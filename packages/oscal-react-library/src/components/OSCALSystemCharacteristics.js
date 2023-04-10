import React from "react";
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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StyledTooltip from "./OSCALStyledTooltip";
import OSCALDiagram from "./OSCALDiagram";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";

export default function OSCALSystemCharacteristics(props) {
  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>System Characteristics</OSCALSectionHeader>
              </OSCALAnchorLinkHeader>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                {props.systemCharacteristics["system-name"]}
                {
                  // Render the system's short name in parentheses next to the name,
                  // but only if the short name exists.
                  props.systemCharacteristics["system-name-short"] &&
                    ` (${props.systemCharacteristics["system-name-short"]})`
                }
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">{props.systemCharacteristics.description}</Typography>
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={2}>
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
            <Grid item xs={2}>
              <TextField
                disabled
                id="security-sensitivity-level"
                label="sensitivity-level"
                defaultValue={props.systemCharacteristics["security-sensitivity-level"]}
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={2}>
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
            <Grid item xs={2}>
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
                    {props.systemCharacteristics["system-information"]["information-types"].map(
                      (informationType) => (
                        <TableRow key={informationType.uuid}>
                          <TableCell component="th" scope="row">
                            <StyledTooltip title={informationType.description}>
                              <Typography variant="body2">{informationType.title}</Typography>
                            </StyledTooltip>
                          </TableCell>
                          <TableCell>
                            {informationType.categorizations?.map((categorization) =>
                              categorization["information-type-ids"].map((infoId) => (
                                <Chip
                                  icon={
                                    categorization.system.startsWith("http") ? (
                                      <OpenInNewIcon />
                                    ) : null
                                  }
                                  label={infoId}
                                  component="a"
                                  href={categorization.system}
                                  clickable
                                  variant="outlined"
                                  key={infoId}
                                />
                              ))
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
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">
                <OSCALAnchorLinkHeader>Authorization Boundary</OSCALAnchorLinkHeader>
              </Typography>
              <Typography variant="body2">
                {props.systemCharacteristics?.["authorization-boundary"]?.description}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.["authorization-boundary"]?.diagrams?.map(
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
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">
                <OSCALAnchorLinkHeader>Network Architecture</OSCALAnchorLinkHeader>
              </Typography>
              <Typography variant="body2">
                {props.systemCharacteristics?.["network-architecture"]?.description}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.["network-architecture"]?.diagrams?.map((diagram) => (
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
                <OSCALAnchorLinkHeader>Data Flow</OSCALAnchorLinkHeader>
              </Typography>
              <Typography variant="body2">
                {props.systemCharacteristics?.["data-flow"]?.description}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {props.systemCharacteristics?.["data-flow"]?.diagrams?.map((diagram) => (
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
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
