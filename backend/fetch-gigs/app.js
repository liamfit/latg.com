const https = require('https');
const AWS = require('aws-sdk');

// Environment variables
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN_PARAMETER = process.env.FACEBOOK_ACCESS_TOKEN_PARAMETER;
const ENABLE_POSTCODE_LOOKUP = process.env.ENABLE_POSTCODE_LOOKUP !== 'false'; // Default to true

// SSM client
const ssm = new AWS.SSM();

// Token cache
let tokenCache = {
  token: null,
  expiresAt: null
};

// Helper function to get Facebook access token from SSM
async function getFacebookAccessToken() {
  // Check cache first (cache for 1 hour to avoid repeated SSM calls)
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    console.log('Fetching Facebook access token from SSM...');
    
    const params = {
      Name: FACEBOOK_ACCESS_TOKEN_PARAMETER,
      WithDecryption: true
    };
    
    const response = await ssm.getParameter(params).promise();
    
    if (response.Parameter && response.Parameter.Value) {
      // Cache the token for 1 hour
      tokenCache = {
        token: response.Parameter.Value,
        expiresAt: now + (60 * 60 * 1000) // 1 hour
      };
      
      console.log('Successfully retrieved Facebook access token from SSM');
      return response.Parameter.Value;
    } else {
      throw new Error('No token value found in SSM parameter');
    }
  } catch (error) {
    console.error('Error fetching Facebook access token from SSM:', error.message);
    throw new Error('Failed to retrieve Facebook access token');
  }
}

// Helper function to make HTTPS requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      });
    }).on('error', (error) => { reject(error); });
  });
}

// Helper function to get postcode from coordinates using postcodes.io
async function getPostcodeFromCoordinates(lat, lng) {
  try {
    const url = `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`;
    console.log('Fetching postcode for coordinates:', lat, lng);
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Postcode request timeout')), 5000); // 5 second timeout
    });
    
    const requestPromise = makeRequest(url);
    const response = await Promise.race([requestPromise, timeoutPromise]);
    
    if (response.result && response.result.length > 0) {
      const nearestPostcode = response.result[0];
      console.log('Found postcode:', nearestPostcode.postcode);
      return nearestPostcode.postcode;
    }
    
    console.log('No postcode found for coordinates');
    return null;
  } catch (error) {
    console.log('Error fetching postcode:', error.message);
    return null;
  }
}

// Helper function to process events with rate limiting for postcode lookups
async function processEventsWithRateLimit(events) {
  const results = [];
  
  // Process events sequentially to avoid overwhelming the postcode API
  for (let i = 0; i < events.length; i++) {
    try {
      const event = events[i];
      console.log(`Processing event ${i + 1}/${events.length}: ${event.name}`);
      
      const transformedEvent = await transformEventToGig(event);
      results.push(transformedEvent);
      
      // Add a small delay between postcode requests to be respectful to the API
      if (i < events.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
      }
    } catch (error) {
      console.log(`Error processing event ${i + 1}:`, error.message);
      // Continue processing other events even if one fails
      results.push({
        id: events[i].id,
        date: 'TBD',
        venue: 'TBD',
        location: 'TBD',
        postcode: 'TBD',
        startTime: 'TBD',
        url: events[i].event_url || `https://www.facebook.com/events/${events[i].id}/`,
        title: events[i].name || 'Unknown Event',
        description: events[i].description || '',
        coverImage: events[i].cover?.source || null,
        attendingCount: events[i].attending_count || 0,
        interestedCount: events[i].interested_count || 0
      });
    }
  }
  
  return results;
}

// Helper function to parse Facebook time with proper timezone handling
function parseFacebookTime(timeString) {
  console.log('Parsing Facebook time:', timeString);
  
  // Facebook format: "2025-07-26T21:00:00+0100"
  // The +0100 means the time is already in UTC+1 (UK time)
  // JavaScript's Date constructor should handle this correctly
  
  const date = new Date(timeString);
  console.log('Parsed Date object:', date.toString());
  console.log('Date.toISOString():', date.toISOString());
  console.log('Date.getHours():', date.getHours());
  
  return date;
}

