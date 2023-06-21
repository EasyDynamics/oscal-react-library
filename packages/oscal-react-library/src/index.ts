import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
} from "./components/OSCALLoader";

import { OSCALPermanentDrawer } from "./components/OSCALPermanentDrawer";
import { OSCALAppBar } from "./components/OSCALAppBar";

/**
 * Bundels loaders and referenced components into "dist/" when rollup is run.
 * Rollup.js is set to run with "npm start" in root directory.
 */
export {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
  OSCALPermanentDrawer,
  OSCALAppBar,
};
