import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import FileUploadIcon from "@mui/icons-material/FileUpload";

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

  const onUpload = (event) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    url.current.value = fileUrl;
    props.onUrlChange(fileUrl);
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
            <Grid item xs={12} md={12}>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="oscal-url"
                  label={`OSCAL ${props.oscalObjectType.name} URL`}
                  defaultValue={props.oscalUrl}
                  helperText="(JSON Format)"
                  variant="outlined"
                  fullWidth
                  inputRef={url}
                />
                <Stack direction="row" spacing={1} sx={{ height: "3.5rem" }}>
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
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    endIcon={<FileUploadIcon />}
                    component="label"
                    disabled={!props.isResolutionComplete}
                  >
                    Upload
                    <input type="file" hidden accept="application/json" onChange={onUpload} />
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </OSCALDocumentForm>
  );
}
