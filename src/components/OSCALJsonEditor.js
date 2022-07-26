import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Editor from "@monaco-editor/react";
import { Grid, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const BaseEditorGrid = styled(Grid)(
  ({ theme }) => `
  padding-right: ${theme.spacing(1)};
  top: ${theme.spacing(1)};
  position: sticky;
  overflow: hidden
`
);

const ButtonGrid = styled(Grid)(
  ({ theme }) => `
  margin-top: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(1)};
`
);

export default function OSCALJsonEditor(props) {
  const editorRef = useRef(props.editorRef);

  const editorOptions = {
    minimap: {
      enabled: false,
    },
    scrollbar: {
      verticalHasArrows: true,
    },
    tabSize: 2,
  };

  return (
    <BaseEditorGrid container direction="column" data-testid="container">
      <Grid item>
        <Typography variant="h6">JSON Editor</Typography>
      </Grid>
      <Grid sx={{ width: "100%" }} item>
        <Editor
          height="83vh"
          options={editorOptions}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          value={props.value}
          defaultLanguage="json"
        />
      </Grid>
      <Grid item>
        <ButtonGrid
          container
          spacing={2}
          justifyContent="flex-end"
          data-testid="button-grid"
        >
          <Grid item>
            <Button
              onClick={() => {
                editorRef.current.setValue(props.value);
              }}
              startIcon={<CancelIcon data-testid="cancel-icon" />}
              variant="contained"
              color="error"
              data-testid="cancel-button"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                props.onSave(editorRef.current.getValue());
              }}
              startIcon={<SaveIcon data-testid="save-icon" />}
              variant="contained"
              color="primary"
              data-testid="save-button"
            >
              Save
            </Button>
          </Grid>
        </ButtonGrid>
      </Grid>
    </BaseEditorGrid>
  );
}
