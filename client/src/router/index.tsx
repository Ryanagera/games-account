import { createBrowserRouter } from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardPage from "../pages/dashboard/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home Page - Foundation Ready</div>,
  },
  {
    path: "/sign-in/*",
    element: <SignInPage />,
  },
  {
    path: "/sign-up/*",
    element: <SignUpPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

export default router;
