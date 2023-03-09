import matchingProp from "./OSCALPropUtils";

/**
 * Determines if a control is withdrawn.
 *
 * @param {object} control
 * @returns a boolean describing whether the control is withdrawn
 */
export default function isWithdrawn(control) {
  // By default controls are *not* withdrawn
  if (!control.props) {
    return false;
  }
  return !!matchingProp(control.props, { name: "status", value: "withdrawn" });
}
