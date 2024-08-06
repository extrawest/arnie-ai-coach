import { ChallengePreferences } from "@/database/xata";
import { JSONData } from "@xata.io/client";

export enum Difficulties {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export type DifficultyCardProps = {
  level: string;
  id: Difficulties;
  description: string;
  selected: boolean;
  onSelect: (level: Difficulties) => void;
};

export type ProfileContainerProps = {
  challengePreferences: JSONData<ChallengePreferences>;
};
