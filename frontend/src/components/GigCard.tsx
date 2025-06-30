import React from "react";
import { GigDataType } from "../types/gig";

interface GigCardProps {
  gigData: GigDataType;
}

const GigCard: React.FC<GigCardProps> = ({ gigData }) => {
  // Helper function to get the best available image
  const getImageSrc = () => {
    // First try the cover image from API
    if (gigData.coverImage) {
      return gigData.coverImage;
    }
    
    // Fallback to a default image
    return '/default-gig.jpg';
  };

  // Helper function to get venue display text
  const getVenueText = () => {
    if (gigData.venue && gigData.venue !== 'TBD') {
      return gigData.venue;
    }
    
    // Try to extract venue from title if available
    if (gigData.title) {
      const titleParts = gigData.title.split(' - ');
      if (titleParts.length >= 2) {
        return titleParts[1].trim(); // Part after "Live at"
      }
      if (gigData.title.includes('at ')) {
        const atIndex = gigData.title.indexOf('at ') + 3;
        return gigData.title.substring(atIndex).trim();
      }
    }
    
    return 'Venue TBA';
  };

  // Helper function to get location display text
  const getLocationText = () => {
    if (gigData.location && gigData.location !== 'TBD') {
      return gigData.location;
    }
    
    // Try to extract location from title if available
    if (gigData.title) {
      const titleParts = gigData.title.split(' - ');
      if (titleParts.length >= 2) {
        const venuePart = titleParts[1];
        const venueWords = venuePart.split(' ');
        if (venueWords.length >= 2) {
          return venueWords[venueWords.length - 1]; // Last word might be city
        }
      }
    }
    
    return 'Location TBA';
  };

  // Helper function to get postcode display text
  const getPostcodeText = () => {
    return gigData.postcode && gigData.postcode !== 'TBD' ? gigData.postcode : '';
  };

  // Helper function to get time display text
  const getTimeText = () => {
    return gigData.startTime || 'Time TBA';
  };

  // Helper function to get date display text
  const getDateText = () => {
    return gigData.date || 'Date TBA';
  };

  // Helper function to determine if we should show location info
  const shouldShowLocation = () => {
    const venue = getVenueText();
    const location = getLocationText();
    return venue !== 'Venue TBA' || location !== 'Location TBA';
  };

  // Helper function to create Google Maps URL
  const getGoogleMapsUrl = () => {
    const venue = getVenueText();
    const location = getLocationText();
    const postcode = getPostcodeText();
    
    // Build search query for Google Maps
    let searchQuery = '';
    if (venue !== 'Venue TBA') {
      searchQuery += venue;
    }
    if (location !== 'Location TBA') {
      searchQuery += searchQuery ? `, ${location}` : location;
    }
    if (postcode) {
      searchQuery += searchQuery ? `, ${postcode}` : postcode;
    }
    
    if (searchQuery) {
      return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    }
    
    return null;
  };

  // Helper function to handle location click
  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mapsUrl = getGoogleMapsUrl();
    if (mapsUrl) {
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="relative h-[300px] rounded-3xl overflow-hidden">
      <a 
        href={gigData.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
        aria-label={`Book tickets for ${getVenueText()} on ${getDateText()}`}
      >
        <img
          src={getImageSrc()}
          alt={`Live performance at ${getVenueText()}`}
          className="absolute h-full w-full object-cover object-top"
          loading="lazy"
          onError={(e) => {
            // If the image fails to load, use a default
            const target = e.target as HTMLImageElement;
            if (target.src !== '/default-gig.jpg') {
              target.src = '/default-gig.jpg';
            }
          }}
        />
        <div className="absolute bg-black/60 h-full w-full flex flex-col justify-between text-white p-6 py-6 font-medium">
          <div>
            <time 
              dateTime={getDateText()}
              className="text-3xl font-bold block"
            >
              {getDateText()}
            </time>
            {shouldShowLocation() && (
              <address className="not-italic">
                <p className="font-semibold text-orange-400">{getVenueText()}</p>
                <div className="flex flex-wrap gap-1">
                  {getLocationText() !== 'Location TBA' && (
                    <button
                      onClick={handleLocationClick}
                      className="hover:text-orange-400 transition-colors cursor-pointer"
                      title="Open in Google Maps"
                    >
                      {getLocationText()}
                    </button>
                  )}
                  {getPostcodeText() && (
                    <>
                      {getLocationText() !== 'Location TBA' && <span>, </span>}
                      <button
                        onClick={handleLocationClick}
                        className="text-sm hover:text-orange-400 transition-colors cursor-pointer"
                        title="Open in Google Maps"
                      >
                        {getPostcodeText()}
                      </button>
                    </>
                  )}
                </div>
              </address>
            )}
          </div>
          <time 
            dateTime={getTimeText()}
            className="text-3xl"
          >
            {getTimeText()}
          </time>
        </div>
      </a>
    </article>
  );
};

export default GigCard;
