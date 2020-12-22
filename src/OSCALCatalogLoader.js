import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OSCALCatalog from './OSCALCatalog.js';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
	  catalogForm: {
	    marginTop: theme.spacing(4),
	    marginBottom: theme.spacing(3),
	  },
	  // TODO - This is a bit hacky
	  catalogUrlInput: {
		 maxWidth: '80%'
	  },
	  reloadButton: {
		 marginLeft: theme.spacing(3)
	  }
	}));

export default function OSCALCatalogLoader() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [catalogUrl, setCatalogUrl] = useState("https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json");
  
  const classes = useStyles();
  
  const loadCatalog = (newCatalogUrl) => {
	  fetch(newCatalogUrl)
      .then(res => res.json())
      .then(
        (result) => {
          setCatalog(result.catalog);
          setIsLoaded(true);
          setError(null);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      )
  }
  
  const handleChange = (event) => {
	  setCatalogUrl(event.target.value);
  };
  
  const handleReloadClick = (event) => {
	  loadCatalog(catalogUrl);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadCatalog(catalogUrl);
  },[]);

  let result;
  
  if (error) {
    result = <Alert severity="error">Yikes! Something went wrong loading the catalog. Sorry, we'll look into it. ({error.message})</Alert>;
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else {
	result = <OSCALCatalog catalog={catalog} />;  
  }
	return (
		<React.Fragment>
		<form className={classes.catalogForm} noValidate autoComplete="off" onSubmit={e => { e.preventDefault(); }}>
			<TextField
	          id="oscal-catalog"
	          className={classes.catalogUrlInput}
	          label="OSCAL Catalog URL"
	          defaultValue={catalogUrl}
	          helperText="(JSON Format)"
	          variant="outlined"
	          fullWidth
	          onChange={handleChange}
	        />
			<Button
		        variant="contained"
		        color="primary"
		        className={classes.reloadButton}
		        endIcon={<ReplayIcon>send</ReplayIcon>}
			    onClick={handleReloadClick}
		      >
			  Reload
			</Button>
		</form>
	    {result}
	  	</React.Fragment>
	);
}