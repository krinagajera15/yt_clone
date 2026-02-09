import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Watch from "../pages/Watch";
import AdminDashboard from "../pages/AdminDashboard";
import AddVideo from "../pages/AddVideo";
import ManageVideos from "../pages/ManageVideos";
import NotFound from "../pages/NotFound";
import Login from "./Login";
import SignUp from "./Register";
import Shorts from "../pages/Shorts";
import { AuthGuard } from "../guard/AuthGuard";
import AddShorts from "../pages/AddShorts";
import { Subscriptionpage } from "../pages/SubscriptionPage";
import Dashboard from "./Admin/Dashbord";

// ✅ Named export must match import
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <AuthGuard/>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/watch/:id", element: <Watch /> },
      // { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/add-video", element: <AddVideo /> },
      { path: "/admin/manage-videos", element: <ManageVideos /> },
      { path: "/addshorts", element: <AddShorts /> },
      { path: "/shorts", element: <Shorts /> },
      { path: "/subscribe", element: <Subscriptionpage /> },
     
    ],
  },
  { path: "*", element: <NotFound /> },
  { path: "/dashbord", element: <Dashboard /> },
]);
