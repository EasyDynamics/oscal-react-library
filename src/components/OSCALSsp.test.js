import React from "react";
import { render } from "@testing-library/react";
import { OSCALSSPLoader } from "./OSCALLoader";
import OSCALSsp from "./OSCALSsp";
import testOSCALSystemCharacteristics from "./OSCALSystemCharacteristics.test";
import testOSCALSystemImplementation from "./OSCALSystemImplementation.test";
import testOSCALMetadata from "./OSCALMetadata.test";
import { sspTestData } from "../test-data/SystemData";
import testOSCALEditableFieldActions from "./OSCALEditableFieldActions.test";

test("OSCALSsp loads", () => {
  render(<OSCALSSPLoader />);
});

function sspRenderer() {
  render(<OSCALSsp system-security-plan={sspTestData} />);
}

function sspRendererRestMode() {
  render(<OSCALSsp system-security-plan={sspTestData} isEditable />);
}

testOSCALSystemCharacteristics("OSCALSsp", sspRenderer);

testOSCALSystemImplementation("OSCALSsp", sspRenderer);

testOSCALMetadata("OSCALSsp", sspRenderer);

testOSCALEditableFieldActions("OSCALSsp", sspRendererRestMode);
