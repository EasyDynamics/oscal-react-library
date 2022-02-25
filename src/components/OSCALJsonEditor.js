import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import Editor from "@monaco-editor/react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

export default function OSCALJsonEditor(props) {
  const useStyles = makeStyles({
    grid: {
      paddingRight: "16px",
      position: "sticky",
      top: "16px",
      overflow: "hidden",
    },
    editor: {
      marginTop: "8px",
      marginBottom: "8px",
      width: "100%",
    },
  });
  const classes = useStyles();
  const editorRef = useRef(null);

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
    <Grid container className={classes.grid} direction="column">
      <Grid item>
        <Typography className={classes.chrome} variant="h6">
          JSON Editor
        </Typography>
      </Grid>
      <Grid className={classes.editor} item>
        <Editor
          height="85vh"
          options={editorOptions}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          value={JSON.stringify(props.value, null, "\t")}
          defaultLanguage="json"
        />
      </Grid>
      <Grid item>
        <Button
          className={classes.chrome}
          onClick={() => {
            props.onSave(editorRef.current.getValue());
          }}
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
        <Button
          className={classes.chrome}
          onClick={() => {
            editorRef.current.setValue(JSON.stringify(props.value, null, "\t"));
          }}
          variant="contained"
          color="secondary"
        >
          Discard
        </Button>
      </Grid>
    </Grid>
  );
}
