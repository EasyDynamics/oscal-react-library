/**
 * Determines if a control is withdrawn.
 *
 * TODO: This is probably 800-53 specific and it should be made more
 * generic to allow the library to work with other frameworks.
 * https://github.com/EasyDynamics/oscal-react-library/issues/504
 *
 * @param {object} control
 * @returns a boolean describing whether the control is withdrawn
 */
export default function isWithdrawn(control) {
  return control?.props?.find(
    (prop) => prop.name === "status" && prop.value === "withdrawn"
  );
}
