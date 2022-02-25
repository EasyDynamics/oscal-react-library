import React, { useState } from "react";
import { styled, withTheme, makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Link from "@material-ui/core/Link";
import EditIcon from "@material-ui/icons/Edit";
import { Grid, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { v4 as uuidv4 } from "uuid";
import { getStatementByComponent } from "./oscal-utils/OSCALControlResolver";
import StyledTooltip from "./OSCALStyledTooltip";
import OSCALPopover from "./OSCALPopover";
import { deepClone, restMethods } from "./oscal-utils/OSCALUtils";

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

function onFieldSaveParameterLabel(
  props,
  descriptionReference,
  implementationReference,
  paramId,
  partialRestData
) {
  const statement =
    partialRestData?.statements?.find(
      (element) => element["statement-id"] === props.statementId
    ) || null;
  const rootOscalObjectName = Object.keys(props.restData)[0];

  const newByComponent = {
    "component-uuid": props.componentId,
    uuid: uuidv4(),
    description: descriptionReference.current.value,
  };

  statement["by-components"].push(newByComponent);

  const editedField = [
    "statements",
    `statement-id[${props.statementId}]`,
    "by-components",
    `component-uuid[${props.componentId}]`,
  ];

  if (paramId) {
    newByComponent["set-parameters"] = [
      {
        "param-id": paramId,
        values: [implementationReference.current.value],
      },
    ];

    editedField.push("set-parameters", `param-id[${paramId}]`, "values");
  } else {
    editedField.push("description");
  }

  props.onFieldSave(
    false,
    partialRestData,
    editedField,
    null,
    restMethods.PUT,
    `${rootOscalObjectName}/${props.restData[rootOscalObjectName].uuid}/control-implementation/implemented-requirements/${props.implementedRequirement.uuid}`
  );
}

/**
 * Replaces the parameter placeholders in the given prose with the given label
 * @param {Object} props
 * @returns the parameter label component
 */
export function OSCALReplacedProseWithParameterLabel(props) {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const partialRestData = props.implementedRequirement
    ? deepClone(props.implementedRequirement)
    : null;
  const statement =
    partialRestData?.statements?.find(
      (element) => element["statement-id"] === props.statementId
    ) || null;

  let labelWithProse = props.prose;
  if (props.label) {
    labelWithProse = props.label.concat(` ${props.prose}`);
  }

  const paramId = props.prose.split(
    RegExp(prosePlaceholderRegexpString, "g")
  )[1];

  return (
    <Typography className={props.className}>
      {labelWithProse
        .split(RegExp(prosePlaceholderRegexpString, "g"))
        .map((segment, index) => {
          if (index % 2 === 0) {
            return getTextSegment(segment, index.toString());
          }

          return (
            <Typography display="inline" variant="body2">
              {getParameterLabelSegment(
                props.parameters,
                segment,
                props.modificationSetParameters,
                index.toString()
              )}
            </Typography>
          );
        })}
      {props.modificationDisplay}
      {props.label && props.isEditable ? (
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ) : null}
      {props.isEditable ? (
        <Grid container>
          <OSCALPopover
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            controlId={props.controlId}
            onCancel={() => {
              setAnchorEl(null);
            }}
            onFieldSave={(descriptionReference, implementationReference) => {
              onFieldSaveParameterLabel(
                props,
                descriptionReference,
                implementationReference,
                paramId,
                partialRestData
              );
            }}
            statementByComponent={statement}
            statementId={props.statementId}
            updatingLabelPlaceholder={paramId}
          />
        </Grid>
      ) : null}
    </Typography>
  );
}

function onFieldSaveByComponentParameterValue(
  props,
  restUrlPath,
  descriptionReference,
  implementationReference
) {
  const partialRestData = deepClone(props.implementedRequirement);
  const byComponent = partialRestData.statements
    .find((element) => element["statement-id"] === props.statementId)
    ["by-components"].find(
      (element) => element["component-uuid"] === props.componentId
    );
  byComponent.description = descriptionReference.current.value;

  const editedField = [
    "statements",
    `statement-id[${props.statementId}]`,
    "by-components",
    `component-uuid[${props.componentId}]`,
  ];

  if (byComponent["set-parameters"]) {
    const paramId =
      props.parameters.find((element) => props.prose.includes(element.id))
        ?.id || null;
    const setParameter = byComponent["set-parameters"].find(
      (element) => element["param-id"] === paramId
    );
    setParameter.values = [implementationReference.current.value];
    editedField.push("set-parameters", `param-id[${paramId}]`, "values");
  } else {
    editedField.push("description");
  }

  props.onFieldSave(
    false,
    partialRestData,
    editedField,
    null,
    restMethods.PUT,
    restUrlPath
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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const rootOscalObjectName = Object.keys(props.restData)[0];

  if (!props.prose) {
    return null;
  }

  const statementByComponent = getStatementByComponent(
    props.implReqStatements,
    props.statementId,
    props.componentId
  );

  if (!statementByComponent) {
    return (
      <OSCALReplacedProseWithParameterLabel
        controlId={props.controlId}
        componentId={props.componentId}
        implementedRequirement={props.implementedRequirement}
        implReqStatements={props.implReqStatements}
        isEditable={props.isEditable}
        label={props.label}
        onFieldSave={props.onFieldSave}
        prose={props.prose}
        parameters={props.parameters}
        restData={props.restData}
        modificationDisplay={props.modificationDisplay}
        className={classes.OSCALStatementNotImplemented}
        statementId={props.statementId}
        statementUuid={props.statementUuid}
      />
    );
  }

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
            <Typography display="inline" variant="body2">
              {getParameterValueSegment(
                statementByComponent,
                getImplReqSetParameters(
                  props.implReqStatements,
                  props.componentId
                ),
                segment,
                props.modificationSetParameters,
                index.toString()
              )}
            </Typography>
          );
        })}
      {props.modificationDisplay}
      {props.isEditable ? (
        <>
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <Grid container>
            <OSCALPopover
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              controlId={props.controlId}
              onCancel={() => {
                setAnchorEl(null);
              }}
              onFieldSave={(descriptionReference, implementationReference) => {
                onFieldSaveByComponentParameterValue(
                  props,
                  `${rootOscalObjectName}/${props.restData[rootOscalObjectName].uuid}/control-implementation/implemented-requirements/${props.implementedRequirement.uuid}`,
                  descriptionReference,
                  implementationReference
                );
              }}
              statementByComponent={statementByComponent}
              statementId={props.statementId}
            />
          </Grid>
        </>
      ) : null}
    </Typography>
  );
}
