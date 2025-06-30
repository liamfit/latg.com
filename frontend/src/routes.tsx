import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Gigs from "./pages/gigs";
import Contact from "./pages/contact";
import Error from "./pages/error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <Error />,
  },
  {
    path: "/gigs",
    element: <Gigs />,
    errorElement: <Error />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <Error />,
  },
]);
