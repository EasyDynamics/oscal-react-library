import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import OSCALControlImplementationImplReq from "./OSCALControlImplementationImplReq";
import OSCALControlImplementationAdd from "./OSCALControlImplementationAdd";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALControlParamLegend from "./OSCALControlParamLegend";

/**
 * Creates the control implementation by setting up the header and outer grid elements
 * and calls OSCALControlImplementationReqList.
 *
 * @param {object} props SSP properties
 * @returns The corresponding Control Implementation
 */
export default function OSCALControlImplementation(props) {
  const implementedRequirements =
    props.controlImplementation["implemented-requirements"];
  const controlIds = implementedRequirements.map(
    (implementedControl) => implementedControl["control-id"]
  );

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <OSCALSectionHeader>Control Implementation</OSCALSectionHeader>
            </Grid>
            <Grid item xs={6} align="right">
              <OSCALControlParamLegend />
            </Grid>
            <Grid item xs={12}>
              <Typography>{props.controlImplementation.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {implementedRequirements.map((implementedRequirement) => (
                  <OSCALControlImplementationImplReq
                    implementedRequirement={implementedRequirement}
                    components={props.components}
                    controls={props.controls}
                    childLevel={0}
                    key={implementedRequirement.uuid}
                    modifications={props.modifications}
                    isEditable={props.isEditable}
                    onRestSuccess={props.onRestSuccess}
                    onRestError={props.onRestError}
                    partialRestData={props.partialRestData}
                  />
                ))}
              </List>
              {props.isEditable ? (
                <Grid item>
                  <OSCALControlImplementationAdd
                    controls={props.controls}
                    implementedControls={controlIds}
                    onRestSuccess={props.onRestSuccess}
                    onRestError={props.onRestError}
                    partialRestData={props.partialRestData}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
