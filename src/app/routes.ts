import * as React from "react";

import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { PlanTrip } from "./pages/PlanTrip";
import { Results } from "./pages/Results";
import { BuildTrip } from "./pages/BuildTrip";
import { SurpriseMeForm } from "./pages/SurpriseMeForm";
import { SurpriseMeResults } from "./pages/SurpriseMeResults";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/plan",
    Component: PlanTrip,
  },
  {
    path: "/surprise",
    Component: SurpriseMeForm,
  },
  {
    path: "/surprise-results",
    Component: SurpriseMeResults,
  },
  {
    path: "/build",
    Component: BuildTrip,
  },
  {
    path: "/results",
    Component: Results,
  },
]);