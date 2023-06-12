import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import OSCALSystemImplementationUsers from "./OSCALSystemImplementationUsers";
import { OSCALSystemImplementationComponents } from "./OSCALSystemImplementationComponents";
import OSCALSystemImplementationInventoryItems from "./OSCALSystemImplementationInventoryItems";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";

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
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>System Implementation</OSCALSectionHeader>
              </OSCALAnchorLinkHeader>
            </Grid>
            <Grid item xs={12}>
              <OSCALMarkupMultiLine paragraphComponent={Typography}>
                {props.systemImplementation.remarks}
              </OSCALMarkupMultiLine>
            </Grid>
            <Grid item xs={12}>
              <OSCALSystemImplementationUsers users={props.systemImplementation.users} />
            </Grid>
            <Grid item xs={12}>
              <OSCALSystemImplementationComponents
                components={props.systemImplementation.components}
                parties={props.parties}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALSystemImplementationInventoryItems
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
