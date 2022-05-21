import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";
import OSCALDiagram from "./OSCALDiagram";

const PREFIX = "OSCALSystemCharacteristics";

const classes = {
  paper: `${PREFIX}-paper`,
  OSCALSystemCharacteristicsInfo: `${PREFIX}-OSCALSystemCharacteristicsInfo`,
  OSCALSystemCharacteristicsHeader: `${PREFIX}-OSCALSystemCharacteristicsHeader`,
  OSCALSystemCharacteristicsStatus: `${PREFIX}-OSCALSystemCharacteristicsStatus`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.paper}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.OSCALSystemCharacteristicsInfo}`]: {
    "text-transform": "capitalize",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },

  // TODO - This is hacky
  [`& .${classes.OSCALSystemCharacteristicsHeader}`]: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },

  [`& .${classes.OSCALSystemCharacteristicsStatus}`]: {
    "text-transform": "capitalize",
  },
}));

export default function OSCALSystemCharacteristics(props) {
  return (
    <Root className={classes.paper}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              className={classes.OSCALSystemCharacteristicsHeader}
            >
              <Typography>System Characteristics</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <Typography variant="h6">
                {props.systemCharacteristics["system-name"]}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {props.systemCharacteristics.props?.map((prop) => (
                      <TableRow key={prop.name}>
                        <TableCell component="th" scope="row">
                          {prop.name}
                        </TableCell>
                        <TableCell align="right">{prop.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <StyledTooltip title={props.systemCharacteristics.status.remarks}>
                <TextField
                  disabled
                  id="system-characteristics-status"
                  label="status"
                  defaultValue={props.systemCharacteristics.status.state}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              </StyledTooltip>
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <TextField
                disabled
                id="security-sensitivity-level"
                label="sensitivity-level"
                defaultValue={
                  props.systemCharacteristics["security-sensitivity-level"]
                }
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <TextField
                disabled
                id="security-objective-confidentiality"
                label="confidentiality"
                defaultValue={
                  props.systemCharacteristics["security-impact-level"][
                    "security-objective-confidentiality"
                  ]
                }
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <TextField
                disabled
                id="security-objective-integrity"
                label="integrity"
                defaultValue={
                  props.systemCharacteristics["security-impact-level"][
                    "security-objective-integrity"
                  ]
                }
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <TextField
                disabled
                id="security-objective-availability"
                label="availability"
                defaultValue={
                  props.systemCharacteristics["security-impact-level"][
                    "security-objective-availability"
                  ]
                }
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="System Information">
                  <TableHead>
                    <TableRow>
                      <TableCell>System Information</TableCell>
                      <TableCell>Categorizations</TableCell>
                      <TableCell>Confidentiality</TableCell>
                      <TableCell>Integrity</TableCell>
                      <TableCell>Availability</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.systemCharacteristics["system-information"][
                      "information-types"
                    ].map((informationType) => (
                      <TableRow key={informationType.uuid}>
                        <TableCell component="th" scope="row">
                          <StyledTooltip title={informationType.description}>
                            <Typography variant="body2">
                              {informationType.title}
                            </Typography>
                          </StyledTooltip>
                        </TableCell>
                        <TableCell>
                          {informationType.categorizations?.map(
                            (categorization) =>
                              categorization["information-type-ids"].map(
                                (infoId) => (
                                  <Chip
                                    label={infoId}
                                    component="a"
                                    href={categorization.system}
                                    clickable
                                    variant="outlined"
                                    key={infoId}
                                  />
                                )
                              )
                          )}
                        </TableCell>
                        <TableCell>
                          {informationType["confidentiality-impact"] &&
                            informationType["confidentiality-impact"].base}
                        </TableCell>
                        <TableCell>
                          {informationType["integrity-impact"] &&
                            informationType["integrity-impact"].base}
                        </TableCell>
                        <TableCell>
                          {informationType["availability-impact"] &&
                            informationType["availability-impact"].base}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Authorization Boundary
              </Typography>
              <Typography variant="body2">
                {
                  props.systemCharacteristics?.["authorization-boundary"]
                    ?.description
                }
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.[
                  "authorization-boundary"
                ]?.diagrams?.map((diagram) => (
                  <Grid item xs={6} key={diagram.uuid}>
                    <OSCALDiagram
                      diagram={diagram}
                      backMatter={props.backMatter}
                      parentUrl={props.parentUrl}
                      mediaTypeRegex={/^image\//}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Network Architecture
              </Typography>
              <Typography variant="body2">
                {
                  props.systemCharacteristics?.["network-architecture"]
                    ?.description
                }
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.[
                  "network-architecture"
                ]?.diagrams?.map((diagram) => (
                  <Grid item xs={6} key={diagram.uuid}>
                    <OSCALDiagram
                      diagram={diagram}
                      backMatter={props.backMatter}
                      parentUrl={props.parentUrl}
                      mediaTypeRegex={/^image\//}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Data Flow
              </Typography>
              <Typography variant="body2">
                {props.systemCharacteristics?.["data-flow"]?.description}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.["data-flow"]?.diagrams?.map(
                  (diagram) => (
                    <Grid item xs={6} key={diagram.uuid}>
                      <OSCALDiagram
                        diagram={diagram}
                        backMatter={props.backMatter}
                        parentUrl={props.parentUrl}
                        mediaTypeRegex={/^image\//}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Root>
  );
}
