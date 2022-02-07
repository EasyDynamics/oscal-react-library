import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Skeleton from "@material-ui/lab/Skeleton";
import CardContent from "@material-ui/core/CardContent";
import OSCALMetadata from "./OSCALMetadata";
import OSCALControl from "./OSCALControl";
import OSCALBackMatter from "./OSCALBackMatter";
import { OSCALResolveProfile } from "./oscal-utils/OSCALProfileResolver";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

/**
 * Displays a given OSCAL Profile is an easily consumable format. According to NIST, a profile
 * represents the baseline of selected controls from one or more control catalogs.
 * For more information see: https://pages.nist.gov/OSCAL/concepts/layer/control/profile/
 *
 * @param {Object} props
 * @returns The OSCAL profile component
 */
export default function OSCALProfile(props) {
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();
  const unmounted = useRef(false);

  // Resolved profile using oscal-utils. Provides error when failure.
  useEffect(() => {
    OSCALResolveProfile(
      props.profile,
      props.parentUrl,
      (profilesCatalogsTree) => {
        if (!unmounted.current) {
          setIsLoaded(true);
          setInheritedProfilesAndCatalogs(profilesCatalogsTree);
          props.onResolutionComplete();
        }
      },
      () => {
        if (!unmounted.current) {
          setError(error);
          setIsLoaded(true);
          props.onResolutionComplete();
        }
      }
    );

    return () => {
      unmounted.current = true;
    };
  }, []);

  // Flatten controls and IDs into single key, value structure
  const includeControlIds = props.profile.imports
    .flatMap((imp) => imp["include-controls"])
    .flatMap((includeControl) => includeControl["with-ids"]);

  // Import resolved controls when loaded. When loading, display a basic skeleton placeholder
  // resembling the content.
  const profileImports = (
    <List
      className={classes.OSCALControlList}
      subheader={
        <ListSubheader
          className={classes.OSCALMetadataPartiesHeader}
          component="div"
          id="oscal-profile-importedControls"
          disableSticky
        >
          Imported Controls
        </ListSubheader>
      }
    >
      {isLoaded ? (
        props.profile.resolvedControls.map((control) => (
          <OSCALControl
            control={control}
            includeControlIds={includeControlIds}
            modificationAlters={props.profile.modify.alters}
            modificationSetParameters={props.profile.modify["set-parameters"]}
            childLevel={0}
            key={`control-${control.id}`}
          />
        ))
      ) : (
        <CardContent key="skeleton-card">
          <span
            style={{ marginTop: 5, display: "flex", gap: "1em" }}
            key="controls load 0"
          >
            <Skeleton variant="text" width="25em" height="3em" />
            <Skeleton variant="circle" width="3em" height="3em" />
          </span>
          <Skeleton variant="text" width="10em" height="2.5em" />
          <Skeleton variant="rect" width="100%" height={115} />
          <Skeleton variant="text" width="6.5em" height="3.5em" />
        </CardContent>
      )}
    </List>
  );

  // Display Metadata and BackMatter components at bottom of Profile
  return (
    <div className={classes.paper}>
      <OSCALMetadata
        metadata={props.profile.metadata}
      />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      {profileImports}
      <OSCALBackMatter
        backMatter={props.profile["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
