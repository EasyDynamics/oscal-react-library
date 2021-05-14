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
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALProfileDefintionResolver from "./oscal-utils/OSCALProfileDefinitionResolver";
import OSCALControl from "./OSCALControl";

/* eslint-disable */
/*

/*
working return
  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.profile.metadata} />
      <div>{props["profile"]["imports"].map((prop) => (
        <div>{prop["include-controls"].map((brob) => (
          <p>{brob["with-ids"]}</p>
        ))}</div>
))}




failed return
return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.profile.metadata} />
      <div>{props["profile"]["imports"]["include-controls"].map((prop) => (
        <p>{prop["with-ids"]}</p>



*/
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

  const profile = props["profile"];
  //console.log(props.parentUrl);
  //profile.resolvedControls = [];
  //console.log(profile.["back-matter"]);
  
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

  //TODO - this is a bad way to grab imported controls, but due to nested arrays everywhere it is somewhat necessary
  profile.trimmedControls = profile.imports.[0].["include-controls"].[0].["with-ids"];
  console.log(profile.trimmedControls);
  console.log(profile.resolvedControls);
  /*
  function trimControls(resolvedControls) {
    let property;
    for (property of props) {
      if (property.name === "label") {
        return property.value;
      }
    }
  } 
  */

//this is all the resolved controls
  //console.log(profile.imports);
  let profileImpl;

  if (!isLoaded) {
    profileImpl = null;
  } else {

    
    profileImpl = (
      
      <List className={classes.OSCALControlList}>
          {profile.resolvedControls.map((control) => (
            <OSCALControl
              control={control}
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
      {profileImpl}
      
    </div>
  );
}

/*

array of resolved controls
array of imported controls based on 'imports'


*/