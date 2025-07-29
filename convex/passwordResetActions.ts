"use node";

import { action } from "./_generated/server";
import { randomBytes } from "crypto";

export const generateResetToken = action({
  args: {},
  handler: async () => {
    return randomBytes(32).toString("hex");
  },
});