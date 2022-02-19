import React, { useRef } from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Editor from "@monaco-editor/react";


export default function OSCALJsonEditor(props) {

    const editorRef = useRef(null);
    const [controlJson, setControlJson] = React.useState(JSON.stringify(props.value));

    const editorOptions = {
        extraEditorClassName: "editor",
        minimap: {
            enabled: false
        },
        scrollbar: {
            verticalHasArrows: true
        }
    };


    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    function onSave() {
        setControlJson(editorRef.current.getValue());
    }

    return (
        <div>
            <Editor
                height="100vh"
                options={editorOptions}
                onMount={handleEditorDidMount}
                value={controlJson}
                defaultLanguage="json"
            />
            <Button onClick={onSave} variant="contained" color="primary">Save</Button>
        </div>
    );
}