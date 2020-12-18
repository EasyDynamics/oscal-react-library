import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControlGuidanceButton: {
		  'margin': '0 0 1em 2em',
		  'color': '#002867'
	  }
	}));

export default function OSCALCatalogGroupControlGuidance(props) {
	const classes = useStyles();
	
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
	    setOpen(!open);
	};
    const handleClose = () => {
	    setOpen(false);
	};
	
	const descriptionElementRef = React.useRef(null);
	  React.useEffect(() => {
	    if (open) {
	      const { current: descriptionElement } = descriptionElementRef;
	      if (descriptionElement !== null) {
	        descriptionElement.focus();
	      }
	    }
	  }, [open]);
	
	return (
			<React.Fragment>
			<Button className={classes.OSCALCatalogGroupControlGuidanceButton} onClick={handleClick}>
				<HelpOutlineIcon/>
			</Button>
			<Dialog
		        open={open}
		        onClose={handleClose}
		        scroll="paper"
		        aria-labelledby="scroll-dialog-title"
		        aria-describedby="scroll-dialog-description"
		      >
				<DialogTitle id="scroll-dialog-title">Guidance</DialogTitle>
				<DialogContent dividers="true">
		          <DialogContentText
		            id="scroll-dialog-description"
		            ref={descriptionElementRef}
		            tabIndex={-1}
		          >
		          	{props.prose}
		          </DialogContentText>
		          </DialogContent>
		          <DialogActions>
		            <Button onClick={handleClose} color="primary">
		              Close
		            </Button>
		          </DialogActions>
		      </Dialog>
		      </React.Fragment>
		  );
	
}