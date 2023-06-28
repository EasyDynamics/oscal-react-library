import { useContext } from "react";

import { OscalContext } from "./OscalContext";

//////////////////////////////////////////////////////////////////////////
// API helper functions

export function useFetchers() {
  let context = useContext(OscalContext);
  const setFiles = context["files"]["set"];
  const setSchemaKeys = context["schemaKeys"]["set"];
  const setEditStatus = context["editStatus"]["set"];
  const setCurrentFileJson = context["currentFileJson"]["set"];
  const setCurrentValidation = context["currentValidation"]["set"];

  const fetch_depth = 3;

  const fetchListFiles = () => {
    fetch("/list_files")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setFiles(data);
        setCurrentFileJson("(empty)");
      });
  };

  const fetchFileJson = (file, path) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oscal_file: file, path: path, depth: fetch_depth }),
    };
    fetch("/get_subtree", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(
        (data) => {
          setCurrentFileJson(data);
        },
        (e) => {
          console.log(e.toString());
          setCurrentFileJson("failed: " + e.toString());
        }
      );
  };

  const fetchSubtree = (file, path, depth, success, fail) => {
    const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path, depth: depth })
        }
        fetch("/get_subtree", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log(e.toString());
            if (fail)
                fail(e)
        })
    }

    const fetchSetSubtree = (file, path, new_value, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path, new_value: new_value })
        }
        fetch("/set_subtree", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/set_subtree call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }
        

    const fetchSaveJson = (file, path, new_value) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path, new_value: new_value })
        }
        fetch("/set_subtree", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            console.log("Called /set_subtree successfully.")
        }, e => {
            console.log(e.toString());
            setEditStatus("Error: Save failed on server.")
        })
    }

    const fetchAddSubtree = (file, path, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path })
        }
        fetch("/add_subtree", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            setEditStatus("Error: /add_subtree failed on server with error " + e.toString())
            if (fail)
                fail(e)
        })
    }

    const fetchDeleteSubtree = (file, path, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path })
        }
        fetch("/delete_subtree", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            setEditStatus("Error: /delete_subtree failed with exception: "+e.toString())
            if (fail)
                fail(e)
        })
    }

    const fetchGetSchemaKeys = (file, path) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, path: path })
        }
        fetch("/get_schema_keys", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            console.log("Called /get_schema_keys successfully.")
            setSchemaKeys(data);
        }, e => {
            console.log(e.toString());
            setEditStatus("Error: /get_schema_keys failed on server.")
        })
    }

    const fetchValidation = (file_name, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file_name })
        }
        fetch("/validate", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/validate call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    const fetchLookup = (file, type, key, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, type: type, key: key })
        }
        fetch("/lookup", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/lookup call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    const fetchLookupAll = (file, type, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, type: type })
        }
        fetch("/lookup_all", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/lookup_all call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    const fetchUploadFile = (file, success, fail) => {
        var formData = new FormData()
        formData.append("file", file)

        const requestOptions = {
            method: "POST",
            body: formData
        }
        fetch("/upload_file", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/upload_file call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    function fetchCreateDirectory(directory, success, fail) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ directory: directory })
        }
        fetch("/create_directory", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/create_directory call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    function fetchCopyFile(old_file, new_file, success, fail) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ old_file: old_file, new_file: new_file })
        }
        fetch("/copy_file", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/copy_file call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    function fetchCreateOscalFile(oscal_file, file_type, success, fail) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: oscal_file, file_type: file_type })
        }
        fetch("/create_oscal_file", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/create_oscal_file call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    function fetchDeleteFile(file, success, fail) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file })
        }
        fetch("/delete_file", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/delete_file call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    function fetchDeleteDirectory(directory, success, fail) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ directory: directory })
        }
        fetch("/delete_directory", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/delete_directory call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // OSCAL Transaction API

    const fetchDeleteRisk = (file, finding_uuid, risk_uuid, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify({ oscal_file: file, finding_uuid: finding_uuid, risk_uuid: risk_uuid })
        }
        fetch("/delete_risk", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log("/delete_risk call failed with exception: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    const fetchTransaction = (operation, request, success, fail) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json" }, 
            body: JSON.stringify(request)
        }
        var slash = "/"
        if (operation.startsWith("/")) {
            slash = ""
        }
        fetch("/transaction"+slash+operation, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
        .then(data => {
            if (success)
                success(data)
        }, e => {
            console.log(operation+" call failed with error: "+e.toString());
            if (fail)
                fail(e)
        })
    }

    const output = {
        fetchListFiles,
        fetchFileJson,
        fetchSubtree,
        fetchSetSubtree,
        fetchSaveJson,
        fetchAddSubtree,
        fetchDeleteSubtree,
        fetchGetSchemaKeys,
        fetchValidation,
        fetchLookup, 
        fetchLookupAll, 
        fetchUploadFile, 
        fetchCreateDirectory,
        fetchCopyFile,
        fetchCreateOscalFile,
        fetchDeleteFile,
        fetchDeleteDirectory,

        fetchDeleteRisk,
        fetchTransaction,
    }

    return output

}
