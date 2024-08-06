"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { Run } from "openai/resources/beta/threads/index";
import { Message } from "openai/resources/beta/threads/messages";

import { threadState, assistantState } from "@/atoms";

const POLLING_FREQUENCY_MS = 1000;



const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userThread] = useRecoilState(threadState);
  const [assistant] = useRecoilState(assistantState);
  const [pollingRun, setPollingRun] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);

  const startRun = async (
    threadId: string,
    assistantId: string
  ): Promise<string> => {
    try {
      const {
        data: { success, run, error },
      } = await axios.post<{
        success: boolean;
        error?: string;
        run?: Run;
      }>("/api/run/create", {
        threadId,
        assistantId,
      });
      if (!success || !run) {
        console.error(error);
        toast.error("Failed to start run");
        return "";
      }
      return run.id;
    } catch (error) {
      console.error(error);
      toast.error("Failed to start run");
      return "";
    }
  };

  const pollRunStatus = async (threadId: string, runId: string) => {
    setPollingRun(true);

    const intervalId = setInterval(async () => {
      try {
        const {
          data: { success, error, run },
        } = await axios.post<{
          success: boolean;
          error?: string;
          run?: Run;
        }>("/api/run/retrieve", {
          threadId,
          runId,
        });

        if (!success || !run) {
          console.error(error);
          toast.error("Failed to poll run status");
          return;
        }

        if (run.status === "completed") {
          clearInterval(intervalId);
          setPollingRun(false);
          fetchMessages();
          return;
        } else if (run.status === "failed") {
          clearInterval(intervalId);
          setPollingRun(false);
          toast.error("Run failed");
          return;
        }
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong");
        clearInterval(intervalId);
      } finally {
        setPollingRun(false);
      }
    }, POLLING_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  };

  const sendMessage = async () => {
    try {
      if (!userThread || sending || !assistant) {
        toast.error("Failed to send message, invalid state");
        return;
      }
      setSending(true);
      const {
        data: { message: newMessage },
      } = await axios.post<{
        success: boolean;
        message?: Message;
        error?: string;
      }>("/api/message/create", {
        message,
        threadId: userThread.threadId?.toString(),
        fromUser: true,
      });
      if (!newMessage) {
        console.error("No messages returnred");
        toast.error("Failed to send message, please try again");
        return;
      }
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      toast.success("Message sent.");
      const runId = await startRun(
        userThread.threadId?.toString() as string,
        assistant?.assistantId?.toString() as string
      );
      if (!runId) {
        toast.error("Failed to start run");
        return;
      }
      pollRunStatus(userThread.threadId?.toString() as string, runId);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

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
            message.content[0]?.type === "text" &&
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
            className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${["true", "True"].includes(
              (message.metadata as { fromUser?: string }).fromUser ?? ""
            )
              ? "bg-yellow-500 ml-auto"
              : "bg-gray-700"
              }`}
          >
            {message.content[0]?.type === "text"
              ? message.content[0].text.value
                .split("\n")
                .map((text, index) => <p key={index}>{text}</p>)
              : null}
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 bg-gray-800">
        <div className="flex items-center bg-white p-2">
          <input
            type="text"
            value={message}
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-transparent text-black focus:outline-none"
          />
          <button
            disabled={
              !userThread?.threadId?.toString() ||
              !assistant ||
              sending ||
              !message.trim()
            }
            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-full focus:outline-none disabled:bg-yellow-700"
            onClick={sendMessage}
          >
            {sending ? "Sending..." : pollingRun ? "Polling Run..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
