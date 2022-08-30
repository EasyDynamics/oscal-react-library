import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import OSCALAssessmentImplementationUsers from "./OSCALAssessmentImplementationUsers";
import OSCALAssessmentImplementationComponents from "./OSCALAssessmentImplementationComponents";
import OSCALAssessmentImplementationInventoryItems from "./OSCALAssessmentImplementationInventoryItems";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";

export default function OSCALSystemImplementation(props) {
  if (!props.systemImplementation) {
    return null;
  }

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALSectionHeader>System Implementation</OSCALSectionHeader>
            </Grid>
            <Grid item xs={12}>
              <OSCALMarkupMultiLine paragraphComponent={Typography}>
                {props.systemImplementation.remarks}
              </OSCALMarkupMultiLine>
            </Grid>
            <Grid item xs={12}>
              <OSCALAssessmentImplementationUsers
                users={props.systemImplementation.users}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALAssessmentImplementationComponents
                components={props.systemImplementation.components}
                parties={props.parties}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALAssessmentImplementationInventoryItems
                inventoryItems={props.systemImplementation["inventory-items"]}
                parties={props.parties}
                components={props.components}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
