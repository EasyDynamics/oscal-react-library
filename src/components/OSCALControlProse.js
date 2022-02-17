import React, { useState } from "react";
import { styled, withTheme, makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { v4 } from "uuid";
import { getStatementByComponent } from "./oscal-utils/OSCALControlResolver";
import { populatePartialPatchData } from "./oscal-utils/OSCALSspResolver";
import OSCALEditableTextField from "./OSCALEditableTextField";
import OSCALModal from "./OSCALModal";
import StyledTooltip from "./OSCALStyledTooltip";

const prosePlaceholderRegexpString = "{{ insert: param, ([0-9a-zA-B-_.]*) }}";

const ParamLabel = styled(withTheme(Typography))((props) => ({
  backgroundColor: props.theme.palette.warning.light,
  padding: "0.2em 0.5em",
  "border-radius": "5px",
  opacity: 0.5,
  color: props.theme.palette.text.primary,
}));

const ParamValue = styled(withTheme(Typography))((props) => ({
  backgroundColor: props.theme.palette.info.light,
  color: "white",
  padding: "0.2em 0.5em",
  "border-radius": "5px",
}));

const useStyles = makeStyles(() => ({
  OSCALStatementNotImplemented: {
    color: "silver",
  },
}));

/**
 * Gets the label for the given parameter ID from the given parameters
 * @param {Array} parameters
 * @param {String} parameterId
 * @returns the parameter label
 */
function getParameterLabel(parameters, parameterId) {
  const parameter = parameters.find(
    (testParameter) => testParameter.id === parameterId
  );

  if (!parameter) {
    return `< ${parameterId} >`;
  }
  if (parameter.label) {
    return `< ${parameter.label} >`;
  }
  if (parameter.select && parameter.select.choice) {
    return `< ${parameter.select.choice.join(" | ")} >`;
  }
  return `< ${parameterId} >`;
}

/**
 * Finds a parameter setting in a component statement
 * @param {Object} statementByComponent
 * @param {Object} implReqSetParameters
 * @param {String} parameterId
 * @returns the parameter label
 */
function getParameterValue(
  statementByComponent,
  implReqSetParameters,
  parameterId
) {
  function parameterHasGivenId(parameterSetting) {
    return parameterSetting["param-id"] === parameterId;
  }
  // Locate set-parameters when found in the by-component
  const setParameters =
    statementByComponent?.["set-parameters"] || implReqSetParameters;
  const foundParameterSetting = setParameters?.find(parameterHasGivenId);

  // Error checking: Exit function when parameter setting or it's values are not found
  if (!foundParameterSetting?.values) {
    return null;
  }

  return foundParameterSetting.values.toString();
}

/**
 * Builds the display of constraints for the given parameterId
 * @param {Object} modificationSetParameters
 * @param {String} parameterId
 * @returns the parameter label
 */
function getConstraintsDisplay(modificationSetParameters, parameterId) {
  // Error check parameters for null
  if (!modificationSetParameters || !parameterId) {
    return "";
  }
  // Search for matching parameter id
  const foundParameterSetting = modificationSetParameters.find(
    (parameterSetting) => parameterSetting["param-id"] === parameterId
  );
  // Error check constraints
  if (!foundParameterSetting?.constraints) {
    return "";
  }
  // Provide list of constraints
  const constraintDescriptions = [];
  foundParameterSetting.constraints.forEach((constraint) => {
    constraintDescriptions.push(constraint.description);
  });
  return constraintDescriptions.join("\n");
}

/**
 * Retrieve the set-parameters when contained in the top-level implemented requirement statement
 *
 * @param {Object} implReqStatements statements on how the control is implemented
 * @param {String} componentId uuid of the component and desired by-component
 * @returns An array of set-parameters
 */
function getImplReqSetParameters(implReqStatements, componentId) {
  // Get the top-level implemented requirement statement
  return (
    implReqStatements
      ?.find((statement) => statement["statement-id"].endsWith("_smt"))
      ?.["by-components"]?.find(
        (byComp) => byComp["component-uuid"] === componentId
      )?.["set-parameters"] || null
  );
}

/**
 * Builds the display of a segment of non-placeholder text within prose
 * @param {String} text
 * @param {String} key
 * @returns the text segment component
 */
function getTextSegment(text, key) {
  if (!text) {
    return null;
  }
  return (
    <Typography component="span" key={key}>
      {text}
    </Typography>
  );
}

/**
 * Wraps a placeholder display in a styled tooltip
 * @param {Object} props
 * @returns the wrapped placeholder display
 */
function SegmentTooltipWrapper(props) {
  return (
    <StyledTooltip title={props.constraintsDisplay} placement="top-end" arrow>
      <Badge color="secondary" variant="dot">
        {props.children}
      </Badge>
    </StyledTooltip>
  );
}

/**
 * Builds the display of a segment of placeholder label text within prose
 * @param {Array} parameters
 * @param {String} parameterId
 * @param {Object} modificationSetParameters
 * @param {String} key
 * @returns the parameter label segment component
 */
function getParameterLabelSegment(
  parameters,
  parameterId,
  modificationSetParameters,
  key
) {
  const parameterLabel = getParameterLabel(parameters, parameterId);
  const constraintsDisplay = getConstraintsDisplay(
    modificationSetParameters,
    parameterId
  );

  if (!constraintsDisplay) {
    return (
      <ParamLabel component="span" key={`param-label-key-${key}`}>
        {parameterLabel}
      </ParamLabel>
    );
  }
  return (
    <SegmentTooltipWrapper
      constraintsDisplay={constraintsDisplay}
      key={`segment-wrapper-key-${key}`}
    >
      <ParamLabel component="span" key={`param-label-key-${key}`}>
        {parameterLabel}
      </ParamLabel>
    </SegmentTooltipWrapper>
  );
}

/**
 * Builds the display of a segment of placeholder value text within prose
 * @param {Object} statementByComponent
 * @param {Object} implReqSetParameters
 * @param {String} parameterId
 * @param {Object} modificationSetParameters
 * @param {String} key
 * @returns the parameter value segment component
 */
function getParameterValueSegment(
  statementByComponent,
  implReqSetParameters,
  parameterId,
  modificationSetParameters,
  key
) {
  const parameterValue = getParameterValue(
    statementByComponent,
    implReqSetParameters,
    parameterId
  );
  const constraintsDisplay = getConstraintsDisplay(
    modificationSetParameters,
    parameterId
  );

  if (!constraintsDisplay.length) {
    return (
      <ParamValue component="span" key={`param-value-key-${key}`}>
        {parameterValue}
      </ParamValue>
    );
  }

  return (
    <SegmentTooltipWrapper
      constraintsDisplay={constraintsDisplay}
      key={`segment-wrapper-key-${key}`}
    >
      <ParamValue component="span" key={`param-value-key-${key}`}>
        {parameterValue}
      </ParamValue>
    </SegmentTooltipWrapper>
  );
}

/**
 * Replaces the parameter placeholders in the given prose with the given label
 * @param {Object} props
 * @returns the parameter label component
 */
export function OSCALReplacedProseWithParameterLabel(props) {
  const [oscalModalPatchData, setOscalModalPatchData] = useState(null);
  const rootOscalObjectName = Object.keys(props.patchData)[0];

  if (!props.prose) {
    return null;
  }

  if (!props.parameters) {
    return (
      <Typography className={props.className}>
        {props.label}
        {props.prose}
        {props.modificationDisplay}
      </Typography>
    );
  }

  let labelWithProse = props.prose;
  if (props.label) {
    labelWithProse = props.label.concat(` ${props.prose}`);
  }

  return (
    <>
      {oscalModalPatchData ? (
        <OSCALModal
          editedField={[
            rootOscalObjectName,
            "control-implementation",
            "implemented-requirements",
            0,
            "statements",
            0,
            "by-components",
            0,
            "description",
          ]}
          patchData={oscalModalPatchData}
          onCancel={() => {
            setOscalModalPatchData(null);
          }}
          onFieldSave={props.onFieldSave}
          open
          title="Enter a description for the control implementation:"
          update={props.update}
          value="Description of control implementation"
        />
      ) : null}
      <Typography className={props.className}>
        {labelWithProse
          .split(RegExp(prosePlaceholderRegexpString, "g"))
          .map((segment, index) => {
            if (index % 2 === 0) {
              return getTextSegment(segment, index.toString());
            }

            return (
              <OSCALEditableTextField
                appendToLastFieldInPath
                canEdit={props.isEditable}
                defaultValue={getParameterLabel(props.parameters, segment)}
                editedField={[
                  rootOscalObjectName,
                  "control-implementation",
                  "implemented-requirements",
                  0,
                  "statements",
                  0,
                  "by-components",
                  0,
                  "set-parameters",
                  0,
                  "values",
                ]}
                onFieldSave={(
                  appendToLastFieldInPath,
                  partialPatchData,
                  editedFieldJsonPath,
                  newValue
                ) => {
                  populatePartialPatchData(
                    appendToLastFieldInPath,
                    partialPatchData,
                    editedFieldJsonPath,
                    newValue
                  );
                  setOscalModalPatchData(partialPatchData);
                }}
                patchData={{
                  [rootOscalObjectName]: {
                    uuid: props.patchData[rootOscalObjectName].uuid,
                    "control-implementation": {
                      "implemented-requirements": [
                        {
                          uuid: props.patchData[rootOscalObjectName][
                            "control-implementation"
                          ]["implemented-requirements"][0].uuid,
                          "control-id":
                            props.patchData[rootOscalObjectName][
                              "control-implementation"
                            ]["implemented-requirements"][0]["control-id"],
                          statements: [
                            {
                              uuid: props.statementUuid,
                              "statement-id": props.statementId,
                              "by-components": [
                                {
                                  uuid: v4(),
                                  "component-uuid": props.componentId,
                                  description:
                                    "User added a new control implementation",
                                  "set-parameters": [
                                    {
                                      "param-id": segment,
                                      values: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                }}
                textFieldSize="small"
                typographyVariant="body2"
                update={props.update}
                value={getParameterLabelSegment(
                  props.parameters,
                  segment,
                  props.modificationSetParameters,
                  index.toString()
                )}
              />
            );
          })}
        {props.modificationDisplay}
      </Typography>
    </>
  );
}

/**
 * Replaces the parameter placeholders in the given prose with the values
 * from the 'by-component' within the given statementId that matches the given componentId
 * from the given implReqStatements
 * @param {Object} props
 * @returns the parameter value component
 */
export function OSCALReplacedProseWithByComponentParameterValue(props) {
  if (!props.prose) {
    return null;
  }

  const statementByComponent = getStatementByComponent(
    props.implReqStatements,
    props.statementId,
    props.componentId
  );

  if (!statementByComponent) {
    const classes = useStyles();
    return (
      <OSCALReplacedProseWithParameterLabel
        componentId={props.componentId}
        implReqStatements={props.implReqStatements}
        isEditable={props.isEditable}
        label={props.label}
        onFieldSave={props.onFieldSave}
        prose={props.prose}
        parameters={props.parameters}
        patchData={props.patchData}
        modificationDisplay={props.modificationDisplay}
        className={classes.OSCALStatementNotImplemented}
        statementId={props.statementId}
        statementUuid={props.statementUuid}
      />
    );
  }

  const rootOscalObjectName = Object.keys(props.patchData)[0];
  const editedFieldPath = [
    rootOscalObjectName,
    "control-implementation",
    "implemented-requirements",
    0,
    "statements",
    0,
    "by-components",
    0,
    "set-parameters",
    0,
    "values",
    0,
  ];

  const partialPatchData = {
    [rootOscalObjectName]: {
      uuid: props.patchData[rootOscalObjectName].uuid,
      "control-implementation": {
        "implemented-requirements": [
          {
            uuid: props.patchData[rootOscalObjectName][
              "control-implementation"
            ]["implemented-requirements"][0].uuid,
            "control-id":
              props.patchData[rootOscalObjectName]["control-implementation"][
                "implemented-requirements"
              ][0]["control-id"],
            statements: [
              {
                uuid: props.statementUuid,
                "statement-id": props.statementId,
                "by-components": [statementByComponent],
              },
            ],
          },
        ],
      },
    },
  };

  const { description } = statementByComponent;
  return (
    <Typography className={props.className}>
      <StyledTooltip title={description ?? props.componentId}>
        <Link href="#{props.label}">{props.label}</Link>
      </StyledTooltip>
      {props.prose
        .split(RegExp(prosePlaceholderRegexpString, "g"))
        .map((segment, index) => {
          if (index % 2 === 0) {
            return getTextSegment(segment, index.toString());
          }
          return (
            <OSCALEditableTextField
              canEdit={props.isEditable}
              defaultValue={getParameterValue(
                statementByComponent,
                getImplReqSetParameters(
                  props.implReqStatements,
                  props.componentId
                ),
                segment
              )}
              editedField={editedFieldPath}
              onFieldSave={props.onFieldSave}
              patchData={partialPatchData}
              textFieldSize="small"
              typographyVariant="body2"
              update={props.update}
              value={getParameterValueSegment(
                statementByComponent,
                getImplReqSetParameters(
                  props.implReqStatements,
                  props.componentId
                ),
                segment,
                props.modificationSetParameters,
                index.toString()
              )}
            />
          );
        })}
      {props.modificationDisplay}
    </Typography>
  );
}
