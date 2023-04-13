import React from "react";
import { render } from "@testing-library/react";
import { OSCALSSPLoader } from "./OSCALLoader";
import OSCALSsp from "./OSCALSsp";
import testOSCALSystemCharacteristics from "./OSCALSystemCharacteristics.test";
import { sspTestData } from "../test-data/SystemData";
import testOSCALDiagram from "./OSCALDiagram.test";

test("OSCALSsp loads", () => {
  render(<OSCALSSPLoader />);
});

function sspRenderer() {
  render(<OSCALSsp system-security-plan={sspTestData} parentUrl="./" />);
}

testOSCALSystemCharacteristics("OSCALSsp", sspRenderer);

testOSCALDiagram("OSCALSsp", sspRenderer);
