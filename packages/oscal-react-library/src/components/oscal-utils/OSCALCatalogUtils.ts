import type { Control, ControlGroup } from "@easydynamics/oscal-types";
import matchingProp from "./OSCALPropUtils";

/**
 * Determines if a control is withdrawn.
 *
 * @param control A catalog control
 * @returns true if control is withdrawn
 */
export default function isWithdrawn(item: Control | ControlGroup): boolean {
  // By default controls are *not* withdrawn
  if (!item.props) {
    return false;
  }
  return !!matchingProp(item.props, { name: "status", value: "withdrawn" });
}
