import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

function updateData(data, editedField, newValue) {
  if (editedField.length === 1) {
    const editData = data;
    editData[editedField] = newValue;
    return;
  }

  updateData(data[editedField.shift()], editedField, newValue);
}

/**
 *
 * @param data data that will be passed into the body of the PATCH request, doesn't initially contain the updates
 * @param update function that will update a state, forcing a re-rendering if the PATCH request is successful
 * @param editedField path to the field that is being updated
 * @param newValue updated value for the edited field
 */
function onSaveComplete(data, update, editedField, newValue) {
  const portString =
    window.location.port === "" ? "" : `:${window.location.port}`;
  const url = `http://localhost${portString}/oscal/v1/ssps/${data["system-security-plan"].uuid}`;

  const dataToSave = JSON.parse(JSON.stringify(data));
  updateData(dataToSave, editedField, newValue);

  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(dataToSave),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        update(result);
      },
      () => {
        alert(
          `Could not update the ${editedField} field with value: ${newValue}.`
        );
      }
    );
}

export default function OSCALSsp(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [ssp, setSsp] = useState(props["system-security-plan"]);
  const unmounted = useRef(false);

  const patchData = {
    "system-security-plan": {
      uuid: ssp.uuid,
    },
  };

  let sspParties;
  if (ssp.metadata) {
    sspParties = ssp.metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      ssp,
      props.parentUrl,
      (profilesCatalogsTree) => {
        if (!unmounted.current) {
          setIsLoaded(true);
          setInheritedProfilesAndCatalogs(profilesCatalogsTree);
          props.onResolutionComplete();
        }
      },
      () => {
        if (!unmounted.current) {
          setError(error);
          setIsLoaded(true);
          props.onResolutionComplete();
        }
      }
    );

    return () => {
      unmounted.current = true;
    };
  }, []);

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = (
      <OSCALControlImplementation
        controlImplementation={ssp["control-implementation"]}
        components={ssp["system-implementation"].components}
        controls={ssp.resolvedControls}
        modifications={ssp.modifications}
      />
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata
        metadata={ssp.metadata}
        isEditable
        editedField={["system-security-plan", "metadata"]}
        onSaveComplete={onSaveComplete}
        patchData={patchData}
        update={setSsp}
      />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      <OSCALSystemCharacteristics
        systemCharacteristics={ssp["system-characteristics"]}
      />
      <OSCALSystemImplementation
        systemImplementation={ssp["system-implementation"]}
        parties={sspParties}
      />
      {controlImpl}
      <OSCALBackMatter
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
