# OSCAL React Library

A library of React components and an [example application](/example) that provides
a direct view into NIST's Open Security Controls Assessment Language ([OSCAL](https://pages.nist.gov/OSCAL/)) data
in JSON format.

These components enable React application developers to quickly compose pages that display granular elements of
OSCAL data or entire catalogs, profiles, component definitions, and system security plans.

![OSCSAL SSP Viewer Screenshot](example/docs/resources/ssp-viewer-screenshot.png)
Take a tour with the [live demo](https://oscal-viewer.msd.easydynamics.com/) or learn more about
developing with the library below.

## Components and Documentation

The library provides OSCAL UI developers a flexible framework for using OSCAL React components in their own
applications.

Those components directly visualize granular elements of the OSCAL JSON format, allowing a developer to assemble them
in the manner that best fits their application.

Documentation for the React components, as well as an editable mockup of each component, can be found on our
[Storybook page.](https://docs.oscal-react-library.msd.easydynamics.com/)

The [example](./example) folder shows how those components can be assembled to create an OSCAL Viewer application.

## Setting Up

### Building and Running Locally

In order to use the library components or test the library locally, the project components need to be rolled up and
dependencies need to be installed initially with the command: `npm install`. From here the application can be built
(See "OSCAL Viewer → Running") or components can be tested (See "Testing"). To automate local installation and
immediately run the application, use the following command:

```text
npm run build-library-and-run-example
```

### Testing

To run the test suite, ensure dependencies are installed and run `npm run test`. To also validate code is passing
eslint linting requirements, run `npm run lint`.

### Development

A component can be created and added to `src/components`. In order for the component to be used in an application,
it must either be added as an export in `src/index.js` or referenced by a component already being exported (such as
components being referenced by a loader in the current OSCAL Viewer). In the root folder of the project, run
`npm start` to roll up all of the components into `dist/` making them accessible to the example application. NOTE:
`npm install` has the same effect and will build all dependencies.

## OSCAL Viewer (Example Application)

The OSCAL Viewer example application allows developers to sample the various OSCAL concepts and view their features.

### Running

Once root dependencies are installed, build application dependencies and run OSCAL Viewer with the following
command:

```text
npm run build-and-run-example
```

After application dependencies are installed, use:

```text
npm run run-example
```

For more details about OSCAL Viewer, please refer to the [example (OSCAL Viewer) README.md](/example/README.md).

## Experimental REST Features

To enabled experimental features that make REST calls defined in
[`oscal-rest`](https://github.com/EasyDynamics/oscal-rest) to a backend service, add a `.env.local` file in
the root of the example project with a variable of `REACT_APP_REST_BASE_URL` pointing to the REST service, i.e.

```text
REACT_APP_REST_BASE_URL=http://localhost:8080/oscal/v1
```

## Contributing

For the process of Contributing to the project, please review [CONTRIBUTING.md](/CONTRIBUTING.md)
and adhere to the [Code of Conduct](/CODE_OF_CONDUCT.md).

## Licensing

For information on the project's license, please review the [LICENSE](/LICENSE) file.
