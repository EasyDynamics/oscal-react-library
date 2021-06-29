# Easy Dynamics OSCAL React Library

A React Library providing components and an example application, OSCAL Viewer, for browsing OSCAL data.

## Setting Up

### Intro

The library provides OSCAL community UI developers a flexible framework for using OSCAL React components outside the scope of the OSCAL Viewer and in their own applications. There are two main parts to local developoment: 1) the `src/` module which contains OSCAL components, loaders, and other library elements; and 2) the `example/` module which contains the OSCAL Viewer application. This project was created following the [create-react-library](https://github.com/transitive-bullshit/create-react-library) model.

### Usage
A component can be created and added to `src/components`. In order for the component to be used in an application, it must either be added as an export in `src/index.js` or referenced by a component already being exported (such as components being referenced by a loader in the current OSCAL Viewer). In the root folder of the project, run `npm start` to roll up all of the components into `dist/` making them accessible to the example application. NOTE: `npm install` has the same effect and will build all dependencies.

### Running

In order to use the library components or test the library, the project components need to be rolled up and dependencies need to be installed initially with the command: `npm install`. From here the application can be built (See "OSCAL Viewer → Running") or components can be tested (See "Testing"). To automate local installation and immediately run the application, use the following command:
```
npm run build-proj
```

### Testing

To run the test suite, ensure dependencies are installed and run `npm run test`. To also validate code is passing eslint linting requirements, run `npm run lint`.

## OSCAL Viewer (Example Application)

The OSCAL Viewer example application allows developers to sample the various OSCAL concepts and view their features.

### Running
Once root dependencies have been installed, the application dependencies can be built and OSCAL Viewer can be ran by issuing the following command:

```
npm run build-app
```

After application dependencies are installed, use:

```
npm run run-app
```


For more details about OSCAL Viewer, please refer to [OSCAL_VIEWER_README.md](/example/OSCAL_VIEWER_README.md).
