import React from "react";
import TableCell from "@mui/material/TableCell";
import OSCALProperties from "./OSCALProperties";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import OSCALImplementedComponents from "./OSCALImplementedComponents";

export default function OSCALInventoryItem(props) {
  if (!props.inventoryItem) {
    return null;
  }

  return (
    <>
      <TableCell>{props.inventoryItem.description}</TableCell>
      <TableCell>
        <OSCALProperties properties={props.inventoryItem.props} />
      </TableCell>
      <TableCell>
        <OSCALResponsibleRoles
          responsibleRoles={props.inventoryItem["responsible-parties"]}
          parties={props.parties}
        />
      </TableCell>
      <TableCell>
        <OSCALImplementedComponents
          implementedComponents={props.inventoryItem["implemented-components"]}
          components={props.components}
        />
      </TableCell>
      <TableCell>{props.inventoryItem.remarks}</TableCell>
    </>
  );
}
