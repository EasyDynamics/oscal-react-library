import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import OSCALEditableFieldActions, {
  getElementLabel,
  updateListItem,
} from "./OSCALEditableFieldActions";
import { OSCALMarkupLine } from "./OSCALMarkupProse";
import { TypographyVariant } from "@mui/material";

function textFieldWithEditableActions(
  props: any,
  reference: React.MutableRefObject<string>,
  inEditState: boolean,
  setInEditState: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (inEditState) {
    return (
      <>
        <Grid item xs={props.size} className={props.className}>
          <TextField
            label={props.fieldName}
            fullWidth
            inputProps={{
              "data-testid": `textField-${getElementLabel(props.editedField)}`,
            }}
            inputRef={reference}
            size={props.textFieldSize}
            defaultValue={props.value}
            variant={props.textFieldVariant}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setInEditState(false);
              } else if (event.key === "Enter") {
                event.preventDefault();
                props.onFieldSave(
                  props.appendToLastFieldInPath,
                  props.partialRestData,
                  props.editedField,
                  props.editedValueId
                    ? updateListItem(
                        props.editedValue,
                        props.editedValueId,
                        props.fieldName,
                        reference.current
                      )
                    : reference.current
                );
                setInEditState(false);
              }
            }}
          />
        </Grid>
        <Grid item>
          <OSCALEditableFieldActions
            appendToLastFieldInPath={props.appendToLastFieldInPath}
            inEditState={inEditState}
            editedField={props.editedField}
            editedValue={props.editedValue}
            editedValueId={props.editedValueId}
            fieldName={props.fieldName}
            setInEditState={setInEditState}
            onCancel={props.onCancel}
            onFieldSave={props.onFieldSave}
            partialRestData={props.partialRestData}
            reference={reference}
          />
        </Grid>
      </>
    );
  }

  return (
    <>
      <Typography display="inline" variant={props.typographyVariant}>
        <OSCALMarkupLine>{props.value}</OSCALMarkupLine>
      </Typography>
      <OSCALEditableFieldActions
        editedField={props.editedField}
        inEditState={inEditState}
        partialRestData={props.partialRestData}
        setInEditState={setInEditState}
      />
    </>
  );
}

export interface EditableFieldProps {
  /**
   * True if in editor mode
   */
  isEditable: boolean;
  /**
   * Currently this is the handleFieldSave() function passed down from the OSCALLoader.
   * All of the funcionality of editing require this function.
   */
  onFieldSave?: (...args: any[]) => void;
  /**
   * A partial representation of the json object you are patching.
   */
  partialRestData?: any;
}

interface EditableTextFieldProps extends EditableFieldProps {
  /**
   * Name of the field currently being edited
   */
  fieldName: string;
  /**
   * Whether the field is editable.
   */
  canEdit: boolean;
  /**
   * Path of each parent of field.
   *
   * @example: ["catalog", "back-matter", "resources"]
   * to edit a backmatter resource.
   */
  editedField: string[] | null;
  /**
   * The value of the object being changed via the REST api call.
   *
   * @example: backmatter.resources
   */
  editedValue?: any;
  /**
   * The id (usually a uuid) of the edited value
   *
   * @example resource.uuid
   */
  editedValueId?: string;
  /**
   * The value of the field that is being changed.
   *
   * @example resource.title
   */
  value?: string;
  /**
   * Grid item xs size
   */
  size?: number;
  /**
   * Size prop of underling TextField
   */
  textFieldSize?: string;
  /**
   * The variant of the non editable Typography
   */
  typographyVariant?: TypographyVariant;
}

export default function OSCALEditableTextField(props: EditableTextFieldProps) {
  const reference = useRef("reference to text field");
  const [inEditState, setInEditState] = useState(false);

  return props.canEdit ? (
    textFieldWithEditableActions(props, reference, inEditState, setInEditState)
  ) : (
    <Grid item>
      <Typography variant={props.typographyVariant}>{props.value}</Typography>
    </Grid>
  );
}

OSCALEditableTextField.defaultProps = {
  textFieldVariant: "outlined",
};
