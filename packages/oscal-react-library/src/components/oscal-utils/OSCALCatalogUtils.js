import matchingProp from "./OSCALPropUtils";

/**
 * Determines if a control is withdrawn.
 *
 * @param {object} control A catalog control
 * @returns {boolean} true if control is withdrawn
 */
export default function isWithdrawn(control) {
  // By default controls are *not* withdrawn
  if (!control.props) {
    return false;
  }
  return !!matchingProp(control.props, { name: "status", value: "withdrawn" });
}
