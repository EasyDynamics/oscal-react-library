import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

export default async function OSCALComponentResolveSources(
  componentDefinition,
  parentUrl,
  setProfilesCatalogsInherited,
  onSuccess,
  onError
) {
  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  componentDefinition.resolvedControls = [];

  const { title } = componentDefinition.metadata;
  const inheritedProfilesAndCatalogs = {
    title,
    type: "component definition",
    inherited: [],
  };

  let pendingProcesses = componentDefinition.components
    .map((component) => component["control-implementations"]?.length ?? 0)
    .reduce((acc, length) => acc + length, 0);

  await Promise.all(
    Object.entries(componentDefinition.components).map(
      async ([key, component]) => {
        component.uuid = key;
        await Promise.all(
          component["control-implementations"].map(
            async (controlImplementation) => {
              controlImplementation.modifications = {
                "set-parameters": [],
                alters: [],
              };
              await OSCALResolveProfileOrCatalogUrlControls(
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
            }
          )
        );
      }
    )
  );

  setProfilesCatalogsInherited(inheritedProfilesAndCatalogs);
}
