export default function getControlOrSubControl(resolvedControls, controlId) {
  /* eslint-disable */
  // First check all of the root level resolveControls
  let control = resolvedControls.find(
    (element) => element.id === controlId
  );
  if (control) {return control}
  // Next, try the substring of the controlId before the period delimiter. For example, "ac-2" based on a control of "ac-2.3"
  if (controlId.includes(".")) {
    const parentControlId = controlId.substring(0, controlId.indexOf("."));
  // Find parent control within root controls
    const parentControl = resolvedControls.find(
        (element) => element.id === parentControlId
      );
  // Check all of the parent control's subcontrols
    if (parentControl) {
        control = parentControl.controls.find(
            (element) => element.id === controlId
          );
      if (control) {return control}
    }
  }
  // Lastly, dig through every root control and its subcontrols 
  resolvedControls.forEach((parentControl) => {
    control = parentControl.controls.find(
        (element) => element.id === controlId
    );
    if (control) {return control}
  });
  return null;
}

/**
 * Gets the 'by-component' object for the give componentId within the given
 * statementId from the given implReqStatements
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_by-component_h2}
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_implemented-requirement}
 *
 * @param {object} implReqStatements Implementation Request Statements
 * @param {string} statementId Id of a statement
 * @param {string} componentId Id of a component
 * @returns Returns the by-component object when a statement is found
 */
 export function getStatementByComponent(implReqStatements, statementId, componentId) {
  // TODO Remove underscore replacement when OSCAL example content is fixed (https://github.com/usnistgov/oscal-content/issues/58, https://easydynamics.atlassian.net/browse/EGRC-266)
  // Locate matching statement to statementId
  const foundStatement = implReqStatements.find(
    (statement) =>
      statement["statement-id"] === statementId ||
      statement["statement-id"] === statementId.replace("_", "")
  );
  // Error checking: Exit function when statement or it's by-components are not found
  if (!foundStatement || !foundStatement["by-components"]) {
    return null;
  }

  // Locate matching byComponent to componentId
  return foundStatement["by-components"].find(
    (byComponent) => byComponent["component-uuid"] === componentId
  );
}