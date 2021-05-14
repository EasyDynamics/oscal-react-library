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