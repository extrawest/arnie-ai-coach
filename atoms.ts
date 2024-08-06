import { atom as recoilAtom } from "recoil";
import { JSONData } from "@xata.io/client";

import { UserThread } from "./database/xata";

export const textState = recoilAtom<JSONData<UserThread> | null>({
  key: "uerThread",
  default: null,
});
