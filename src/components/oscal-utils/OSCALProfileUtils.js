/**
 * Fixes source url if it does not properly link to a profile.
 *
 * @param {string} sourceURL url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @returns the correct source url
 */
export function fixProfileUrl(sourceUrl, parentUrl) {
  if (!sourceUrl?.startsWith("http")) {
    return `${parentUrl}/../${sourceUrl}`;
  }
  return sourceUrl;
}

/**
 * Fetches & sets the modifications from a profile at a given sourceURL.
 *
 * @param {string} sourceURL url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @param {function} setModifications set method for modifications
 */
export async function fetchProfileModifications(
  sourceUrl,
  parentUrl,
  setModifications
) {
  const profileUrl = fixProfileUrl(sourceUrl, parentUrl);

  fetch(profileUrl)
    .then((res) => res.json())
    .then(
      (result) => setModifications(result?.profile?.modify),
      () => null
    );
}

/**
 * Wrapper for calling the two function arguments.
 * Checks that setContentLoaded is defined before calling.
 * This is used for setting state variables that track the loading of the page.
 *
 * @param {function} setIsLoaded set for isLoaded state variable
 * @param {function} setContentLoaded set method for contentLoaded state variable
 * @param {boolean} value passed into the functions
 */
export function setLoadedStates(setIsLoaded, setContentLoaded, value) {
  setIsLoaded(value);
  if (setContentLoaded) {
    setContentLoaded(value);
  }
}
