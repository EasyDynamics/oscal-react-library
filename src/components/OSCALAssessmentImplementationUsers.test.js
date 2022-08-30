import React, { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usersTestData } from "../test-data/SystemData";
import OSCALAssessmentImplementationUsers from "./OSCALAssessmentImplementationUsers";

describe("OSCALAssessmentImplementationUsers", () => {
  beforeEach(() => {
    render(<OSCALAssessmentImplementationUsers users={usersTestData} />);
  });

  test("shows 'Users' section title", () => {
    const result = screen.getByText("Users");
    expect(result).toBeVisible();
  });

  test("shows 'Title' column", () => {
    const result = screen.getByText("Title");
    expect(result).toBeVisible();
  });

  test("shows 'Authorized Privileges' column", () => {
    const result = screen.getByText("Authorized Privileges");
    expect(result).toBeVisible();
  });

  test("shows name of a user listed", () => {
    const result = screen.getByText("User 1");
    expect(result).toBeVisible();
  });

  test("shows name of a privilege listed", () => {
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows name of a user listed", async () => {
    await userEvent.hover(screen.getByText("User 1"));
    expect(await screen.findByText("A system user")).toBeInTheDocument();
  });

  test("shows 'Authorized Privileges' title", () => {
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows 'Authorized Privileges' description", async () => {
    await userEvent.hover(screen.getByText("privilege title"));
    expect(
      await screen.findByText("privilege description")
    ).toBeInTheDocument();
  });

  test("shows read function preformed", () => {
    const result = screen.getByText("reading function");
    expect(result).toBeVisible();
  });

  test("shows write function preformed", () => {
    const result = screen.getByText("writing function");
    expect(result).toBeVisible();
  });
});
