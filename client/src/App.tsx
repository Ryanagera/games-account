import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useUserSync } from "./hooks/useUserSync";

export default function App() {
  // Sync user data selectively
  useUserSync();

  return <RouterProvider router={router} />;
}
