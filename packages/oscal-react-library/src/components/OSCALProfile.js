import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { List, ListSubheader } from "@mui/material";
import OSCALMetadata from "./OSCALMetadata";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALControl from "./OSCALControl";
import OSCALBackMatter from "./OSCALBackMatter";
import { OSCALResolveProfile } from "./oscal-utils/OSCALProfileResolver";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";
import OSCALControlParamLegend from "./OSCALControlParamLegend";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";

/**
 * Displays a given OSCAL Profile is an easily consumable format. According to NIST, a profile
 * represents the baseline of selected controls from one or more control catalogs.
 * For more information see: https://pages.nist.gov/OSCAL/concepts/layer/control/profile/
 *
 * @param {*} props
 * @returns The OSCAL profile component
 */
export default function OSCALProfile(props) {
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const unmounted = useRef(false);

  const partialRestData = {
    profile: {
      uuid: props.profile.uuid,
    },
  };

  // Resolved profile using oscal-utils. Provides error when failure.
  useEffect(() => {
    OSCALResolveProfile(
      props.profile,
      props.parentUrl,
      (profilesCatalogsTree) => {
        if (!unmounted.current) {
          console.log("----- SUCCESS -----");
          setIsLoaded(true);
          setInheritedProfilesAndCatalogs(profilesCatalogsTree);
          props.onResolutionComplete();
        }
      },
      () => {
        if (!unmounted.current) {
          console.log("----- FAILURE -----");
          setError(error);
          setIsLoaded(true);
          props.onResolutionComplete();
        }
      }
    );

    console.log("----- PROFILE RESOLVED ------");

    return () => {
      unmounted.current = true;
    };
  }, []);

  const includeAllControls = props.profile.imports
    .map((imp) => imp["include-all"])
    .filter((include) => include);

  const includeAll = includeAllControls.length > 0;

  const subControlIds = props.profile.resolvedControls
    ?.flatMap((resolved) => resolved.controls ?? [])
    .flatMap((subControl) => subControl.id)
    ?.filter((id) => id);
  const controlIds = props.profile.resolvedControls?.flatMap((control) => control.id);

  const excludeControlIds = props.profile.imports
    .flatMap((imp) => imp["exclude-controls"] ?? [])
    .flatMap((excludeControl) => excludeControl["with-ids"] ?? []);

  // Exclude all subcontrols that needed to be excluded.

  const includedSubControlIds = subControlIds
    ?.flatMap((subControl) => (!excludeControlIds?.includes(subControl) ? subControl : undefined))
    ?.filter((id) => id);

  const allControlIds = [...(controlIds ?? []), ...(includedSubControlIds ?? [])];

  // Flatten controls and IDs into single key, value structure
  const includeControlIds = includeAll
    ? allControlIds
    : props.profile.imports
        .flatMap((imp) => imp["include-controls"] ?? [])
        .flatMap((includeControl) => includeControl["with-ids"] ?? []);

  // Import resolved controls when loaded. When loading, display a basic skeleton placeholder
  // resembling the content.
  const profileImports = (
    <List
      subheader={
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ListSubheader component="div" id="oscal-profile-importedControls" disableSticky>
              <OSCALAnchorLinkHeader>Imported Controls</OSCALAnchorLinkHeader>
            </ListSubheader>
          </Grid>
          <Grid item xs={6} align="right">
            <OSCALControlParamLegend />
          </Grid>
        </Grid>
      }
    >
      {isLoaded ? (
        props.profile.resolvedControls.map((control) => (
          <OSCALControl
            control={control}
            excludeControlIds={excludeControlIds}
            includeControlIds={includeControlIds}
            modificationAlters={props.profile.modify?.alters}
            modificationSetParameters={props.profile.modify?.["set-parameters"]}
            restData={{
              profile: {
                uuid: props.profile.uuid,
              },
            }}
            childLevel={0}
            key={`control-${control.id}`}
          />
        ))
      ) : (
        <CardContent key="skeleton-card">
          <span style={{ marginTop: 5, display: "flex", gap: "1em" }} key="controls load 0">
            <Skeleton variant="text" width="25em" height="3em" />
            <Skeleton variant="circular" width="3em" height="3em" />
          </span>
          <Skeleton variant="text" width="10em" height="2.5em" />
          <Skeleton variant="rectangular" width="100%" height={115} />
          <Skeleton variant="text" width="6.5em" height="3.5em" />
        </CardContent>
      )}
    </List>
  );

  // Display Metadata and BackMatter components at bottom of Profile
  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={props.profile.metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={partialRestData}
        urlFragment={props.urlFragment}
        parentUrl={props.parentUrl}
        backMatter={props.profile["back-matter"]}
      />
      <OSCALProfileCatalogInheritance inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs} />
      {profileImports}
      <OSCALBackMatter
        backMatter={props.profile["back-matter"]}
        parentUrl={props.parentUrl}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={partialRestData}
      />
    </OSCALDocumentRoot>
  );
}
