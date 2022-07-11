import { v4 as uuidv4 } from "uuid";

/**
 * enum describing the available REST methods
 */
export const restMethods = {
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
};

interface OscalObjectType {
  name: string;
  defaultUrl: string;
  defaultUuid: string;
  jsonRootName: string;
  restPath: string;
}

export const oscalObjectTypes: { [key: string]: OscalObjectType } = {
  catalog: {
    name: "Catalog",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/catalogs/NIST_SP-800-53_rev5_catalog.json",
    defaultUuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
    jsonRootName: "catalog",
    restPath: "catalogs",
  },
  component: {
    name: "Component",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/component-definitions/example-component.json",
    defaultUuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
    jsonRootName: "component-definition",
    restPath: "component-definitions",
  },
  profile: {
    name: "Profile",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/profiles/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    defaultUuid: "8b3beca1-fcdc-43e0-aebb-ffc0a080c486",
    jsonRootName: "profile",
    restPath: "profiles",
  },
  ssp: {
    name: "System Security Plan",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  },
};

/**
 * Populates a map of oscal object types to oscal objects retrieved from a get request.
 *
 * @param {string} backendUrl base url of server to fetch from
 * @param {Object} oscalObjectType Object that contains information on an oscalObject
 * @param {(any) => void} handleResult Function to map a fetched result to the json root name of an oscal object
 */
