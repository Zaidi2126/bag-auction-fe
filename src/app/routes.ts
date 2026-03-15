import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { AuctionPage } from "./pages/auction-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auction",
    Component: AuctionPage,
  },
]);
