import { Box, Card, FormControlLabel, Grid, RadioGroup, Typography } from "@mui/material";
import React from "react";
import {
  OSCALPrimaryDestructiveButton,
  OSCALPrimaryButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
} from "./OSCALButtons";
import {
  OSCALCancelButton,
  OSCALCheckbox,
  OSCALConfirmButton,
  OSCALDropdown,
  OSCALRadio,
  OSCALTextField,
} from "./OSCALInputs";
import { OSCALDialogTitle } from "./OSCALDialog";
import { useState } from "react";

export default function OSCALStyle() {
  const [selectedExampleRadio, setSelectedExampleRadio] = useState(null);

  function handleExampleRadioRadioChange(event) {
    setSelectedExampleRadio(event.target.value);
  }

  function renderStyleGuide() {
    return (
      <Card
        sx={{
          marginLeft: "10rem",
          marginRight: "10rem",
          marginTop: "2.5rem",
          marginBottom: "2.5rem",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src="https://www.easydynamics.com/wp-content/uploads/2022/05/EDC_400px.svg"
          width="15rem"
          paddingTop="2.5rem"
        />
        <Typography variant="h3">OSCAL Style Guide</Typography>
        <OSCALDialogTitle subtitle="This displays the implementation of the style guide." />
        <Grid
          container
          spacing={2}
          justifyContent="left"
          textAlign={"left"}
          sx={{ padding: "2.5rem" }}
        >
          <Grid item xs={12}>
            <Typography variant="h2">Color Palette</Typography>

            <br />

            <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
              Primary Colors
            </Typography>
            <Grid container spacing={2} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.primary.main,
                  }}
                />
                <Typography>Primary (#002867)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  }}
                />
                <Typography>Secondary (#023E88)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.backgroundGray.main,
                  }}
                />
                <Typography>Background Gray (#F6F6F6)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.primaryAccent.main,
                  }}
                />
                <Typography>Primary Accent (#FF6600)</Typography>
              </Grid>
            </Grid>

            <br />

            <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
              Secondary Colors
            </Typography>
            <Grid container spacing={2} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.lightBlue.main,
                  }}
                />
                <Typography>Light Blue (#E2ECFA)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.lightGrayBlue.main,
                  }}
                />
                <Typography>Light Gray Blue (#E8EBF1)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.offWhite.main,
                  }}
                />
                <Typography>Off-white (#F3F5F8)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.white.main,
                  }}
                />
                <Typography>White (#FFFFFF)</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.black.main,
                  }}
                />
                <Typography>Black (#2B2B2B)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.gray.main,
                  }}
                />
                <Typography>Gray (#EAEAEA)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.destructive.main,
                  }}
                />
                <Typography>Destructive (#B31515)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.lightPink.main,
                  }}
                />
                <Typography>Light Pink (#FFD9D9)</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.lightGreen.main,
                  }}
                />
                <Typography>Light Green (#DBF4E7)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.grayBlue.main,
                  }}
                />
                <Typography>Gray Blue (#B4BCCC)</Typography>
              </Grid>
              <Grid item md={3}>
                <Box
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: (theme) => theme.palette.darkGray.main,
                  }}
                />
                <Typography>Dark Gray (#6A6A6A)</Typography>
              </Grid>
            </Grid>

            <br />
            <br />

            <Typography variant="h2">Typography</Typography>
            <Grid container spacing={1} sx={{ margin: "1rem" }} textAlign={"center"}>
              <Grid item md={12}>
                <Typography variant="h1">Example Text (h1)</Typography>
              </Grid>
              <Grid item md={12}>
                <Typography variant="h2">Example Text (h2)</Typography>
              </Grid>
              <Grid item md={12}>
                <Typography>Example Text (body)</Typography>
              </Grid>

              <br />
              <br />

              <Grid item md={12}>
                <Typography>
                  <a href="https://www.easydynamics.com/">Example Link</a>
                </Typography>
              </Grid>

              <br />
              <br />

              <Grid item md={12}>
                <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightRegular }}>
                  Source Sans Pro Regular
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightMedium }}>
                  Source Sans Pro Semi-Bold
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
                  Source Sans Pro Bold
                </Typography>
              </Grid>
            </Grid>

            <br />
            <br />

            <Typography variant="h2">Buttons</Typography>
            <Grid container spacing={5} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <OSCALPrimaryButton>Primary Button</OSCALPrimaryButton>
              </Grid>
              <Grid item md={3}>
                <OSCALSecondaryButton>Secondary Button</OSCALSecondaryButton>
              </Grid>
              <Grid item md={3}>
                <OSCALTertiaryButton>Tertiary Button</OSCALTertiaryButton>
              </Grid>
              <Grid item md={3}>
                <OSCALPrimaryDestructiveButton>Primary Destructive Button</OSCALPrimaryDestructiveButton>
              </Grid>
            </Grid>

            <br />
            <br />

            <Typography variant="h2">Inputs</Typography>
            <Grid container spacing={2} sx={{ margin: "0.5rem" }}>
              <Grid item md={3}>
                <OSCALTextField label={"Required Text Field"} required={true} />
              </Grid>
              <Grid item md={3}>
                <OSCALTextField label={"Optional Text Field"} />
              </Grid>
              <Grid item md={3}>
                <OSCALTextField label={"Disabled Text Field"} disabled={true} />
              </Grid>
              <Grid item md={3}>
                <OSCALDropdown label={"Dropdown"} required={true} />
              </Grid>
              <Grid item md={3}>
                <OSCALTextField
                  placeholder={"Placeholder Text"}
                  label={"Text Field w/ Placeholder Text"}
                  required={true}
                />
              </Grid>
              <Grid item md={3}>
                <OSCALTextField
                  label={"Text Field w/ Helper Subtext"}
                  helper={"(xxx) xxx-xxx"}
                  required={true}
                />
              </Grid>
              <Grid item md={6}>
                <OSCALTextField label={"Text Field w/ Error Message"} required={true} error />
              </Grid>
              <Grid item md={3}>
                <FormControlLabel control={<OSCALCheckbox />} label={"Value 1"} />
                <br />
                <FormControlLabel control={<OSCALCheckbox />} label={"Value 2"} />
              </Grid>
              <Grid item md={3}>
                <RadioGroup
                  name="example-radio-buttons-group"
                  value={selectedExampleRadio}
                  onChange={(event) => handleExampleRadioRadioChange(event)}
                >
                  <FormControlLabel
                    key={"example-radio_0"}
                    value={"value-1"}
                    control={<OSCALRadio />}
                    label={"Value 1"}
                  />
                  <FormControlLabel
                    key={"example-radio_1"}
                    value={"value-2"}
                    control={<OSCALRadio />}
                    label={"Value 2"}
                  />
                </RadioGroup>
              </Grid>
              <Grid item md={0.5}>
                <OSCALCancelButton />
              </Grid>
              <Grid item md={0.5}>
                <OSCALConfirmButton />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    );
  }

  return renderStyleGuide();
}
