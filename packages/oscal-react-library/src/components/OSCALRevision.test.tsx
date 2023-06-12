import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { exampleRevisions } from "../test-data/CommonData";
import { OSCALRevisions, OSCALRevisionsButton } from "./OSCALRevision";

describe("OSCAL Revisions Button", () => {
  test("displays 0 when there are no revisions", () => {
    render(<OSCALRevisionsButton revisions={undefined} />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("0");
  });

  test("is disabled when there are no revisions", () => {
    render(<OSCALRevisionsButton revisions={undefined} />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  test("displays 2 when there are 2 revisions", () => {
    render(<OSCALRevisionsButton revisions={exampleRevisions} />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("2");
  });

  test("displays Revisions dialog headers", () => {
    render(<OSCALRevisionsButton revisions={exampleRevisions} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const header = screen.getByRole("heading", {
      name: /revision history/i,
    });
    const titleHeader = screen.getByRole("columnheader", { name: /title/i });
    const publishHeader = screen.getByRole("columnheader", { name: /published/i });

    expect(header).toBeVisible();
    expect(titleHeader).toBeVisible();
    expect(publishHeader).toBeVisible();
  });
});

describe("OSCALRevisions", () => {
  test("Displays all title cells", () => {
    render(<OSCALRevisions revisions={exampleRevisions} />);

    const title1 = screen.getByRole("cell", { name: /title1/i });
    const title2 = screen.getByRole("cell", { name: /title2/i });

    expect(title1).toBeVisible();
    expect(title2).toBeVisible();
  });

  test("Displays all version cells", () => {
    render(<OSCALRevisions revisions={exampleRevisions} />);

    const version1 = screen.getByRole("cell", { name: /v1/i });
    const version2 = screen.getByRole("cell", { name: /v1/i });

    expect(version1).toBeVisible();
    expect(version2).toBeVisible();
  });

  test("Displays all revision cells", () => {
    render(<OSCALRevisions revisions={exampleRevisions} />);

    const revision1 = screen.getByRole("cell", { name: /1\.0\.4/i });
    const revision2 = screen.getByRole("cell", { name: /1\.0\.3/i });

    expect(revision1).toBeVisible();
    expect(revision2).toBeVisible();
  });
});
