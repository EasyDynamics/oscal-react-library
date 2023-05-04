import { ControlGroup } from "@easydynamics/oscal-types";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import OSCALCatalogGroups from "./OSCALCatalogGroups";

const testGroups: ControlGroup[] = [
  {
    id: "parent-group",
    class: "family",
    title: "Parent Group",
    groups: [
      {
        id: "child-group",
        class: "family",
        title: "Access Control",
        groups: [
          {
            id: "child-child-group",
            title: "Sub Access Control",
            controls: [
              {
                id: "control-id",
                title: "Access Control Policy and Procedures",
              },
            ],
          },
        ],
      },
      {
        id: "sibling-group",
        class: "family",
        title: "Sibling Title",
        controls: [{ id: "control2-id", title: "Audit Events" }],
        parts: [
          {
            name: "Parent part prose",
            prose: "Prose",
          },
        ],
      },
    ],
  },
  {
    title: "Test Group C",
    parts: [
      {
        id: "test-c-overview-1",
        name: "overview",
        prose: "This group has prose",
      },
    ],
  },
];

function getTextByChildren(text: string) {
  function result(_content: any, node: any) {
    const hasText = (checkNode: any) => checkNode.textContent === text;
    const nodeHasText = hasText(node);
    // This is necessary because we are providing a query function to override how
    // text search is performed.
    // eslint-disable-next-line testing-library/no-node-access
    const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));

    return nodeHasText && childrenDontHaveText;
  }
  return result;
}

describe("OSCALCatalogGroup", () => {
  test("displays param legend", () => {
    render(<OSCALCatalogGroups groups={testGroups} />);
    const placeholderBox = screen.getByLabelText("legend-placeholder-label");
    expect(placeholderBox).toBeVisible();
    const placeholderBoxLabel = screen.getByText("Placeholder");
    expect(placeholderBoxLabel).toBeVisible();

    const valueBox = screen.getByLabelText("legend-value-label");
    expect(valueBox).toBeVisible();
    const valueBoxLabel = screen.getByText("Value");
    expect(valueBoxLabel).toBeVisible();
  });

  test("displays nested groups", () => {
    render(<OSCALCatalogGroups groups={testGroups} />);
    const expand1 = screen.getByText("Access Control");
    fireEvent.click(expand1);

    const expand2 = screen.getByText("Sub Access Control");
    fireEvent.click(expand2);

    const expand3 = screen.getByText(
      getTextByChildren("control-id Access Control Policy and Procedures")
    );
    fireEvent.click(expand3);
  });

  test("displays sibling control group", () => {
    render(<OSCALCatalogGroups groups={testGroups} />);
    const expand1 = screen.getByText("Sibling Title");
    fireEvent.click(expand1);

    const expand2 = screen.getByText(getTextByChildren("control2-id Audit Events"));
    fireEvent.click(expand2);
  });

  test("displays outer group prose", () => {
    render(<OSCALCatalogGroups groups={testGroups} />);

    const expand1 = screen.getByText("Test Group C");
    fireEvent.click(expand1);

    const prose = screen.getByText("This group has prose");

    expect(prose).toBeVisible();
  });

  test("displays child group prose", () => {
    render(<OSCALCatalogGroups groups={testGroups} />);

    const expand1 = screen.getByText("Sibling Title");
    fireEvent.click(expand1);

    const prose = screen.getByText("Prose");

    expect(prose).toBeVisible();
  });
});
