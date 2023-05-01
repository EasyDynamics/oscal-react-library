import {
  ComponentControlImplementation,
  ControlBasedRequirement,
  Oscal,
  SetParameterValue,
  SpecificControlStatement,
} from "@easydynamics/oscal-types";
import { v4 as uuidv4 } from "uuid";
import { OscalObjectType, oscalObjectTypes } from "./OSCALObjectData";

/**
 * enum describing the available REST methods
 */
export enum RestMethod {
  DELETE = "DELETE",
  GET = "GET",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
}

/**
 * Re-mark all the fields in an object as mutable.
 *
 * This is a TERRIBLE IDEA. But we do it anyway because there are some really bad
 * previous decisions to mutate data. This violates React's assumptions and generally
 * makes things harder to reason about here.
 *
 * @deprecated use immutable data structures instead
 */
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Populates a map of oscal object types to oscal objects retrieved from a get request.
 *
 * @param {string} backendUrl base url of server to fetch from
 * @param {Object} oscalObjectType Object that contains information on an oscalObject
 * @param {(any) => void} handleResult Function to map a fetched result to the json root name of an oscal object
 */
export function fetchAllResourcesOfType<T extends keyof Oscal>(
  backendUrl: string,
  oscalObjectType: OscalObjectType,
  handleResult: (result: Pick<Oscal, T>[]) => void
) {
  fetch(`${backendUrl}/${oscalObjectType.restPath}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status.toString());
      else return response.json();
    })
    .then(handleResult);
}

/**
 * Clone all attributes of a JSON-serializable object.
 *
 * **Note**: this functions is **not safe** for objects with fields that cannot be represented
 * in JSON.
 *
 * @param obj the object to clone
 * @returns the cloned object
 */
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
  newValue: any = null,
  appendToLastFieldInPath = false
) {
  if (editedFieldJsonPath.length === 0) {
    return;
  }
  if (editedFieldJsonPath.length === 1) {
    if (appendToLastFieldInPath) {
      data[editedFieldJsonPath[0]].push(newValue);
    } else {
      data[editedFieldJsonPath[0]] = newValue;
    }
    return;
  }

  const firstField = editedFieldJsonPath.shift()!;
  if (Number.isInteger(editedFieldJsonPath.at(0))) {
    populatePartialRestData(
      data[Number(firstField)],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else {
    populatePartialRestData(
      data[firstField],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  }
}

export function buildRequestUrl(
  partialRestData: any,
  restUrlPath: string | undefined,
  oscalObjectType: OscalObjectType | null
): string {
  if (!restUrlPath && oscalObjectType) {
    return `${process.env.REACT_APP_REST_BASE_URL}/${oscalObjectType.restPath}/${
      partialRestData[oscalObjectType.jsonRootName].uuid
    }`;
  } else if (restUrlPath?.startsWith("http", 0)) {
    return restUrlPath;
  } else {
    return `${process.env.REACT_APP_REST_BASE_URL}/${restUrlPath}`;
  }
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
  httpMethod: RestMethod,
  requestUrl: string,
  onPreRestRequest: () => void,
  onSuccess: (result: any) => void,
  onError: (err: any) => void
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
  implementedRequirement: ControlBasedRequirement,
  statementId: string,
  componentId: string,
  description: string,
  implementationSetParameters: SetParameterValue[],
  onPreRestRequest: () => void,
  onSuccess: (result: any) => void,
  onError: (err: any) => void
) {
  const partialRestImplementedRequirement: Mutable<ControlBasedRequirement> =
    deepClone(implementedRequirement);

  // Find our statement
  let statement: Mutable<SpecificControlStatement> | undefined =
    partialRestImplementedRequirement.statements?.find(
      (element) => element["statement-id"] === statementId
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
  let statementByComponent: Mutable<ComponentControlImplementation> | undefined = statement[
    "by-components"
  ]?.find((element) => element["component-uuid"] === componentId);
  // If our statementByComponent doesn't exit, create and add it
  if (!statementByComponent) {
    statementByComponent = {
      "component-uuid": componentId,
      uuid: uuidv4(),
      description: "",
    };
    statement["by-components"] ??= [];
    statement["by-components"].push(statementByComponent);
  }
  statementByComponent.description = description;

  // Set each implementation parameter
  if (implementationSetParameters?.length) {
    statementByComponent["set-parameters"] ??= [];
    implementationSetParameters
      .filter((element) => !!element)
      .forEach((implementationSetParameter) => {
        const foundExistingSetParam: Mutable<SetParameterValue> | undefined = statementByComponent![
          "set-parameters"
        ]?.find((element) => element["param-id"] === implementationSetParameter["param-id"]);
        if (foundExistingSetParam) {
          foundExistingSetParam.values = implementationSetParameter.values;
        } else {
          statementByComponent!["set-parameters"]?.push(implementationSetParameter);
        }
      });
  }

  const rootUuid = partialRootRestData[oscalObjectTypes.ssp.jsonRootName].uuid;
  const rootRestPath = `${oscalObjectTypes.ssp.restPath}/${rootUuid}`;
  const requestUrl = `${rootRestPath}/control-implementation/implemented-requirements/${implementedRequirement.uuid}`;

  performRequest(
    { "implemented-requirement": partialRestImplementedRequirement },
    RestMethod.PUT,
    buildRequestUrl(null, requestUrl, null),
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
  newImplementedRequirement: ControlBasedRequirement,
  onPreRestRequest: () => void,
  onSuccess: (result: any) => void,
  onError: (err: any) => void
) {
  const rootUuid = partialRootRestData[oscalObjectTypes.ssp.jsonRootName].uuid;
  const rootRestPath = `${oscalObjectTypes.ssp.restPath}/${rootUuid}`;
  const requestUrl = `${rootRestPath}/control-implementation/implemented-requirements`;

  performRequest(
    { "implemented-requirement": newImplementedRequirement },
    RestMethod.POST,
    buildRequestUrl(null, requestUrl, null),
    onPreRestRequest,
    onSuccess,
    onError
  );
}
