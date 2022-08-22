import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALMetadata from "./OSCALMetadata";
import { metadataTestData } from "../test-data/CommonData";

describe("OSCALMetadata", () => {
  beforeEach(() => {
    render(<OSCALMetadata metadata={metadataTestData} />);
  });

  test(`displays title`, () => {
    const result = screen.getByRole("heading", { name: "Test Title" });
    expect(result).toBeVisible();
  });

  test(`displays version`, () => {
    const result = screen.getByText("Revision 5");
    expect(result).toBeVisible();
  });

  test(`displays parties`, () => {
    const result = screen.getByText("Some group of people");
    expect(result).toBeVisible();
  });

  test(`displays Contact button`, () => {
    const button = screen.getByRole("button", {
      name: /contact/i,
    });

    expect(button).toBeVisible();
  });

  test(`displays email contact info`, () => {
    const button = screen.getByRole("button", {
      name: /contact/i,
    });

    button.click();

    expect(screen.getByText("Email")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /owners@email\.org/i })
    ).toBeVisible();
  });

  test(`displays telephone mobile number info`, () => {
    const button = screen.getByRole("button", {
      name: /contact/i,
    });
    button.click();

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18005555555/i })).toBeVisible();
  });

  test(`displays telephone office number info`, () => {
    const button = screen.getByRole("button", {
      name: /contact/i,
    });

    button.click();

    expect(screen.getByText("Phone")).toBeVisible();
    expect(screen.getByRole("link", { name: /\+18004444444/i })).toBeVisible();
  });

  test(`displays address info`, () => {
    const button = screen.getByRole("button", {
      name: /contact/i,
    });

    button.click();

    expect(screen.getByText("Addresses")).toBeVisible();
    expect(screen.getByText(/0000 st, suite 3 city 0000 us/i)).toBeVisible();
  });
});
