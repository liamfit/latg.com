import React from "react";
import { BandMemberDataType } from "../types/bandMember";

interface BandMemberCardProps {
  bandMemberData: BandMemberDataType;
}

const BandMemberCard: React.FC<BandMemberCardProps> = ({ bandMemberData }) => {
  return (
    <article 
      className="relative h-[600px] w-[400px] rounded-3xl overflow-hidden hover:bg-black hover:bg-opacity-70 transition-opacity duration-300"
      role="article"
      aria-labelledby={`band-member-${bandMemberData.id}`}
    >
      <img
        src={bandMemberData.img}
        alt={`${bandMemberData.name} playing ${bandMemberData.instrument}`}
        className="absolute h-full w-full object-cover object-top"
        loading="lazy"
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
