import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usersTestData } from "../test-data/SystemData";
import OSCALSystemImplementationUsers from "./OSCALSystemImplementationUsers";

describe("OSCALSystemImplementationUsers", () => {
  test("shows 'Users' section title", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("Users");
    expect(result).toBeVisible();
  });

  test("shows 'Title' column", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("Title");
    expect(result).toBeVisible();
  });

  test("shows 'Authorized Privileges' column", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("Authorized Privileges");
    expect(result).toBeVisible();
  });

  test("shows name of a privilege listed", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows name of a user listed", async () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    await userEvent.hover(screen.getByText("User 1"));
    expect(await screen.findByText("A system user")).toBeInTheDocument();
  });

  test("shows 'Authorized Privileges' title", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows 'Authorized Privileges' description", async () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    await userEvent.hover(screen.getByText("privilege title"));
    expect(
      await screen.findByText("privilege description")
    ).toBeInTheDocument();
  });

  test("shows read function preformed", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("reading function");
    expect(result).toBeVisible();
  });

  test("shows write function preformed", () => {
    render(<OSCALSystemImplementationUsers users={usersTestData} />);
    const result = screen.getByText("writing function");
    expect(result).toBeVisible();
  });
});
