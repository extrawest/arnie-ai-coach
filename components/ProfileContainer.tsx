"use client";

import { FC, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { JSONData } from "@xata.io/client";

import { ChallengePreferences } from "@/database/xata";

import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { DifficultyCard } from "./DifficultyCard";
import { Difficulties, ProfileContainerProps } from "./types";

const difficulties = [
  {
    id: Difficulties.EASY,
    level: "Easy",
    description:
      "This challenge level is for people who are new to programming. Receive 3 challenges per day (7:30AM, 12PM, & 5:30PM EST).",
  },
  {
    id: Difficulties.MEDIUM,
    level: "Medium",
    description:
      "This challenge level is for people who are familiar with programming. Receive 4 challenges per day (7AM, 12PM, 5PM, & 8PM EST).",
  },
  {
    id: Difficulties.HARD,
    level: "Hard",
    description:
      "This challenge level is for people who are experienced with programming. Receive 5 challenges per day (6AM, 9AM, 12PM, 5PM, & 8PM EST).",
  },
];

export const ProfileContainer: FC<ProfileContainerProps> = ({
  challengePreferences,
}) => {
  const [saving, setSaving] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(challengePreferences.challengeId || "EASY");
  const [sendNotifications, setSendNotifications] = useState(challengePreferences.sendNotifications || false);

  console.log(challengePreferences)

  const handleToggleNotifications = () =>
    setSendNotifications((prev) => !prev);

  const handleSelectDifficulty = (difficultyId: Difficulties) =>
    setSelectedDifficulty(difficultyId);

  const handleSave = async () => {
    try {
      const response = await axios.post<{
        data: JSONData<ChallengePreferences>;
        success: boolean;
        message?: string;
      }>("/api/challenge-preferences", {
        id: challengePreferences.id,
        challengeId: selectedDifficulty,
        sendNotifications
      });

      if (!response.data.success || !response.data.data) {
        console.error(response.data.message ?? "Something went wrong");
        toast.error(response.data.message ?? "Something went wrong");
        return;
      }

      toast.success("Preferences saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="flex flex-col">
    <div className="flex flex-row justify-between items-center mb-4">
      <h1 className="font-bold text-2xl">Challenge level</h1>
      <Button onClick={handleSave}>{saving ? "Saving..." : "Save"}</Button>
    </div>
    {/* <div className="flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg">
      <div>
        <h3 className="font-medium text-lg text-gray-900">Push Notifications</h3>
        <p>Recieve push notifications when new challenges are available.</p>
      </div>
      <Switch
        checked={sendNotifications as boolean}
        onCheckedChange={handleToggleNotifications}
      />
    </div> */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {
        difficulties.map((difficulty) => (
          <DifficultyCard
            id={difficulty.id}
            key={difficulty.id}
            level={difficulty.level}
            description={difficulty.description}
            selected={difficulty.id === selectedDifficulty}
            onSelect={(difficultyId: Difficulties) => handleSelectDifficulty(difficultyId)}
          />
        ))
      }
    </div>
  </div>
}

export default ProfileContainer;