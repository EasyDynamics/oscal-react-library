import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import OSCALMetadata from "./OSCALMetadata";
import OSCALProfileDefintionResolver from "./oscal-utils/OSCALProfileDefinitionResolver";
import OSCALControl from "./OSCALControl";
import OSCALBackMatter from "./OSCALBackMatter";

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
    OSCALProfileDefintionResolver(
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

  // TODO - this is a bad way to grab imported controls, but due to nested arrays everywhere it is somewhat necessary
  profile.includeControlIds =
    profile.imports[0]["include-controls"][0]["with-ids"];

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
        href={profile.imports[0].href}
      />
    </div>
  );
}
