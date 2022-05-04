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

export const oscalObjectTypes = {
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
    name: "SSP",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  },
};

export function getOscalObjectTypeFromJsonRootName(jsonRootName) {
  return Object.keys(oscalObjectTypes).find(
    (element) => element.jsonRootName === jsonRootName
  );
}

export function deepClone(obj) {
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
  data,
  editedFieldJsonPath,
  newValue = null,
  appendToLastFieldInPath = false
) {
  if (editedFieldJsonPath.length === 1) {
    const editData = data;

    if (appendToLastFieldInPath) {
      editData[editedFieldJsonPath].push(newValue);
    } else {
      editData[editedFieldJsonPath] = newValue;
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
      data[editedFieldJsonPath.shift()],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  }
}

export function buildRequestUrl(partialRestData, restUrlPath, oscalObjectType) {
  let url;
  if (!restUrlPath || restUrlPath === "") {
    url = `${process.env.REACT_APP_REST_BASE_URL}/${oscalObjectType.restPath}/${
      partialRestData[oscalObjectType.jsonRootName].uuid
    }`;
  } else if (restUrlPath.startsWith("http", 0)) {
    url = restUrlPath;
  } else {
    url = `${process.env.REACT_APP_REST_BASE_URL}/${restUrlPath}`;
  }
  return url;
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
  restJsonPayload,
  httpMethod,
  requestUrl,
  onPreRestRequest,
  onSuccess,
  onError
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
        if (!response.ok) throw new Error(response.status);
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
 * implemented requirement statement by compontent from the given data.
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
  partialRootRestData,
  implementedRequirement,
  statementId,
  componentId,
  description,
  implementationSetParameters,
  onPreRestRequest,
  onSuccess,
  onError
) {
  const partialRestImplementedRequirement = deepClone(implementedRequirement);

  // Find our statement
  let statement = partialRestImplementedRequirement?.statements?.find(
    (element) => element["statement-id"] === statementId
  );

  // If our statement doesn't exist, create and add it
  if (!statement) {
    statement = {
      "statement-id": props.statementId,
      uuid: uuidv4(),
      "by-components": [],
    };
    if (!partialRestImplementedRequirement.statements) {
      partialRestImplementedRequirement.statements = [];
    }
    partialRestImplementedRequirement.statements.push(statement);
  }

  // Find our statementByComponent
  let statementByComponent = statement["by-components"].find(
    (element) => element["component-uuid"] === componentId
  );
  // If our statementByComponent doesn't exit, create and add it
  if (!statementByComponent) {
    statementByComponent = {
      "component-uuid": componentId,
      uuid: uuidv4()
    };
    if (!statement["by-components"]) {
      statement["by-components"] = [];
    }
    statement["by-components"].push(statementByComponent);
  }
  statementByComponent.description = description;

  // Set each implementation parameter
  if (implementationSetParameters) {
    if (!statementByComponent["set-parameters"]) {
      statementByComponent["set-parameters"] = [];
    }
    implementationSetParameters.forEach((element) =>
      statementByComponent["set-parameters"].push(element)
    );
  }

  const rootUuid = partialRootRestData[oscalObjectTypes.ssp.jsonRootName].uuid;
  const rootRestPath = `${oscalObjectTypes.ssp.restPath}/${rootUuid}`;
  const requestUrl = `${rootRestPath}/control-implementation/implemented-requirements/${implementedRequirement.uuid}`;

  performRequest(
    partialRestImplementedRequirement,
    restMethods.PUT,
    requestUrl,
    onPreRestRequest,
    onSuccess,
    onError
  );
}
