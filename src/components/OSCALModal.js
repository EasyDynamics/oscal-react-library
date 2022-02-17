import React, { useRef } from "react";
import { Grid, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";

const useStyles = makeStyles((theme) => ({
  OSCALModal: {
    marginBottom: theme.spacing(2),
  },

  OSCALModalTitle: {
    marginBottom: theme.spacing(2),
  },
}));

export default function OSCALModal(props) {
  const classes = useStyles();
  const textFieldReference = useRef("Modal Text Field");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "50%",
    maxHeight: 250,
    maxWidth: 750,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
  };

  return (
    <Modal open={props.open}>
      <Box sx={style}>
        <Grid
          className={classes.OSCALModal}
          container
          alignItems="flex-start"
          justifyContent="flex-end"
        >
          <OSCALEditableFieldActions
            inEditState
            editedField={props.editedField}
            onCancel={props.onCancel}
            onFieldSave={props.onFieldSave}
            patchData={props.patchData}
            reference={textFieldReference}
            update={props.update}
          />
        </Grid>
        <Grid
          className={classes.OSCALModalTitle}
          container
          justifyContent="center"
        >
          <Typography variant={props.typographyVariant || "h5"}>
            {props.title}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={8}>
            <Typography>
              <TextField
                fullWidth
                inputRef={textFieldReference}
                size={props.textFieldSize || "medium"}
                defaultValue={props.description}
                variant={props.textFieldVariant || "outlined"}
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
