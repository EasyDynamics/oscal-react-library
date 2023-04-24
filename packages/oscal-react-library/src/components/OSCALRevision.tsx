import { RevisionHistoryEntry } from "@easydynamics/oscal-types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { OSCALMetadataLabel } from "./OSCALMetadataCommon";
import {
  StyledHeaderTableCell,
  StyledTableHead,
  StyledTableRow,
} from "./OSCALSystemImplementationTableStyles";
import { NotSpecifiedTypography } from "./StyledTypography";

export interface OSCALRevisionProps {
  revision: RevisionHistoryEntry;
}

export const OSCALRevision: React.FC<OSCALRevisionProps> = (props) => {
  const { revision } = props;
  const NO_INFORMATION = <NotSpecifiedTypography>Not Specified</NotSpecifiedTypography>;

  return (
    <StyledTableRow>
      <TableCell>{revision.title ?? NO_INFORMATION}</TableCell>
      <TableCell>{revision.published?.toString() ?? NO_INFORMATION}</TableCell>
      <TableCell>{revision["last-modified"]?.toString() ?? NO_INFORMATION}</TableCell>
      <TableCell>{revision.version}</TableCell>
      <TableCell>{revision["oscal-version"] ?? NO_INFORMATION}</TableCell>
    </StyledTableRow>
  );
};

export interface OSCALRevisionsProps {
  revisions: RevisionHistoryEntry[] | undefined;
}

export const OSCALRevisions: React.FC<OSCALRevisionsProps> = (props) => {
  const { revisions } = props;

  return (
    <Table aria-label="Components" sx={{ height: "max-content" }}>
      <StyledTableHead>
        <TableRow>
          <StyledHeaderTableCell>Title</StyledHeaderTableCell>
          <StyledHeaderTableCell>Published</StyledHeaderTableCell>
          <StyledHeaderTableCell>Last Modified</StyledHeaderTableCell>
          <StyledHeaderTableCell>Version</StyledHeaderTableCell>
          <StyledHeaderTableCell>OSCAL Version</StyledHeaderTableCell>
        </TableRow>
      </StyledTableHead>
      <TableBody>
        {revisions?.map((revision) => (
          <OSCALRevision revision={revision} key={revision.version} />
        ))}
      </TableBody>
    </Table>
  );
};

export const OSCALRevisionsButton: React.FC<OSCALRevisionsProps> = (props) => {
  const { revisions } = props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <OSCALMetadataLabel variant="body2">Revisions:</OSCALMetadataLabel>
      <Button size="small" variant="outlined" onClick={handleOpen} disabled={!revisions}>
        <Typography variant="body2">{revisions?.length ?? 0}</Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md" fullWidth>
        <DialogTitle>Revision History</DialogTitle>
        <DialogContent dividers>
          <OSCALRevisions revisions={revisions} />
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
