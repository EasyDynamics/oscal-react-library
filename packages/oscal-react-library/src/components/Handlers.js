import { useContext } from "react";

import { OscalContext } from "./OscalContext";
import { useFetchers } from "./Fetchers";

export function useHandlers() {
  let context = useContext(OscalContext);
  const currentFile = context["currentFile"]["get"];
  const setCurrentFile = context["currentFile"]["set"];
  const currentPath = context["currentPath"]["get"];
  const setCurrentPath = context["currentPath"]["set"];
  const setAddPath = context["addPath"]["set"];
  const setAddValue = context["addValue"]["set"];
  const setSchemaKeys = context["schemaKeys"]["set"];
  const setEditPath = context["editPath"]["set"];
  const editValue = context["editValue"]["get"];
  const setEditValue = context["editValue"]["set"];
  const setEditStatus = context["editStatus"]["set"];
  const setLastPath = context["lastPath"]["set"];
  const setCurrentFileJson = context["currentFileJson"]["set"];
  const setCurrentValidation = context["currentValidation"]["set"];

  let fetchers = useFetchers();
  const fetchFileJson = fetchers["fetchFileJson"];
  const fetchSaveJson = fetchers["fetchSaveJson"];
  const fetchAddSubtree = fetchers["fetchAddSubtree"];
  const fetchDeleteSubtree = fetchers["fetchDeleteSubtree"];
  const fetchGetSchemaKeys = fetchers["fetchGetSchemaKeys"];
  const fetchValidation = fetchers["fetchValidation"];

  //////////////////////////////////////////////////////////////////////////
  // State update helpers

  const updateCurrentFile = (file, path) => {
    setCurrentFile(file);
    setLastPath(currentPath);
    setCurrentPath(path);
    if (file === "(none)") {
      setCurrentFileJson("(empty)");
      setCurrentValidation([]);
    } else {
      fetchFileJson(file, path);
      fetchValidationWrapper(file);
    }
  };

  function fetchValidationWrapper(file) {
    fetchValidation(file, setCurrentValidation, (e) => setCurrentValidation([]));
  }

  const updateEditState = (path, value, message) => {
    setEditPath(path);
    setEditValue(value);
    setEditStatus(message);
  };

    const cancelEdit = () => {
        updateEditState("(none)", null, "")
    }

    const cancelAdd = () => {
        setAddPath("(none)")
        setAddValue(null)
        setSchemaKeys(null)
    }

    //////////////////////////////////////////////////////////////////////////
    // Event handler functions 

    const handleEditSwitchChange = (event) => {
        setEditValue(event.target.checked)
    }

    const handleEditChange = (event) => {
        setEditValue(event.target.value)
    }

    const handleSave = (curPath, curType) => {
        if (editValue === null) {
            // If they didn't change the value, just cancel.
            cancelEdit()
            return
        }

        let newJson = editValue
        if (curType === "number") {
            newJson = +newJson // convert to number
            if (Number.isNaN(newJson)) {
                setEditStatus("Error: Invalid number.")
                return
            } 
        }


        fetchSaveJson(currentFile, curPath, newJson) // note: this is the path being edited.
        setEditStatus("Saving...")
        setTimeout(() => { 
            fetchFileJson(currentFile, currentPath); // note: this is the top level path currently displayed.
            fetchValidationWrapper(currentFile);
            cancelEdit();
        }, 1000)
    }

    const handleAddClick = (curPath, curType) => {
        if (curType === "object") {
            setAddPath(curPath)
            fetchGetSchemaKeys(currentFile, curPath)
        } else {
            // For arrays, don't bother and just add it to the end
            handleAdd(curPath + "/end")
        }
    }

    const handleAdd = (newPath) => {
        fetchAddSubtree(currentFile, newPath, data => fetchAddSubtreeSuccess(data, newPath), e => fetchAddSubtreeFail(e, newPath))
        setCurrentFileJson("Generating New OSCAL subpath "+newPath)
        cancelAdd()
    }

    function fetchAddSubtreeSuccess(data, newPath) {
        updateCurrentFile(currentFile, newPath.split("/").slice(0, -1).join("/"))
    }

    function fetchAddSubtreeFail(e, newPath) {
        const error_message = "Add Subtree operation failed for path " + newPath
        console.log(error_message)
        setCurrentFileJson(error_message)
    }

    const handleDelete = (curPath) => {
        fetchDeleteSubtree(currentFile, curPath, handleDeleteSuccess, null)

        setCurrentFileJson("Deleting...")

        // Set the new path as the parent of the node being deleted.
        let newPath = curPath.split("/").slice(0, -1).join("/")

        setTimeout(() => { 
            updateCurrentFile(currentFile, newPath)
        }, 1000)
    }

    function handleDeleteSuccess(response) {
        console.log("Called /delete_subtree successfully.")
    }

    const handleAddChange = (event) => {
        setAddValue(event.target.value)
    }

    let output = { 
        updateCurrentFile,
        updateEditState,
        cancelEdit,
        cancelAdd,
        handleEditSwitchChange,
        handleEditChange,
        handleSave,
        handleAddClick,
        handleAdd,
        handleDelete,
        handleAddChange
    }


    return output

}
