import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["componentDefinition"] }] */
export default function OSCALComponentResolveSources(
  componentDefinition,
  parentUrl,
  onSuccess,
  onError
) {
  componentDefinition.resolvedControls = [];
  Object.entries(componentDefinition.components).forEach(([key, component]) => {
    /* eslint no-param-reassign: "error" */
    component.uuid = key;
    let controlImplementation;
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
