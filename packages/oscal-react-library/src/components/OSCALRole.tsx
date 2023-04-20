import { Role } from "@easydynamics/oscal-types";
import WorkIcon from "@mui/icons-material/Work";
import { Card, DialogContent, DialogTitle, Grid } from "@mui/material";
import React from "react";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { MetadataAvatar, OSCALMetadataCard, OSCALMetadataFieldArea } from "./OSCALMetadataCommon";

interface OSCALMetadataRoleProps {
  role: Role;
}

export const OSCALMetadataRole: React.FC<OSCALMetadataRoleProps> = (props) => {
  const { role } = props;

  const avatar = <MetadataAvatar id={role.id} text={role.title} fallbackIcon={<WorkIcon />} />;

  return (
    <OSCALMetadataCard
      title={role.title}
      subheader={role["short-name"]}
      avatar={avatar}
      disabled={!role.description}
    >
      <DialogTitle>{role.title}</DialogTitle>
      <DialogContent dividers>
        <OSCALMarkupMultiLine>{role?.description}</OSCALMarkupMultiLine>
      </DialogContent>
    </OSCALMetadataCard>
  );
};

export interface OSCALMetadataRolesProps {
  roles: Role[] | undefined;
  urlFragment?: string;
}

export const OSCALMetadataRoles: React.FC<OSCALMetadataRolesProps> = (props) => {
  const { roles, urlFragment } = props;
  const cards = roles?.map((role) => (
    <Grid item xs={12} md={4} key={role.id} component={Card}>
      <OSCALMetadataRole role={role} />
    </Grid>
  ));

  return (
    <OSCALMetadataFieldArea title="Roles" urlFragment={urlFragment}>
      {cards}
    </OSCALMetadataFieldArea>
  );
};
