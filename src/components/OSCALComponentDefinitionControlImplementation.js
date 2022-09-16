import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { List, ListItem, ListItemText } from "@mui/material";
import OSCALControlImplementationImplReq from "./OSCALControlImplementationImplReq";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALControlParamLegend from "./OSCALControlParamLegend";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";

export default function OSCALComponentDefinitionControlImplementation(props) {
  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <OSCALAnchorLinkHeader
                title={
                  <OSCALSectionHeader>
                    Control Implementations
                  </OSCALSectionHeader>
                }
              />
            </Grid>
            <Grid item xs={6} align="right">
              <OSCALControlParamLegend />
            </Grid>
            <Grid item xs={12}>
              <List>
                {props.controlImplementations.map((controlImpl) => (
                  <ListItem key={controlImpl.uuid}>
                    <ListItemText>
                      {controlImpl.description}
                      <Grid item xs={12}>
                        <List>
                          {controlImpl["implemented-requirements"].map(
                            (implementedRequirement) => (
                              <OSCALControlImplementationImplReq
                                implementedRequirement={implementedRequirement}
                                components={props.components}
                                controls={props.controls}
                                childLevel={0}
                                key={implementedRequirement.uuid}
                                modifications={controlImpl.modifications}
                                isEditable={props.isEditable}
                                onRestSuccess={props.onRestSuccess}
                                onRestError={props.onRestError}
                                partialRestData={props.partialRestData}
                              />
                            )
                          )}
                        </List>
                      </Grid>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
