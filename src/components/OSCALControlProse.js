import React, { useState } from "react";
import { styled, withTheme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Badge from "@material-ui/core/Badge";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { Grid, IconButton, TextField } from "@material-ui/core";
import StyledTooltip from "./OSCALStyledTooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getStatementByComponent } from "./oscal-utils/OSCALControlResolver";
import * as restUtils from "./oscal-utils/OSCALRestUtils";

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

const useStyles = makeStyles((theme) => ({
  OSCALStatementNotImplemented: {
    color: "silver",
  },
  OSCALStatementEditControlsContainer: {
    "text-align": "right",
  },
  OSCALStatementEditing: {
    "border-color": theme.palette.info.light,
    "box-shadow": `0 0 5px ${theme.palette.info.light}`,
  },
}));

/**
 * Gets the label for the given parameter ID from the given parameters
 * @param {Array} parameters
 * @param {String} parameterId
 * @returns the parameter label
 */
function getParameterLabelText(parameters, parameterId) {
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
  let paramSegment;
  // First check for set-parameters in the profile/catalog
  let parameterValueText;
  if (modificationSetParameters) {
    // Search for matching parameter id
    const foundParameterSetting = modificationSetParameters.find(
      (parameterSetting) => parameterSetting["param-id"] === parameterId
    );
    // Check values
    if (foundParameterSetting?.values) {
      parameterValueText = foundParameterSetting.values.toString();
    }
  }
  if (parameterValueText) {
    paramSegment = (
      <ParamValue component="span" key={`param-value-key-${key}`}>
        {parameterValueText}
      </ParamValue>
    );
  } else {
    const parameterLabelText = getParameterLabelText(
      parameters,
      parameterId,
      modificationSetParameters
    );
    paramSegment = (
      <ParamLabel component="span" key={`param-label-key-${key}`}>
        {parameterLabelText}
      </ParamLabel>
    );
  }

  const constraintsDisplay = getConstraintsDisplay(
    modificationSetParameters,
    parameterId
  );

  if (!constraintsDisplay) {
    // This throws an error without fragment wrapper
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{paramSegment}</>;
  }
  return (
    <SegmentTooltipWrapper
      constraintsDisplay={constraintsDisplay}
      key={`segment-wrapper-key-${key}`}
    >
      {paramSegment}
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
            return getTextSegment(segment, index.toString());
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
 * from the given implementedRequirement
 * @param {Object} props
 * @returns the parameter value component
 */
export function OSCALReplacedProseWithByComponentParameterValue(props) {
  const classes = useStyles();
  const [isEditingStatement, setIsEditingStatement] = useState(false);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  if (!props.prose) {
    return null;
  }

  const statementByComponent = getStatementByComponent(
    props.implementedRequirement?.statements,
    props.statementId,
    props.componentId
  );

  if (!statementByComponent && !isEditingStatement) {
    // We don't have a by component implementation, but we're not editing, so just display param labels
    return (
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <OSCALReplacedProseWithParameterLabel
            label={props.label}
            prose={props.prose}
            parameters={props.parameters}
            modificationDisplay={props.modificationDisplay}
            className={classes.OSCALStatementNotImplemented}
          />
        </Grid>
        <Grid item xs={1} className={classes.OSCALStatementEditControlsContainer}>
          {(props.isEditable && !isEditingStatement) ? (
            <IconButton
              size="small"
              onClick={(event) => {
                setIsEditingStatement(!isEditingStatement);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    );
  }
  const statementByComponentDescription = statementByComponent?.description || null;
  const implReqSetParameters =
    getImplReqSetParameters(props.implementedRequirement?.statements, props.componentId);
  const editedImplementationSetParameters = [];
  const proseDisplay = props.prose
    .split(RegExp(prosePlaceholderRegexpString, "g"))
    .map((segment, index) => {
      if (index % 2 === 0) {
        // This is not a parameter placeholder
        return getTextSegment(segment, index.toString());
      }
      if (isEditingStatement) {
        // We're currently editing this statement, so build param input
        // TODO - Populate implementationSetParameters with values from statementByComponent or empties
        let setParameter = statementByComponent?.["set-parameters"]?.find(
          (element) => element["param-id"] === segment
        );
        if (!setParameter) {
          setParameter = {
            "param-id": segment
          }
        }
        if (!setParameter.values) {
          setParameter.values = [ null ];
        }
        editedImplementationSetParameters[segment] = setParameter;
        // TODO - support for more than 1 item in values arrays
        return <TextField
          label={segment}
          variant="outlined"
          size="small"
          value={setParameter.values[0]}
        />
      } else {
        // We're not editing this statement, so return param value
        return getParameterValueSegment(
          statementByComponent,
          implReqSetParameters,
          segment,
          props.modificationSetParameters,
          index.toString()
        );
      }
    });

  return (
    <Grid container spacing={2} className={(isEditingStatement) ? classes.OSCALStatementEditing : null }>
       <Grid item xs={11}>
        <Typography className={props.className}>
          <StyledTooltip title={statementByComponentDescription ?? props.componentId}>
            <Link href="#{props.label}">{props.label}</Link>
          </StyledTooltip>
          {proseDisplay}
          {props.modificationDisplay}
        </Typography>
      </Grid>
      <Grid item xs={1} className={classes.OSCALStatementEditControlsContainer}>
        {(props.isEditable && !isEditingStatement) ? (
          <IconButton
            size="small"
            onClick={(event) => {
              setIsEditingStatement(!isEditingStatement);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Grid>
      {isEditingStatement ? (
        <>
          <Grid item xs={10}>
            <TextField
              fullWidth
              label="Description"
              multiline
              variant="outlined"
              inputProps={{
                "data-testid": "Statement By Component Description TextField",
              }}
              value={statementByComponentDescription}
            />
          </Grid>
          {!isProcessingRequest ? (
            <>
              <Grid item xs={1} className={classes.OSCALStatementEditControlsContainer}>
                <IconButton
                  aria-label={`save-${[props.statementId]}`}
                  onClick={() => {
                    restUtils.createOrUpdateSspControlImplementationImplementedRequirementStatementByComponent(
                      props.partialRestData,
                      props.implementedRequirement,
                      props.statementId,
                      props.componentId,
                      statementByComponentDescription,
                      editedImplementationSetParameters,
                      () => { setIsProcessingRequest(true); },
                      () => {
                        setIsEditingStatement(false);
                        setIsProcessingRequest(false);
                        props.onRestSuccess();
                      },
                      (error) => { props.onRestError(error); }
                    )
                  }}
                >
                  <SaveIcon fontSize={props.iconFontSize} />
                </IconButton>
              </Grid>
              <Grid item xs={1} className={classes.OSCALStatementEditControlsContainer}>
                <IconButton
                  aria-label={`cancel-${[props.statementId]}`}
                  onClick={() => { setIsEditingStatement(false); }}
                >
                  <CancelIcon fontSize={props.iconFontSize} />
                </IconButton>
              </Grid>
            </>
          ) : (
            <Grid item xs={2}>
              <CircularProgress />
            </Grid>
          )}
        </>
      ) : null}
    </Grid>
  );
}
