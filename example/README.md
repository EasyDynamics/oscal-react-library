# Easy Dynamics OSCAL Viewer

A React-based UI for browsing OSCAL data.


TODO: Update details about OSCAL Viewer (EGRC-422)


## Features
In this initial iteration, the project is only able to render basic elements of OSCAL catalogs, system security plans, component definitions, and profiles.

The NIST 800-53 (rev 5) catalog is loaded by default in the catalog viewer:

![OSCSAL Catalog Viewer Screenshot](docs/resources/catalog-viewer-screenshot.png)

The ssp-example from the OSCAL Github repo is loaded by default in the SSP viewer:

![OSCSAL SSP Viewer Screenshot](docs/resources/ssp-viewer-screenshot.png)


TODO: Add Component Viewer & Profile Viewer (EGRC-422)


## Running

When in `example/`, the following commands can be issued:

```
npm install
npm start
```

## Testing

Within the `example/src` directory, run the following comands to run application tests and linter checks, respectively:

```
npm run test
npm run lint
```
