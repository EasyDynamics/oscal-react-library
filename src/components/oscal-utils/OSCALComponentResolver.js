import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

export default function OSCALComponentResolveSources(
  componentDefinition,
  parentUrl,
  onSuccess,
  onError
) {
  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  componentDefinition.resolvedControls = [];
  Object.entries(componentDefinition.components).forEach(([key, component]) => {
    component.uuid = key;
    component["control-implementations"].forEach((controlImplementation) => {
      OSCALResolveProfileOrCatalogUrlControls(
        componentDefinition.resolvedControls,
        controlImplementation.source,
        parentUrl,
        componentDefinition["back-matter"], // not actually used for resolution in components
        onSuccess,
        onError,
        []
      );
    });
  });
}