export function fetchAllResourcesOfType(
  backendUrl: string,
  oscalObjectType: OscalObjectType,
  handleResult: (_: any) => void
) {
  fetch(`${backendUrl}/${oscalObjectType.restPath}`)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status}`);
      else return response.json();
    })
    .then(handleResult);
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Update a partial REST data at the field defined by editedFieldJsonPath with
 * newValue.
 *
 * @param data data to be updated with new value, for later use in a REST request
 * @param editedFieldJsonPath path to the field that is being updated
 * @param newValue updated value for the edited field
 * @param appendToLastFieldInPath boolean indicating if the updated value should be appended to an array or replace an existing value
 */
export function populatePartialRestData(
  data: any,
  editedFieldJsonPath: string[],
  newValue = null,
  appendToLastFieldInPath = false
) {
  if (editedFieldJsonPath.length === 1) {
    const editData = data;

    if (appendToLastFieldInPath) {
      editData[editedFieldJsonPath[0]].push(newValue);
    } else {
      editData[editedFieldJsonPath[0]] = newValue;
    }

    return;
  }

  if (Number.isInteger(editedFieldJsonPath.at(0))) {
    populatePartialRestData(
      data[Number(editedFieldJsonPath.shift())],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else {
    populatePartialRestData(
      data[editedFieldJsonPath.shift()!],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  }
}

interface RequestUrlProps {
  partialRestData?: any;
  restUrlPath?: string;
  oscalObjectType?: OscalObjectType;
}

function buildRequestUrlWithoutObject(restUrlPath: string): string {
  if (restUrlPath.startsWith("http://") || restUrlPath.startsWith("https://")) {
    return restUrlPath;
  }
  return `${process.env.REACT_APP_REST_BASE_URL}/${restUrlPath}`;
}

function buildRequestUrlWithObject(
  oscalObjectType: OscalObjectType,
  partialRestData: any
) {
  return `${process.env.REACT_APP_REST_BASE_URL}/${oscalObjectType.restPath}/${
    partialRestData[oscalObjectType.jsonRootName].uuid
  }`;
}

export function buildRequestUrl(props: RequestUrlProps): string {
  const { partialRestData, restUrlPath, oscalObjectType } = props;
  if (!partialRestData && !oscalObjectType) {
    return buildRequestUrlWithoutObject(restUrlPath!);
  }
  return buildRequestUrlWithObject(oscalObjectType!, partialRestData);
}

/**
 * Sends a REST request of type restMethod to a backend service.
 *
 * @param restJsonPayload data that will be passed into the body of the REST request
 * @param httpMethod the HTTP request type
 * @param requestUrl the REST URL to send the request to
 * @param onPreRestRequest function called just before making the REST request
 * @param onSuccess function called on a successful REST request with the result of the request as an argument
 * @param onError function called on error with the error as an argument
 */
export function performRequest(
  restJsonPayload: any,
  httpMethod: string,
  requestUrl: string,
  onPreRestRequest: () => void,
  onSuccess: (_: any) => void,
  onError: (_: Error) => void
) {
  onPreRestRequest();

  const requestInfo = {
    method: httpMethod,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(restJsonPayload),
  };

  fetch(requestUrl, requestInfo)
    .then(
      (response) => {
        if (!response.ok) throw new Error(response.status.toString());
        else return response.json();
      },
      (err) => onError(err)
    )
    .then(
      (result) => {
        onSuccess(result);
      },
      (err) => onError(err)
    );
}

/**
 * Creates and performs the REST request for updating an SSP control implementation
 * implemented requirement statement by component from the given data.
 *
 * @param partialRootRestData the partial root SSP object
 * @param implementedRequirement the existing implemented requirement object
 * @param statementId the id of the statement to be updated
 * @param componentId the id of the by-component to be updated
 * @param description the new description value for the control implementation
 * @param implementationSetParameters an array of the new set-parameters
 * @param onPreRestRequest function called just before making the REST request
 * @param onSuccess function called on a successful REST request with the result of the request as an argument
 * @param onError function called on error with the error as an argument
 */
export function createOrUpdateSspControlImplementationImplementedRequirementStatementByComponent(
  partialRootRestData: any,
  implementedRequirement: any,
  statementId: string,
  componentId: string,
  description: string,
  implementationSetParameters: any,
  onPreRestRequest: () => void,
  onSuccess: (_: any) => void,
  onError: (_: Error) => void
) {
  const partialRestImplementedRequirement = deepClone(implementedRequirement);

  // Find our statement
  let statement = partialRestImplementedRequirement.statements?.find(
    (element: any) => element["statement-id"] === statementId
  );

  // If our statement doesn't exist, create and add it
  if (!statement) {
    statement = {
      "statement-id": statementId,
      uuid: uuidv4(),
      "by-components": [],
    };
    partialRestImplementedRequirement.statements ??= [];
    partialRestImplementedRequirement.statements.push(statement);
  }

  // Find our statementByComponent
  let statementByComponent = statement["by-components"]?.find(
    (element: any) => element["component-uuid"] === componentId
  );
  // If our statementByComponent doesn't exit, create and add it
  if (!statementByComponent) {
    statementByComponent = {
      "component-uuid": componentId,
      uuid: uuidv4(),
    };
    statement["by-components"] ??= [];
    statement["by-components"].push(statementByComponent);
  }
  statementByComponent.description = description;

  // Set each implementation parameter
  if (implementationSetParameters?.length) {
    statementByComponent["set-parameters"] ??= [];
    implementationSetParameters
      .filter((element: any) => !!element)
      .forEach((implementationSetParameter: any) => {
        const foundExistingSetParam = statementByComponent[
          "set-parameters"
        ].find(
          (element: any) =>
            element["param-id"] === implementationSetParameter["param-id"]
        );
        if (foundExistingSetParam) {
          foundExistingSetParam.values = implementationSetParameter.values;
        } else {
          statementByComponent["set-parameters"].push(
            implementationSetParameter
          );
        }
      });
  }

  const rootUuid = partialRootRestData[oscalObjectTypes.ssp.jsonRootName].uuid;
  const rootRestPath = `${oscalObjectTypes.ssp.restPath}/${rootUuid}`;
  const requestUrl = `${rootRestPath}/control-implementation/implemented-requirements/${implementedRequirement.uuid}`;

  performRequest(
    { "implemented-requirement": partialRestImplementedRequirement },
    restMethods.PUT,
    buildRequestUrl({ restUrlPath: requestUrl }),
    onPreRestRequest,
    onSuccess,
    onError
  );
}

/**
 * Creates and performs the REST request for adding a new SSP control implementation
 * implemented requirement from the data.
 *
 * @param {*} partialRootRestData the partial root SSP object
 * @param {*} newImplementedRequirement the new implemented requirement to add
 * @param {*} onPreRestRequest function called just before making the REST request
 * @param {*} onSuccess function called on a successful REST request with the result of the request as an argument
 * @param {*} onError function called on error with the error as an argument
 */
export function createSspControlImplementationImplementedRequirement(
  partialRootRestData: any,
  newImplementedRequirement: any,
  onPreRestRequest: () => void,
  onSuccess: (_: any) => void,
  onError: (_: Error) => void
) {
  const rootUuid = partialRootRestData[oscalObjectTypes.ssp.jsonRootName].uuid;
  const rootRestPath = `${oscalObjectTypes.ssp.restPath}/${rootUuid}`;
  const requestUrl = `${rootRestPath}/control-implementation/implemented-requirements`;

  performRequest(
    { "implemented-requirement": newImplementedRequirement },
    restMethods.POST,
    buildRequestUrl({ restUrlPath: requestUrl }),
    onPreRestRequest,
    onSuccess,
    onError
  );
}
