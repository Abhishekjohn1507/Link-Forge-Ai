// This file configures authentication for your Convex app.

export default {
  // Provide a list of providers to enable auth for your application.
  // See https://docs.convex.dev/auth/config for details on configuring these providers.
  providers: [
    {
      domain: "https://clerk.url-shortener.dev",
      applicationID: "convex",
    },
  ],
};