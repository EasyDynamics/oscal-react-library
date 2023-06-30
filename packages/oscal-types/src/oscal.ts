// To parse this data:
//
//   import { Convert, Oscal } from "./file";
//
//   const oscal = Convert.toOscal(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Oscal {
    readonly $schema?: string;
    readonly catalog?: Catalog;
    readonly profile?: Profile;
    readonly 'component-definition'?: ComponentDefinition;
    readonly 'system-security-plan'?: SystemSecurityPlanSSP;
    readonly 'assessment-plan'?: SecurityAssessmentPlanSAP;
    readonly 'assessment-results'?: SecurityAssessmentResultsSAR;
    readonly 'plan-of-action-and-milestones'?: PlanOfActionAndMilestonesPOAM;
}

/**
 * An assessment plan, such as those provided by a FedRAMP assessor.
 */
export interface SecurityAssessmentPlanSAP {
    readonly 'assessment-assets'?: AssessmentAssets;
    readonly 'assessment-subjects'?: SubjectOfAssessment[];
    readonly 'back-matter'?: BackMatter;
    readonly 'import-ssp': ImportSystemSecurityPlan;
    /**
     * Used to define data objects that are used in the assessment plan, that do not appear in
     * the referenced SSP.
     */
    readonly 'local-definitions'?: AssessmentPlanLocalDefinitions;
    readonly metadata: PublicationMetadata;
    readonly 'reviewed-controls': ReviewedControlsAndControlObjectives;
    readonly tasks?: Task[];
    /**
     * Used to define various terms and conditions under which an assessment, described by the
     * plan, can be performed. Each child part defines a different type of term or condition.
     */
    readonly 'terms-and-conditions'?: AssessmentPlanTermsAndConditions;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this assessment plan in this or other OSCAL instances. The locally defined
     * UUID of the assessment plan can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * Identifies the assets used to perform this assessment, such as the assessment team,
 * scanning tools, and assumptions.
 */
export interface AssessmentAssets {
    readonly 'assessment-platforms': AssessmentPlatform[];
    readonly components?: AssessmentAssetsComponent[];
}

/**
 * Used to represent the toolset used to perform aspects of the assessment.
 */
export interface AssessmentPlatform {
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * The title or name for the assessment platform.
     */
    readonly title?: string;
    readonly 'uses-components'?: UsesComponent[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this assessment platform elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the assessment platform can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * A reference to a local or remote resource
 */
export interface Link {
    /**
     * A resolvable URL reference to a resource.
     */
    readonly href: string;
    /**
     * Specifies a media type as defined by the Internet Assigned Numbers Authority (IANA) Media
     * Types Registry.
     */
    readonly 'media-type'?: string;
    /**
     * Describes the type of relationship provided by the link. This can be an indicator of the
     * link's purpose.
     */
    readonly rel?: string;
    /**
     * A textual label to associate with the link, which may be used for presentation in a tool.
     */
    readonly text?: string;
}

/**
 * An attribute, characteristic, or quality of the containing object expressed as a
 * namespace qualified name/value pair. The value of a property is a simple scalar value,
 * which may be expressed as a list of values.
 */
export interface Property {
    /**
     * A textual label that provides a sub-type or characterization of the property's name. This
     * can be used to further distinguish or discriminate between the semantics of multiple
     * properties of the same object with the same name and ns.
     */
    readonly class?: string;
    /**
     * A textual label that uniquely identifies a specific attribute, characteristic, or quality
     * of the property's containing object.
     */
    readonly name: string;
    /**
     * A namespace qualifying the property's name. This allows different organizations to
     * associate distinct semantics with the same name.
     */
    readonly ns?: string;
    readonly remarks?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this defined property elsewhere in this or other OSCAL instances. This UUID
     * should be assigned per-subject, which means it should be consistently used to identify
     * the same subject across revisions of the document.
     */
    readonly uuid?: string;
    /**
     * Indicates the value of the attribute, characteristic, or quality.
     */
    readonly value: string;
}

/**
 * The set of components that are used by the assessment platform.
 */
export interface UsesComponent {
    /**
     * A machine-oriented identifier reference to a component that is implemented as part of an
     * inventory item.
     */
    readonly 'component-uuid': string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
}

/**
 * A reference to a set of organizations or persons that have responsibility for performing
 * a referenced role in the context of the containing object.
 */
export interface ResponsibleParty {
    readonly links?: Link[];
    readonly 'party-uuids': string[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A human-oriented identifier reference to roles served by the user.
     */
    readonly 'role-id': string;
}

/**
 * A defined component that can be part of an implemented system.
 */
export interface AssessmentAssetsComponent {
    /**
     * A description of the component, including information about its function.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly protocols?: ServiceProtocolInformation[];
    /**
     * A summary of the technological or business purpose of the component.
     */
    readonly purpose?: string;
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * Describes the operational status of the system component.
     */
    readonly status: ComponentStatus;
    /**
     * A human readable name for the system component.
     */
    readonly title: string;
    /**
     * A category describing the purpose of the component.
     */
    readonly type: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this component elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the component can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * Information about the protocol used to provide a service.
 */
export interface ServiceProtocolInformation {
    /**
     * The common name of the protocol, which should be the appropriate "service name" from the
     * IANA Service Name and Transport Protocol Port Number Registry.
     */
    readonly name: string;
    readonly 'port-ranges'?: PortRange[];
    /**
     * A human readable name for the protocol (e.g., Transport Layer Security).
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this service protocol information elsewhere in this or other OSCAL
     * instances. The locally defined UUID of the service protocol can be used to reference the
     * data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly uuid?: string;
}

/**
 * Where applicable this is the IPv4 port range on which the service operates.
 */
export interface PortRange {
    /**
     * Indicates the ending port number in a port range
     */
    readonly end?: number;
    /**
     * Indicates the starting port number in a port range
     */
    readonly start?: number;
    /**
     * Indicates the transport type.
     */
    readonly transport?: Transport;
}

export enum Transport {
    TCP = 'TCP',
    UDP = 'UDP',
}

/**
 * A reference to one or more roles with responsibility for performing a function relative
 * to the containing object.
 */
export interface ResponsibleRole {
    readonly links?: Link[];
    readonly 'party-uuids'?: string[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A human-oriented identifier reference to roles responsible for the business function.
     */
    readonly 'role-id': string;
}

/**
 * Describes the operational status of the system component.
 */
export interface ComponentStatus {
    readonly remarks?: string;
    /**
     * The operational status.
     */
    readonly state: PurpleState;
}

export enum PurpleState {
    DISPOSITION = 'disposition',
    OPERATIONAL = 'operational',
    OTHER = 'other',
    UNDER_DEVELOPMENT = 'under-development',
}

/**
 * Identifies system elements being assessed, such as components, inventory items, and
 * locations. In the assessment plan, this identifies a planned assessment subject. In the
 * assessment results this is an actual assessment subject, and reflects any changes from
 * the plan. exactly what will be the focus of this assessment. Any subjects not identified
 * in this way are out-of-scope.
 */
export interface SubjectOfAssessment {
    /**
     * A human-readable description of the collection of subjects being included in this
     * assessment.
     */
    readonly description?: string;
    readonly 'exclude-subjects'?: SelectAssessmentSubject[];
    readonly 'include-all'?: IncludeAll;
    readonly 'include-subjects'?: SelectAssessmentSubject[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * Indicates the type of assessment subject, such as a component, inventory, item, location,
     * or party represented by this selection statement.
     */
    readonly type: string;
}

/**
 * Identifies a set of assessment subjects to include/exclude by UUID.
 */
export interface SelectAssessmentSubject {
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A machine-oriented identifier reference to a component, inventory-item, location, party,
     * user, or resource using it's UUID.
     */
    readonly 'subject-uuid': string;
    /**
     * Used to indicate the type of object pointed to by the uuid-ref within a subject.
     */
    readonly type: string;
}

/**
 * Include all controls from the imported catalog or profile resources.
 */
export interface IncludeAll {
}

/**
 * A collection of resources, which may be included directly or by reference.
 */
export interface BackMatter {
    readonly resources?: Resource[];
}

/**
 * A resource associated with content in the containing document. A resource may be directly
 * included in the document base64 encoded or may point to one or more equivalent internet
 * resources.
 */
export interface Resource {
    /**
     * The Base64 alphabet in RFC 2045 - aligned with XSD.
     */
    readonly base64?: Base64;
    /**
     * A citation consisting of end note text and optional structured bibliographic data.
     */
    readonly citation?: Citation;
    /**
     * A short summary of the resource used to indicate the purpose of the resource.
     */
    readonly description?: string;
    readonly 'document-ids'?: DocumentIdentifier[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly rlinks?: ResourceLink[];
    /**
     * A name given to the resource, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this defined resource elsewhere in this or other OSCAL instances. This UUID
     * should be assigned per-subject, which means it should be consistently used to identify
     * the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * The Base64 alphabet in RFC 2045 - aligned with XSD.
 */
export interface Base64 {
    /**
     * Name of the file before it was encoded as Base64 to be embedded in a resource. This is
     * the name that will be assigned to the file when the file is decoded.
     */
    readonly filename?: string;
    /**
     * Specifies a media type as defined by the Internet Assigned Numbers Authority (IANA) Media
     * Types Registry.
     */
    readonly 'media-type'?: string;
    readonly value: string;
}

/**
 * A citation consisting of end note text and optional structured bibliographic data.
 */
export interface Citation {
    readonly links?: Link[];
    readonly props?: Property[];
    /**
     * A line of citation text.
     */
    readonly text: string;
}

/**
 * A document identifier qualified by an identifier scheme. A document identifier provides a
 * globally unique identifier with a cross-instance scope that is used for a group of
 * documents that are to be treated as different versions of the same document. If this
 * element does not appear, or if the value of this element is empty, the value of
 * "document-id" is equal to the value of the "uuid" flag of the top-level root element.
 */
export interface DocumentIdentifier {
    readonly identifier: string;
    /**
     * Qualifies the kind of document identifier using a URI. If the scheme is not provided the
     * value of the element will be interpreted as a string of characters.
     */
    readonly scheme?: string;
}

/**
 * A pointer to an external resource with an optional hash for verification and change
 * detection.
 */
export interface ResourceLink {
    readonly hashes?: Hash[];
    /**
     * A resolvable URI reference to a resource.
     */
    readonly href: string;
    /**
     * Specifies a media type as defined by the Internet Assigned Numbers Authority (IANA) Media
     * Types Registry.
     */
    readonly 'media-type'?: string;
}

/**
 * A representation of a cryptographic digest generated over a resource using a specified
 * hash algorithm.
 */
export interface Hash {
    /**
     * Method by which a hash is derived
     */
    readonly algorithm: string;
    readonly value: string;
}

/**
 * Used by the assessment plan and POA&M to import information about the system.
 */
export interface ImportSystemSecurityPlan {
    /**
     * A resolvable URL reference to the system security plan for the system being assessed.
     */
    readonly href: string;
    readonly remarks?: string;
}

/**
 * Used to define data objects that are used in the assessment plan, that do not appear in
 * the referenced SSP.
 */
export interface AssessmentPlanLocalDefinitions {
    readonly activities?: Activity[];
    readonly components?: AssessmentAssetsComponent[];
    readonly 'inventory-items'?: InventoryItem[];
    readonly 'objectives-and-methods'?: AssessmentSpecificControlObjective[];
    readonly remarks?: string;
    readonly users?: SystemUser[];
}

/**
 * Identifies an assessment or related process that can be performed. In the assessment
 * plan, this is an intended activity which may be associated with an assessment task. In
 * the assessment results, this an activity that was actually performed as part of an
 * assessment.
 */
export interface Activity {
    /**
     * A human-readable description of this included activity.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly 'related-controls'?: ReviewedControlsAndControlObjectives;
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly steps?: Step[];
    /**
     * The title for this included activity.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this assessment activity elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the activity can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies the controls being assessed and their control objectives.
 */
export interface ReviewedControlsAndControlObjectives {
    readonly 'control-objective-selections'?: ReferencedControlObjectives[];
    readonly 'control-selections': AssessedControls[];
    /**
     * A human-readable description of control objectives.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * Identifies the control objectives of the assessment. In the assessment plan, these are
 * the planned objectives. In the assessment results, these are the assessed objectives, and
 * reflects any changes from the plan.
 */
export interface ReferencedControlObjectives {
    /**
     * A human-readable description of this collection of control objectives.
     */
    readonly description?: string;
    readonly 'exclude-objectives'?: SelectObjective[];
    readonly 'include-all'?: IncludeAll;
    readonly 'include-objectives'?: SelectObjective[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * Used to select a control objective for inclusion/exclusion based on the control
 * objective's identifier.
 */
export interface SelectObjective {
    /**
     * Points to an assessment objective.
     */
    readonly 'objective-id': string;
}

/**
 * Identifies the controls being assessed. In the assessment plan, these are the planned
 * controls. In the assessment results, these are the actual controls, and reflects any
 * changes from the plan.
 */
export interface AssessedControls {
    /**
     * A human-readable description of in-scope controls specified for assessment.
     */
    readonly description?: string;
    readonly 'exclude-controls'?: SelectControl[];
    readonly 'include-all'?: IncludeAll;
    readonly 'include-controls'?: SelectControl[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * Used to select a control for inclusion/exclusion based on one or more control
 * identifiers. A set of statement identifiers can be used to target the inclusion/exclusion
 * to only specific control statements providing more granularity over the specific
 * statements that are within the asessment scope.
 */
export interface SelectControl {
    /**
     * A human-oriented identifier reference to a control with a corresponding id value. When
     * referencing an externally defined control, the Control Identifier Reference must be used
     * in the context of the external / imported OSCAL instance (e.g., uri-reference).
     */
    readonly 'control-id': string;
    readonly 'statement-ids'?: string[];
}

/**
 * Identifies an individual step in a series of steps related to an activity, such as an
 * assessment test or examination procedure.
 */
export interface Step {
    /**
     * A human-readable description of this step.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly 'reviewed-controls'?: ReviewedControlsAndControlObjectives;
    /**
     * The title for this step.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this step elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the step (in a series of steps) can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * A single managed inventory item within the system.
 */
export interface InventoryItem {
    /**
     * A summary of the inventory item stating its purpose within the system.
     */
    readonly description: string;
    readonly 'implemented-components'?: ImplementedComponent[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this inventory item elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the inventory item can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * The set of components that are implemented in a given system inventory item.
 */
export interface ImplementedComponent {
    /**
     * A machine-oriented identifier reference to a component that is implemented as part of an
     * inventory item.
     */
    readonly 'component-uuid': string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
}

/**
 * A local definition of a control objective for this assessment. Uses catalog syntax for
 * control objective and assessment actions.
 */
export interface AssessmentSpecificControlObjective {
    /**
     * A human-oriented identifier reference to a control with a corresponding id value. When
     * referencing an externally defined control, the Control Identifier Reference must be used
     * in the context of the external / imported OSCAL instance (e.g., uri-reference).
     */
    readonly 'control-id': string;
    /**
     * A human-readable description of this control objective.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly parts: Part[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * A partition of a control's definition or a child of another part.
 */
export interface Part {
    /**
     * A textual label that provides a sub-type or characterization of the part's name. This can
     * be used to further distinguish or discriminate between the semantics of multiple parts of
     * the same control with the same name and ns.
     */
    readonly class?: string;
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined part elsewhere in this or other OSCAL instances. When referenced
     * from another OSCAL instance, this identifier must be referenced in the context of the
     * containing resource (e.g., import-profile). This id should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly id?: string;
    readonly links?: Link[];
    /**
     * A textual label that uniquely identifies the part's semantic type.
     */
    readonly name: string;
    /**
     * A namespace qualifying the part's name. This allows different organizations to associate
     * distinct semantics with the same name.
     */
    readonly ns?: string;
    readonly parts?: Part[];
    readonly props?: Property[];
    /**
     * Permits multiple paragraphs, lists, tables etc.
     */
    readonly prose?: string;
    /**
     * A name given to the part, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
}

/**
 * A type of user that interacts with the system based on an associated role.
 */
export interface SystemUser {
    readonly 'authorized-privileges'?: Privilege[];
    /**
     * A summary of the user's purpose within the system.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'role-ids'?: string[];
    /**
     * A short common name, abbreviation, or acronym for the user.
     */
    readonly 'short-name'?: string;
    /**
     * A name given to the user, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this user class elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the system user can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies a specific system privilege held by the user, along with an associated
 * description and/or rationale for the privilege.
 */
export interface Privilege {
    /**
     * A summary of the privilege's purpose within the system.
     */
    readonly description?: string;
    readonly 'functions-performed': string[];
    /**
     * A human readable name for the privilege.
     */
    readonly title: string;
}

/**
 * Provides information about the publication and availability of the containing document.
 */
export interface PublicationMetadata {
    readonly 'document-ids'?: DocumentIdentifier[];
    readonly 'last-modified': Date;
    readonly links?: Link[];
    readonly locations?: Location[];
    readonly 'oscal-version': string;
    readonly parties?: PartyOrganizationOrPerson[];
    readonly props?: Property[];
    readonly published?: Date;
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
    readonly revisions?: RevisionHistoryEntry[];
    readonly roles?: Role[];
    /**
     * A name given to the document, which may be used by a tool for display and navigation.
     */
    readonly title: string;
    readonly version: string;
}

/**
 * A location, with associated metadata that can be referenced.
 */
export interface Location {
    readonly address: Address;
    readonly 'email-addresses'?: string[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'telephone-numbers'?: TelephoneNumber[];
    /**
     * A name given to the location, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
    readonly urls?: string[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this defined location elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the location can be used to reference the data item locally or
     * globally (e.g., from an importing OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * A postal address for the location.
 */
export interface Address {
    readonly 'addr-lines'?: string[];
    /**
     * City, town or geographical region for the mailing address.
     */
    readonly city?: string;
    /**
     * The ISO 3166-1 alpha-2 country code for the mailing address.
     */
    readonly country?: string;
    /**
     * Postal or ZIP code for mailing address
     */
    readonly 'postal-code'?: string;
    /**
     * State, province or analogous geographical region for mailing address
     */
    readonly state?: string;
    /**
     * Indicates the type of address.
     */
    readonly type?: string;
}

/**
 * Contact number by telephone.
 */
export interface TelephoneNumber {
    readonly number: string;
    /**
     * Indicates the type of phone number.
     */
    readonly type?: string;
}

/**
 * A responsible entity which is either a person or an organization.
 */
export interface PartyOrganizationOrPerson {
    readonly addresses?: Address[];
    readonly 'email-addresses'?: string[];
    readonly 'external-ids'?: PartyExternalIdentifier[];
    readonly links?: Link[];
    readonly 'location-uuids'?: string[];
    readonly 'member-of-organizations'?: string[];
    /**
     * The full name of the party. This is typically the legal name associated with the party.
     */
    readonly name?: string;
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A short common name, abbreviation, or acronym for the party.
     */
    readonly 'short-name'?: string;
    readonly 'telephone-numbers'?: TelephoneNumber[];
    /**
     * A category describing the kind of party the object describes.
     */
    readonly type: PartyType;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this defined party elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the party can be used to reference the data item locally or globally
     * (e.g., from an importing OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * An identifier for a person or organization using a designated scheme. e.g. an Open
 * Researcher and Contributor ID (ORCID)
 */
export interface PartyExternalIdentifier {
    readonly id: string;
    /**
     * Indicates the type of external identifier.
     */
    readonly scheme: string;
}

export enum PartyType {
    ORGANIZATION = 'organization',
    PERSON = 'person',
}

/**
 * An entry in a sequential list of revisions to the containing document in reverse
 * chronological order (i.e., most recent previous revision first).
 */
export interface RevisionHistoryEntry {
    readonly 'last-modified'?: Date;
    readonly links?: Link[];
    readonly 'oscal-version'?: string;
    readonly props?: Property[];
    readonly published?: Date;
    readonly remarks?: string;
    /**
     * A name given to the document revision, which may be used by a tool for display and
     * navigation.
     */
    readonly title?: string;
    readonly version: string;
}

/**
 * Defines a function assumed or expected to be assumed by a party in a specific situation.
 */
export interface Role {
    /**
     * A summary of the role's purpose and associated responsibilities.
     */
    readonly description?: string;
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined role elsewhere in this or other OSCAL instances. When referenced
     * from another OSCAL instance, the locally defined ID of the Role from the imported OSCAL
     * instance must be referenced in the context of the containing resource (e.g., import,
     * import-component-definition, import-profile, import-ssp or import-ap). This ID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly id: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A short common name, abbreviation, or acronym for the role.
     */
    readonly 'short-name'?: string;
    /**
     * A name given to the role, which may be used by a tool for display and navigation.
     */
    readonly title: string;
}

/**
 * Represents a scheduled event or milestone, which may be associated with a series of
 * assessment actions.
 */
export interface Task {
    readonly 'associated-activities'?: AssociatedActivity[];
    readonly dependencies?: TaskDependency[];
    /**
     * A human-readable description of this task.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly subjects?: SubjectOfAssessment[];
    readonly tasks?: Task[];
    /**
     * The timing under which the task is intended to occur.
     */
    readonly timing?: EventTiming;
    /**
     * The title for this task.
     */
    readonly title: string;
    /**
     * The type of task.
     */
    readonly type: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this task elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the task can be used to reference the data item locally or globally (e.g., in an
     * imported OSCAL instance). This UUID should be assigned per-subject, which means it should
     * be consistently used to identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies an individual activity to be performed as part of a task.
 */
export interface AssociatedActivity {
    /**
     * A machine-oriented identifier reference to an activity defined in the list of activities.
     */
    readonly 'activity-uuid': string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly subjects: SubjectOfAssessment[];
}

/**
 * Used to indicate that a task is dependent on another task.
 */
export interface TaskDependency {
    readonly remarks?: string;
    /**
     * A machine-oriented identifier reference to a unique task.
     */
    readonly 'task-uuid': string;
}

/**
 * The timing under which the task is intended to occur.
 */
export interface EventTiming {
    /**
     * The task is intended to occur at the specified frequency.
     */
    readonly 'at-frequency'?: FrequencyCondition;
    /**
     * The task is intended to occur on the specified date.
     */
    readonly 'on-date'?: OnDateCondition;
    /**
     * The task is intended to occur within the specified date range.
     */
    readonly 'within-date-range'?: OnDateRangeCondition;
}

/**
 * The task is intended to occur at the specified frequency.
 */
export interface FrequencyCondition {
    /**
     * The task must occur after the specified period has elapsed.
     */
    readonly period: number;
    /**
     * The unit of time for the period.
     */
    readonly unit: TimeUnit;
}

export enum TimeUnit {
    DAYS = 'days',
    HOURS = 'hours',
    MINUTES = 'minutes',
    MONTHS = 'months',
    SECONDS = 'seconds',
    YEARS = 'years',
}

/**
 * The task is intended to occur on the specified date.
 */
export interface OnDateCondition {
    /**
     * The task must occur on the specified date.
     */
    readonly date: Date;
}

/**
 * The task is intended to occur within the specified date range.
 */
export interface OnDateRangeCondition {
    /**
     * The task must occur on or before the specified date.
     */
    readonly end: Date;
    /**
     * The task must occur on or after the specified date.
     */
    readonly start: Date;
}

/**
 * Used to define various terms and conditions under which an assessment, described by the
 * plan, can be performed. Each child part defines a different type of term or condition.
 */
export interface AssessmentPlanTermsAndConditions {
    readonly parts?: AssessmentPart[];
}

/**
 * A partition of an assessment plan or results or a child of another part.
 */
export interface AssessmentPart {
    /**
     * A textual label that provides a sub-type or characterization of the part's name. This can
     * be used to further distinguish or discriminate between the semantics of multiple parts of
     * the same control with the same name and ns.
     */
    readonly class?: string;
    readonly links?: Link[];
    /**
     * A textual label that uniquely identifies the part's semantic type.
     */
    readonly name: string;
    /**
     * A namespace qualifying the part's name. This allows different organizations to associate
     * distinct semantics with the same name.
     */
    readonly ns?: string;
    readonly parts?: AssessmentPart[];
    readonly props?: Property[];
    /**
     * Permits multiple paragraphs, lists, tables etc.
     */
    readonly prose?: string;
    /**
     * A name given to the part, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this part elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the part can be used to reference the data item locally or globally (e.g., in an
     * ported OSCAL instance). This UUID should be assigned per-subject, which means it should
     * be consistently used to identify the same subject across revisions of the document.
     */
    readonly uuid?: string;
}

/**
 * Security assessment results, such as those provided by a FedRAMP assessor in the FedRAMP
 * Security Assessment Report.
 */
export interface SecurityAssessmentResultsSAR {
    readonly 'back-matter'?: BackMatter;
    readonly 'import-ap': ImportAssessmentPlan;
    /**
     * Used to define data objects that are used in the assessment plan, that do not appear in
     * the referenced SSP.
     */
    readonly 'local-definitions'?: AssessmentResultsLocalDefinitions;
    readonly metadata: PublicationMetadata;
    readonly results: AssessmentResult[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this assessment results instance in this or other OSCAL instances. The
     * locally defined UUID of the assessment result can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Used by assessment-results to import information about the original plan for assessing
 * the system.
 */
export interface ImportAssessmentPlan {
    /**
     * A resolvable URL reference to the assessment plan governing the assessment activities.
     */
    readonly href: string;
    readonly remarks?: string;
}

/**
 * Used to define data objects that are used in the assessment plan, that do not appear in
 * the referenced SSP.
 */
export interface AssessmentResultsLocalDefinitions {
    readonly activities?: Activity[];
    readonly 'objectives-and-methods'?: AssessmentSpecificControlObjective[];
    readonly remarks?: string;
}

/**
 * Used by the assessment results and POA&M. In the assessment results, this identifies all
 * of the assessment observations and findings, initial and residual risks, deviations, and
 * disposition. In the POA&M, this identifies initial and residual risks, deviations, and
 * disposition.
 */
export interface AssessmentResult {
    /**
     * A log of all assessment-related actions taken.
     */
    readonly 'assessment-log'?: AssessmentLog;
    readonly attestations?: AttestationStatements[];
    /**
     * A human-readable description of this set of test results.
     */
    readonly description: string;
    /**
     * Date/time stamp identifying the end of the evidence collection reflected in these
     * results. In a continuous motoring scenario, this may contain the same value as start if
     * appropriate.
     */
    readonly end?: Date;
    readonly findings?: Finding[];
    readonly links?: Link[];
    /**
     * Used to define data objects that are used in the assessment plan, that do not appear in
     * the referenced SSP.
     */
    readonly 'local-definitions'?: ResultLocalDefinitions;
    readonly observations?: Observation[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'reviewed-controls': ReviewedControlsAndControlObjectives;
    readonly risks?: IdentifiedRisk[];
    /**
     * Date/time stamp identifying the start of the evidence collection reflected in these
     * results.
     */
    readonly start: Date;
    /**
     * The title for this set of results.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this set of results in this or other OSCAL instances. The locally defined
     * UUID of the assessment result can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * A log of all assessment-related actions taken.
 */
export interface AssessmentLog {
    readonly entries: AssessmentLogEntry[];
}

/**
 * Identifies the result of an action and/or task that occurred as part of executing an
 * assessment plan or an assessment event that occurred in producing the assessment results.
 */
export interface AssessmentLogEntry {
    /**
     * A human-readable description of this event.
     */
    readonly description?: string;
    /**
     * Identifies the end date and time of an event. If the event is a point in time, the start
     * and end will be the same date and time.
     */
    readonly end?: Date;
    readonly links?: Link[];
    readonly 'logged-by'?: LoggedBy[];
    readonly props?: Property[];
    readonly 'related-tasks'?: TaskReference[];
    readonly remarks?: string;
    /**
     * Identifies the start date and time of an event.
     */
    readonly start: Date;
    /**
     * The title for this event.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference an assessment event in this or other OSCAL instances. The locally defined
     * UUID of the assessment log entry can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Used to indicate who created a log entry in what role.
 */
export interface LoggedBy {
    /**
     * A machine-oriented identifier reference to the party who is making the log entry.
     */
    readonly 'party-uuid': string;
    /**
     * A point to the role-id of the role in which the party is making the log entry.
     */
    readonly 'role-id'?: string;
}

/**
 * Identifies an individual task for which the containing object is a consequence of.
 */
export interface TaskReference {
    /**
     * Used to detail assessment subjects that were identfied by this task.
     */
    readonly 'identified-subject'?: IdentifiedSubject;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
    readonly subjects?: SubjectOfAssessment[];
    /**
     * A machine-oriented identifier reference to a unique task.
     */
    readonly 'task-uuid': string;
}

/**
 * Used to detail assessment subjects that were identfied by this task.
 */
export interface IdentifiedSubject {
    /**
     * A machine-oriented identifier reference to a unique assessment subject placeholder
     * defined by this task.
     */
    readonly 'subject-placeholder-uuid': string;
    readonly subjects: SubjectOfAssessment[];
}

/**
 * A set of textual statements, typically written by the assessor.
 */
export interface AttestationStatements {
    readonly parts: AssessmentPart[];
    readonly 'responsible-parties'?: ResponsibleParty[];
}

/**
 * Describes an individual finding.
 */
export interface Finding {
    /**
     * A human-readable description of this finding.
     */
    readonly description: string;
    /**
     * A machine-oriented identifier reference to the implementation statement in the SSP to
     * which this finding is related.
     */
    readonly 'implementation-statement-uuid'?: string;
    readonly links?: Link[];
    readonly origins?: FindingOrigin[];
    readonly props?: Property[];
    readonly 'related-observations'?: FindingRelatedObservation[];
    readonly 'related-risks'?: FindingRelatedRisk[];
    readonly remarks?: string;
    readonly target: TargetClass;
    /**
     * The title for this finding.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this finding in this or other OSCAL instances. The locally defined UUID of
     * the finding can be used to reference the data item locally or globally (e.g., in an
     * imported OSCAL instance). This UUID should be assigned per-subject, which means it should
     * be consistently used to identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies the source of the finding, such as a tool, interviewed person, or activity.
 */
export interface FindingOrigin {
    readonly actors: OriginatingActor[];
    readonly 'related-tasks'?: TaskReference[];
}

/**
 * The actor that produces an observation, a finding, or a risk. One or more actor type can
 * be used to specify a person that is using a tool.
 */
export interface OriginatingActor {
    /**
     * A machine-oriented identifier reference to the tool or person based on the associated
     * type.
     */
    readonly 'actor-uuid': string;
    readonly links?: Link[];
    readonly props?: Property[];
    /**
     * For a party, this can optionally be used to specify the role the actor was performing.
     */
    readonly 'role-id'?: string;
    /**
     * The kind of actor.
     */
    readonly type: ActorType;
}

export enum ActorType {
    ASSESSMENT_PLATFORM = 'assessment-platform',
    PARTY = 'party',
    TOOL = 'tool',
}

/**
 * Relates the finding to a set of referenced observations that were used to determine the
 * finding.
 */
export interface FindingRelatedObservation {
    /**
     * A machine-oriented identifier reference to an observation defined in the list of
     * observations.
     */
    readonly 'observation-uuid': string;
}

/**
 * Relates the finding to a set of referenced risks that were used to determine the finding.
 */
export interface FindingRelatedRisk {
    /**
     * A machine-oriented identifier reference to a risk defined in the list of risks.
     */
    readonly 'risk-uuid': string;
}

/**
 * Captures an assessor's conclusions regarding the degree to which an objective is
 * satisfied.
 */
export interface TargetClass {
    /**
     * A human-readable description of the assessor's conclusions regarding the degree to which
     * an objective is satisfied.
     */
    readonly description?: string;
    readonly 'implementation-status'?: ImplementationStatus;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A determination of if the objective is satisfied or not within a given system.
     */
    readonly status: StatusClass;
    /**
     * A machine-oriented identifier reference for a specific target qualified by the type.
     */
    readonly 'target-id': string;
    /**
     * The title for this objective status.
     */
    readonly title?: string;
    /**
     * Identifies the type of the target.
     */
    readonly type: FindingTargetType;
}

/**
 * Indicates the degree to which the a given control is implemented.
 */
export interface ImplementationStatus {
    readonly remarks?: string;
    /**
     * Identifies the implementation status of the control or control objective.
     */
    readonly state: string;
}

/**
 * A determination of if the objective is satisfied or not within a given system.
 */
export interface StatusClass {
    /**
     * The reason the objective was given it's status.
     */
    readonly reason?: string;
    readonly remarks?: string;
    /**
     * An indication as to whether the objective is satisfied or not.
     */
    readonly state: ObjectiveStatusState;
}

export enum ObjectiveStatusState {
    NOT_SATISFIED = 'not-satisfied',
    SATISFIED = 'satisfied',
}

export enum FindingTargetType {
    OBJECTIVE_ID = 'objective-id',
    STATEMENT_ID = 'statement-id',
}

/**
 * Used to define data objects that are used in the assessment plan, that do not appear in
 * the referenced SSP.
 */
export interface ResultLocalDefinitions {
    readonly 'assessment-assets'?: AssessmentAssets;
    readonly components?: AssessmentAssetsComponent[];
    readonly 'inventory-items'?: InventoryItem[];
    readonly tasks?: Task[];
    readonly users?: SystemUser[];
}

/**
 * Describes an individual observation.
 */
export interface Observation {
    /**
     * Date/time stamp identifying when the finding information was collected.
     */
    readonly collected: Date;
    /**
     * A human-readable description of this assessment observation.
     */
    readonly description: string;
    /**
     * Date/time identifying when the finding information is out-of-date and no longer valid.
     * Typically used with continuous assessment scenarios.
     */
    readonly expires?: Date;
    readonly links?: Link[];
    readonly methods: string[];
    readonly origins?: FindingOrigin[];
    readonly props?: Property[];
    readonly 'relevant-evidence'?: RelevantEvidence[];
    readonly remarks?: string;
    readonly subjects?: IdentifiesTheSubject[];
    /**
     * The title for this observation.
     */
    readonly title?: string;
    readonly types?: string[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this observation elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the observation can be used to reference the data item locally or
     * globally (e.g., in an imorted OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Links this observation to relevant evidence.
 */
export interface RelevantEvidence {
    /**
     * A human-readable description of this evidence.
     */
    readonly description: string;
    /**
     * A resolvable URL reference to relevant evidence.
     */
    readonly href?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * A human-oriented identifier reference to a resource. Use type to indicate whether the
 * identified resource is a component, inventory item, location, user, or something else.
 */
export interface IdentifiesTheSubject {
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A machine-oriented identifier reference to a component, inventory-item, location, party,
     * user, or resource using it's UUID.
     */
    readonly 'subject-uuid': string;
    /**
     * The title or name for the referenced subject.
     */
    readonly title?: string;
    /**
     * Used to indicate the type of object pointed to by the uuid-ref within a subject.
     */
    readonly type: string;
}

/**
 * An identified risk.
 */
export interface IdentifiedRisk {
    readonly characterizations?: Characterization[];
    /**
     * The date/time by which the risk must be resolved.
     */
    readonly deadline?: Date;
    /**
     * A human-readable summary of the identified risk, to include a statement of how the risk
     * impacts the system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly 'mitigating-factors'?: MitigatingFactor[];
    readonly origins?: FindingOrigin[];
    readonly props?: Property[];
    readonly 'related-observations'?: RiskRelatedObservation[];
    readonly remediations?: RiskResponse[];
    /**
     * A log of all risk-related tasks taken.
     */
    readonly 'risk-log'?: RiskLog;
    /**
     * An summary of impact for how the risk affects the system.
     */
    readonly statement: string;
    readonly status: string;
    readonly 'threat-ids'?: ThreatID[];
    /**
     * The title for this risk.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this risk elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the risk can be used to reference the data item locally or globally (e.g., in an
     * imported OSCAL instance). This UUID should be assigned per-subject, which means it should
     * be consistently used to identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * A collection of descriptive data about the containing object from a specific origin.
 */
export interface Characterization {
    readonly facets: Facet[];
    readonly links?: Link[];
    readonly origin: FindingOrigin;
    readonly props?: Property[];
}

/**
 * An individual characteristic that is part of a larger set produced by the same actor.
 */
export interface Facet {
    readonly links?: Link[];
    /**
     * The name of the risk metric within the specified system.
     */
    readonly name: string;
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * Specifies the naming system under which this risk metric is organized, which allows for
     * the same names to be used in different systems controlled by different parties. This
     * avoids the potential of a name clash.
     */
    readonly system: string;
    /**
     * Indicates the value of the facet.
     */
    readonly value: string;
}

/**
 * Describes an existing mitigating factor that may affect the overall determination of the
 * risk, with an optional link to an implementation statement in the SSP.
 */
export interface MitigatingFactor {
    /**
     * A human-readable description of this mitigating factor.
     */
    readonly description: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this implementation statement elsewhere in this or other OSCAL instancess.
     * The locally defined UUID of the implementation statement can be used to reference the
     * data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly 'implementation-uuid'?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly subjects?: IdentifiesTheSubject[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this mitigating factor elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the mitigating factor can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Relates the finding to a set of referenced observations that were used to determine the
 * finding.
 */
export interface RiskRelatedObservation {
    /**
     * A machine-oriented identifier reference to an observation defined in the list of
     * observations.
     */
    readonly 'observation-uuid': string;
}

/**
 * Describes either recommended or an actual plan for addressing the risk.
 */
export interface RiskResponse {
    /**
     * A human-readable description of this response plan.
     */
    readonly description: string;
    /**
     * Identifies whether this is a recommendation, such as from an assessor or tool, or an
     * actual plan accepted by the system owner.
     */
    readonly lifecycle: string;
    readonly links?: Link[];
    readonly origins?: FindingOrigin[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'required-assets'?: RequiredAsset[];
    readonly tasks?: Task[];
    /**
     * The title for this response activity.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this remediation elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the risk response can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies an asset required to achieve remediation.
 */
export interface RequiredAsset {
    /**
     * A human-readable description of this required asset.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly subjects?: IdentifiesTheSubject[];
    /**
     * The title for this required asset.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this required asset elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the asset can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * A log of all risk-related tasks taken.
 */
export interface RiskLog {
    readonly entries: RiskLogEntry[];
}

/**
 * Identifies an individual risk response that occurred as part of managing an identified
 * risk.
 */
export interface RiskLogEntry {
    /**
     * A human-readable description of what was done regarding the risk.
     */
    readonly description?: string;
    /**
     * Identifies the end date and time of the event. If the event is a point in time, the start
     * and end will be the same date and time.
     */
    readonly end?: Date;
    readonly links?: Link[];
    readonly 'logged-by'?: LoggedBy[];
    readonly props?: Property[];
    readonly 'related-responses'?: RiskResponseReference[];
    readonly remarks?: string;
    /**
     * Identifies the start date and time of the event.
     */
    readonly start: Date;
    readonly 'status-change'?: string;
    /**
     * The title for this risk log entry.
     */
    readonly title?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this risk log entry elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the risk log entry can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies an individual risk response that this log entry is for.
 */
export interface RiskResponseReference {
    readonly links?: Link[];
    readonly props?: Property[];
    readonly 'related-tasks'?: TaskReference[];
    readonly remarks?: string;
    /**
     * A machine-oriented identifier reference to a unique risk response.
     */
    readonly 'response-uuid': string;
}

/**
 * A pointer, by ID, to an externally-defined threat.
 */
export interface ThreatID {
    /**
     * An optional location for the threat data, from which this ID originates.
     */
    readonly href?: string;
    readonly id: string;
    /**
     * Specifies the source of the threat information.
     */
    readonly system: string;
}

/**
 * A collection of controls.
 */
export interface Catalog {
    readonly 'back-matter'?: BackMatter;
    readonly controls?: Control[];
    readonly groups?: ControlGroup[];
    readonly metadata: PublicationMetadata;
    readonly params?: Parameter[];
    /**
     * A globally unique identifier with cross-instance scope for this catalog instance. This
     * UUID should be changed when this document is revised.
     */
    readonly uuid: string;
}

/**
 * A structured information object representing a security or privacy control. Each security
 * or privacy control within the Catalog is defined by a distinct control instance.
 */
export interface Control {
    /**
     * A textual label that provides a sub-type or characterization of the control.
     */
    readonly class?: string;
    readonly controls?: Control[];
    /**
     * A human-oriented, locally unique identifier with instance scope that can be used to
     * reference this control elsewhere in this and other OSCAL instances (e.g., profiles). This
     * id should be assigned per-subject, which means it should be consistently used to identify
     * the same control across revisions of the document.
     */
    readonly id: string;
    readonly links?: Link[];
    readonly params?: Parameter[];
    readonly parts?: Part[];
    readonly props?: Property[];
    /**
     * A name given to the control, which may be used by a tool for display and navigation.
     */
    readonly title: string;
}

/**
 * Parameters provide a mechanism for the dynamic assignment of value(s) in a control.
 */
export interface Parameter {
    /**
     * A textual label that provides a characterization of the parameter.
     */
    readonly class?: string;
    readonly constraints?: Constraint[];
    /**
     * **(deprecated)** Another parameter invoking this one. This construct has been deprecated
     * and should not be used.
     */
    readonly 'depends-on'?: string;
    readonly guidelines?: Guideline[];
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined parameter elsewhere in this or other OSCAL instances. When
     * referenced from another OSCAL instance, this identifier must be referenced in the context
     * of the containing resource (e.g., import-profile). This id should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly id: string;
    /**
     * A short, placeholder name for the parameter, which can be used as a substitute for a
     * value if no value is assigned.
     */
    readonly label?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly select?: Selection;
    /**
     * Describes the purpose and use of a parameter
     */
    readonly usage?: string;
    readonly values?: string[];
}

/**
 * A formal or informal expression of a constraint or test
 */
export interface Constraint {
    /**
     * A textual summary of the constraint to be applied.
     */
    readonly description?: string;
    readonly tests?: ConstraintTest[];
}

/**
 * A test expression which is expected to be evaluated by a tool.
 */
export interface ConstraintTest {
    /**
     * A formal (executable) expression of a constraint
     */
    readonly expression: string;
    readonly remarks?: string;
}

/**
 * A prose statement that provides a recommendation for the use of a parameter.
 */
export interface Guideline {
    /**
     * Prose permits multiple paragraphs, lists, tables etc.
     */
    readonly prose: string;
}

/**
 * Presenting a choice among alternatives
 */
export interface Selection {
    readonly choice?: string[];
    /**
     * Describes the number of selections that must occur. Without this setting, only one value
     * should be assumed to be permitted.
     */
    readonly 'how-many'?: ParameterCardinality;
}

export enum ParameterCardinality {
    ONE = 'one',
    ONE_OR_MORE = 'one-or-more',
}

/**
 * A group of controls, or of groups of controls.
 */
export interface ControlGroup {
    /**
     * A textual label that provides a sub-type or characterization of the group.
     */
    readonly class?: string;
    readonly controls?: Control[];
    readonly groups?: ControlGroup[];
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined group elsewhere in in this and other OSCAL instances (e.g.,
     * profiles). This id should be assigned per-subject, which means it should be consistently
     * used to identify the same group across revisions of the document.
     */
    readonly id?: string;
    readonly links?: Link[];
    readonly params?: Parameter[];
    readonly parts?: Part[];
    readonly props?: Property[];
    /**
     * A name given to the group, which may be used by a tool for display and navigation.
     */
    readonly title: string;
}

/**
 * A collection of component descriptions, which may optionally be grouped by capability.
 */
export interface ComponentDefinition {
    readonly 'back-matter'?: BackMatter;
    readonly capabilities?: Capability[];
    readonly components?: ComponentDefinitionComponent[];
    readonly 'import-component-definitions'?: ImportComponentDefinition[];
    readonly metadata: PublicationMetadata;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this component definition elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the component definition can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * A grouping of other components and/or capabilities.
 */
export interface Capability {
    readonly 'control-implementations'?: ControlImplementationSet[];
    /**
     * A summary of the capability.
     */
    readonly description: string;
    readonly 'incorporates-components'?: IncorporatesComponent[];
    readonly links?: Link[];
    /**
     * The capability's human-readable name.
     */
    readonly name: string;
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this capability elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the capability can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance).This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * Defines how the component or capability supports a set of controls.
 */
export interface ControlImplementationSet {
    /**
     * A description of how the specified set of controls are implemented for the containing
     * component or capability.
     */
    readonly description: string;
    readonly 'implemented-requirements': ImplementedRequirementElement[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly 'set-parameters'?: SetParameterValue[];
    /**
     * A reference to an OSCAL catalog or profile providing the referenced control or subcontrol
     * definition.
     */
    readonly source: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference a set of implemented controls elsewhere in this or other OSCAL instances.
     * The locally defined UUID of the control implementation set can be used to reference the
     * data item locally or globally (e.g., in an imported OSCAL instance). This UUID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Describes how the containing component or capability implements an individual control.
 */
export interface ImplementedRequirementElement {
    /**
     * A human-oriented identifier reference to a control with a corresponding id value. When
     * referencing an externally defined control, the Control Identifier Reference must be used
     * in the context of the external / imported OSCAL instance (e.g., uri-reference).
     */
    readonly 'control-id': string;
    /**
     * A suggestion for how the specified control may be implemented if the containing component
     * or capability is instantiated in a system security plan.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly 'set-parameters'?: SetParameterValue[];
    readonly statements?: ControlStatementImplementation[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference a specific control implementation elsewhere in this or other OSCAL
     * instances. The locally defined UUID of the control implementation can be used to
     * reference the data item locally or globally (e.g., in an imported OSCAL instance).This
     * UUID should be assigned per-subject, which means it should be consistently used to
     * identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies the parameter that will be set by the enclosed value.
 */
export interface SetParameterValue {
    /**
     * A human-oriented reference to a parameter within a control, who's catalog has been
     * imported into the current implementation context.
     */
    readonly 'param-id': string;
    readonly remarks?: string;
    readonly values: string[];
}

/**
 * Identifies which statements within a control are addressed.
 */
export interface ControlStatementImplementation {
    /**
     * A summary of how the containing control statement is implemented by the component or
     * capability.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A human-oriented identifier reference to a control statement.
     */
    readonly 'statement-id': string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this control statement elsewhere in this or other OSCAL instances. The UUID
     * of the control statement in the source OSCAL instance is sufficient to reference the data
     * item locally or globally (e.g., in an imported OSCAL instance).
     */
    readonly uuid: string;
}

/**
 * TBD
 */
export interface IncorporatesComponent {
    /**
     * A machine-oriented identifier reference to a component.
     */
    readonly 'component-uuid': string;
    /**
     * A description of the component, including information about its function.
     */
    readonly description: string;
}

/**
 * A defined component that can be part of an implemented system.
 */
export interface ComponentDefinitionComponent {
    readonly 'control-implementations'?: ControlImplementationSet[];
    /**
     * A description of the component, including information about its function.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly protocols?: ServiceProtocolInformation[];
    /**
     * A summary of the technological or business purpose of the component.
     */
    readonly purpose?: string;
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A human readable name for the component.
     */
    readonly title: string;
    /**
     * A category describing the purpose of the component.
     */
    readonly type: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this component elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the component can be used to reference the data item locally or globally
     * (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject, which
     * means it should be consistently used to identify the same subject across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * Loads a component definition from another resource.
 */
export interface ImportComponentDefinition {
    /**
     * A link to a resource that defines a set of components and/or capabilities to import into
     * this collection.
     */
    readonly href: string;
}

/**
 * A plan of action and milestones which identifies initial and residual risks, deviations,
 * and disposition, such as those required by FedRAMP.
 */
export interface PlanOfActionAndMilestonesPOAM {
    readonly 'back-matter'?: BackMatter;
    readonly 'import-ssp'?: ImportSystemSecurityPlan;
    readonly 'local-definitions'?: PlanOfActionAndMilestonesLocalDefinitions;
    readonly metadata: PublicationMetadata;
    readonly observations?: Observation[];
    readonly 'poam-items': POAMItem[];
    readonly risks?: IdentifiedRisk[];
    readonly 'system-id'?: SystemIdentification;
    /**
     * A machine-oriented, globally unique identifier with instancescope that can be used to
     * reference this POA&M instance in this OSCAL instance. This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Allows components, and inventory-items to be defined within the POA&M for circumstances
 * where no OSCAL-based SSP exists, or is not delivered with the POA&M.
 */
export interface PlanOfActionAndMilestonesLocalDefinitions {
    readonly components?: AssessmentAssetsComponent[];
    readonly 'inventory-items'?: InventoryItem[];
    readonly remarks?: string;
}

/**
 * Describes an individual POA&M item.
 */
export interface POAMItem {
    /**
     * A human-readable description of POA&M item.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly origins?: PoamItemOrigin[];
    readonly props?: Property[];
    readonly 'related-observations'?: PoamItemRelatedObservation[];
    readonly 'related-risks'?: PoamItemRelatedRisk[];
    readonly remarks?: string;
    /**
     * The title or name for this POA&M item .
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with instance scope that can be used to
     * reference this POA&M item entry in this OSCAL instance. This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid?: string;
}

/**
 * Identifies the source of the finding, such as a tool or person.
 */
export interface PoamItemOrigin {
    readonly actors: OriginatingActor[];
}

/**
 * Relates the poam-item to a set of referenced observations that were used to determine the
 * finding.
 */
export interface PoamItemRelatedObservation {
    /**
     * A machine-oriented identifier reference to an observation defined in the list of
     * observations.
     */
    readonly 'observation-uuid': string;
}

/**
 * Relates the finding to a set of referenced risks that were used to determine the finding.
 */
export interface PoamItemRelatedRisk {
    /**
     * A machine-oriented identifier reference to a risk defined in the list of risks.
     */
    readonly 'risk-uuid': string;
}

/**
 * A human-oriented, globally unique identifier with cross-instance scope that can be used
 * to reference this system identification property elsewhere in this or other OSCAL
 * instances. When referencing an externally defined system identification, the system
 * identification must be used in the context of the external / imported OSCAL instance
 * (e.g., uri-reference). This string should be assigned per-subject, which means it should
 * be consistently used to identify the same system across revisions of the document.
 */
export interface SystemIdentification {
    readonly id: string;
    /**
     * Identifies the identification system from which the provided identifier was assigned.
     */
    readonly 'identifier-type'?: string;
}

/**
 * Each OSCAL profile is defined by a Profile element
 */
export interface Profile {
    readonly 'back-matter'?: BackMatter;
    readonly imports: ImportResource[];
    readonly merge?: MergeControls;
    readonly metadata: PublicationMetadata;
    readonly modify?: ModifyControls;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this profile elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the profile can be used to reference the data item locally or globally (e.g., in
     * an imported OSCAL instance).This identifier should be assigned per-subject, which means
     * it should be consistently used to identify the same profile across revisions of the
     * document.
     */
    readonly uuid: string;
}

/**
 * The import designates a catalog or profile to be included (referenced and potentially
 * modified) by this profile. The import also identifies which controls to select using the
 * include-all, include-controls, and exclude-controls directives.
 */
export interface ImportResource {
    readonly 'exclude-controls'?: Call[];
    /**
     * A resolvable URL reference to the base catalog or profile that this profile is tailoring.
     */
    readonly href: string;
    readonly 'include-all'?: IncludeAll;
    readonly 'include-controls'?: Call[];
}

/**
 * Call a control by its ID
 */
export interface Call {
    readonly matching?: MatchControlsByPattern[];
    /**
     * When a control is included, whether its child (dependent) controls are also included.
     */
    readonly 'with-child-controls'?: IncludeContainedControlsWithControl;
    readonly 'with-ids'?: string[];
}

/**
 * Select controls by (regular expression) match on ID
 */
export interface MatchControlsByPattern {
    /**
     * A glob expression matching the IDs of one or more controls to be selected.
     */
    readonly pattern?: string;
}

export enum IncludeContainedControlsWithControl {
    NO = 'no',
    YES = 'yes',
}

/**
 * A Merge element provides structuring directives that drive how controls are organized
 * after resolution.
 */
export interface MergeControls {
    /**
     * An As-is element indicates that the controls should be structured in resolution as they
     * are structured in their source catalogs. It does not contain any elements or attributes.
     */
    readonly 'as-is'?: boolean;
    /**
     * A Combine element defines how to combine multiple (competing) versions of the same
     * control.
     */
    readonly combine?: CombinationRule;
    /**
     * A Custom element frames a structure for embedding represented controls in resolution.
     */
    readonly custom?: CustomGrouping;
    /**
     * Use the flat structuring method.
     */
    readonly flat?: Flat;
}

/**
 * A Combine element defines how to combine multiple (competing) versions of the same
 * control.
 */
export interface CombinationRule {
    /**
     * How clashing controls should be handled
     */
    readonly method?: CombinationMethod;
}

export enum CombinationMethod {
    KEEP = 'keep',
    MERGE = 'merge',
    USE_FIRST = 'use-first',
}

/**
 * A Custom element frames a structure for embedding represented controls in resolution.
 */
export interface CustomGrouping {
    readonly groups?: CustomGroup[];
    readonly 'insert-controls'?: SelectControls[];
}

/**
 * A group of (selected) controls or of groups of controls
 */
export interface CustomGroup {
    /**
     * A textual label that provides a sub-type or characterization of the group.
     */
    readonly class?: string;
    readonly groups?: CustomGroup[];
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined group elsewhere in this or other OSCAL instances. When referenced
     * from another OSCAL instance, this identifier must be referenced in the context of the
     * containing resource (e.g., import-profile). This id should be assigned per-subject, which
     * means it should be consistently used to identify the same group across revisions of the
     * document.
     */
    readonly id?: string;
    readonly 'insert-controls'?: SelectControls[];
    readonly links?: Link[];
    readonly params?: Parameter[];
    readonly parts?: Part[];
    readonly props?: Property[];
    /**
     * A name given to the group, which may be used by a tool for display and navigation.
     */
    readonly title: string;
}

/**
 * Specifies which controls to use in the containing context.
 */
export interface SelectControls {
    readonly 'exclude-controls'?: Call[];
    readonly 'include-all'?: IncludeAll;
    readonly 'include-controls'?: Call[];
    /**
     * A designation of how a selection of controls in a profile is to be ordered.
     */
    readonly order?: Order;
}

export enum Order {
    ASCENDING = 'ascending',
    DESCENDING = 'descending',
    KEEP = 'keep',
}

/**
 * Use the flat structuring method.
 */
export interface Flat {
}

/**
 * Set parameters or amend controls in resolution
 */
export interface ModifyControls {
    readonly alters?: Alteration[];
    readonly 'set-parameters'?: ParameterSetting[];
}

/**
 * An Alter element specifies changes to be made to an included control when a profile is
 * resolved.
 */
export interface Alteration {
    readonly adds?: Addition[];
    /**
     * A human-oriented identifier reference to a control with a corresponding id value. When
     * referencing an externally defined control, the Control Identifier Reference must be used
     * in the context of the external / imported OSCAL instance (e.g., uri-reference).
     */
    readonly 'control-id': string;
    readonly removes?: Removal[];
}

/**
 * Specifies contents to be added into controls, in resolution
 */
export interface Addition {
    /**
     * Target location of the addition.
     */
    readonly 'by-id'?: string;
    readonly links?: Link[];
    readonly params?: Parameter[];
    readonly parts?: Part[];
    /**
     * Where to add the new content with respect to the targeted element (beside it or inside it)
     */
    readonly position?: Position;
    readonly props?: Property[];
    /**
     * A name given to the control, which may be used by a tool for display and navigation.
     */
    readonly title?: string;
}

export enum Position {
    AFTER = 'after',
    BEFORE = 'before',
    ENDING = 'ending',
    STARTING = 'starting',
}

/**
 * Specifies objects to be removed from a control based on specific aspects of the object
 * that must all match.
 */
export interface Removal {
    /**
     * Identify items to remove by matching their class.
     */
    readonly 'by-class'?: string;
    /**
     * Identify items to remove indicated by their id.
     */
    readonly 'by-id'?: string;
    /**
     * Identify items to remove by the name of the item's information element name, e.g. title
     * or prop
     */
    readonly 'by-item-name'?: string;
    /**
     * Identify items to remove by matching their assigned name
     */
    readonly 'by-name'?: string;
    /**
     * Identify items to remove by the item's ns, which is the namespace associated with a part,
     * or prop.
     */
    readonly 'by-ns'?: string;
}

/**
 * A parameter setting, to be propagated to points of insertion
 */
export interface ParameterSetting {
    /**
     * A textual label that provides a characterization of the parameter.
     */
    readonly class?: string;
    readonly constraints?: Constraint[];
    /**
     * **(deprecated)** Another parameter invoking this one. This construct has been deprecated
     * and should not be used.
     */
    readonly 'depends-on'?: string;
    readonly guidelines?: Guideline[];
    /**
     * A short, placeholder name for the parameter, which can be used as a substitute for a
     * value if no value is assigned.
     */
    readonly label?: string;
    readonly links?: Link[];
    /**
     * A human-oriented, locally unique identifier with cross-instance scope that can be used to
     * reference this defined parameter elsewhere in this or other OSCAL instances. When
     * referenced from another OSCAL instance, this identifier must be referenced in the context
     * of the containing resource (e.g., import-profile). This id should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly 'param-id': string;
    readonly props?: Property[];
    readonly select?: Selection;
    /**
     * Describes the purpose and use of a parameter
     */
    readonly usage?: string;
    readonly values?: string[];
}

/**
 * A system security plan, such as those described in NIST SP 800-18
 */
export interface SystemSecurityPlanSSP {
    readonly 'back-matter'?: BackMatter;
    readonly 'control-implementation': ControlImplementationClass;
    readonly 'import-profile': ImportProfile;
    readonly metadata: PublicationMetadata;
    readonly 'system-characteristics': SystemCharacteristics;
    readonly 'system-implementation': SystemImplementation;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this system security plan (SSP) elsewhere in this or other OSCAL instances.
     * The locally defined UUID of the SSP can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance).This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Describes how the system satisfies a set of controls.
 */
export interface ControlImplementationClass {
    /**
     * A statement describing important things to know about how this set of control
     * satisfaction documentation is approached.
     */
    readonly description: string;
    readonly 'implemented-requirements': ControlBasedRequirement[];
    readonly 'set-parameters'?: SetParameterValue[];
}

/**
 * Describes how the system satisfies the requirements of an individual control.
 */
export interface ControlBasedRequirement {
    readonly 'by-components'?: ComponentControlImplementation[];
    /**
     * A human-oriented identifier reference to a control with a corresponding id value. When
     * referencing an externally defined control, the Control Identifier Reference must be used
     * in the context of the external / imported OSCAL instance (e.g., uri-reference).
     */
    readonly 'control-id': string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly 'set-parameters'?: SetParameterValue[];
    readonly statements?: SpecificControlStatement[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this control requirement elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the control requirement can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Defines how the referenced component implements a set of controls.
 */
export interface ComponentControlImplementation {
    /**
     * A machine-oriented identifier reference to the component that is implemeting a given
     * control.
     */
    readonly 'component-uuid': string;
    /**
     * An implementation statement that describes how a control or a control statement is
     * implemented within the referenced system component.
     */
    readonly description: string;
    /**
     * Identifies content intended for external consumption, such as with leveraged
     * organizations.
     */
    readonly export?: Export;
    readonly 'implementation-status'?: ImplementationStatus;
    readonly inherited?: InheritedControlImplementation[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    readonly satisfied?: SatisfiedControlImplementationResponsibility[];
    readonly 'set-parameters'?: SetParameterValue[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this by-component entry elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the by-component entry can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies content intended for external consumption, such as with leveraged
 * organizations.
 */
export interface Export {
    /**
     * An implementation statement that describes the aspects of the control or control
     * statement implementation that can be available to another system leveraging this system.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly provided?: ProvidedControlImplementation[];
    readonly remarks?: string;
    readonly responsibilities?: ControlImplementationResponsibility[];
}

/**
 * Describes a capability which may be inherited by a leveraging system.
 */
export interface ProvidedControlImplementation {
    /**
     * An implementation statement that describes the aspects of the control or control
     * statement implementation that can be provided to another system leveraging this system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this provided entry elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the provided entry can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Describes a control implementation responsibility imposed on a leveraging system.
 */
export interface ControlImplementationResponsibility {
    /**
     * An implementation statement that describes the aspects of the control or control
     * statement implementation that a leveraging system must implement to satisfy the control
     * provided by a leveraged system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    /**
     * A machine-oriented identifier reference to an inherited control implementation that a
     * leveraging system is inheriting from a leveraged system.
     */
    readonly 'provided-uuid'?: string;
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this responsibility elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the responsibility can be used to reference the data item locally or
     * globally (e.g., in an imported OSCAL instance). This UUID should be assigned per-subject,
     * which means it should be consistently used to identify the same subject across revisions
     * of the document.
     */
    readonly uuid: string;
}

/**
 * Describes a control implementation inherited by a leveraging system.
 */
export interface InheritedControlImplementation {
    /**
     * An implementation statement that describes the aspects of a control or control statement
     * implementation that a leveraging system is inheriting from a leveraged system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    /**
     * A machine-oriented identifier reference to an inherited control implementation that a
     * leveraging system is inheriting from a leveraged system.
     */
    readonly 'provided-uuid'?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this inherited entry elsewhere in this or other OSCAL instances. The locally
     * defined UUID of the inherited control implementation can be used to reference the data
     * item locally or globally (e.g., in an imported OSCAL instance). This UUID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Describes how this system satisfies a responsibility imposed by a leveraged system.
 */
export interface SatisfiedControlImplementationResponsibility {
    /**
     * An implementation statement that describes the aspects of a control or control statement
     * implementation that a leveraging system is implementing based on a requirement from a
     * leveraged system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A machine-oriented identifier reference to a control implementation that satisfies a
     * responsibility imposed by a leveraged system.
     */
    readonly 'responsibility-uuid'?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this satisfied control implementation entry elsewhere in this or other OSCAL
     * instances. The locally defined UUID of the control implementation can be used to
     * reference the data item locally or globally (e.g., in an imported OSCAL instance). This
     * UUID should be assigned per-subject, which means it should be consistently used to
     * identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * Identifies which statements within a control are addressed.
 */
export interface SpecificControlStatement {
    readonly 'by-components'?: ComponentControlImplementation[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-roles'?: ResponsibleRole[];
    /**
     * A human-oriented identifier reference to a control statement.
     */
    readonly 'statement-id': string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this control statement elsewhere in this or other OSCAL instances. The UUID
     * of the control statement in the source OSCAL instance is sufficient to reference the data
     * item locally or globally (e.g., in an imported OSCAL instance).
     */
    readonly uuid: string;
}

/**
 * Used to import the OSCAL profile representing the system's control baseline.
 */
export interface ImportProfile {
    /**
     * A resolvable URL reference to the profile or catalog to use as the system's control
     * baseline.
     */
    readonly href: string;
    readonly remarks?: string;
}

/**
 * Contains the characteristics of the system, such as its name, purpose, and security
 * impact level.
 */
export interface SystemCharacteristics {
    readonly 'authorization-boundary': AuthorizationBoundary;
    readonly 'data-flow'?: DataFlow;
    readonly 'date-authorized'?: string;
    /**
     * A summary of the system.
     */
    readonly description: string;
    readonly links?: Link[];
    readonly 'network-architecture'?: NetworkArchitecture;
    readonly props?: Property[];
    readonly remarks?: string;
    readonly 'responsible-parties'?: ResponsibleParty[];
    readonly 'security-impact-level': SecurityImpactLevel;
    /**
     * The overall information system sensitivity categorization, such as defined by FIPS-199.
     */
    readonly 'security-sensitivity-level': string;
    readonly status: SystemCharacteristicsStatus;
    readonly 'system-ids': SystemIdentification[];
    readonly 'system-information': SystemInformation;
    /**
     * The full name of the system.
     */
    readonly 'system-name': string;
    /**
     * A short name for the system, such as an acronym, that is suitable for display in a data
     * table or summary list.
     */
    readonly 'system-name-short'?: string;
}

/**
 * A description of this system's authorization boundary, optionally supplemented by
 * diagrams that illustrate the authorization boundary.
 */
export interface AuthorizationBoundary {
    /**
     * A summary of the system's authorization boundary.
     */
    readonly description: string;
    readonly diagrams?: Diagram[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * A graphic that provides a visual representation the system, or some aspect of it.
 */
export interface Diagram {
    /**
     * A brief caption to annotate the diagram.
     */
    readonly caption?: string;
    /**
     * A summary of the diagram.
     */
    readonly description?: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this diagram elsewhere in this or other OSCAL instances. The locally defined
     * UUID of the diagram can be used to reference the data item locally or globally (e.g., in
     * an imported OSCAL instance). This UUID should be assigned per-subject, which means it
     * should be consistently used to identify the same subject across revisions of the document.
     */
    readonly uuid: string;
}

/**
 * A description of the logical flow of information within the system and across its
 * boundaries, optionally supplemented by diagrams that illustrate these flows.
 */
export interface DataFlow {
    /**
     * A summary of the system's data flow.
     */
    readonly description: string;
    readonly diagrams?: Diagram[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * A description of the system's network architecture, optionally supplemented by diagrams
 * that illustrate the network architecture.
 */
export interface NetworkArchitecture {
    /**
     * A summary of the system's network architecture.
     */
    readonly description: string;
    readonly diagrams?: Diagram[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
}

/**
 * The overall level of expected impact resulting from unauthorized disclosure,
 * modification, or loss of access to information.
 */
export interface SecurityImpactLevel {
    /**
     * A target-level of availability for the system, based on the sensitivity of information
     * within the system.
     */
    readonly 'security-objective-availability': string;
    /**
     * A target-level of confidentiality for the system, based on the sensitivity of information
     * within the system.
     */
    readonly 'security-objective-confidentiality': string;
    /**
     * A target-level of integrity for the system, based on the sensitivity of information
     * within the system.
     */
    readonly 'security-objective-integrity': string;
}

/**
 * Describes the operational status of the system.
 */
export interface SystemCharacteristicsStatus {
    readonly remarks?: string;
    /**
     * The current operating status.
     */
    readonly state: FluffyState;
}

export enum FluffyState {
    DISPOSITION = 'disposition',
    OPERATIONAL = 'operational',
    OTHER = 'other',
    UNDER_DEVELOPMENT = 'under-development',
    UNDER_MAJOR_MODIFICATION = 'under-major-modification',
}

/**
 * Contains details about all information types that are stored, processed, or transmitted
 * by the system, such as privacy information, and those defined in NIST SP 800-60.
 */
export interface SystemInformation {
    readonly 'information-types': InformationType[];
    readonly links?: Link[];
    readonly props?: Property[];
}

/**
 * Contains details about one information type that is stored, processed, or transmitted by
 * the system, such as privacy information, and those defined in NIST SP 800-60.
 */
export interface InformationType {
    /**
     * The expected level of impact resulting from the disruption of access to or use of the
     * described information or the information system.
     */
    readonly 'availability-impact': AvailabilityImpactLevel;
    readonly categorizations?: InformationTypeCategorization[];
    /**
     * The expected level of impact resulting from the unauthorized disclosure of the described
     * information.
     */
    readonly 'confidentiality-impact': ConfidentialityImpactLevel;
    /**
     * A summary of how this information type is used within the system.
     */
    readonly description: string;
    /**
     * The expected level of impact resulting from the unauthorized modification of the
     * described information.
     */
    readonly 'integrity-impact': IntegrityImpactLevel;
    readonly links?: Link[];
    readonly props?: Property[];
    /**
     * A human readable name for the information type. This title should be meaningful within
     * the context of the system.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope that can be used
     * to reference this information type elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the information type can be used to reference the data item
     * locally or globally (e.g., in an imported OSCAL instance). This UUID should be assigned
     * per-subject, which means it should be consistently used to identify the same subject
     * across revisions of the document.
     */
    readonly uuid?: string;
}

/**
 * The expected level of impact resulting from the disruption of access to or use of the
 * described information or the information system.
 */
export interface AvailabilityImpactLevel {
    readonly 'adjustment-justification'?: string;
    readonly base: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly selected?: string;
}

/**
 * A set of information type identifiers qualified by the given identification system used,
 * such as NIST SP 800-60.
 */
export interface InformationTypeCategorization {
    readonly 'information-type-ids'?: string[];
    /**
     * Specifies the information type identification system used.
     */
    readonly system: string;
}

/**
 * The expected level of impact resulting from the unauthorized disclosure of the described
 * information.
 */
export interface ConfidentialityImpactLevel {
    readonly 'adjustment-justification'?: string;
    readonly base: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly selected?: string;
}

/**
 * The expected level of impact resulting from the unauthorized modification of the
 * described information.
 */
export interface IntegrityImpactLevel {
    readonly 'adjustment-justification'?: string;
    readonly base: string;
    readonly links?: Link[];
    readonly props?: Property[];
    readonly selected?: string;
}

/**
 * Provides information as to how the system is implemented.
 */
export interface SystemImplementation {
    readonly components: AssessmentAssetsComponent[];
    readonly 'inventory-items'?: InventoryItem[];
    readonly 'leveraged-authorizations'?: LeveragedAuthorization[];
    readonly links?: Link[];
    readonly props?: Property[];
    readonly remarks?: string;
    readonly users: SystemUser[];
}

/**
 * A description of another authorized system from which this system inherits capabilities
 * that satisfy security requirements. Another term for this concept is a common control
 * provider.
 */
export interface LeveragedAuthorization {
    readonly 'date-authorized': string;
    readonly links?: Link[];
    /**
     * A machine-oriented identifier reference to the party that manages the leveraged system.
     */
    readonly 'party-uuid': string;
    readonly props?: Property[];
    readonly remarks?: string;
    /**
     * A human readable name for the leveraged authorization in the context of the system.
     */
    readonly title: string;
    /**
     * A machine-oriented, globally unique identifier with cross-instance scope and can be used
     * to reference this leveraged authorization elsewhere in this or other OSCAL instances. The
     * locally defined UUID of the leveraged authorization can be used to reference the data
     * item locally or globally (e.g., in an imported OSCAL instance). This UUID should be
     * assigned per-subject, which means it should be consistently used to identify the same
     * subject across revisions of the document.
     */
    readonly uuid: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toOscal(json: string): Oscal {
        return cast(JSON.parse(json), r("Oscal"));
    }

    public static oscalToJson(value: Oscal): string {
        return JSON.stringify(uncast(value, r("Oscal")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }
    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }
    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }
    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }
    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }
    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }
    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Oscal": o([
        { json: "$schema", js: "$schema", typ: u(undefined, "") },
        { json: "catalog", js: "catalog", typ: u(undefined, r("Catalog")) },
        { json: "profile", js: "profile", typ: u(undefined, r("Profile")) },
        { json: "component-definition", js: "component-definition", typ: u(undefined, r("ComponentDefinition")) },
        { json: "system-security-plan", js: "system-security-plan", typ: u(undefined, r("SystemSecurityPlanSSP")) },
        { json: "assessment-plan", js: "assessment-plan", typ: u(undefined, r("SecurityAssessmentPlanSAP")) },
        { json: "assessment-results", js: "assessment-results", typ: u(undefined, r("SecurityAssessmentResultsSAR")) },
        { json: "plan-of-action-and-milestones", js: "plan-of-action-and-milestones", typ: u(undefined, r("PlanOfActionAndMilestonesPOAM")) },
    ], false),
    "SecurityAssessmentPlanSAP": o([
        { json: "assessment-assets", js: "assessment-assets", typ: u(undefined, r("AssessmentAssets")) },
        { json: "assessment-subjects", js: "assessment-subjects", typ: u(undefined, a(r("SubjectOfAssessment"))) },
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "import-ssp", js: "import-ssp", typ: r("ImportSystemSecurityPlan") },
        { json: "local-definitions", js: "local-definitions", typ: u(undefined, r("AssessmentPlanLocalDefinitions")) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "reviewed-controls", js: "reviewed-controls", typ: r("ReviewedControlsAndControlObjectives") },
        { json: "tasks", js: "tasks", typ: u(undefined, a(r("Task"))) },
        { json: "terms-and-conditions", js: "terms-and-conditions", typ: u(undefined, r("AssessmentPlanTermsAndConditions")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "AssessmentAssets": o([
        { json: "assessment-platforms", js: "assessment-platforms", typ: a(r("AssessmentPlatform")) },
        { json: "components", js: "components", typ: u(undefined, a(r("AssessmentAssetsComponent"))) },
    ], false),
    "AssessmentPlatform": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uses-components", js: "uses-components", typ: u(undefined, a(r("UsesComponent"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Link": o([
        { json: "href", js: "href", typ: "" },
        { json: "media-type", js: "media-type", typ: u(undefined, "") },
        { json: "rel", js: "rel", typ: u(undefined, "") },
        { json: "text", js: "text", typ: u(undefined, "") },
    ], false),
    "Property": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "ns", js: "ns", typ: u(undefined, "") },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: u(undefined, "") },
        { json: "value", js: "value", typ: "" },
    ], false),
    "UsesComponent": o([
        { json: "component-uuid", js: "component-uuid", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
    ], false),
    "ResponsibleParty": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "party-uuids", js: "party-uuids", typ: a("") },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "role-id", js: "role-id", typ: "" },
    ], false),
    "AssessmentAssetsComponent": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "protocols", js: "protocols", typ: u(undefined, a(r("ServiceProtocolInformation"))) },
        { json: "purpose", js: "purpose", typ: u(undefined, "") },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "status", js: "status", typ: r("ComponentStatus") },
        { json: "title", js: "title", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ServiceProtocolInformation": o([
        { json: "name", js: "name", typ: "" },
        { json: "port-ranges", js: "port-ranges", typ: u(undefined, a(r("PortRange"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: u(undefined, "") },
    ], false),
    "PortRange": o([
        { json: "end", js: "end", typ: u(undefined, 0) },
        { json: "start", js: "start", typ: u(undefined, 0) },
        { json: "transport", js: "transport", typ: u(undefined, r("Transport")) },
    ], false),
    "ResponsibleRole": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "party-uuids", js: "party-uuids", typ: u(undefined, a("")) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "role-id", js: "role-id", typ: "" },
    ], false),
    "ComponentStatus": o([
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "state", js: "state", typ: r("PurpleState") },
    ], false),
    "SubjectOfAssessment": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "exclude-subjects", js: "exclude-subjects", typ: u(undefined, a(r("SelectAssessmentSubject"))) },
        { json: "include-all", js: "include-all", typ: u(undefined, r("IncludeAll")) },
        { json: "include-subjects", js: "include-subjects", typ: u(undefined, a(r("SelectAssessmentSubject"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "type", js: "type", typ: "" },
    ], false),
    "SelectAssessmentSubject": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "subject-uuid", js: "subject-uuid", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "IncludeAll": o([
    ], false),
    "BackMatter": o([
        { json: "resources", js: "resources", typ: u(undefined, a(r("Resource"))) },
    ], false),
    "Resource": o([
        { json: "base64", js: "base64", typ: u(undefined, r("Base64")) },
        { json: "citation", js: "citation", typ: u(undefined, r("Citation")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "document-ids", js: "document-ids", typ: u(undefined, a(r("DocumentIdentifier"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "rlinks", js: "rlinks", typ: u(undefined, a(r("ResourceLink"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Base64": o([
        { json: "filename", js: "filename", typ: u(undefined, "") },
        { json: "media-type", js: "media-type", typ: u(undefined, "") },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Citation": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "text", js: "text", typ: "" },
    ], false),
    "DocumentIdentifier": o([
        { json: "identifier", js: "identifier", typ: "" },
        { json: "scheme", js: "scheme", typ: u(undefined, "") },
    ], false),
    "ResourceLink": o([
        { json: "hashes", js: "hashes", typ: u(undefined, a(r("Hash"))) },
        { json: "href", js: "href", typ: "" },
        { json: "media-type", js: "media-type", typ: u(undefined, "") },
    ], false),
    "Hash": o([
        { json: "algorithm", js: "algorithm", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "ImportSystemSecurityPlan": o([
        { json: "href", js: "href", typ: "" },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "AssessmentPlanLocalDefinitions": o([
        { json: "activities", js: "activities", typ: u(undefined, a(r("Activity"))) },
        { json: "components", js: "components", typ: u(undefined, a(r("AssessmentAssetsComponent"))) },
        { json: "inventory-items", js: "inventory-items", typ: u(undefined, a(r("InventoryItem"))) },
        { json: "objectives-and-methods", js: "objectives-and-methods", typ: u(undefined, a(r("AssessmentSpecificControlObjective"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "users", js: "users", typ: u(undefined, a(r("SystemUser"))) },
    ], false),
    "Activity": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-controls", js: "related-controls", typ: u(undefined, r("ReviewedControlsAndControlObjectives")) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "steps", js: "steps", typ: u(undefined, a(r("Step"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ReviewedControlsAndControlObjectives": o([
        { json: "control-objective-selections", js: "control-objective-selections", typ: u(undefined, a(r("ReferencedControlObjectives"))) },
        { json: "control-selections", js: "control-selections", typ: a(r("AssessedControls")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "ReferencedControlObjectives": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "exclude-objectives", js: "exclude-objectives", typ: u(undefined, a(r("SelectObjective"))) },
        { json: "include-all", js: "include-all", typ: u(undefined, r("IncludeAll")) },
        { json: "include-objectives", js: "include-objectives", typ: u(undefined, a(r("SelectObjective"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "SelectObjective": o([
        { json: "objective-id", js: "objective-id", typ: "" },
    ], false),
    "AssessedControls": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "exclude-controls", js: "exclude-controls", typ: u(undefined, a(r("SelectControl"))) },
        { json: "include-all", js: "include-all", typ: u(undefined, r("IncludeAll")) },
        { json: "include-controls", js: "include-controls", typ: u(undefined, a(r("SelectControl"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "SelectControl": o([
        { json: "control-id", js: "control-id", typ: "" },
        { json: "statement-ids", js: "statement-ids", typ: u(undefined, a("")) },
    ], false),
    "Step": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "reviewed-controls", js: "reviewed-controls", typ: u(undefined, r("ReviewedControlsAndControlObjectives")) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "InventoryItem": o([
        { json: "description", js: "description", typ: "" },
        { json: "implemented-components", js: "implemented-components", typ: u(undefined, a(r("ImplementedComponent"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImplementedComponent": o([
        { json: "component-uuid", js: "component-uuid", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
    ], false),
    "AssessmentSpecificControlObjective": o([
        { json: "control-id", js: "control-id", typ: "" },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "parts", js: "parts", typ: a(r("Part")) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "Part": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "name", js: "name", typ: "" },
        { json: "ns", js: "ns", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "prose", js: "prose", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
    ], false),
    "SystemUser": o([
        { json: "authorized-privileges", js: "authorized-privileges", typ: u(undefined, a(r("Privilege"))) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "role-ids", js: "role-ids", typ: u(undefined, a("")) },
        { json: "short-name", js: "short-name", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Privilege": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "functions-performed", js: "functions-performed", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PublicationMetadata": o([
        { json: "document-ids", js: "document-ids", typ: u(undefined, a(r("DocumentIdentifier"))) },
        { json: "last-modified", js: "last-modified", typ: Date },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "locations", js: "locations", typ: u(undefined, a(r("Location"))) },
        { json: "oscal-version", js: "oscal-version", typ: "" },
        { json: "parties", js: "parties", typ: u(undefined, a(r("PartyOrganizationOrPerson"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "published", js: "published", typ: u(undefined, Date) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
        { json: "revisions", js: "revisions", typ: u(undefined, a(r("RevisionHistoryEntry"))) },
        { json: "roles", js: "roles", typ: u(undefined, a(r("Role"))) },
        { json: "title", js: "title", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Location": o([
        { json: "address", js: "address", typ: r("Address") },
        { json: "email-addresses", js: "email-addresses", typ: u(undefined, a("")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "telephone-numbers", js: "telephone-numbers", typ: u(undefined, a(r("TelephoneNumber"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "urls", js: "urls", typ: u(undefined, a("")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Address": o([
        { json: "addr-lines", js: "addr-lines", typ: u(undefined, a("")) },
        { json: "city", js: "city", typ: u(undefined, "") },
        { json: "country", js: "country", typ: u(undefined, "") },
        { json: "postal-code", js: "postal-code", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "TelephoneNumber": o([
        { json: "number", js: "number", typ: "" },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "PartyOrganizationOrPerson": o([
        { json: "addresses", js: "addresses", typ: u(undefined, a(r("Address"))) },
        { json: "email-addresses", js: "email-addresses", typ: u(undefined, a("")) },
        { json: "external-ids", js: "external-ids", typ: u(undefined, a(r("PartyExternalIdentifier"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "location-uuids", js: "location-uuids", typ: u(undefined, a("")) },
        { json: "member-of-organizations", js: "member-of-organizations", typ: u(undefined, a("")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "short-name", js: "short-name", typ: u(undefined, "") },
        { json: "telephone-numbers", js: "telephone-numbers", typ: u(undefined, a(r("TelephoneNumber"))) },
        { json: "type", js: "type", typ: r("PartyType") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "PartyExternalIdentifier": o([
        { json: "id", js: "id", typ: "" },
        { json: "scheme", js: "scheme", typ: "" },
    ], false),
    "RevisionHistoryEntry": o([
        { json: "last-modified", js: "last-modified", typ: u(undefined, Date) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "oscal-version", js: "oscal-version", typ: u(undefined, "") },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "published", js: "published", typ: u(undefined, Date) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Role": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "short-name", js: "short-name", typ: u(undefined, "") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Task": o([
        { json: "associated-activities", js: "associated-activities", typ: u(undefined, a(r("AssociatedActivity"))) },
        { json: "dependencies", js: "dependencies", typ: u(undefined, a(r("TaskDependency"))) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "subjects", js: "subjects", typ: u(undefined, a(r("SubjectOfAssessment"))) },
        { json: "tasks", js: "tasks", typ: u(undefined, a(r("Task"))) },
        { json: "timing", js: "timing", typ: u(undefined, r("EventTiming")) },
        { json: "title", js: "title", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "AssociatedActivity": o([
        { json: "activity-uuid", js: "activity-uuid", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "subjects", js: "subjects", typ: a(r("SubjectOfAssessment")) },
    ], false),
    "TaskDependency": o([
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "task-uuid", js: "task-uuid", typ: "" },
    ], false),
    "EventTiming": o([
        { json: "at-frequency", js: "at-frequency", typ: u(undefined, r("FrequencyCondition")) },
        { json: "on-date", js: "on-date", typ: u(undefined, r("OnDateCondition")) },
        { json: "within-date-range", js: "within-date-range", typ: u(undefined, r("OnDateRangeCondition")) },
    ], false),
    "FrequencyCondition": o([
        { json: "period", js: "period", typ: 0 },
        { json: "unit", js: "unit", typ: r("TimeUnit") },
    ], false),
    "OnDateCondition": o([
        { json: "date", js: "date", typ: Date },
    ], false),
    "OnDateRangeCondition": o([
        { json: "end", js: "end", typ: Date },
        { json: "start", js: "start", typ: Date },
    ], false),
    "AssessmentPlanTermsAndConditions": o([
        { json: "parts", js: "parts", typ: u(undefined, a(r("AssessmentPart"))) },
    ], false),
    "AssessmentPart": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "name", js: "name", typ: "" },
        { json: "ns", js: "ns", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AssessmentPart"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "prose", js: "prose", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: u(undefined, "") },
    ], false),
    "SecurityAssessmentResultsSAR": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "import-ap", js: "import-ap", typ: r("ImportAssessmentPlan") },
        { json: "local-definitions", js: "local-definitions", typ: u(undefined, r("AssessmentResultsLocalDefinitions")) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "results", js: "results", typ: a(r("AssessmentResult")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImportAssessmentPlan": o([
        { json: "href", js: "href", typ: "" },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "AssessmentResultsLocalDefinitions": o([
        { json: "activities", js: "activities", typ: u(undefined, a(r("Activity"))) },
        { json: "objectives-and-methods", js: "objectives-and-methods", typ: u(undefined, a(r("AssessmentSpecificControlObjective"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "AssessmentResult": o([
        { json: "assessment-log", js: "assessment-log", typ: u(undefined, r("AssessmentLog")) },
        { json: "attestations", js: "attestations", typ: u(undefined, a(r("AttestationStatements"))) },
        { json: "description", js: "description", typ: "" },
        { json: "end", js: "end", typ: u(undefined, Date) },
        { json: "findings", js: "findings", typ: u(undefined, a(r("Finding"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "local-definitions", js: "local-definitions", typ: u(undefined, r("ResultLocalDefinitions")) },
        { json: "observations", js: "observations", typ: u(undefined, a(r("Observation"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "reviewed-controls", js: "reviewed-controls", typ: r("ReviewedControlsAndControlObjectives") },
        { json: "risks", js: "risks", typ: u(undefined, a(r("IdentifiedRisk"))) },
        { json: "start", js: "start", typ: Date },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "AssessmentLog": o([
        { json: "entries", js: "entries", typ: a(r("AssessmentLogEntry")) },
    ], false),
    "AssessmentLogEntry": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "end", js: "end", typ: u(undefined, Date) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "logged-by", js: "logged-by", typ: u(undefined, a(r("LoggedBy"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-tasks", js: "related-tasks", typ: u(undefined, a(r("TaskReference"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "start", js: "start", typ: Date },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "LoggedBy": o([
        { json: "party-uuid", js: "party-uuid", typ: "" },
        { json: "role-id", js: "role-id", typ: u(undefined, "") },
    ], false),
    "TaskReference": o([
        { json: "identified-subject", js: "identified-subject", typ: u(undefined, r("IdentifiedSubject")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
        { json: "subjects", js: "subjects", typ: u(undefined, a(r("SubjectOfAssessment"))) },
        { json: "task-uuid", js: "task-uuid", typ: "" },
    ], false),
    "IdentifiedSubject": o([
        { json: "subject-placeholder-uuid", js: "subject-placeholder-uuid", typ: "" },
        { json: "subjects", js: "subjects", typ: a(r("SubjectOfAssessment")) },
    ], false),
    "AttestationStatements": o([
        { json: "parts", js: "parts", typ: a(r("AssessmentPart")) },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
    ], false),
    "Finding": o([
        { json: "description", js: "description", typ: "" },
        { json: "implementation-statement-uuid", js: "implementation-statement-uuid", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "origins", js: "origins", typ: u(undefined, a(r("FindingOrigin"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-observations", js: "related-observations", typ: u(undefined, a(r("FindingRelatedObservation"))) },
        { json: "related-risks", js: "related-risks", typ: u(undefined, a(r("FindingRelatedRisk"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "target", js: "target", typ: r("TargetClass") },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "FindingOrigin": o([
        { json: "actors", js: "actors", typ: a(r("OriginatingActor")) },
        { json: "related-tasks", js: "related-tasks", typ: u(undefined, a(r("TaskReference"))) },
    ], false),
    "OriginatingActor": o([
        { json: "actor-uuid", js: "actor-uuid", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "role-id", js: "role-id", typ: u(undefined, "") },
        { json: "type", js: "type", typ: r("ActorType") },
    ], false),
    "FindingRelatedObservation": o([
        { json: "observation-uuid", js: "observation-uuid", typ: "" },
    ], false),
    "FindingRelatedRisk": o([
        { json: "risk-uuid", js: "risk-uuid", typ: "" },
    ], false),
    "TargetClass": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "implementation-status", js: "implementation-status", typ: u(undefined, r("ImplementationStatus")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "status", js: "status", typ: r("StatusClass") },
        { json: "target-id", js: "target-id", typ: "" },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "type", js: "type", typ: r("FindingTargetType") },
    ], false),
    "ImplementationStatus": o([
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "state", js: "state", typ: "" },
    ], false),
    "StatusClass": o([
        { json: "reason", js: "reason", typ: u(undefined, "") },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "state", js: "state", typ: r("ObjectiveStatusState") },
    ], false),
    "ResultLocalDefinitions": o([
        { json: "assessment-assets", js: "assessment-assets", typ: u(undefined, r("AssessmentAssets")) },
        { json: "components", js: "components", typ: u(undefined, a(r("AssessmentAssetsComponent"))) },
        { json: "inventory-items", js: "inventory-items", typ: u(undefined, a(r("InventoryItem"))) },
        { json: "tasks", js: "tasks", typ: u(undefined, a(r("Task"))) },
        { json: "users", js: "users", typ: u(undefined, a(r("SystemUser"))) },
    ], false),
    "Observation": o([
        { json: "collected", js: "collected", typ: Date },
        { json: "description", js: "description", typ: "" },
        { json: "expires", js: "expires", typ: u(undefined, Date) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "methods", js: "methods", typ: a("") },
        { json: "origins", js: "origins", typ: u(undefined, a(r("FindingOrigin"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "relevant-evidence", js: "relevant-evidence", typ: u(undefined, a(r("RelevantEvidence"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "subjects", js: "subjects", typ: u(undefined, a(r("IdentifiesTheSubject"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "types", js: "types", typ: u(undefined, a("")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "RelevantEvidence": o([
        { json: "description", js: "description", typ: "" },
        { json: "href", js: "href", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "IdentifiesTheSubject": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "subject-uuid", js: "subject-uuid", typ: "" },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "type", js: "type", typ: "" },
    ], false),
    "IdentifiedRisk": o([
        { json: "characterizations", js: "characterizations", typ: u(undefined, a(r("Characterization"))) },
        { json: "deadline", js: "deadline", typ: u(undefined, Date) },
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "mitigating-factors", js: "mitigating-factors", typ: u(undefined, a(r("MitigatingFactor"))) },
        { json: "origins", js: "origins", typ: u(undefined, a(r("FindingOrigin"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-observations", js: "related-observations", typ: u(undefined, a(r("RiskRelatedObservation"))) },
        { json: "remediations", js: "remediations", typ: u(undefined, a(r("RiskResponse"))) },
        { json: "risk-log", js: "risk-log", typ: u(undefined, r("RiskLog")) },
        { json: "statement", js: "statement", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "threat-ids", js: "threat-ids", typ: u(undefined, a(r("ThreatID"))) },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Characterization": o([
        { json: "facets", js: "facets", typ: a(r("Facet")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "origin", js: "origin", typ: r("FindingOrigin") },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
    ], false),
    "Facet": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "name", js: "name", typ: "" },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "system", js: "system", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "MitigatingFactor": o([
        { json: "description", js: "description", typ: "" },
        { json: "implementation-uuid", js: "implementation-uuid", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "subjects", js: "subjects", typ: u(undefined, a(r("IdentifiesTheSubject"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "RiskRelatedObservation": o([
        { json: "observation-uuid", js: "observation-uuid", typ: "" },
    ], false),
    "RiskResponse": o([
        { json: "description", js: "description", typ: "" },
        { json: "lifecycle", js: "lifecycle", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "origins", js: "origins", typ: u(undefined, a(r("FindingOrigin"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "required-assets", js: "required-assets", typ: u(undefined, a(r("RequiredAsset"))) },
        { json: "tasks", js: "tasks", typ: u(undefined, a(r("Task"))) },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "RequiredAsset": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "subjects", js: "subjects", typ: u(undefined, a(r("IdentifiesTheSubject"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "RiskLog": o([
        { json: "entries", js: "entries", typ: a(r("RiskLogEntry")) },
    ], false),
    "RiskLogEntry": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "end", js: "end", typ: u(undefined, Date) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "logged-by", js: "logged-by", typ: u(undefined, a(r("LoggedBy"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-responses", js: "related-responses", typ: u(undefined, a(r("RiskResponseReference"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "start", js: "start", typ: Date },
        { json: "status-change", js: "status-change", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "RiskResponseReference": o([
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-tasks", js: "related-tasks", typ: u(undefined, a(r("TaskReference"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "response-uuid", js: "response-uuid", typ: "" },
    ], false),
    "ThreatID": o([
        { json: "href", js: "href", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "system", js: "system", typ: "" },
    ], false),
    "Catalog": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "controls", js: "controls", typ: u(undefined, a(r("Control"))) },
        { json: "groups", js: "groups", typ: u(undefined, a(r("ControlGroup"))) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "params", js: "params", typ: u(undefined, a(r("Parameter"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Control": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "controls", js: "controls", typ: u(undefined, a(r("Control"))) },
        { json: "id", js: "id", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "params", js: "params", typ: u(undefined, a(r("Parameter"))) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Parameter": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "constraints", js: "constraints", typ: u(undefined, a(r("Constraint"))) },
        { json: "depends-on", js: "depends-on", typ: u(undefined, "") },
        { json: "guidelines", js: "guidelines", typ: u(undefined, a(r("Guideline"))) },
        { json: "id", js: "id", typ: "" },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "select", js: "select", typ: u(undefined, r("Selection")) },
        { json: "usage", js: "usage", typ: u(undefined, "") },
        { json: "values", js: "values", typ: u(undefined, a("")) },
    ], false),
    "Constraint": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "tests", js: "tests", typ: u(undefined, a(r("ConstraintTest"))) },
    ], false),
    "ConstraintTest": o([
        { json: "expression", js: "expression", typ: "" },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "Guideline": o([
        { json: "prose", js: "prose", typ: "" },
    ], false),
    "Selection": o([
        { json: "choice", js: "choice", typ: u(undefined, a("")) },
        { json: "how-many", js: "how-many", typ: u(undefined, r("ParameterCardinality")) },
    ], false),
    "ControlGroup": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "controls", js: "controls", typ: u(undefined, a(r("Control"))) },
        { json: "groups", js: "groups", typ: u(undefined, a(r("ControlGroup"))) },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "params", js: "params", typ: u(undefined, a(r("Parameter"))) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ComponentDefinition": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "capabilities", js: "capabilities", typ: u(undefined, a(r("Capability"))) },
        { json: "components", js: "components", typ: u(undefined, a(r("ComponentDefinitionComponent"))) },
        { json: "import-component-definitions", js: "import-component-definitions", typ: u(undefined, a(r("ImportComponentDefinition"))) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Capability": o([
        { json: "control-implementations", js: "control-implementations", typ: u(undefined, a(r("ControlImplementationSet"))) },
        { json: "description", js: "description", typ: "" },
        { json: "incorporates-components", js: "incorporates-components", typ: u(undefined, a(r("IncorporatesComponent"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "name", js: "name", typ: "" },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ControlImplementationSet": o([
        { json: "description", js: "description", typ: "" },
        { json: "implemented-requirements", js: "implemented-requirements", typ: a(r("ImplementedRequirementElement")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("SetParameterValue"))) },
        { json: "source", js: "source", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImplementedRequirementElement": o([
        { json: "control-id", js: "control-id", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("SetParameterValue"))) },
        { json: "statements", js: "statements", typ: u(undefined, a(r("ControlStatementImplementation"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "SetParameterValue": o([
        { json: "param-id", js: "param-id", typ: "" },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "values", js: "values", typ: a("") },
    ], false),
    "ControlStatementImplementation": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "statement-id", js: "statement-id", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "IncorporatesComponent": o([
        { json: "component-uuid", js: "component-uuid", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "ComponentDefinitionComponent": o([
        { json: "control-implementations", js: "control-implementations", typ: u(undefined, a(r("ControlImplementationSet"))) },
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "protocols", js: "protocols", typ: u(undefined, a(r("ServiceProtocolInformation"))) },
        { json: "purpose", js: "purpose", typ: u(undefined, "") },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "title", js: "title", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImportComponentDefinition": o([
        { json: "href", js: "href", typ: "" },
    ], false),
    "PlanOfActionAndMilestonesPOAM": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "import-ssp", js: "import-ssp", typ: u(undefined, r("ImportSystemSecurityPlan")) },
        { json: "local-definitions", js: "local-definitions", typ: u(undefined, r("PlanOfActionAndMilestonesLocalDefinitions")) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "observations", js: "observations", typ: u(undefined, a(r("Observation"))) },
        { json: "poam-items", js: "poam-items", typ: a(r("POAMItem")) },
        { json: "risks", js: "risks", typ: u(undefined, a(r("IdentifiedRisk"))) },
        { json: "system-id", js: "system-id", typ: u(undefined, r("SystemIdentification")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "PlanOfActionAndMilestonesLocalDefinitions": o([
        { json: "components", js: "components", typ: u(undefined, a(r("AssessmentAssetsComponent"))) },
        { json: "inventory-items", js: "inventory-items", typ: u(undefined, a(r("InventoryItem"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "POAMItem": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "origins", js: "origins", typ: u(undefined, a(r("PoamItemOrigin"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "related-observations", js: "related-observations", typ: u(undefined, a(r("PoamItemRelatedObservation"))) },
        { json: "related-risks", js: "related-risks", typ: u(undefined, a(r("PoamItemRelatedRisk"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: u(undefined, "") },
    ], false),
    "PoamItemOrigin": o([
        { json: "actors", js: "actors", typ: a(r("OriginatingActor")) },
    ], false),
    "PoamItemRelatedObservation": o([
        { json: "observation-uuid", js: "observation-uuid", typ: "" },
    ], false),
    "PoamItemRelatedRisk": o([
        { json: "risk-uuid", js: "risk-uuid", typ: "" },
    ], false),
    "SystemIdentification": o([
        { json: "id", js: "id", typ: "" },
        { json: "identifier-type", js: "identifier-type", typ: u(undefined, "") },
    ], false),
    "Profile": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "imports", js: "imports", typ: a(r("ImportResource")) },
        { json: "merge", js: "merge", typ: u(undefined, r("MergeControls")) },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "modify", js: "modify", typ: u(undefined, r("ModifyControls")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImportResource": o([
        { json: "exclude-controls", js: "exclude-controls", typ: u(undefined, a(r("Call"))) },
        { json: "href", js: "href", typ: "" },
        { json: "include-all", js: "include-all", typ: u(undefined, r("IncludeAll")) },
        { json: "include-controls", js: "include-controls", typ: u(undefined, a(r("Call"))) },
    ], false),
    "Call": o([
        { json: "matching", js: "matching", typ: u(undefined, a(r("MatchControlsByPattern"))) },
        { json: "with-child-controls", js: "with-child-controls", typ: u(undefined, r("IncludeContainedControlsWithControl")) },
        { json: "with-ids", js: "with-ids", typ: u(undefined, a("")) },
    ], false),
    "MatchControlsByPattern": o([
        { json: "pattern", js: "pattern", typ: u(undefined, "") },
    ], false),
    "MergeControls": o([
        { json: "as-is", js: "as-is", typ: u(undefined, true) },
        { json: "combine", js: "combine", typ: u(undefined, r("CombinationRule")) },
        { json: "custom", js: "custom", typ: u(undefined, r("CustomGrouping")) },
        { json: "flat", js: "flat", typ: u(undefined, r("Flat")) },
    ], false),
    "CombinationRule": o([
        { json: "method", js: "method", typ: u(undefined, r("CombinationMethod")) },
    ], false),
    "CustomGrouping": o([
        { json: "groups", js: "groups", typ: u(undefined, a(r("CustomGroup"))) },
        { json: "insert-controls", js: "insert-controls", typ: u(undefined, a(r("SelectControls"))) },
    ], false),
    "CustomGroup": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "groups", js: "groups", typ: u(undefined, a(r("CustomGroup"))) },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "insert-controls", js: "insert-controls", typ: u(undefined, a(r("SelectControls"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "params", js: "params", typ: u(undefined, a(r("Parameter"))) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SelectControls": o([
        { json: "exclude-controls", js: "exclude-controls", typ: u(undefined, a(r("Call"))) },
        { json: "include-all", js: "include-all", typ: u(undefined, r("IncludeAll")) },
        { json: "include-controls", js: "include-controls", typ: u(undefined, a(r("Call"))) },
        { json: "order", js: "order", typ: u(undefined, r("Order")) },
    ], false),
    "Flat": o([
    ], false),
    "ModifyControls": o([
        { json: "alters", js: "alters", typ: u(undefined, a(r("Alteration"))) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("ParameterSetting"))) },
    ], false),
    "Alteration": o([
        { json: "adds", js: "adds", typ: u(undefined, a(r("Addition"))) },
        { json: "control-id", js: "control-id", typ: "" },
        { json: "removes", js: "removes", typ: u(undefined, a(r("Removal"))) },
    ], false),
    "Addition": o([
        { json: "by-id", js: "by-id", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "params", js: "params", typ: u(undefined, a(r("Parameter"))) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part"))) },
        { json: "position", js: "position", typ: u(undefined, r("Position")) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
    ], false),
    "Removal": o([
        { json: "by-class", js: "by-class", typ: u(undefined, "") },
        { json: "by-id", js: "by-id", typ: u(undefined, "") },
        { json: "by-item-name", js: "by-item-name", typ: u(undefined, "") },
        { json: "by-name", js: "by-name", typ: u(undefined, "") },
        { json: "by-ns", js: "by-ns", typ: u(undefined, "") },
    ], false),
    "ParameterSetting": o([
        { json: "class", js: "class", typ: u(undefined, "") },
        { json: "constraints", js: "constraints", typ: u(undefined, a(r("Constraint"))) },
        { json: "depends-on", js: "depends-on", typ: u(undefined, "") },
        { json: "guidelines", js: "guidelines", typ: u(undefined, a(r("Guideline"))) },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "param-id", js: "param-id", typ: "" },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "select", js: "select", typ: u(undefined, r("Selection")) },
        { json: "usage", js: "usage", typ: u(undefined, "") },
        { json: "values", js: "values", typ: u(undefined, a("")) },
    ], false),
    "SystemSecurityPlanSSP": o([
        { json: "back-matter", js: "back-matter", typ: u(undefined, r("BackMatter")) },
        { json: "control-implementation", js: "control-implementation", typ: r("ControlImplementationClass") },
        { json: "import-profile", js: "import-profile", typ: r("ImportProfile") },
        { json: "metadata", js: "metadata", typ: r("PublicationMetadata") },
        { json: "system-characteristics", js: "system-characteristics", typ: r("SystemCharacteristics") },
        { json: "system-implementation", js: "system-implementation", typ: r("SystemImplementation") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ControlImplementationClass": o([
        { json: "description", js: "description", typ: "" },
        { json: "implemented-requirements", js: "implemented-requirements", typ: a(r("ControlBasedRequirement")) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("SetParameterValue"))) },
    ], false),
    "ControlBasedRequirement": o([
        { json: "by-components", js: "by-components", typ: u(undefined, a(r("ComponentControlImplementation"))) },
        { json: "control-id", js: "control-id", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("SetParameterValue"))) },
        { json: "statements", js: "statements", typ: u(undefined, a(r("SpecificControlStatement"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ComponentControlImplementation": o([
        { json: "component-uuid", js: "component-uuid", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "export", js: "export", typ: u(undefined, r("Export")) },
        { json: "implementation-status", js: "implementation-status", typ: u(undefined, r("ImplementationStatus")) },
        { json: "inherited", js: "inherited", typ: u(undefined, a(r("InheritedControlImplementation"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "satisfied", js: "satisfied", typ: u(undefined, a(r("SatisfiedControlImplementationResponsibility"))) },
        { json: "set-parameters", js: "set-parameters", typ: u(undefined, a(r("SetParameterValue"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Export": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "provided", js: "provided", typ: u(undefined, a(r("ProvidedControlImplementation"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsibilities", js: "responsibilities", typ: u(undefined, a(r("ControlImplementationResponsibility"))) },
    ], false),
    "ProvidedControlImplementation": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ControlImplementationResponsibility": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "provided-uuid", js: "provided-uuid", typ: u(undefined, "") },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "InheritedControlImplementation": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "provided-uuid", js: "provided-uuid", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "SatisfiedControlImplementationResponsibility": o([
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsibility-uuid", js: "responsibility-uuid", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "SpecificControlStatement": o([
        { json: "by-components", js: "by-components", typ: u(undefined, a(r("ComponentControlImplementation"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-roles", js: "responsible-roles", typ: u(undefined, a(r("ResponsibleRole"))) },
        { json: "statement-id", js: "statement-id", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "ImportProfile": o([
        { json: "href", js: "href", typ: "" },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "SystemCharacteristics": o([
        { json: "authorization-boundary", js: "authorization-boundary", typ: r("AuthorizationBoundary") },
        { json: "data-flow", js: "data-flow", typ: u(undefined, r("DataFlow")) },
        { json: "date-authorized", js: "date-authorized", typ: u(undefined, "") },
        { json: "description", js: "description", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "network-architecture", js: "network-architecture", typ: u(undefined, r("NetworkArchitecture")) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "responsible-parties", js: "responsible-parties", typ: u(undefined, a(r("ResponsibleParty"))) },
        { json: "security-impact-level", js: "security-impact-level", typ: r("SecurityImpactLevel") },
        { json: "security-sensitivity-level", js: "security-sensitivity-level", typ: "" },
        { json: "status", js: "status", typ: r("SystemCharacteristicsStatus") },
        { json: "system-ids", js: "system-ids", typ: a(r("SystemIdentification")) },
        { json: "system-information", js: "system-information", typ: r("SystemInformation") },
        { json: "system-name", js: "system-name", typ: "" },
        { json: "system-name-short", js: "system-name-short", typ: u(undefined, "") },
    ], false),
    "AuthorizationBoundary": o([
        { json: "description", js: "description", typ: "" },
        { json: "diagrams", js: "diagrams", typ: u(undefined, a(r("Diagram"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "Diagram": o([
        { json: "caption", js: "caption", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "DataFlow": o([
        { json: "description", js: "description", typ: "" },
        { json: "diagrams", js: "diagrams", typ: u(undefined, a(r("Diagram"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "NetworkArchitecture": o([
        { json: "description", js: "description", typ: "" },
        { json: "diagrams", js: "diagrams", typ: u(undefined, a(r("Diagram"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
    ], false),
    "SecurityImpactLevel": o([
        { json: "security-objective-availability", js: "security-objective-availability", typ: "" },
        { json: "security-objective-confidentiality", js: "security-objective-confidentiality", typ: "" },
        { json: "security-objective-integrity", js: "security-objective-integrity", typ: "" },
    ], false),
    "SystemCharacteristicsStatus": o([
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "state", js: "state", typ: r("FluffyState") },
    ], false),
    "SystemInformation": o([
        { json: "information-types", js: "information-types", typ: a(r("InformationType")) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
    ], false),
    "InformationType": o([
        { json: "availability-impact", js: "availability-impact", typ: r("AvailabilityImpactLevel") },
        { json: "categorizations", js: "categorizations", typ: u(undefined, a(r("InformationTypeCategorization"))) },
        { json: "confidentiality-impact", js: "confidentiality-impact", typ: r("ConfidentialityImpactLevel") },
        { json: "description", js: "description", typ: "" },
        { json: "integrity-impact", js: "integrity-impact", typ: r("IntegrityImpactLevel") },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: u(undefined, "") },
    ], false),
    "AvailabilityImpactLevel": o([
        { json: "adjustment-justification", js: "adjustment-justification", typ: u(undefined, "") },
        { json: "base", js: "base", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "selected", js: "selected", typ: u(undefined, "") },
    ], false),
    "InformationTypeCategorization": o([
        { json: "information-type-ids", js: "information-type-ids", typ: u(undefined, a("")) },
        { json: "system", js: "system", typ: "" },
    ], false),
    "ConfidentialityImpactLevel": o([
        { json: "adjustment-justification", js: "adjustment-justification", typ: u(undefined, "") },
        { json: "base", js: "base", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "selected", js: "selected", typ: u(undefined, "") },
    ], false),
    "IntegrityImpactLevel": o([
        { json: "adjustment-justification", js: "adjustment-justification", typ: u(undefined, "") },
        { json: "base", js: "base", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "selected", js: "selected", typ: u(undefined, "") },
    ], false),
    "SystemImplementation": o([
        { json: "components", js: "components", typ: a(r("AssessmentAssetsComponent")) },
        { json: "inventory-items", js: "inventory-items", typ: u(undefined, a(r("InventoryItem"))) },
        { json: "leveraged-authorizations", js: "leveraged-authorizations", typ: u(undefined, a(r("LeveragedAuthorization"))) },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "users", js: "users", typ: a(r("SystemUser")) },
    ], false),
    "LeveragedAuthorization": o([
        { json: "date-authorized", js: "date-authorized", typ: "" },
        { json: "links", js: "links", typ: u(undefined, a(r("Link"))) },
        { json: "party-uuid", js: "party-uuid", typ: "" },
        { json: "props", js: "props", typ: u(undefined, a(r("Property"))) },
        { json: "remarks", js: "remarks", typ: u(undefined, "") },
        { json: "title", js: "title", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Transport": [
        "TCP",
        "UDP",
    ],
    "PurpleState": [
        "disposition",
        "operational",
        "other",
        "under-development",
    ],
    "PartyType": [
        "organization",
        "person",
    ],
    "TimeUnit": [
        "days",
        "hours",
        "minutes",
        "months",
        "seconds",
        "years",
    ],
    "ActorType": [
        "assessment-platform",
        "party",
        "tool",
    ],
    "ObjectiveStatusState": [
        "not-satisfied",
        "satisfied",
    ],
    "FindingTargetType": [
        "objective-id",
        "statement-id",
    ],
    "ParameterCardinality": [
        "one",
        "one-or-more",
    ],
    "IncludeContainedControlsWithControl": [
        "no",
        "yes",
    ],
    "CombinationMethod": [
        "keep",
        "merge",
        "use-first",
    ],
    "Order": [
        "ascending",
        "descending",
        "keep",
    ],
    "Position": [
        "after",
        "before",
        "ending",
        "starting",
    ],
    "FluffyState": [
        "disposition",
        "operational",
        "other",
        "under-development",
        "under-major-modification",
    ],
};
