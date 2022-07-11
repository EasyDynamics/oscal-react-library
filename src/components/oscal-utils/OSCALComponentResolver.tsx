import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

export default function OSCALComponentResolveSources(
  componentDefinition: any,
  parentUrl: string,
  onSuccess: (_: any) => void,
  onError: () => void
): void {
  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  componentDefinition.resolvedControls = [];

  const inheritedProfilesAndCatalogs = {
    inherited: [],
  };

  let pendingProcesses = componentDefinition.components
    ?.map((component: any) => component["control-implementations"]?.length ?? 0)
    .reduce((acc: number, length: number) => acc + length, 0);

  Object.entries(componentDefinition.components!).forEach(
    ([key, component]: [string, any]) => {
      component.uuid = key;
      component["control-implementations"].forEach(
        (controlImplementation: any) => {
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
                onSuccess(inheritedProfilesAndCatalogs);
              }
            },
            () => {
              pendingProcesses -= 1;
              onError();
            },
            []
          );
        }
      );
    }
  );
}
