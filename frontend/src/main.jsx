import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
// 1. Import the necessary tools
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Create the client instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // This prevents the app from refetching everything
      // every time you click back into the browser window
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 3. Wrap everything in the Provider */}
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </StrictMode>
);
