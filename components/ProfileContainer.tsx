"use client";

import { FC, useState } from "react";
import { JSONData } from "@xata.io/client";
import { ChallengePreferences } from "@/database/xata";

import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

type ProfileContainerProps = {
  challengePreferences: JSONData<ChallengePreferences>;
}

const difficulties = [
  {
    id: "EASY",
    level: "Easy",
    description:
      "This challenge level is for people who are new to programming. Receive 3 challenges per day (7:30AM, 12PM, & 5:30PM EST).",
  },
  {
    id: "MEDIUM",
    level: "Medium",
    description:
      "This challenge level is for people who are familiar with programming. Receive 4 challenges per day (7AM, 12PM, 5PM, & 8PM EST).",
  },
  {
    id: "HARD",
    level: "Hard",
    description:
      "This challenge level is for people who are experienced with programming. Receive 5 challenges per day (6AM, 9AM, 12PM, 5PM, & 8PM EST).",
  },
];

export const ProfileContainer: FC<ProfileContainerProps> = ({
  challengePreferences,
}) => {
  const [sendNotifications, setSendNotifications] = useState(challengePreferences.sendNotifications || false);
  const handleToggleNotifications = () => {

  }

  console.log(sendNotifications);

  return <div className="flex flex-col">
    <div className="flex flex-row justify-between items-center mb-4">
      <h1 className="font-bold text-2xl">Challenge level</h1>
      <Button>Save</Button>
    </div>
    <div className="flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg">
      <div>
        <h3 className="font-medium text-lg text-gray-900">Push Notifications</h3>
        <p>Recieve push notifications when new challenges are available.</p>
      </div>
      <Switch checked={sendNotifications as boolean} onCheckedChange={handleToggleNotifications} />
    </div>
    <div>

    </div>
  </div>;
}

export default ProfileContainer;