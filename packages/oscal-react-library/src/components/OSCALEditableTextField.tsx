import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Grid, TextField, TextFieldProps } from "@mui/material";
import OSCALEditableFieldActions, {
  getElementLabel,
  updateListItem,
} from "./OSCALEditableFieldActions";
import { OSCALMarkupLine } from "./OSCALMarkupProse";
import { TypographyVariant } from "@mui/material";

interface TextFieldWithEditableActionsProps extends EditableTextFieldProps {
  reference: React.MutableRefObject<TextFieldProps>;
  inEditState: boolean;
  setInEditState: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextFieldWithEditableActions: React.FC<TextFieldWithEditableActionsProps> = (props) => {
  const { reference, inEditState, setInEditState } = props;

  if (inEditState) {
    if (!props.onFieldSave) {
      throw new Error("onFieldSave is not defined");
    }

    return (
      <>
        <Grid item xs={props.size}>
          <TextField
            label={props.fieldName}
            fullWidth
            inputProps={{
              "data-testid": `textField-${getElementLabel(props.editedField)}`,
            }}
            inputRef={reference}
            size={props.textFieldSize}
            defaultValue={props.value}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setInEditState(false);
              } else if (event.key === "Enter") {
                event.preventDefault();
                props.onFieldSave!(
                  false,
                  props.partialRestData,
                  props.editedField!,
                  props.editedValueId
                    ? updateListItem(
                        props.editedValue,
                        props.editedValueId,
                        props.fieldName,
                        reference.current.value as any as string
                      )
                    : (reference.current.value as any)
                );
                setInEditState(false);
              }
            }}
          />
        </Grid>
        <Grid item>
          <OSCALEditableFieldActions
            inEditState={inEditState}
            editedField={props.editedField}
            editedValue={props.editedValue}
            editedValueId={props.editedValueId}
            fieldName={props.fieldName}
            setInEditState={setInEditState}
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
};

export type OnFieldSaveHandler = (
  appendToLastFieldInPath: boolean,
  partialRestData: Record<string, any>,
  editedFieldJsonPath: string[],
  newValue: string | object,
  restUrlPath?: string
) => void;

export interface EditableFieldProps {
  /**
   * True if in editor mode
   */
  isEditable?: boolean;
  /**
   * Currently this is the handleFieldSave() function passed down from the OSCALLoader.
   * All of the funcionality of editing require this function.
   */
  onFieldSave?: OnFieldSaveHandler;
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
  textFieldSize?: "small" | "medium" | undefined;
  /**
   * The variant of the non editable Typography
   */
  typographyVariant?: TypographyVariant;
}

export default function OSCALEditableTextField(props: EditableTextFieldProps) {
  const reference = useRef({ value: props.value });
  const [inEditState, setInEditState] = useState(false);

  return props.isEditable ? (
    <TextFieldWithEditableActions
      {...props}
      reference={reference}
      inEditState={inEditState}
      setInEditState={setInEditState}
    />
  ) : (
    <Typography variant={props.typographyVariant}>{props.value}</Typography>
  );
}

OSCALEditableTextField.defaultProps = {
  textFieldVariant: "outlined",
};
