import type { Control } from "@easydynamics/oscal-types";
import matchingProp from "./OSCALPropUtils";

/**
 * Determines if a control is withdrawn.
 *
 * @param control A catalog control
 * @returns true if control is withdrawn
 */
export default function isWithdrawn(control: Control): boolean {
  // By default controls are *not* withdrawn
  if (!control.props) {
    return false;
  }
  return !!matchingProp(control.props, { name: "status", value: "withdrawn" });
}
