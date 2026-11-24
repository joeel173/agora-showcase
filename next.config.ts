import type { NextConfig } from "next";
process.env.NEXT_TELEMETRY_DISABLED = "1";
const config: NextConfig = {
  output: "export",
  devIndicators: false,
};
export default config;
