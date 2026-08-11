import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kjvdeaf.app",
  appName: "KJV for the Deaf",
  // Points the native app shell at the live, already-deployed site
  // rather than bundling a static copy. This is the right approach
  // here because the site has server routes (contact form, auth)
  // that a static export can't serve. The native app becomes a
  // thin, installable wrapper around kjvdeaf.com, and every update
  // pushed to the live site shows up instantly in the app too --
  // no app-store review needed for content/wording changes.
  server: {
    url: "https://kjvdeaf.com",
    cleartext: false,
  },
  backgroundColor: "#ffffff",
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
