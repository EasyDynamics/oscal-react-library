import React, { useCallback, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import OSCALControlLabel from "./OSCALControlLabel";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import { propWithName } from "./oscal-utils/OSCALPropUtils";

const OSCALControlCard = styled(Card, {
  // https://github.com/mui/material-ui/blob/c34935814b81870ca325099cdf41a1025a85d4b5/packages/mui-system/src/createStyled.js#L56
  shouldForwardProp: (prop) =>
    !["childLevel", "withdrawn", "ownerState", "theme", "sx", "as"].includes(
      prop
    ),
})`
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  margin-right: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  ${(props) => props.childLevel > 0 && "background-color: #fffcf0;"}
  ${(props) =>
    props.withdrawn &&
    `text-decoration: line-through; color: ${props.theme.palette.grey[400]};`}
`;

function ControlsList(props) {
  return (
    <div>
      {props.control.parts?.map((part, index) => (
        <OSCALControlPart
          componentId={props.componentId}
          control={props.control}
          controlId={props.control.id}
          implementedRequirement={props.implementedRequirement}
          isEditable={props.isEditable}
          key={part.id ?? `part-${index}`}
          modificationAlters={props.modificationAlters}
          modificationSetParameters={props.modificationSetParameters}
          onRestError={props.onRestError}
          onRestSuccess={props.onRestSuccess}
          parameters={props.control.params}
          part={part}
          partialRestData={props.partialRestData}
        />
      ))}
      {props.control.controls?.map((control) => (
        <OSCALControl
          childLevel={(props?.childLevel ?? 0) + 1}
          componentId={props.componentId}
          control={control}
          implementedRequirement={props.implementedRequirement}
          includeControlIds={props.includeControlIds}
          isEditable={props.isEditable}
          key={control.id}
          modificationAlters={props.modificationAlters}
          modificationSetParameters={props.modificationSetParameters}
          onRestError={props.onRestError}
          onRestSuccess={props.onRestSuccess}
          parameters={control.params}
          partialRestData={props.partialRestData}
        />
      ))}
    </div>
  );
}

export default function OSCALControl(props) {
  const {
    listItemOpened,
    itemNavigatedTo,
    urlFragment,
    control,
    includeControlIds,
    modificationAlters,
    showInList,
    childLevel,
  } = props;

  const handleListItemOpened = useCallback(() => {
    if (!listItemOpened || itemNavigatedTo) {
      return;
    }
    const fragment = urlFragment;
    if (fragment === "" || fragment === null) {
      return;
    }
    // Smooth scroll to control if element is found with fragment identifier
    const elementWithFragment = document.getElementById(fragment);
    elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
  }, [listItemOpened, itemNavigatedTo, urlFragment]);

  useEffect(() => {
    handleListItemOpened();
  }, [handleListItemOpened]);

  if (
    !control ||
    (includeControlIds && !includeControlIds.includes(control.id))
  ) {
    return null;
  }

  let modificationDisplay;
  if (modificationAlters) {
    modificationDisplay = (
      <OSCALControlModification
        modificationAlters={modificationAlters}
        controlId={control.id}
      />
    );
  }

  const label = propWithName(control.props, "label")?.value;

  return showInList ? (
    <ControlsList {...props} />
  ) : (
    <OSCALControlCard
      childLevel={childLevel ?? 0}
      withdrawn={isWithdrawn(control)}
    >
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <OSCALAnchorLinkHeader value={control.id}>
              <Typography
                variant="h6"
                component="h2"
                style={childLevel ? { fontSize: "1.1rem" } : undefined}
              >
                <OSCALControlLabel
                  component="span"
                  label={label}
                  id={control.id}
                />{" "}
                {control.title} {modificationDisplay}
              </Typography>
            </OSCALAnchorLinkHeader>
          </Grid>
        </Grid>
        <ControlsList {...props} />
      </CardContent>
    </OSCALControlCard>
  );
}
