import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column'
    },
    OSCALResponsibleRolesSubDataHeader: {
        'text-transform': 'capitalize',
        'white-space': 'nowrap'
    },
}));

export default function OSCALResponsibleRoles(props) {
    const classes = useStyles();

    const getPartyName = (partyUuid) => {
		if (!props.parties) { return null; }
		var party;
		for (party of props.parties) {
			if (party.uuid === partyUuid) {
				return party.name;
			}
        }
		return null;
    }
        return (
            <TableContainer>
				<Table size="small">
					<TableBody>
						{props.responsibleRoles && Object.entries(props.responsibleRoles).map(([key, role], index) => (
							<TableRow key={key}>
								<TableCell className={classes.OSCALResponsibleRolesSubDataHeader} component="th" scope="row">
									{key}
								</TableCell>
								<TableCell align="right">
									{role.['party-uuids'] && role.['party-uuids'].map((partyUuid) => (
										getPartyName(partyUuid)	
									))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
        )
    }