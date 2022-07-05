import React from "react";
import { render, screen } from "@testing-library/react";
import { rest, setupWorker } from "msw";
import { setupServer } from "msw/node";
import { act } from "react-dom/test-utils";
import OSCALDrawerSelector from "./OSCALDrawerSelector";

test("OSCALDrawerSelector loads", () => {
  render(<OSCALDrawerSelector open />);
});

test(`OSCALDrawerSelector displays expected tree items`, () => {
  render(<OSCALDrawerSelector open />);

  const catalogItem = screen.getByRole("treeitem", {
    name: "Catalog",
  });

  const componentItem = screen.getByRole("treeitem", {
    name: "Component",
  });

  const profileItem = screen.getByRole("treeitem", {
    name: "Profile",
  });

  const SSPItem = screen.getByRole("treeitem", {
    name: "SSP",
  });

  expect(catalogItem).toBeVisible();
  expect(componentItem).toBeVisible();
  expect(profileItem).toBeVisible();
  expect(SSPItem).toBeVisible();
});

test(`OSCALDrawerSelector displays close button`, () => {
  render(<OSCALDrawerSelector open />);

  const closeButton = screen.getByTestId("ChevronLeftIcon", {
    role: "button",
  });

  expect(closeButton).toBeVisible();
});

const backendUrl = "oscal-object";
// server stuff
const handlers = [
  rest.get(`${backendUrl}/catalogs`, (req, res, ctx) =>
    res(
      ctx.ok(true),
      ctx.json({
        catalog: [
          {
            catalog: {
              uuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
              metadata: {
                title: "catalog1",
              },
            },
          },
        ],
      })
    )
  ),
  rest.get(`${backendUrl}/profiles`, (req, res, ctx) =>
    res(ctx.ok(true), ctx.json({ profile: [] }))
  ),
  rest.get(`${backendUrl}/system-security-plans`, (req, res, ctx) =>
    res(ctx.ok(true), ctx.json({ "system-security-plan": [] }))
  ),
  rest.get(`${backendUrl}/component-definitions`, (req, res, ctx) =>
    res(ctx.ok(true), ctx.json({ "component-definition": [] }))
  ),
];

const server = setupServer(...handlers);

test("server", () => {
  server.listen();

  fetch(`${backendUrl}/catalogs`).then((result) => console.log(result));

  server.close();
});

test("OSCALDrawerSelector displays multiple catalogs", async () => {
  server.listen();

  render(<OSCALDrawerSelector open backendUrl={backendUrl} />);

  expect(await screen.findByText("catalog1")).toBeInTheDocument();

  server.close();
});
