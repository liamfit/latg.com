import React, { useState } from "react";
import { BandMemberDataType } from "../types/bandMember";

interface BandMemberCardProps {
  bandMemberData: BandMemberDataType;
}

const BandMemberCard: React.FC<BandMemberCardProps> = ({ bandMemberData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<'portrait' | 'landscape'>('portrait');

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    // Determine if image is landscape (width > height) or portrait
    setImageAspectRatio(aspectRatio > 1 ? 'landscape' : 'portrait');
    setImageLoaded(true);
  };

  // Dynamic classes based on image aspect ratio
  const getCardClasses = () => {
    const baseClasses = "relative rounded-3xl overflow-hidden hover:bg-black hover:bg-opacity-70 transition-opacity duration-300";
    
    if (imageAspectRatio === 'landscape') {
      // For landscape images, use a wider, shorter card
      return `${baseClasses} h-[400px] w-[600px]`;
    } else {
      // For portrait images, use the original tall, narrow card
      return `${baseClasses} h-[600px] w-[400px]`;
    }
  };

  const getImageClasses = () => {
    const baseClasses = "absolute h-full w-full object-cover";
    
    if (imageAspectRatio === 'landscape') {
      // For landscape images, center the image
      return `${baseClasses} object-center`;
    } else {
      // For portrait images, align to top
      return `${baseClasses} object-top`;
    }
  };

  return (
    <article 
      className={getCardClasses()}
      role="article"
      aria-labelledby={`band-member-${bandMemberData.id}`}
    >
      <img
        src={bandMemberData.img}
        alt={`${bandMemberData.name} playing ${bandMemberData.instrument}`}
        className={getImageClasses()}
        loading="lazy"
        onLoad={handleImageLoad}
        style={{ opacity: imageLoaded ? 1 : 0 }}
      />
      <div className="absolute h-full w-full flex flex-col justify-between text-white p-6 font-medium bg-black bg-opacity-0 hover:bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div>
          <h3 
            id={`band-member-${bandMemberData.id}`}
            className="text-3xl font-bold"
          >
            {bandMemberData.name}
          </h3>
          <p className="font-semibold text-orange-400">{bandMemberData.instrument}</p>
        </div>
        <p className="text-sm leading-relaxed">{bandMemberData.bio}</p>
      </div>
    </article>
  );
};

export default BandMemberCard;
