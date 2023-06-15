import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { OscalObjectType } from "./oscal-utils/OSCALObjectData";

const OSCALDocumentForm = styled("form")(
  ({ theme }) => `
  margin-top: ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(2)};
`
);

export interface OSCALLoaderFormProps {
  onUrlChange(s: string): void;
  oscalUrl: string;
  oscalObjectType: OscalObjectType;
  isResolutionComplete: boolean;
}

export default function OSCALLoaderForm(props: OSCALLoaderFormProps) {
  const url = useRef({ value: props.oscalUrl });

  const submitForm = () => {
    props.onUrlChange(url.current.value);
  };

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
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
          <Stack direction="row" spacing={1}>
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
        </Grid>
      </Grid>
    </OSCALDocumentForm>
  );
}
