const host =
  typeof window !== "undefined" ? window.location.host : "localhost:3000";

export const baseUrl = host.includes("localhost")
  ? `http://${host}`
  : `${window.location.protocol}//${host}`;
