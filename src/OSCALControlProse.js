import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import StyledTooltip from "./OSCALStyledTooltip";
import getStatementByComponent from "./oscal-utils/OSCALControlResolver";

const prosePlaceholderRegexpString = "{{ insert: param, ([0-9a-zA-B-_.]*) }}";

/**
 * Gets the parameter ID from the given prosePlaceholder using regular expression
 * group matching
 * @param {String} prosePlaceholder
 * @returns the parameter ID
 */
function getParameterIdFromProsePlaceholder(prosePlaceholder) {
  const matches = RegExp(prosePlaceholderRegexpString, "g").exec(
    prosePlaceholder
  );
  if (!matches || matches.length === 1) {
    return {};
  }
  return matches[1];
}

/**
 * Replaces the parameter placeholders in the given prose with the given label
 *
 * TODO - This is probably 800-53 specific?
 * TODO - Add support for select param
 * BUG - If there is more then one parameter in the prose, this script will not work
 */
export function OSCALReplacedProseWithParameterLabel(props) {
  if (!props.prose) {
    return null;
  }
  let replacedProse;

  if (!props.parameters) {
    replacedProse = props.prose;
  } else {
    const getParameterLabel = (prosePlaceholder) => {
      const parameterId = getParameterIdFromProsePlaceholder(prosePlaceholder);

      const parameter = props.parameters.find(
        (parameter) => parameter.id === parameterId
      );

      if (!parameter) {
        return {};
      }
      if (parameter.label) {
        return `< ${parameter.label} >`;
      }
      if (parameter.select && parameter.select.choice) {
        return `< ${parameter.select.choice.join(" | ")} >`;
      }
      return `< ${prosePlaceholder} >`;
    };

    replacedProse = props.prose.replace(
      RegExp(prosePlaceholderRegexpString, "g"),
      getParameterLabel
    );
  }
  return (
    <Typography className={props.className}>
      {props.label} {replacedProse} {props.modificationDisplay}
    </Typography>
  );
}

/**
 * Replaces the parameter placeholders in the given prose with the values
 * from the 'by-component' within the given statementId that matches the given componentId
 * from the given implReqStatements
 *
 * TODO - This is probably 800-53 specific?
 */
export function OSCALReplacedProseWithByComponentParameterValue(props) {
  if (!props.prose) {
    return {};
  }
  const statementByComponent = getStatementByComponent(
    props.implReqStatements,
    props.statementId,
    props.componentId
  );
  if (!statementByComponent) {
    return (
      <OSCALReplacedProseWithParameterLabel
        label={props.label}
        prose={props.prose}
        parameters={props.parameters}
        className={props.unimplementedStatementClassName}
        modificationDisplay={props.modificationDisplay}
      />
    );
  }
  // Finds a parameter setting in a component statement
  function getParameterValue(prosePlaceholder) {
    const parameterId = getParameterIdFromProsePlaceholder(prosePlaceholder);

    // Locate matching parameter to parameterId
    const foundParameterSetting = statementByComponent["set-parameters"].find(
      (parameterSetting) => parameterSetting["param-id"] === parameterId
    );

    // Error checking: Exit function when parameter setting or it's values are not found
    if (!foundParameterSetting || !foundParameterSetting.values) {
      return {};
    }

    // TODO parse select parameters
    return `<span class="${
      props.componentParameterSettingClassname
    }" >${foundParameterSetting.values.toString()}</span>`;
  }

  const replacedProse = props.prose.replace(
    RegExp(prosePlaceholderRegexpString, "g"),
    getParameterValue
  );
  const { description } = statementByComponent;
  // TODO dangerouslySetInnerHTML is not safe, there are other alternatives
  return (
    <Typography>
      <StyledTooltip title={description}>
        <Link href="#{props.label}">{props.label}</Link>
      </StyledTooltip>
      {"\u00A0"}
      <span dangerouslySetInnerHTML={{ __html: replacedProse }} />
      {props.modificationDisplay}
    </Typography>
  );
}
