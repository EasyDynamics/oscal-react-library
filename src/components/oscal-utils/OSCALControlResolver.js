export default function getControlOrSubControl(resolvedControls, controlId) {
  const findControlById = (controls, desiredId) =>
    controls?.find((control) => control.id === desiredId);

  // Try to find control at root level of the resolved controls
  const control = findControlById(resolvedControls, controlId);
  if (control) {
    return control;
  }

  // If the control isn't at the root level, it may be a subcontrol of it's parent;
  // so for example, "ac-2.3" may be a child of "ac-2"
  const isSubControl = (testControlId) => testControlId.includes(".");
  if (isSubControl(controlId)) {
    const parentControlId = controlId.split(".")[0];
    const parentControl = findControlById(resolvedControls, parentControlId);
    const subControl = findControlById(parentControl?.controls, controlId);

    if (subControl) {
      return subControl;
    }
  }

  // If the control isn't at root level or a subcontrol of it's parent,
  // it should be able to be found by just searching all subcontrols.
  return findControlById(
    resolvedControls.flatMap((parentControl) => parentControl.controls),
    controlId
  );
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
export function getStatementByComponent(
  implReqStatements,
  statementId,
  componentId
) {
  const foundStatement = implReqStatements?.find(
    (statement) => statement["statement-id"] === statementId
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
