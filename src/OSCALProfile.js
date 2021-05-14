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

/* eslint-disable */
/*
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALProfile(props) {
  const classes = useStyles();
  console.log(props["profile"]["imports"]);



  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.profile.metadata} />
      <TableContainer>
                  <Table aria-label="Title">
                    <TableHead>
                      <TableRow>
                        <TableCell>Control</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(props.profile.imports).map(
                        ([key, component], index) => (
                          <TableRow key={key}>
                            <TableCell component="th" scope="row">
                             {component["with-ids"]}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
      <div>{props["profile"]["imports"].map((prop) => (
        <div>{prop["include-controls"].map((brob) => (
          <li>{brob["with-ids"]}</li>
        ))}</div>
))}
</div>
    </div>
    
  );
}
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


  //this is all the resolved controls
  console.log(profile.resolvedControls);
  console.log(profile.imports);
  

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={profile.metadata} />
      <List
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            id="nested-list-subheader"
          >
            Control Groups
          </ListSubheader>
        }
      >
        {profile.resolvedControls.map((group) => (
          <div>{group.id} {group.title}</div>
        ))}
      </List>
    
     
     
    </div>
  );
}

/*

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALSsp(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();

  const ssp = props["system-security-plan"];

  let sspParties;
  if (ssp.metadata) {
    sspParties = ssp.metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      ssp,
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

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = (
      <OSCALControlImplementation
        controlImplementation={ssp["control-implementation"]}
        components={ssp["system-implementation"].components}
        controls={ssp.resolvedControls}
      />
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={ssp.metadata} />
      <OSCALSystemCharacteristics
        systemCharacteristics={ssp["system-characteristics"]}
      />
      <OSCALSystemImplementation
        systemImplementation={ssp["system-implementation"]}
        parties={sspParties}
      />
      {controlImpl}
    </div>
  );
}



*/