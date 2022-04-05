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

export function buildRestRequestUrl(
  partialRestData,
  restUrlPath,
  oscalObjectType
) {
  let url;
  if (!restUrlPath || restUrlPath === "") {
    url = `${process.env.REACT_APP_REST_BASE_URL}/${oscalObjectType.restPath}/${partialRestData[oscalObjectType.jsonRootName].uuid}`;
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
export function performRestRequest(
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
};
