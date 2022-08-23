import React from "react";
import { render } from "@testing-library/react";
import { OSCALSSPLoader } from "./OSCALLoader";
import OSCALSsp from "./OSCALSsp";
import testOSCALSystemCharacteristics from "./OSCALSystemCharacteristics.test";
import testOSCALSystemImplementation from "./OSCALSystemImplementation.test";
import testOSCALMetadata from "./OSCALMetadata.test";
import { sspTestData } from "../test-data/SystemData";
import testOSCALEditableFieldActions from "./OSCALEditableFieldActions.test";
import testOSCALEditableTextField from "./OSCALEditableTextField.test";
import testOSCALDiagram from "./OSCALDiagram.test";

test("OSCALSsp loads", () => {
  render(<OSCALSSPLoader />);
});

function sspRenderer() {
  render(<OSCALSsp system-security-plan={sspTestData} parentUrl="./" />);
}

function sspRendererRestMode() {
  render(
    <OSCALSsp
      system-security-plan={sspTestData}
      isEditable
      parentUrl="./"
      onFieldSave={() => {}}
    />
  );
}

testOSCALSystemCharacteristics("OSCALSsp", sspRenderer);

testOSCALSystemImplementation("OSCALSsp", sspRenderer);

testOSCALMetadata("OSCALSsp", sspRenderer);

testOSCALEditableFieldActions("OSCALSsp", sspRendererRestMode);

testOSCALDiagram("OSCALSsp", sspRenderer);

testOSCALEditableTextField("OSCALSsp", sspRendererRestMode);
