import React from "react";
import { Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("renders menu navigation", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  userEvent.click(screen.getByRole("button", { name: /menu/i }));
  const menuCVElement = screen.getByRole("menuitem", {
    name: /Catalog Viewer/i,
  });
  const menuSSPElement = screen.getByRole("menuitem", {
    name: /System Security Plan Viewer/i,
  });

  expect(menuCVElement).toBeVisible();
  expect(menuSSPElement).toBeVisible();
});
