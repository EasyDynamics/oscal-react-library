import React, { useState, useEffect } from 'react';
import OSCALCatalog from './OSCALCatalog.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function OSCALCatalogLoader() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [catalog, setCatalog] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json")
      .then(res => res.json())
      .then(
        (result) => {
          setCatalog(result.catalog);
          setIsLoaded(true);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <Alert severity="error">Yikes! Something went wrong loading the playlist. Sorry, we'll look into it. ({error.message})</Alert>;
  } else if (!isLoaded) {
    return <CircularProgress />;
  } else {
    return (
      <Container component="main">
        <CssBaseline />
      	<OSCALCatalog catalog={catalog} />
      </Container>
    );
  }
}