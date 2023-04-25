import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Grid, IconButton, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import StyledTooltip from "./OSCALStyledTooltip";
import { getStatementByComponent } from "./oscal-utils/OSCALControlResolver";
import * as restUtils from "./oscal-utils/OSCALRestUtils";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { NotSpecifiedTypography } from "./StyledTypography";

const OSCALStatementEditing = styled(Grid)`
  ${(props) =>
    props.isEditing &&
    `
    border-color: ${props.theme.palette.info.light};
    box-shadow: 0 0 5px ${props.theme.palette.info.light};
  `}
`;
const OSCALStatementEditControlsContainer = styled(Grid)`
  text-align: right;
`;

const prosePlaceholderRegexpString = "{{ insert: param, ([0-9a-zA-B-_.]*) }}";

const ParamLabel = styled(Typography)(
  ({ theme }) => `
  background-color: ${theme.palette.warning.light};
  padding: 0.2em 0.5em;
  border-radius: 5px;
  opacity: 0.5;
  color: ${theme.palette.text.primary};
`
);
const ParamValue = styled(Typography)(
  ({ theme }) => `
  background-color: ${theme.palette.info.light};
  color: white;
  padding: 0.2em 0.5em;
  border-radius: 5px;
`
);

const styledParamLabel = (keyValue, parameterLabelText) => (
  <ParamLabel component="span" key={keyValue}>
    {parameterLabelText}
  </ParamLabel>
);

const styledParamValue = (keyValue, parameterValue) => (
  <ParamValue component="span" key={keyValue}>
    {parameterValue}
  </ParamValue>
);

/**
 * Gets the label for the given parameter ID from the given parameters
 * @param {Array} parameters
 * @param {String} parameterId
 * @returns the parameter label
 */
