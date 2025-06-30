import { useEffect, useState } from "react";
import Slider from "react-slick";
import GigCard from "./GigCard";
import { GigDataType } from "../types/gig";
import { getMockGigs } from "../utils/mockGigs";
import { getApiUrl, shouldUseMockData } from "../config/api";
import background from "/background.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GigCarousel = () => {
  const [gigs, setGigs] = useState<GigDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mockGigCount, setMockGigCount] = useState(3); // Number of mock gigs to show

  useEffect(() => {
    if (shouldUseMockData()) {
      // Use mock data for testing
      setLoading(true);
      setTimeout(() => {
        const mockData = getMockGigs(mockGigCount);
        setGigs(mockData);
        setLoading(false);
      }, 1000); // Simulate loading time
    } else {
      // Use real API
      fetch(getApiUrl())
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            // Limit to 10 events maximum
            const limitedGigs = (data.data || []).slice(0, 10);
            setGigs(limitedGigs);
          } else {
            setError(data.error || "Failed to load gigs");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching gigs:", err);
          setError("Failed to load gigs. Please try again later.");
          setLoading(false);
        });
    }
  }, [mockGigCount]); // Re-run when mockGigCount changes

  // Dynamic carousel settings based on number of gigs
  const getCarouselSettings = () => {
    const baseSettings = {
      dots: gigs.length > 1,
      infinite: gigs.length > 3,
      speed: 500,
      swipeToSlide: true,
      initialSlide: 0,
    };

    if (gigs.length === 0) {
      return baseSettings;
    }

    if (gigs.length === 1) {
      return {
        ...baseSettings,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        infinite: false,
      };
    }

    if (gigs.length === 2) {
      return {
        ...baseSettings,
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
    }

    // 3 or more gigs - use responsive settings
    return {
      ...baseSettings,
      slidesToShow: Math.min(3, gigs.length),
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: Math.min(3, gigs.length),
            slidesToScroll: 1,
            infinite: gigs.length > 3,
            dots: true,
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: Math.min(2, gigs.length),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  };

  return (
    <div className="bg-black/30 w-full absolute min-h-full">
      <img
        className="w-full h-full object-cover absolute z-[-100]"
        src={background}
        alt="background"
      />
      
      {/* Mock Data Controls - Only show when using mock data */}
      {shouldUseMockData() && (
        <div className="absolute top-20 left-4 z-10 bg-black/80 p-4 rounded-lg text-white">
          <div className="text-sm font-bold mb-2">🧪 Mock Data Testing</div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs">Gigs:</label>
            <select 
              value={mockGigCount} 
              onChange={(e) => setMockGigCount(Number(e.target.value))}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
            >
              <option value={0}>0 (Empty)</option>
              <option value={1}>1 (Single)</option>
              <option value={2}>2 (Pair)</option>
              <option value={3}>3 (Carousel)</option>
              <option value={5}>5 (Full)</option>
            </select>
          </div>
          <div className="text-xs text-gray-300">
            Set shouldUseMockData = false to use real API
          </div>
        </div>
      )}
      
      <div className="w-3/4 m-auto">
        <div className="mt-40">
          {loading && (
            <div className="text-center text-white text-xl py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              Loading gigs...
            </div>
          )}
          
          {error && (
            <div className="text-center text-white py-20">
              <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
              <p className="text-gray-300">Please check back later or contact us for updates.</p>
            </div>
          )}
          
          {!loading && !error && gigs.length === 0 && (
            <div className="text-center text-white py-20">
              <div className="text-2xl mb-4">🎵</div>
              <h2 className="text-2xl font-bold mb-2">No Gigs Scheduled</h2>
              <p className="text-gray-300">Check back soon for upcoming performances!</p>
            </div>
          )}
          
          {!loading && !error && gigs.length > 0 && (
            <div>
              {gigs.length === 1 ? (
                // Single gig - center it without carousel
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <GigCard gigData={gigs[0]} />
                  </div>
                </div>
              ) : (
                // Multiple gigs - use carousel
                <Slider className="space-x-4" {...getCarouselSettings()}>
                  {gigs.map((gig) => (
                    <GigCard key={gig.id} gigData={gig} />
                  ))}
                </Slider>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigCarousel;
