import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OSCALComponentLoader } from "./OSCALLoader";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import testOSCALMetadata, {
  testExternalComponentOSCALMetadata,
} from "./OSCALMetadata.test";
import testOSCALResponsibleRoles, {
  testExternalOSCALResponsibleRoles,
} from "./OSCALResponsibleRoles.test";
import {
  componentDefinitionTestData,
  externalComponentDefinitionTestData,
} from "../test-data/ComponentsData";
import { componentDefinitionUrl } from "../test-data/Urls";

test("OSCALComponentDefinition loads", () => {
  render(<OSCALComponentLoader />);
});

function componentDefinitionRenderer() {
  render(
    <OSCALComponentDefinition
      componentDefinition={componentDefinitionTestData}
    />
  );
}

function externalUrlComponentDefinitionRenderer(externalUrl) {
  render(
    <OSCALComponentDefinition
      componentDefinition={externalComponentDefinitionTestData}
      parentUrl={externalUrl}
    />
  );
}

function testOSCALComponentDefinitionComponent(parentElementName, renderer) {
  test(`${parentElementName} shows component title`, () => {
    renderer();
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component description`, async () => {
    renderer();
    userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });
}

function testExternalOSCALComponentDefinitionComponent(
  parentElementName,
  renderer,
  externalUrl
) {
  test(`${parentElementName} shows component title`, () => {
    renderer(externalUrl);
    const result = screen.getByText("test component 1");
    expect(result).toBeVisible();
  });
  test(`${parentElementName} shows component description`, async () => {
    renderer(externalUrl);
    userEvent.hover(screen.getByText("test component 1"));
    expect(
      await screen.findByText(
        "This is a software component that implements basic authentication mechanisms."
      )
    ).toBeInTheDocument();
  });
}

function testUrlOSCALComponentDefinition(url) {
  const externalUrl = url.searchParams.get("url");
  if (!externalUrl) {
    testOSCALMetadata("OSCALComponentDefinition", componentDefinitionRenderer);

    testOSCALComponentDefinitionComponent(
      "OSCALComponentDefinition",
      componentDefinitionRenderer
    );

    testOSCALResponsibleRoles(
      "OSCALComponentDefinition",
      componentDefinitionRenderer
    );
    return;
  }
  testExternalComponentOSCALMetadata(
    "ExternalOSCALComponentDefinition",
    externalUrlComponentDefinitionRenderer,
    externalUrl
  );
  testExternalOSCALComponentDefinitionComponent(
    "ExternalOSCALComponentDefinition",
    externalUrlComponentDefinitionRenderer,
    externalUrl
  );
  testExternalOSCALResponsibleRoles(
    "ExternalOSCALComponentDefinition",
    externalUrlComponentDefinitionRenderer,
    externalUrl
  );
}

const url = new URL("https://www.oscal-profile-test.com");
testUrlOSCALComponentDefinition(url);
url.searchParams.set("url", componentDefinitionUrl);
testUrlOSCALComponentDefinition(url);
