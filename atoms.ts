import { atom as recoilAtom } from "recoil";
import { JSONData } from "@xata.io/client";

import { Assistant, UserThread } from "./database/xata";

export const threadState = recoilAtom<JSONData<UserThread> | null>({
  key: "userThread",
  default: null,
});

export const assistantState = recoilAtom<JSONData<Assistant> | null>({
  key: "assistant",
  default: null,
});