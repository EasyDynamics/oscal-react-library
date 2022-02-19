import React, { useRef } from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Editor from "@monaco-editor/react";
import { Grid, makeStyles, Typography } from "@material-ui/core";


export default function OSCALJsonEditor(props) {

    const useStyles = makeStyles({
        grid: {
            paddingRight: "16px",
            position: "sticky",
            top: "16px",
            overflow: "hidden"
        },
        editor: {
            marginTop: "8px",
            marginBottom: "8px",
            width: "100%"
        },
        chrome: {
        }
    });
    const classes = useStyles();

    const editorRef = useRef(null);
    const [value, setValue] = React.useState(JSON.stringify(props.value, null, "\t"));

    const editorOptions = {
        minimap: {
            enabled: false
        },
        scrollbar: {
            verticalHasArrows: true
        },
        tabSize: 2
    };


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function onClick() {
        setValue(editorRef.current.getValue());
    }

    return (
        <Grid container className={classes.grid} direction="column">
            <Grid item>
                <Typography className={classes.chrome} variant="h6">JSON Editor</Typography>
            </Grid>
            <Grid className={classes.editor} item>
                <Editor
                    height="85vh"
                    options={editorOptions}
                    onMount={handleEditorDidMount}
                    value={value}
                    defaultLanguage="json" />
            </Grid>
            <Grid item>
                <Button className={classes.chrome} onClick={onClick} variant="contained" color="primary">Save</Button>
            </Grid>
        </Grid>
    );
}