function getParameterLabelText(parameters, parameterId) {
  const parameter = parameters.find((testParameter) => testParameter.id === parameterId);

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
function getParameterValue(statementByComponent, implReqSetParameters, parameterId) {
  function parameterHasGivenId(parameterSetting) {
    return parameterSetting["param-id"] === parameterId;
  }
  // Locate set-parameters when found in the by-component
  const setParameters = statementByComponent?.["set-parameters"] || implReqSetParameters;
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
      ?.["by-components"]?.find((byComp) => byComp["component-uuid"] === componentId)?.[
      "set-parameters"
    ] || null
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

  if (text.includes("\n")) {
    return <OSCALMarkupMultiLine key={key}>{text}</OSCALMarkupMultiLine>;
  }
  return <OSCALMarkupLine key={key}>{text}</OSCALMarkupLine>;
}

/**
 * Wraps a placeholder display in a styled tooltip
 * @param {Object} props
 * @returns the wrapped placeholder display
 */
function SegmentTooltipWrapper(props) {
  return (
    <StyledTooltip title={props.constraintsDisplay} placement="top-end" arrow>
      <Badge color="info" variant="dot">
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
function getParameterLabelSegment(parameters, parameterId, modificationSetParameters, key) {
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
    paramSegment = styledParamValue(`param-value-key-${key}`, parameterValueText);
  } else {
    const parameterLabelText = getParameterLabelText(
      parameters,
      parameterId,
      modificationSetParameters
    );
    paramSegment = styledParamLabel(
      `param-label-key-${key}`,
      <OSCALMarkupLine>{parameterLabelText}</OSCALMarkupLine>
    );
  }

  const constraintsDisplay = getConstraintsDisplay(modificationSetParameters, parameterId);

  if (!constraintsDisplay) {
    return paramSegment;
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
 * @param {Array} parameters
 * @returns the parameter value segment component
 */
function getParameterValueSegment(
  statementByComponent,
  implReqSetParameters,
  parameterId,
  modificationSetParameters,
  key,
  parameters
) {
  const parameterValue = getParameterValue(statementByComponent, implReqSetParameters, parameterId);
  const constraintsDisplay = getConstraintsDisplay(modificationSetParameters, parameterId);

  const parameterLabelText = getParameterLabelText(
    parameters,
    parameterId,
    modificationSetParameters
  );

  if (parameterValue) {
    if (!constraintsDisplay.length) {
      return styledParamValue(`param-value-key-${key}`, parameterValue);
    }
    return (
      <SegmentTooltipWrapper
        constraintsDisplay={constraintsDisplay}
        key={`segment-wrapper-key-${key}`}
      >
        {styledParamValue(`param-value-key-${key}`, parameterValue)}
      </SegmentTooltipWrapper>
    );
  }
  if (!constraintsDisplay.length) {
    return styledParamLabel(`param-label-key-${key}`, parameterLabelText);
  }
  return (
    <SegmentTooltipWrapper
      constraintsDisplay={constraintsDisplay}
      key={`segment-wrapper-key-${key}`}
    >
      {styledParamLabel(`param-label-key-${key}`, parameterLabelText)};
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
  const prose = props.parameters
    ? props.prose.split(RegExp(prosePlaceholderRegexpString, "g")).map((segment, index) => {
        if (index % 2 === 0) {
          return getTextSegment(segment, index);
        }
        return getParameterLabelSegment(
          props.parameters,
          segment,
          props.modificationSetParameters,
          index
        );
      })
    : getTextSegment(props.prose, 0);

  if (!props.isImplemented) {
    return (
      <NotSpecifiedTypography>
        {props.label} {prose}
        {props.modificationDisplay}
      </NotSpecifiedTypography>
    );
  }

  if (props.modificationDisplay === undefined) {
    return (
      <div>
        {props.label} {prose}
        {props.modificationDisplay}
      </div>
    );
  }

  return (
    <div>
      {props.label} {prose}
      {props.modificationDisplay}
    </div>
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

  // TODO: This approach may not scale well. We're creating a ref
  // for every editable field for every control statement/prose for every
  // component before the user has even asked to edit. However, other attempts
  // resulted in a React error of: "Rendered more hooks than during the previous
  // render." This should be investigated further.
  // https://github.com/EasyDynamics/oscal-react-library/issues/499
  /* eslint-disable react-hooks/rules-of-hooks */
  const statementByComponentDescription = statementByComponent?.description || null;
  const statementByComponentDescriptionMarkup = statementByComponentDescription ? (
    <OSCALMarkupMultiLine>{statementByComponentDescription}</OSCALMarkupMultiLine>
  ) : null;
  const statementByComponentDescriptionRef = useRef(statementByComponentDescription);
  const setParametersRefs = {};
  if (props.parameters?.length > 0) {
    props.parameters.forEach((parameter) => {
      setParametersRefs[parameter.id] = useRef();
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  if (!statementByComponent && !isEditingStatement) {
    // We don't have a by component implementation, but we're not editing, so just display param labels
    return (
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <OSCALReplacedProseWithParameterLabel
            label={props.label}
            key={props.prose}
            prose={props.prose}
            parameters={props.parameters}
            modificationDisplay={props.modificationDisplay}
          />
        </Grid>
        <OSCALStatementEditControlsContainer item xs={1}>
          {props.isEditable && !isEditingStatement ? (
            <IconButton
              aria-label={`edit-bycomponent-${props.componentId}-statement-${props.statementId}`}
              size="small"
              onClick={() => {
                setIsEditingStatement(!isEditingStatement);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          ) : null}
        </OSCALStatementEditControlsContainer>
      </Grid>
    );
  }
  const implReqSetParameters = getImplReqSetParameters(
    props.implementedRequirement?.statements,
    props.componentId
  );
  const proseDisplay = props.prose
    .split(RegExp(prosePlaceholderRegexpString, "g"))
    .map((segment, index) => {
      if (index % 2 === 0) {
        // This is not a parameter placeholder
        return getTextSegment(segment, index.toString());
      }
      if (isEditingStatement) {
        // We're currently editing this statement, so build param input
        const setParameter = statementByComponent?.["set-parameters"]?.find(
          (element) => element["param-id"] === segment
        ) ?? { "param-id": segment };
        setParameter.values ??= [null];
        const setParameterRef = setParametersRefs[segment];
        // TODO: Support for more than one item in values array
        // https://github.com/EasyDynamics/oscal-react-library/issues/501
        return (
          <TextField
            id={`edit-bycomponent-${props.componentId}-statement-${props.statementId}-param-${segment}`}
            label={segment}
            variant="outlined"
            size="small"
            inputRef={setParameterRef}
            defaultValue={setParameter.values[0]}
            // Due to a lack of a good value for a key, the index is being used
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          />
        );
      }

      return getParameterValueSegment(
        statementByComponent,
        implReqSetParameters,
        segment,
        props.modificationSetParameters,
        index.toString(),
        props.parameters
      );
    });

  return (
    <OSCALStatementEditing container spacing={2}>
      <Grid item xs={11}>
        <StyledTooltip title={statementByComponentDescriptionMarkup ?? props.componentId}>
          <Link underline="hover" href={`#${props.label}`}>
            {props.label}
          </Link>
        </StyledTooltip>{" "}
        {proseDisplay}
        {props.modificationDisplay}
      </Grid>
      <OSCALStatementEditControlsContainer item xs={1}>
        {props.isEditable && !isEditingStatement ? (
          <IconButton
            aria-label={`edit-bycomponent-${props.componentId}-statement-${props.statementId}`}
            size="small"
            onClick={() => {
              setIsEditingStatement(!isEditingStatement);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
      </OSCALStatementEditControlsContainer>
      {isEditingStatement ? (
        <>
          <Grid item xs={10}>
            <TextField
              id={`edit-bycomponent-${props.componentId}-statement-${props.statementId}-description`}
              fullWidth
              label="Description"
              multiline
              variant="outlined"
              inputProps={{
                "data-testid": "Statement By Component Description TextField",
              }}
              inputRef={statementByComponentDescriptionRef}
              defaultValue={statementByComponentDescription}
            />
          </Grid>
          {!isProcessingRequest ? (
            <>
              <OSCALStatementEditControlsContainer item xs={1}>
                <IconButton
                  aria-label={`save-${[props.statementId]}`}
                  onClick={() => {
                    restUtils.createOrUpdateSspControlImplementationImplementedRequirementStatementByComponent(
                      props.partialRestData,
                      props.implementedRequirement,
                      props.statementId,
                      props.componentId,
                      statementByComponentDescriptionRef.current.value,
                      Object.keys(setParametersRefs).map((setParameterId) => {
                        const setParameterValue = setParametersRefs[setParameterId]?.current?.value;
                        return setParameterValue
                          ? {
                              "param-id": setParameterId,
                              values: [setParameterValue],
                            }
                          : null;
                      }),
                      () => {
                        setIsProcessingRequest(true);
                      },
                      () => {
                        setIsEditingStatement(false);
                        setIsProcessingRequest(false);
                        props.onRestSuccess();
                      },
                      (error) => {
                        props.onRestError(error);
                      }
                    );
                  }}
                  size="large"
                >
                  <SaveIcon fontSize={props.iconFontSize} />
                </IconButton>
              </OSCALStatementEditControlsContainer>
              <OSCALStatementEditControlsContainer item xs={1}>
                <IconButton
                  aria-label={`cancel-${[props.statementId]}`}
                  onClick={() => {
                    setIsEditingStatement(false);
                  }}
                  size="large"
                >
                  <CancelIcon fontSize={props.iconFontSize} />
                </IconButton>
              </OSCALStatementEditControlsContainer>
            </>
          ) : (
            <Grid item xs={2}>
              <CircularProgress />
            </Grid>
          )}
        </>
      ) : null}
    </OSCALStatementEditing>
  );
}
