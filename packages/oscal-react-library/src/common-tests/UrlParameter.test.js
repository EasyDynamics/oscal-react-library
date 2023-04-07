import { getRequestedUrl } from "../components/OSCALLoader";
import { urlParameterTestUrl } from "../test-data/Urls";

describe("Grabbing a URL Parameter from the Browser", () => {
  test("No Url Parameter Exists", () => {
    // The Url parameter should always initially be null.
    expect(getRequestedUrl()).toBeNull();
  });

  test("Url Parameter Exists", () => {
    const url = new URL(window.location);
    url.searchParams.set("url", urlParameterTestUrl);
    window.history.pushState({}, "", url);
    expect(getRequestedUrl()).toEqual(urlParameterTestUrl);
  });
});
