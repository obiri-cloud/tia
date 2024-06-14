import React from "react";
import { ILabImage } from "../types";

const LabCard = ({
  lab,
  viewImage,
}: {
  lab: ILabImage;
  viewImage: (lab: ILabImage) => void;
}) => {
  return (
    <div
      onClick={() => viewImage(lab)}
      className="p-6  border border-1 rounded-md cursor-pointer"
    >
      <div className="flex gap-3 items-center">
        <div className="w-[60px] h-[60px] p-1 flex justify-center items-center rounded-md border border-1">
          <img src={lab.image_picture ?? ""} alt="" className="w-10 h-10" />
        </div>
        <div className="">
          <h2 className="font-jet font-semibold text-lg leading-4">
            {lab.name}
          </h2>
        </div>
      </div>
      <p className="mt-3 text-sm">{lab.description}</p>
      <div className="mt-4">
        <span className="px-3 py-1 border border-1 rounded-md text-sm">
          {lab.difficulty_level}
        </span>
      </div>
    </div>
  );
};

export default LabCard;
