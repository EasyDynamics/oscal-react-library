import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
} from "./components/OSCALLoader";

import OSCALDrawerSelector from "./components/OSCALDrawerSelector";

/**
 * Bundels loaders and referenced components into "dist/" when rollup is run.
 * Rollup.js is set to run with "npm start" in root directory.
 */
export {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
  OSCALDrawerSelector,
};
