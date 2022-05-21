import React, { useRef } from "react";
import Button from "@mui/material/Button";
import Editor from "@monaco-editor/react";
import { Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function OSCALJsonEditor(props) {
  const useStyles = makeStyles((theme) => ({
    grid: {
      paddingRight: theme.spacing(1),
      top: theme.spacing(1),
      position: "sticky",
      overflow: "hidden",
    },
    buttonGrid: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    editor: {
      width: "100%",
    },
  }));
  const classes = useStyles();
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
    <Grid
      container
      className={classes.grid}
      direction="column"
      data-testid="container"
    >
      <Grid item>
        <Typography variant="h6">JSON Editor</Typography>
      </Grid>
      <Grid className={classes.editor} item>
        <Editor
          height="85vh"
          options={editorOptions}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          value={props.value}
          defaultLanguage="json"
        />
      </Grid>
      <Grid item>
        <Grid
          className={classes.buttonGrid}
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
              color="secondary"
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
        </Grid>
      </Grid>
    </Grid>
  );
}
