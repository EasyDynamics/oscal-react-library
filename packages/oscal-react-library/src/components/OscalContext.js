import { useState, createContext } from "react";
import React from "react";

export const OscalContext = createContext();

export const OscalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState("(none)");
  const [currentPath, setCurrentPath] = useState("");
  const [addPath, setAddPath] = useState("(none)");
  const [addValue, setAddValue] = useState(null);
  const [schemaKeys, setSchemaKeys] = useState(null);
  const [editPath, setEditPath] = useState("(none)");
  const [editValue, setEditValue] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [lastPath, setLastPath] = useState("");
  const [currentFileJson, setCurrentFileJson] = useState("(empty)");
  const [currentValidation, setCurrentValidation] = useState([]);
  const [showValidation, setShowValidation] = useState(true);
  /*
  const [sarTabValue, setSarTabValue] = useState("Metadata");
  const [sarTabLoaded, setSarTabLoaded] = useState(false);
  const [sarTabPath, setSarTabPath] = useState("assessment-results/metadata");
  const [lastSarTabPath, setLastSarTabPath] = useState(null);
  const [sarTabContents, setSarTabContents] = useState(null);

  const [eiNewInitMode, setEiNewInitMode] = useState(false);
  const [eiUploadFile, setEiUploadFile] = useState(null);
  const [eiUploadStatus, setEiUploadStatus] = useState("Please upload a file");
  const [eiUploadErrors, setEiUploadErrors] = useState("(no errors)");
  const [eiUploadPhase, setEiUploadPhase] = useState("before_submit");

  const [eiScopes, setEiScopes] = useState(null);
  const [eiScopeFile, setEiScopeFile] = useState(null);
  const [eiScopeTitle, setEiScopeTitle] = useState(null);
  const [eiScopeMode, setEiScopeMode] = useState("main");

  const [eiAssessText, setEiAssessText] = useState("Loading...");
  const [eiControlIds, setEiControlIds] = useState(null);
  const [eiAssessPage, setEiAssessPage] = useState(0);
  const [eiResultsJson, setEiResultsJson] = useState(null);
  const [eiResourcesJson, setEiResourcesJson] = useState(null); */

  const eiMode = true;
  //const eiMode = false
  const overlays = {
    "assessment-results": true,
    "enterprise-initiative": true,
  };

  return (
    <OscalContext.Provider
      value={{
        files: { get: files, set: setFiles },
        currentFile: { get: currentFile, set: setCurrentFile },
        currentPath: { get: currentPath, set: setCurrentPath },
        addPath: { get: addPath, set: setAddPath },
        addValue: { get: addValue, set: setAddValue },
        schemaKeys: { get: schemaKeys, set: setSchemaKeys },
        editPath: { get: editPath, set: setEditPath },
        editValue: { get: editValue, set: setEditValue },
        editStatus: { get: editStatus, set: setEditStatus },
        lastPath: { get: lastPath, set: setLastPath },
        currentFileJson: { get: currentFileJson, set: setCurrentFileJson },
        currentValidation: { get: currentValidation, set: setCurrentValidation },
        showValidation: { get: showValidation, set: setShowValidation },
        eiMode,
        overlays,
      }}
    >
      {children}
    </OscalContext.Provider>
  );
};
