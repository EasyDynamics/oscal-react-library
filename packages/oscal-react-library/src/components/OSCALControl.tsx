import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import OSCALControlLabel from "./OSCALControlLabel";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";
import { AnchorLinkProps, OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import { appendToFragmentPrefix } from "./oscal-utils/OSCALLinkUtils";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { shouldForwardProp } from "@mui/system";
import {
  Control,
  ImplementedRequirementElement,
  SetParameterValue,
  Alteration,
} from "@easydynamics/oscal-types";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { Stack } from "@mui/material";

interface ControlListOptions {
  childLevel: number;
}

interface OSCALControlCardProps extends CardProps, ControlListOptions {
  withdrawn: boolean;
}

const OSCALControlCard = styled(Card, {
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) && prop !== "childLevel" && prop !== "withdrawn",
})<OSCALControlCardProps>(({ theme, childLevel, withdrawn }) => ({
  marginTop: "1em",
  marginBotom: "1em",
  marginLeft: childLevel ? "1.5em" : "0",
  marginRight: childLevel ? "1.5em" : "0",
  backgroundColor: childLevel ? "#FFFCF0" : undefined,
  textDecoration: withdrawn ? "line-through" : undefined,
  color: withdrawn ? theme.palette.grey[400] : undefined,
}));

interface ControlsListProps extends EditableFieldProps, AnchorLinkProps, ControlListOptions {
  control: Control;
  componentId?: string;
  implementedRequirement?: ImplementedRequirementElement;
  includeControlIds?: string[];
  excludeControlIds?: string[];
  onRestError?: (...args: any[]) => void;
  onRestSuccess?: (...args: any[]) => void;
  modificationAlters?: Alteration[];
  modificationSetParameters?: SetParameterValue[];
  withdrawn: boolean;
}

const ControlsList: React.FC<ControlsListProps> = (props) => {
  const {
    control,
    componentId,
    implementedRequirement,
    isEditable,
    modificationAlters,
    modificationSetParameters,
    onRestError,
    onRestSuccess,
    partialRestData,
    childLevel,
    includeControlIds,
    urlFragment,
    fragmentPrefix,
  } = props;
  return (
    <Box
      sx={[
        { textDecoration: props.withdrawn ? "line-through" : undefined },
        (theme) => ({
          color: props.withdrawn ? theme.palette.grey[400] : undefined,
        }),
      ]}
    >
      {control.parts?.map((part, index) => (
        <OSCALControlPart
          componentId={componentId}
          control={control}
          controlId={control.id}
          implementedRequirement={implementedRequirement}
          isEditable={isEditable}
          key={part.id ?? `part-${index}`}
          modificationAlters={modificationAlters}
          modificationSetParameters={modificationSetParameters}
          onRestError={onRestError}
          onRestSuccess={onRestSuccess}
          parameters={control.params}
          part={part}
          partialRestData={partialRestData}
        />
      ))}
      {control.controls?.map((listControl) => (
        <OSCALControl
          childLevel={(childLevel ?? 0) + 1}
          componentId={componentId}
          control={listControl}
          implementedRequirement={implementedRequirement}
          includeControlIds={includeControlIds}
          isEditable={isEditable}
          key={listControl.id}
          modificationAlters={modificationAlters}
          modificationSetParameters={modificationSetParameters}
          onRestError={onRestError}
          onRestSuccess={onRestSuccess}
          partialRestData={partialRestData}
          urlFragment={urlFragment}
          fragmentPrefix={fragmentPrefix}
          withdrawn={props.withdrawn}
        />
      ))}
    </Box>
  );
};

export interface OSCALControlProps extends ControlsListProps, AnchorLinkProps {
  listItemOpened?: boolean;
  isItemNavigatedTo?: boolean;
  showInList?: boolean;
  previousHandledFragment?: string;
  setPreviousHandledFragment?: (fragment: string) => void;
}

const OSCALControl: React.FC<OSCALControlProps> = (props) => {
  const {
    listItemOpened,
    isItemNavigatedTo,
    urlFragment,
    fragmentPrefix,
    control,
    includeControlIds,
    modificationAlters,
    showInList,
    childLevel,
    excludeControlIds,
    previousHandledFragment,
    setPreviousHandledFragment,
    withdrawn,
  } = props;

  useEffect(() => {
    if (!listItemOpened || isItemNavigatedTo || previousHandledFragment === urlFragment) {
      return;
    }
    if (!urlFragment) {
      return;
    }
    // Smooth scroll to control if element is found with fragment identifier
    const elementWithFragment = document.getElementById(urlFragment);
    elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
  }, [
    listItemOpened,
    isItemNavigatedTo,
    urlFragment,
    previousHandledFragment,
    setPreviousHandledFragment,
  ]);

  if (!control || (includeControlIds && !includeControlIds.includes(control.id))) {
    return null;
  }
  if (!control || (excludeControlIds && excludeControlIds.includes(control.id))) {
    return null;
  }

  let modificationDisplay;
  if (modificationAlters) {
    modificationDisplay = (
      <OSCALControlModification modificationAlters={modificationAlters} controlId={control.id} />
    );
  }

  const label = propWithName(control.props, "label")?.value;
  const controlOrParentWithdrawn = withdrawn || isWithdrawn(control);

  return showInList ? (
    <ControlsList {...props} withdrawn={controlOrParentWithdrawn} />
  ) : (
    <OSCALControlCard childLevel={childLevel ?? 0} withdrawn={controlOrParentWithdrawn}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack alignItems="center" direction="row" justifyContent="space-between">
              <OSCALAnchorLinkHeader
                name={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  style={childLevel ? { fontSize: "1.1rem" } : undefined}
                >
                  <OSCALControlLabel component="span" label={label} id={control.id} />{" "}
                  {control.title} {modificationDisplay}
                </Typography>
              </OSCALAnchorLinkHeader>
              <Box>
                <OSCALPropertiesDialog
                  properties={control.props}
                  title={
                    <>
                      <OSCALControlLabel id={control.id} label={label} component="span" />
                      {` ${control.title}`}
                    </>
                  }
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <ControlsList {...props} withdrawn={controlOrParentWithdrawn} />
      </CardContent>
    </OSCALControlCard>
  );
};

export default OSCALControl;