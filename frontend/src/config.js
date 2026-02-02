const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 5000,
  debugMode: import.meta.env.MODE === "development",
};

export default config;
