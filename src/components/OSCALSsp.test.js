import React from "react";
import { render } from "@testing-library/react";
import { OSCALSSPLoader } from "./OSCALLoader";
import OSCALSsp from "./OSCALSsp";
import testOSCALSystemCharacteristics, {
  testExternalOSCALSystemCharacteristics,
} from "./OSCALSystemCharacteristics.test";
import testOSCALSystemImplementation, {
  testExternalOSCALSystemImplementation,
} from "./OSCALSystemImplementation.test";
import testOSCALMetadata, {
  testExternalSspOSCALMetadata,
} from "./OSCALMetadata.test";
import { sspTestData, sspTestDataExternal } from "../test-data/SystemData";
import { sspTestExampleUrl } from "../test-data/Urls";

test("OSCALSsp loads", () => {
  render(<OSCALSSPLoader />);
});

function sspRenderer() {
  render(<OSCALSsp system-security-plan={sspTestData} />);
}

function externalUrlSspRenderer(externalUrl) {
  render(
    <OSCALSsp
      parentUrl={externalUrl}
      system-security-plan={sspTestDataExternal}
    />
  );
}

// get url.searchParams.url, check if null, do tests based on that
function testUrlOSCALSsp(url) {
  const externalUrl = url.searchParams.get("url");
  if (!externalUrl) {
    testOSCALSystemCharacteristics("OSCALSsp", sspRenderer);
    testOSCALSystemImplementation("OSCALSsp", sspRenderer);
    testOSCALMetadata("OSCALSsp", sspRenderer);
    return;
  }

  testExternalOSCALSystemCharacteristics(
    "OSCALSspExternal",
    externalUrlSspRenderer,
    externalUrl
  );
  testExternalOSCALSystemImplementation(
    "OSCALSspExternal",
    externalUrlSspRenderer,
    externalUrl
  );
  testExternalSspOSCALMetadata(
    "OSCALSspExternal",
    externalUrlSspRenderer,
    externalUrl
  );
}

const url = new URL("https://www.oscalssptest.com");
testUrlOSCALSsp(url);
url.searchParams.set("url", sspTestExampleUrl);
testUrlOSCALSsp(url);
