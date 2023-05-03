import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { keywordValuesList, metadataTestData } from "../test-data/CommonData";
import OSCALMetadata from "./OSCALMetadata";

describe("OSCALMetadata", () => {
  test(`displays title`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);
    const result = screen.getByRole("heading", { name: "Test Title" });
    expect(result).toBeVisible();
  });

  test(`displays version`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);
    const result = screen.getByText("Revision 5");
    expect(result).toBeVisible();
  });

  test("displays remarks", () => {
    render(<OSCALMetadata metadata={metadataTestData} />);
    const remarks = screen.getByText("This is test data");
    expect(remarks).toBeVisible();
  });
});

describe("OSCAL metadata parties", () => {
  test(`displays parties`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const result = screen.getByText("Some group of people");
    expect(result).toBeVisible();
  });

  test(`displays Contact button`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    expect(button).toBeVisible();
  });

  test(`displays logo`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    const logo = screen.getByAltText("Some group of people logo");

    expect(logo).toBeVisible();
    expect(logo).toHaveAttribute("src", "https://example.png");
  });

  test(`displays email contact info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.getByRole("link", { name: /owners@email\.org/i })).toBeVisible();
  });

  test(`displays telephone mobile number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18005555555/i })).toBeVisible();
  });

  test(`displays telephone office number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18004444444/i })).toBeVisible();
  });

  test(`displays telephone home number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18007777777/i })).toBeVisible();
  });

  test(`displays unknown type telephone number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+1800666666/i })).toBeVisible();
  });

  test(`displays work address info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);
    expect(screen.getByText("Address")).toBeVisible();
    expect(screen.getByText(/0000 stsuite 3city, state 0000us/i)).toBeVisible();
  });

  test(`displays home address info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Address")).toBeVisible();
    expect(screen.getByText(/1111 road stcity, state 0000us/i)).toBeVisible();
  });

  test(`displays unknown type address info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Address")).toBeVisible();
    expect(screen.getByText(/2222 stcity, state 0000us/i)).toBeVisible();
  });
});

describe("OSCAL metadata roles", () => {
  test(`displays role title`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Roles");
    fireEvent.click(expand);

    const role1 = screen.getByText("Document creator");
    const role2 = screen.getByText("Contact");

    expect(role1).toBeVisible();
    expect(role2).toBeVisible();
  });

  test(`displays role dialog box`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Roles");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /document creator details button/i,
    });
    fireEvent.click(button);

    const title = screen.getByRole("heading", { name: /document creator/i });
    const description = screen.getByText("Creates documents");

    expect(title).toBeVisible();
    expect(description).toBeVisible();
  });
});

describe("OSCAL metadata locations", () => {
  test("display location titles", () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const location1 = screen.getByText("Example Location");
    const location2 = screen.getByText("Not Specified");

    expect(location1).toBeVisible();
    expect(location2).toBeVisible();
  });

  test("display location address", () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /Example Location details button/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Address")).toBeVisible();
    expect(screen.getByText(/0000 stsuite 3city, state 0000us/i)).toBeVisible();
  });

  test(`display telephone office number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /Example Location details button/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18004444444/i })).toBeVisible();
  });

  test(`display email contact info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /Example Location details button/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.getByRole("link", { name: /owners@email\.org/i })).toBeVisible();
  });

  test(`display url list`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /Example Location details button/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("URLs")).toBeVisible();
    expect(screen.getByRole("link", { name: /www\.website\.com/i })).toBeVisible();
  });
});

describe("OSCAL metadata keywords", () => {
  test("display keyword chips", () => {
    render(<OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.basic }} />);

    const expand = screen.getByText("Keywords");
    fireEvent.click(expand);

    const chips = screen.getAllByRole("chip");
    const keyword1 = screen.getByText("Keyword_1");
    const keyword2 = screen.getByText("Keyword_2");
    const keyword3 = screen.getByText("Keyword_3");

    expect(chips.length).toBe(3);
    expect(keyword1).toBeVisible();
    expect(keyword2).toBeVisible();
    expect(keyword3).toBeVisible();
  });

  test("displays one keyword", () => {
    render(
      <OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.oneKeyWord }} />
    );

    const expand = screen.getByText("Keywords");
    fireEvent.click(expand);

    const chips = screen.getAllByRole("chip");
    const keyword1 = screen.getByText("Keyword_1");

    expect(chips.length).toBe(1);
    expect(keyword1).toBeVisible();
  });

  test("displays no keywords with empty props", () => {
    render(
      <OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.emptyProps }} />
    );

    const expand = screen.getByText("Keywords");
    fireEvent.click(expand);

    const chips = screen.queryAllByRole("chip");

    expect(chips.length).toBe(0);
  });

  test("displays no keywords with empty value", () => {
    render(
      <OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.emptyValue }} />
    );

    const expand = screen.getByText("Keywords");
    fireEvent.click(expand);

    const chips = screen.queryAllByRole("chip");

    expect(chips.length).toBe(0);
  });

  test("displays no keywords with different ns", () => {
    render(<OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.setns }} />);

    const expand = screen.getByText("Keywords");
    fireEvent.click(expand);

    const chips = screen.queryAllByRole("chip");

    expect(chips.length).toBe(0);
  });

  test("displays props", () => {
    render(<OSCALMetadata metadata={{ ...metadataTestData, props: keywordValuesList.setns }} />);

    const openProperties = screen.getByText("Open Properties");
    fireEvent.click(openProperties);

    const modalTitle = screen.getByText("Test Title Properties");
    expect(modalTitle).toBeVisible();
    const valueText = screen.getByText("Keyword_1");
    expect(valueText).toBeVisible();
  });
});
