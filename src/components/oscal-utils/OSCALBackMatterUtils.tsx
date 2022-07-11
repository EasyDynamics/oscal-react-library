/**
 * Gets a resource from the given back matter's resource by the given HREF UUID.
 */
export function getResourceFromBackMatterByHref(
  backMatter: any,
  href: string
): any | undefined {
  if (!href.startsWith("#")) {
    throw new Error("not an internal href");
  }
  // Dig into back-matter to look for absolute href
  const importUuid = href.substring(1);

  return backMatter?.resources?.find(
    (resource: any) => resource.uuid === importUuid
  );
}

/**
 * Gets an rlink URI from the given back matter's resource by the given HREF UUID.
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/component/xml-schema/##local_back-matter-resource-rlink_def-h3}
 */
export default function getUriFromBackMatterByHref(
  backMatter: any,
  href: string,
  mediaTypeRegex: RegExp
) {
  const foundResource = getResourceFromBackMatterByHref(backMatter, href);

  if (!foundResource) {
    throw new Error("resource not found for href");
  }

  const foundLink = foundResource.rlinks?.find((rlink: any) =>
    mediaTypeRegex.test(rlink["media-type"])
  );

  if (!foundLink) {
    throw new Error("resource not found for href");
  }

  return foundLink;
}
