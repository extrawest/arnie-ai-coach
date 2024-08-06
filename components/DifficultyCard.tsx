import { FC } from "react";
import { Button } from "./ui/button"
import { DifficultyCardProps } from "./types";

const selectedStyles = "ring-2 ring-blue-500 bg-blue-50 bg-opacity-15";
const unselectedStyles = "hover:bg-gray-50";

export const DifficultyCard: FC<DifficultyCardProps> = ({ level, description, selected, onSelect, id }) =>
  <div
    className={`flex flex-col p-4 border border-gray-200 rounded-lg cursor-pointer ${selected ? selectedStyles : unselectedStyles}`}
    onClick={() => onSelect(id)}
  >
    <h2 className={`font-bold text-xl ${selected ? "text-blue-500" : "text-black"}`}>{level}</h2>
    <p className="text-gray-500">{description}</p>
  </div>;