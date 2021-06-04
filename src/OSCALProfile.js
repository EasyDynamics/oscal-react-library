import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import OSCALMetadata from "./OSCALMetadata";
import OSCALControl from "./OSCALControl";
import OSCALBackMatter from "./OSCALBackMatter";
import { OSCALResolveProfile } from "./oscal-utils/OSCALProfileResolver";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALProfile(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();

  // eslint-disable-next-line
  const profile = props["profile"];

  useEffect(() => {
    OSCALResolveProfile(
      profile,
      props.parentUrl,
      () => {
        setIsLoaded(true);
      },
      () => {
        setError(error);
        setIsLoaded(true);
      }
    );
    // eslint-disable-next-line
  }, []);

  profile.imports.forEach((imp) => {
    imp["include-controls"].forEach((includeControl) => {
      profile.includeControlIds = includeControl["with-ids"];
    });
  });

  let profileImports;

  if (!isLoaded) {
    profileImports = null;
  } else {
    profileImports = (
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
        {props.profile.resolvedControls.map((control) => (
          <OSCALControl
            control={control}
            includeControlIds={props.profile.includeControlIds}
            modifications={props.profile.modify}
            childLevel={0}
            key={`control-${control.id}`}
          />
        ))}
      </List>
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={profile.metadata} />
      {profileImports}
      <OSCALBackMatter
        backMatter={profile["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
