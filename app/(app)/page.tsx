"use client";

import { useState } from "react";

const ChatPage = () => {
  const [fetching, setFetching] = useState(false);
  return (
    <div className="w-screen h-full flex flex-col bg-black text-wh text-white">
      {/* list messages */}
      {fetching && <div className="text-center font-bold"></div>}
    </div>
  );
};

export default ChatPage;
