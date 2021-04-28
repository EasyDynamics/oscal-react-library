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
      let controlImplementation;
      component.controlImplementations.forEach(controlImplementation => {
        OSCALResolveProfileOrCatalogUrlControls(
          componentDefinition.resolvedControls,
          controlImplementation.source,
          parentUrl,
          componentDefinition.["back-matter"], // not actually used for resolution in components
          onSuccess,
          onError,
          []
        );
      });
    });
}