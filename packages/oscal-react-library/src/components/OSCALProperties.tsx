import ConstructionIcon from "@mui/icons-material/Construction";
import React, { ReactElement } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import StyledTooltip from "./OSCALStyledTooltip";
import TableHead from "@mui/material/TableHead";
import { StyledTableRow } from "./OSCALSystemImplementationTableStyles";
import { Property } from "@easydynamics/oscal-types";
import { NIST_DEFAULT_NAMESPACE, namespaceOf } from "./oscal-utils/OSCALPropUtils";
import { SmallInlineClassDisplay } from "./OSCALClass";
import { ButtonLaunchedDialog } from "./ButtonLaunchedDialog";
import { groupBy } from "../utils";

/**
 *  Helper to sort properties by their `name` field.
 *
 * @param propA The first property to compare
 * @param propB The second property to compare
 * @returns A positive number if A is before B alphabetically ot a negative number if B is before A
 *   alphabetically.
 */
function byName(propA: Property, propB: Property): number {
  return propA.name.localeCompare(propB.name);
}

interface OSCALPropertyProps {
  /**
   * Contains property elements
   */
  property: Property;
}

const OSCALProperty: React.FC<OSCALPropertyProps> = ({ property }) => {
  const NO_INFORMATION = <Typography className="NotSpecified">Not Specified</Typography>;

  return (
    <StyledTooltip title={property.remarks ?? ""}>
      <StyledTableRow key={property.uuid}>
        <TableCell>{property.name ?? NO_INFORMATION}</TableCell>
        <TableCell>
          {property.class ? <SmallInlineClassDisplay item={property} /> : NO_INFORMATION}
        </TableCell>
        <TableCell>{property.value ?? NO_INFORMATION}</TableCell>
      </StyledTableRow>
    </StyledTooltip>
  );
};

interface OSCALPropertiesProps {
  /**
   * Contains a list of properties
   */
  properties?: Property[];
  /**
   * A namespace used for the title of a table
   */
  namespace?: string;
}

const OSCALProperties: React.FC<OSCALPropertiesProps> = ({ properties, namespace }) => {
  if (!properties?.length) return null;
  return (
    <>
      <Typography
        variant="h6"
        id={`${namespace}-table-title`}
        className="OSCALSystemImplementationTableTitle"
      >
        {namespace}
      </Typography>
      <TableContainer sx={{ maxHeight: "20em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <TableHead className="StyledTableHead">
            <TableRow>
              <TableCell className="StyledHeaderTableCell">Name</TableCell>
              <TableCell className="StyledHeaderTableCell">Class</TableCell>
              <TableCell className="StyledHeaderTableCell">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // The index must be used because there is no combination of attributes of
              // a property that is guaranteed to be unique; the index is the best available
              // option. A UUID is not guaranteed to be present.
            }
            {properties?.map((property, idx) => (
              <OSCALProperty
                property={property}
                key={`${namespaceOf(property?.ns)}-property-${idx}`}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export interface OSCALPropertiesDialogProps {
  /**
   * Contains properties elements
   */
  properties?: Property[];
  /**
   * Title of the element the properties resides under
   */
  title?: string | ReactElement;
}

export const OSCALPropertiesDialog: React.FC<OSCALPropertiesDialogProps> = ({
  properties,
  title,
}) => {
  const { [NIST_DEFAULT_NAMESPACE]: nist, ...thirdParties } = groupBy(properties ?? [], (prop) =>
    namespaceOf(prop.ns)
  );

  return (
    <ButtonLaunchedDialog
      Icon={ConstructionIcon}
      disabled={!properties}
      componentTitle={title}
      dialogTitle={"Properties"}
    >
      {/* Handle NIST properties */}
      <OSCALProperties
        properties={nist?.sort(byName)}
        namespace={NIST_DEFAULT_NAMESPACE}
        key={NIST_DEFAULT_NAMESPACE}
      />
      {
        /* Handle 3rd party properties */
        Object.entries(thirdParties)
          .sort(([key1], [key2]) => key1.localeCompare(key2))
          .map(([key, props]) => (
            <OSCALProperties properties={props.sort(byName)} namespace={key} key={key} />
          ))
      }
    </ButtonLaunchedDialog>
  );
};
