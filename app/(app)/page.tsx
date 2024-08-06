"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";

import { textState } from "@/atoms";
import { Message } from "openai/resources/beta/threads/messages";

const POLLING_FREQUENCY_MS = 4000;

const ChatPage = () => {
  const [userThread] = useRecoilState(textState);
  const [fetching, setFetching] = useState(true);
  const [messages, setMessages] = useState<Array<Message>>([]);

  const fetchMessages = useCallback(async () => {
    if (!userThread) return;
    try {
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: Array<Message>;
      }>("/api/message/list", { threadId: userThread?.threadId?.toString() });

      if (!response.data.success) {
        console.error(response.data.error ?? "Unknown error");
        setFetching(false);
        return;
      }

      let newMessages = response.data.messages;
      newMessages
        ?.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .filter(
          (message) =>
            message.content[0].type === "text" &&
            message.content[0].text.value.trim() !== ""
        );

      if (newMessages) {
        setMessages(newMessages);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setFetching(false);
      setMessages([]);
    } finally {
      setFetching(false);
    }
  }, [userThread]);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-scroll p-8 space-y-2">
        {fetching && messages.length === 0 && (
          <div className="text-center font-bold">Fetching...</div>
        )}
        {messages.length === 0 && !fetching && (
          <div className="text-center font-bold">No messages.</div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
              ["true", "True"].includes(
                (message.metadata as { fromUser?: string }).fromUser ?? ""
              )
                ? "bg-yellow-500 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {message.content[0].type === "text"
              ? message.content[0].text.value
                  .split("\n")
                  .map((text, index) => <p key={index}>{text}</p>)
              : null}
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 bg-gray-800"></div>
    </div>
  );
};

export default ChatPage;
