"use client";

import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

import { JSONData } from "@xata.io/client";
import { Navbar } from "@/components/Navbar";
import { Assistant, UserThread } from "@/database/xata";
import { threadState, assistantState } from "@/atoms";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [, setUserThread] = useRecoilState(threadState);
  const [assistant, setAssistant] = useRecoilState(assistantState);

  useEffect(() => {
    if (assistant) return;

    const getAssistant = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          message: string;
          assistant: JSONData<Assistant>;
        }>("/api/assistant");

        if (!response.data.success || !response.data.assistant) {
          console.error(response.data.message ?? "Unknown error");
          toast.error("Failed to get assistant");
          setAssistant(null);
          return;
        }
        setAssistant(response.data.assistant);
      } catch (e) {
        console.error(e);
      }
    };
    getAssistant();
  }, [assistant, setAssistant]);

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
