import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALCatalogGroups from "./OSCALCatalogGroups";

const testGroups = [
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
      },
    ],
  },
];

describe("OSCALCatalogGroup", () => {
  beforeEach(() => {
    render(<OSCALCatalogGroups groups={testGroups} />);
  });

  test("displays param legend", () => {
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
    const expand1 = screen.getByText("Access Control");
    fireEvent.click(expand1);

    const expand2 = screen.getByText("Sub Access Control");
    fireEvent.click(expand2);

    const expand3 = screen.getByText(
      "CONTROL-ID Access Control Policy and Procedures"
    );
    fireEvent.click(expand3);
  });

  test("displays sibling control group", () => {
    const expand1 = screen.getByText("Sibling Title");
    fireEvent.click(expand1);

    const expand2 = screen.getByText("CONTROL2-ID Audit Events");
    fireEvent.click(expand2);
  });
});
