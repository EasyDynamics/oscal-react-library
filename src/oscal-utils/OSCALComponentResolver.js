function OSCALComponentResolveSources(componentDefinition) {
  const getSources = (controlImplementations) => {
    let src;
    const sources=[];
    /* eslint-disable */
    for (controlImplementation of controlImplementations) {
        controlImplementation.profile = OSCALResolveProfile(
            profileUrl, 
            parentUrl, 
            onSuccess, 
            onError);
    }
    return sources;
  }

  const getControlImplementations = (componentDefinition) => {
    const controlImplementations=[];
    Object.entries(componentDefinition.components).map(([key, component], index) => (
      controlImplementations.push(component["control-implementations"])
    ));
    return controlImplementations;
  }

  /* eslint-enable */
  if (!componentDefinition) {
    return null;
  }
  return getSources(getControlImplementations(componentDefinition));
}
export default function OSCALComponentResolveProfiles(
    componentDefinition,
    parentUrl,
    onSuccess,
    onError
  ) {
    /* eslint-disable */
    const sources = OSCALComponentResolveSources(componentDefinition);
    for (let sourceUrl in sources) {
        if (!sourceUrl.startsWith("http")) {
            sourceUrl = `${parentUrl}/../../${sourceUrl}`;
          }
          ssp.profile = OSCALResolveProfile(
            profileUrl, 
            parentUrl, 
            onSuccess, 
            onError);
    }
  }