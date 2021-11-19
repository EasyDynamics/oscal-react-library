import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

export default function OSCALComponentResolveSources(
  componentDefinition,
  parentUrl,
  setInheritedProfilesAndCatalogs,
  onSuccess,
  onError
) {
  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  componentDefinition.resolvedControls = [];

  const inheritedProfilesAndCatalogs = {
    inherited: [],
  };

  let pendingProcesses = componentDefinition.components
    .map((component) => component["control-implementations"]?.length ?? 0)
    .reduce((acc, length) => acc + length, 0);

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
        inheritedProfilesAndCatalogs.inherited,
        () => {
          pendingProcesses -= 1;
          if (!pendingProcesses) {
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
  setInheritedProfilesAndCatalogs(inheritedProfilesAndCatalogs);
}
