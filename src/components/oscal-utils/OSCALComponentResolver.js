import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

function processesToRun(componentDefinition) {
  if (!componentDefinition.components.forEach){ 
    return 0;
  }
  let count = 0;
  componentDefinition.components.forEach((component) => {
    count += component["control-implementations"]?.length ?? 0;
  });
  return count;
}

export default function OSCALComponentResolveSources(
  componentDefinition,
  parentUrl,
  onSuccess,
  onError
) {
  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  componentDefinition.resolvedControls = [];
  let pendingProcesses = processesToRun(componentDefinition);
  Object.entries(componentDefinition.components).forEach(([key, component]) => {
    component.uuid = key;
    component["control-implementations"].forEach((controlImplementation) => {
      controlImplementation.modifications = {
        "set-parameters": [],
        alters: [],
      };

      OSCALResolveProfileOrCatalogUrlControls(
        componentDefinition.resolvedControls,
        controlImplementation.modifications,
        controlImplementation.source,
        parentUrl,
        componentDefinition["back-matter"], // not actually used for resolution in components
        () => {
          pendingProcesses -= 1;
          if (pendingProcesses === 0) {
            onSuccess();
          }
        },
        () => {
          pendingProcesses -= 1;
          onError();
        },
        []
      );
    });
  });
}
