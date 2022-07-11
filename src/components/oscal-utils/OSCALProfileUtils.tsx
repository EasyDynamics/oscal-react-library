/**
 * Fixes source url if it does not properly link to a profile.
 *
 * @param {string} sourceUrl url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @returns the correct source url
 */
export function fixProfileUrl(sourceUrl: string, parentUrl: string): string {
  if (!sourceUrl?.startsWith("http")) {
    return `${parentUrl}/../${sourceUrl}`;
  }
  return sourceUrl;
}

/**
 * Fetches & sets the modifications from a profile at a given sourceURL.
 *
 * @param {string} sourceUrl url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @param {function} setModifications set method for modifications
 */
export async function fetchProfileModifications(
  sourceUrl: string,
  parentUrl: string,
  setModifications: (_: any) => void
) {
  const profileUrl = fixProfileUrl(sourceUrl, parentUrl);

  fetch(profileUrl)
    .then((res) => res.json())
    .then(
      (result) => setModifications(result?.profile?.modify),
      () => null
    );
}
