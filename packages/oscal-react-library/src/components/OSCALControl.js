import React, { useEffect } from "react";
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
import { appendToFragmentPrefix } from "./oscal-utils/OSCALLinkUtils";
import OSCALProperties from "./OSCALProperties";

const OSCALControlCard = styled(Card, {
  // https://github.com/mui/material-ui/blob/c34935814b81870ca325099cdf41a1025a85d4b5/packages/mui-system/src/createStyled.js#L56
  shouldForwardProp: (prop) =>
    !["childLevel", "withdrawn", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  margin-right: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  ${(props) => props.childLevel > 0 && "background-color: #fffcf0;"}
  ${(props) =>
    props.withdrawn && `text-decoration: line-through; color: ${props.theme.palette.grey[400]};`}
`;

function ControlsList(props) {
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
    <div>
      <OSCALProperties
        properties={control.props}
        title={
          <>
            <OSCALControlLabel id={control.id} label={control.label} component="span" />
            {` ${control.title} Discussion`}
          </>
        }
      />
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
          parameters={listControl.params}
          partialRestData={partialRestData}
          urlFragment={urlFragment}
          fragmentPrefix={fragmentPrefix}
        />
      ))}
    </div>
  );
}

export default function OSCALControl(props) {
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
  } = props;

  useEffect(() => {
    if (!listItemOpened || isItemNavigatedTo) {
      return;
    }
    if (!urlFragment) {
      return;
    }
    // Smooth scroll to control if element is found with fragment identifier
    const elementWithFragment = document.getElementById(urlFragment);
    elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
  }, [listItemOpened, isItemNavigatedTo, urlFragment]);

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

  return showInList ? (
    <ControlsList {...props} />
  ) : (
    <OSCALControlCard childLevel={childLevel ?? 0} withdrawn={isWithdrawn(control)}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <OSCALAnchorLinkHeader
              value={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}
            >
              <Typography
                variant="h6"
                component="h2"
                style={childLevel ? { fontSize: "1.1rem" } : undefined}
              >
                <OSCALControlLabel component="span" label={label} id={control.id} /> {control.title}{" "}
                {modificationDisplay}
              </Typography>
            </OSCALAnchorLinkHeader>
          </Grid>
        </Grid>
        <ControlsList {...props} />
      </CardContent>
    </OSCALControlCard>
  );
}
