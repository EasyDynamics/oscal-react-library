import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import OSCALMetadata from "./OSCALMetadata";
import { metadataTestData } from "../test-data/CommonData";

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

  test(`displays email contact info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });

    button.click();

    expect(screen.getByText("Email")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /owners@email\.org/i })
    ).toBeVisible();
  });

  test(`displays telephone mobile number info`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Parties");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /some group of people details button/i,
    });
    button.click();

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

    button.click();

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

    button.click();

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

    button.click();

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

    button.click();
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

    button.click();

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

    button.click();

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
    button.click();

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
    button.click();

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
    button.click();

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
    button.click();

    expect(screen.getByText("Email")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /owners@email\.org/i })
    ).toBeVisible();
  });

  test(`display url list`, () => {
    render(<OSCALMetadata metadata={metadataTestData} />);

    const expand = screen.getByText("Locations");
    fireEvent.click(expand);

    const button = screen.getByRole("button", {
      name: /Example Location details button/i,
    });
    button.click();

    expect(screen.getByText("URLs")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /www\.website\.com/i })
    ).toBeVisible();
  });
});
