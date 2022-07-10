import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate, useParams } from "react-router-dom";

const OSCALDocumentForm = styled("form")(
  ({ theme }) => `
  margin-top: ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(2)};
`
);

export default function OSCALLoaderForm(props) {
  const [oscalObjects, setOscalObjects] = useState([]);
  const [selectedUuid, setSelectedUuid] = useState("");
  const requestedId = useParams()?.id;
  const unmounted = useRef(false);
  const navigate = useNavigate();

  const findAllObjects = () => {
    fetch(`${props.backendUrl}/${props.oscalObjectType.restPath}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(
        (result) => {
          if (!unmounted.current) {
            setOscalObjects(result);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (e) => {
          props.onError(e);
        }
      );
  };

  useEffect(() => {
    if (props.isRestMode) findAllObjects();
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    setSelectedUuid(
      oscalObjects
        .map((item) => item[props.oscalObjectType.jsonRootName].uuid)
        .find((uuid) => uuid === requestedId) ?? ""
    );
  }, [oscalObjects, requestedId]);

  const url = useRef(null);
  const submitForm = () => {
    props.onUrlChange(url.current.value);
    props.onReloadClick();
  };

  return (
    <OSCALDocumentForm
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        submitForm();
        e.preventDefault();
      }}
    >
      <Grid container spacing={3}>
        {!props.isRestMode ? (
          <>
            <Grid item xs={6} md={9}>
              <TextField
                id="oscal-url"
                label={`OSCAL ${props.oscalObjectType.name} URL`}
                defaultValue={props.oscalUrl}
                helperText="(JSON Format)"
                variant="outlined"
                fullWidth
                inputRef={url}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                endIcon={<ReplayIcon>send</ReplayIcon>}
                disabled={!props.isResolutionComplete}
                type="submit"
              >
                Reload
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={10} md={11}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="oscal-object-select-label">
                Select OSCAL {props.oscalObjectType.name}
              </InputLabel>
              <Select
                labelId="oscal-object-select-label"
                id="oscal-object-simple-select"
                label={`Select OSCAL ${props.oscalObjectType.name}`}
                value={selectedUuid}
                onChange={(event) => {
                  setSelectedUuid(event.target.value);
                  props.onUuidChange(event.target.value);
                  navigate(
                    `/${props.oscalObjectType.jsonRootName}/${event.target.value}`,
                    { replace: true }
                  );
                }}
              >
                {oscalObjects?.map((oscalObject) => (
                  <MenuItem
                    value={oscalObject[props.oscalObjectType.jsonRootName].uuid}
                    key={oscalObject[props.oscalObjectType.jsonRootName].uuid}
                  >
                    {
                      oscalObject[props.oscalObjectType.jsonRootName].metadata
                        .title
                    }
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {props.backendUrl && (
          <Grid item xs={2} md={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.isRestMode}
                  color="primary"
                  onChange={props.onChangeRestMode}
                  name="isRestMode"
                />
              }
              label="REST Mode"
            />
          </Grid>
        )}
      </Grid>
    </OSCALDocumentForm>
  );
}
