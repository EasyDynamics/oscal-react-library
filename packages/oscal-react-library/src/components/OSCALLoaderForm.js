import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";

const OSCALDocumentForm = styled("form")(
  ({ theme }) => `
  margin-top: ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(2)};
`
);

export default function OSCALLoaderForm(props) {
  const url = useRef(props.oscalUrl);

  const submitForm = () => {
    props.onUrlChange(url.current.value);
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
        {!props.isRestMode && (
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
        )}
      </Grid>
    </OSCALDocumentForm>
  );
}
