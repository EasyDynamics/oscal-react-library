import { Oscal } from "@easydynamics/oscal-types";
import { OscalObjectType, OscalObjectWrapped } from "./OSCALObjectData";

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
 * Populates a map of oscal object types to oscal objects retrieved from a get request.
 *
 * @param {string} backendUrl base url of server to fetch from
 * @param {Object} oscalObjectType Object that contains information on an oscalObject
 * @param {(any) => void} handleResult Function to map a fetched result to the json root name of an oscal object
 */
export function fetchAllResourcesOfType<T extends keyof Oscal>(
  backendUrl: string | undefined,
  oscalObjectType: OscalObjectType,
  handleResult: (result: OscalObjectWrapped<T>[]) => void
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
