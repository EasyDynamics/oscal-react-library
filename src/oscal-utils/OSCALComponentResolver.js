import ResolveProfileOrCatalogUrl from "./OSCALProfileResolver";

export default function OSCALComponentResolveSources(
    componentDefinition,
    parentUrl,
    onSuccess,
    onError
  ) {
  Object.entries(componentDefinition.components).forEach(([key, component]) => {
    let controlImplementation;
    component.controlImplementations.forEach(controlImplementation => {
      ResolveProfileOrCatalogUrl(componentDefinition.controls, controlImplementation.source, parentUrl, onSuccess, onError);
    });
  });
}