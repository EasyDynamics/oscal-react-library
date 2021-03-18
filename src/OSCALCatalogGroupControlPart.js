import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import OSCALCatalogGroupControlGuidance from './OSCALCatalogGroupControlGuidance.js';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControlPart: {
		  'padding-left': '2em'
	  },
	  OSCALCatalogGroupControlStatement: {
		  'padding-left': '0em'
	  },
	  OSCALStatement: {},
	  OSCALStatementNotImplemented: {
		  'color': 'silver'
	  },
	  OSCALComponentParameterSetting: {
		  'backgroundColor': `${theme.palette.info.light}`,
		  'color': 'white',
		  'padding': '0.1em 0.5em',
		  'border-radius': '5px'
	  }
	}));

// TODO - This is probably 800-53 specific?
function getPartLabel(props) {
	if (!props) {return;}
	var property;
	for (property of props) {
		if (property.name === 'label') {
			return property.value;
		}
	}
}


/**
 * Gets the 'by-component' object for the give componentId within the given 
 * statementId from the given implReqStatements
 * 
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_by-component_h2}
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_implemented-requirement}
 */
function getStatementByComponent(implReqStatements, statementId, componentId) {
	let foundStatement;
	for (const [key, statement] of Object.entries(implReqStatements)) {
		// TODO Remove underscore replacement when OSCAL example content is fixed
		if (key === statementId || key === statementId.replace('_', '')) {
			foundStatement = statement;
		}
	}
	if (!foundStatement || !foundStatement.['by-components']) {return;}
	for (const [key, byComponent] of Object.entries(foundStatement.['by-components'])) {
		if (key === componentId) {
			return byComponent;
		}
	}
}

/**
 * Replaces the parameter placeholders in the given prose with the given label
 * 
 * TODO - This is probably 800-53 specific?
 */
function ReplacedProseWithParameterLabel(props) {
	if (!props.prose) { return null; }
	let replacedProse;
	if (!props.parameters) {
		replacedProse = props.prose;
	} else {
		function getParameterLabel(parameterId) {
			// trim
			parameterId = parameterId.substring(3, parameterId.length-3);
			const parameter = props.parameters.find(parameter => parameter.id === parameterId);
			if (!parameter) {return;}
			// TODO parse select parameters
			return '< ' + parameter.label + ' >';
		}
		replacedProse = props.prose.replace(/\{\{ (.*) \}\}/, getParameterLabel);
	}
	return (
		<Typography className={props.className}>
			{props.label} {replacedProse}
		</Typography>
	);
}

/**
 * Replaces the parameter placeholders in the given prose with the values 
 * from the 'by-component' within the given statementId that matches the given componentId
 * from the given implReqStatements
 * 
 * TODO - This is probably 800-53 specific?
 */
function ReplacedProseWithByComponentParameterValue(props) {
	if (!props.prose) {return;}
	const statementByComponent = getStatementByComponent(props.implReqStatements, props.statementId, props.componentId);
	if (!statementByComponent) {
		return <ReplacedProseWithParameterLabel label={props.label} prose={props.prose} 
			parameters={props.parameters} className={props.unimplementedStatementClassName} />;
	}
	function getParameterValue(parameterId) {
		// trim
		parameterId = parameterId.substring(3, parameterId.length-3);
		let foundParameterSetting;
		for (const [key, parameterSetting] of Object.entries(statementByComponent.['parameter-settings'])) {
			if (key === parameterId) {
				foundParameterSetting = parameterSetting;
			}
		}
		if (!foundParameterSetting || !foundParameterSetting.values) {return;}
		// TODO parse select parameters
		return '<span class="' + props.componentParameterSettingClassname + '" >' + foundParameterSetting.values.toString() + '</span>';
	}
	const replacedProse = props.prose.replace(/\{\{ (.*) \}\}/, getParameterValue);
	const description = statementByComponent.description;
	// TODO dangerouslySetInnerHTML is not safe, there are other alternatives
	return (
		<Typography>
			<Tooltip title={
				<Typography variant="body2">{description}</Typography>
			}><Link href={''}>{props.label}</Link></Tooltip>
			{'\u00A0'}
			<span dangerouslySetInnerHTML={{ __html: (replacedProse) }} />
		</Typography>
	);
}

export default function OSCALCatalogGroupControlPart(props) {
	const classes = useStyles();
	
	// Don't display assessment if we're displaying a control implementation
	if (props.implReqStatements && (props.part.name === 'objective' || props.part.name === 'assessment')) {
		return null;
	}

	if (props.part.name === 'guidance') {
		return <OSCALCatalogGroupControlGuidance prose={props.part.prose} />;
	}

	const isStatement = props.part.name === 'statement';
	const label = getPartLabel(props.part.props);

	let replacedProse;
	if (props.implReqStatements) {
		replacedProse = <ReplacedProseWithByComponentParameterValue label={label} prose={props.part.prose} parameters={props.parameters}
			implReqStatements={props.implReqStatements} statementId={props.part.id} componentId={props.componentId}
			unimplementedStatementClassName={classes.OSCALStatementNotImplemented}
			componentParameterSettingClassname={classes.OSCALComponentParameterSetting} />;
	} else {
		replacedProse = <ReplacedProseWithParameterLabel label={label} prose={props.part.prose} parameters={props.parameters} />;
	}

	let className;
	if (isStatement) {
		className = classes.OSCALCatalogGroupControlStatement;
	} else {
		className = classes.OSCALCatalogGroupControlPart;
	}
	return (
		  <div className={className}>
			{replacedProse}
	        {props.part.parts && props.part.parts.map(part => (
	          <OSCALCatalogGroupControlPart part={part} parameters={props.parameters} implReqStatements={props.implReqStatements} componentId={props.componentId} key={part.id} />
            ))}
	      </div>
	  );
	
}