// Transform Facebook event data to match our gig format
async function transformEventToGig(event) {
  // Parse the Facebook time string - it already includes timezone info
  // Facebook returns times like "2025-07-26T21:00:00+0100" (with timezone offset)
  console.log('Original Facebook time:', event.start_time);
  
  // Create Date object from Facebook's time string with proper timezone handling
  const startTime = parseFacebookTime(event.start_time);
  
  // Format date as DD-MM-YYYY (use the timezone that Facebook provided)
  const date = startTime.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    timeZone: 'Europe/London'
  }).split('/').join('-');
  
  // Format time as HH:MM AM/PM (use the timezone that Facebook provided)
  const time = startTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true,
    timeZone: 'Europe/London'
  });
  
  console.log('Formatted date:', date);
  console.log('Formatted time:', time);
  
  // Extract venue and location from place data
  let venue = 'TBD', location = 'TBD', postcode = 'TBD';
  
  if (event.place && event.place.name) {
    // Facebook place names often include the city, e.g., "THE FLOWERPOT DERBY"
    const placeName = event.place.name.trim();
    
    // Try to extract venue and city from place name
    // Common patterns: "VENUE CITY" or "VENUE - CITY"
    const parts = placeName.split(/\s*[-–]\s*/); // Split by dash or en-dash
    
    if (parts.length >= 2) {
      // Format: "VENUE - CITY"
      venue = parts[0].trim();
      location = parts[1].trim();
    } else {
      // Format: "VENUE CITY" - try to extract city from the end
      const words = placeName.split(/\s+/);
      if (words.length >= 2) {
        // Assume the last word is the city
        const city = words[words.length - 1];
        venue = words.slice(0, -1).join(' '); // Everything except the last word
        location = city;
      } else {
        venue = placeName;
        location = 'TBD';
      }
    }
    
    // If we still have a very long venue name, it might include location info
    if (venue.length > 30 && venue.includes(' ')) {
      const venueWords = venue.split(' ');
      const lastWord = venueWords[venueWords.length - 1];
      
      // If the last word looks like a city name (all caps or title case)
      if (lastWord === lastWord.toUpperCase() || lastWord === lastWord.charAt(0).toUpperCase() + lastWord.slice(1).toLowerCase()) {
        venue = venueWords.slice(0, -1).join(' ');
        location = lastWord;
      }
    }
    
    // Try to get postcode from coordinates if available
    if (event.place.location && event.place.location.latitude && event.place.location.longitude && ENABLE_POSTCODE_LOOKUP) {
      const foundPostcode = await getPostcodeFromCoordinates(
        event.place.location.latitude, 
        event.place.location.longitude
      );
      if (foundPostcode) {
        postcode = foundPostcode;
      }
    }
  }
  
  return {
    id: event.id,
    date,
    venue,
    location,
    postcode,
    startTime: time,
    url: event.event_url || `https://www.facebook.com/events/${event.id}/`,
    title: event.name,
    description: event.description || '',
    coverImage: event.cover?.source || null,
    attendingCount: event.attending_count || 0,
    interestedCount: event.interested_count || 0
  };
}

// AWS Lambda handler
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN_PARAMETER) {
      throw new Error('Missing required environment variables');
    }
    
    const facebookUrl = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/events?` +
      `access_token=${await getFacebookAccessToken()}&` +
      `fields=id,name,description,start_time,end_time,place,event_url,cover,attending_count,interested_count&` +
      `limit=50`;
    const facebookResponse = await makeRequest(facebookUrl);
    if (facebookResponse.error) {
      throw new Error(`Facebook API error: ${facebookResponse.error.message}`);
    }
    
    // Filter events first
    const filteredEvents = facebookResponse.data.filter(event => {
      const eventTime = new Date(event.start_time);
      return eventTime > new Date() && event.name;
    });
    
    console.log(`Found ${filteredEvents.length} upcoming events`);
    
    // Process events with rate limiting
    const gigs = await processEventsWithRateLimit(filteredEvents);
    
    // Sort by date after transformation
    gigs.sort((a, b) => {
      const dateA = new Date(a.date.split('-').reverse().join('-'));
      const dateB = new Date(b.date.split('-').reverse().join('-'));
      return dateA - dateB;
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: gigs, total: gigs.length })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to fetch gigs', message: error.message })
    };
  }
}; 