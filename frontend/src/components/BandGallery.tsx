import BandMemberCard from "./BandMemberCard";
import { bandData } from "../data/band";
import background from "/background.jpg";

const BandGallery = () => {
  return (
    <div className="bg-black/30 w-full absolute min-h-full">
      <img
        className="w-full h-full object-cover absolute z-[-100]"
        src={background}
        alt="background"
      />
      <div className="container my-20 mx-auto">
        <div className="justify-center items-center flex flex-wrap gap-4">
          {bandData.map((bandMember) => (
            <BandMemberCard key={bandMember.id} bandMemberData={bandMember} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BandGallery;
