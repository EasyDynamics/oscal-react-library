import React, { useCallback } from "react";
import { styled, withTheme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Badge from "@material-ui/core/Badge";
import StyledTooltip from "./OSCALStyledTooltip";
import { getStatementByComponent } from "./oscal-utils/OSCALControlResolver";

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
    return null;
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
 * @param {String} parameterId
 * @returns the parameter label
 */
function getParameterValue(statementByComponent, parameterId) {
  // Locate matching parameter to parameterId
  if (!statementByComponent["set-parameters"]) {
    return null;
  }
  const foundParameterSetting = statementByComponent["set-parameters"].find(
    (parameterSetting) => parameterSetting["param-id"] === parameterId
  );

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
  // Error check constriants
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
  const parameterLabel = useCallback(
    getParameterLabel(parameters, parameterId)
  );
  const constraintsDisplay = useCallback(
    getConstraintsDisplay(modificationSetParameters, parameterId)
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
 * @param {String} parameterId
 * @param {Object} modificationSetParameters
 * @param {String} key
 * @returns the parameter value segment component
 */
function getParameterValueSegment(
  statementByComponent,
  parameterId,
  modificationSetParameters,
  key
) {
  const parameterValue = useCallback(
    getParameterValue(statementByComponent, parameterId)
  );
  const constraintsDisplay = useCallback(
    getConstraintsDisplay(modificationSetParameters, parameterId)
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

  return (
    <Typography className={props.className}>
      {props.label}
      {props.prose
        .split(RegExp(prosePlaceholderRegexpString, "g"))
        .map((segment, index) => {
          if (index % 2 === 0) {
            return useCallback(getTextSegment(segment, index.toString()));
          }
          return getParameterLabelSegment(
            props.parameters,
            segment,
            props.modificationSetParameters,
            index.toString()
          );
        })}
      {props.modificationDisplay}
    </Typography>
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
        label={props.label}
        prose={props.prose}
        parameters={props.parameters}
        modificationDisplay={props.modificationDisplay}
        className={classes.OSCALStatementNotImplemented}
      />
    );
  }

  const { description } = statementByComponent;
  return (
    <Typography>
      <StyledTooltip title={description}>
        <Link href="#{props.label}">{props.label}</Link>
      </StyledTooltip>
      {props.prose
        .split(RegExp(prosePlaceholderRegexpString, "g"))
        .map((segment, index) => {
          if (index % 2 === 0) {
            return useCallback(getTextSegment(segment, index.toString()));
          }
          return getParameterValueSegment(
            statementByComponent,
            segment,
            props.modificationSetParameters,
            index.toString()
          );
        })}
      {props.modificationDisplay}
    </Typography>
  );
}
