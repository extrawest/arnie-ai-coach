"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";

import { JSONData } from "@xata.io/client";
import { Navbar } from "@/components/Navbar";
import { UserThread } from "@/database/xata";

import { textState } from "@/atoms";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [_, setUserThread] = useRecoilState(textState);
  useEffect(() => {
    const getUserThread = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          messages?: string;
          userThread: JSONData<UserThread>;
        }>("/api/user-thread");

        if (!response.data.success || !response.data.userThread) {
          console.error(response.data.messages ?? "Unknown error");
          setUserThread(null);
          return;
        }

        setUserThread(response.data.userThread);
      } catch (e) {
        console.error(e);
        setUserThread(null);
      }
    };
    getUserThread();
  }, [setUserThread]);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
};

export default AppLayout;
