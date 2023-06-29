import { useContext } from "react";

import { OscalContext } from "./OscalContext";

//////////////////////////////////////////////////////////////////////////
// API helper functions

export function useFetchers() {
  let context = useContext(OscalContext);
  return context;
}
