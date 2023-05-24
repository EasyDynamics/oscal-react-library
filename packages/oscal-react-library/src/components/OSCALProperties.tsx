import ConstructionIcon from "@mui/icons-material/Construction";
import React, { ReactElement } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
  StyledTableHead,
} from "./OSCALSystemImplementationTableStyles";
import { Property } from "@easydynamics/oscal-types";
import { NIST_DEFAULT_NAMESPACE, namespaceOf } from "./oscal-utils/OSCALPropUtils";
import { NotSpecifiedTypography } from "./StyledTypography";
import { groupBy } from "../utils";
import { ButtonLaunchedDialog } from "./ButtonLaunchedDialog";
import { SmallInlineClassDisplay } from "./OSCALClass";
import { HoverablePopover } from "./HoverablePopover";
import { OSCALMarkupLine } from "./OSCALMarkupProse";

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
  const NO_INFORMATION = <NotSpecifiedTypography>Not Specified</NotSpecifiedTypography>;

  return (
    <HoverablePopover popoverContent={<OSCALMarkupLine>{property.remarks}</OSCALMarkupLine>}>
      <StyledTableRow key={property.uuid}>
        <TableCell>{property.name ?? NO_INFORMATION}</TableCell>
        <TableCell>
          {property.class ? <SmallInlineClassDisplay item={property} /> : NO_INFORMATION}
        </TableCell>
        <TableCell>{property.value ?? NO_INFORMATION}</TableCell>
      </StyledTableRow>
    </HoverablePopover>
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
      <OSCALSystemImplementationTableTitle variant="h6" id={`${namespace}-table-title`}>
        {namespace}
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "20em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderTableCell>Name</StyledHeaderTableCell>
              <StyledHeaderTableCell>Class</StyledHeaderTableCell>
              <StyledHeaderTableCell>Value</StyledHeaderTableCell>
            </TableRow>
          </StyledTableHead>
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
