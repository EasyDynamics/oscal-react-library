import React from "react";
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
  return (
    <OSCALDocumentForm
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
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
                onChange={props.onUrlChange}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                endIcon={<ReplayIcon>send</ReplayIcon>}
                onClick={props.onReloadClick}
                disabled={!props.isResolutionComplete}
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
