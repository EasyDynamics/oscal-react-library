import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import { Grid, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { v4 as uuidv4 } from "uuid";
import { Autocomplete } from "@material-ui/lab";
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";
import { deepClone, restMethods } from "./oscal-utils/OSCALUtils";

const useStyles = makeStyles((theme) => ({
  ControlProseEditor: {
    padding: theme.spacing(2),
    width: 500,
  },
}));

/**
 * Conducts preparation for a REST request that will be sent to a backend service to update a
 * parameter placeholder value with an implementation and description. The request, if successful,
 * saves the changes to the appropriate file and updates the changes to the Viewer.
 *
 * @param props object passed to the parent component containing necessary data to create and update the component
 * @param descriptionReference reference to the text field input containing the new description for the control implementation
 * @param setParameterValues the set-parameter values for the control implementation statement
 * @param paramId the set-parameter id
 */
export function onFieldSaveParameterLabel(
  props,
  descriptionReference,
  setParameterValues,
  paramId
) {
  const partialRestData = deepClone(props.implementedRequirement);
  const statementExists =
    partialRestData?.statements?.find(
      (element) => element["statement-id"] === props.statementId
    ) || null;
  const rootOscalObjectName = Object.keys(props.partialRestData)[0];
  const rootUuid = props.partialRestData[rootOscalObjectName].uuid;
  const restUrl = `${props.restPath}/${rootUuid}/control-implementation/implemented-requirements/${props.implementedRequirement.uuid}`;
  const statement = statementExists || {
    "statement-id": props.statementId,
    uuid: uuidv4(),
    "by-components": [],
  };
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
        values: setParameterValues,
      },
    ];
    editedField.push("set-parameters", `param-id[${paramId}]`, "values");
  } else {
    editedField.push("description");
  }

  const restData = partialRestData;
  if (!restData.statements) {
    restData.statements = [statement];
  } else if (!statementExists) {
    restData.statements.push(statement);
  }

  props.onFieldSave(
    false,
    restData,
    editedField,
    null,
    restMethods.PUT,
    restUrl
  );
}

/**
 * Conducts preparation for a REST request that will be sent to a backend service to update a
 * parameter placeholder value with an implementation and description. The request, if successful,
 * saves the changes to the appropriate file and updates the changes to the Viewer.
 *
 * @param props object passed to the parent component containing necessary data to create and update the component
 * @param descriptionReference reference to the text field input containing the new description for the control implementation
 * @param setParameterValues the set-parameter values for the control implementation statement
 */
export function onFieldSaveByComponentParameterValue(
  props,
  descriptionReference,
  setParameterValues
) {
  const partialRestData = deepClone(props.implementedRequirement);
  const byComponent = partialRestData.statements
    .find((element) => element["statement-id"] === props.statementId)
    ["by-components"].find(
      (element) => element["component-uuid"] === props.componentId
    );
  byComponent.description = descriptionReference.current.value;

  const rootOscalObjectName = Object.keys(props.partialRestData)[0];
  const rootUuid = props.partialRestData[rootOscalObjectName].uuid;
  const rootRestPath = `${props.restPath}/${rootUuid}`;
  const restUrl = `${rootRestPath}/control-implementation/implemented-requirements/${props.implementedRequirement.uuid}`;
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
    setParameter.values = setParameterValues;
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
    restUrl
  );
}

export default function OSCALControlPartEditor(props) {
  const classes = useStyles();
  const descriptionReference = useRef("Reference to control description");
  const setParameters =
    props.statementByComponent?.["set-parameters"]?.[0]?.values || [];
  let newSetParameters = setParameters;

  return (
    <Popover
      open={props.anchorEl}
      onClose={() => {
        props.setAnchorEl(null);
      }}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Grid container className={classes.ControlProseEditor} xs={12}>
        <Typography variant="h6">
          Implementation of Statement &apos;{props.statementId}&apos; for
          Control &apos;{props.controlId}&apos;
        </Typography>
        <Grid container xs={12}>
          {props.isUserDefinedImplementation ? (
            <>
              <Grid item xs={3}>
                <Typography>Parameter Values: </Typography>
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  data-testid="Popover Implementation Autocomplete"
                  defaultValue={setParameters}
                  freeSolo
                  fullWidth
                  multiple
                  onChange={(event, values) => {
                    newSetParameters = values;
                  }}
                  options={setParameters}
                  renderInput={(params) => (
                    <TextField {...params} label="Enter Parameter Values" />
                  )}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={3}>
            <Typography>Description: </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Enter Description"
              multiline
              inputProps={{
                "data-testid": "Popover Description TextField",
              }}
              inputRef={descriptionReference}
              defaultValue={props.statementByComponent?.description}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} justifyContent="flex-end">
          <OSCALEditableFieldActions
            inEditState
            editedFieldPath="statement-statement-id-by-components-component-uuid-description/values"
            onCancel={props.onCancel}
            onFieldSave={() => {
              props.onFieldSave(descriptionReference, newSetParameters);
            }}
            update={props.update}
          />
        </Grid>
      </Grid>
    </Popover>
  );
}
