/**
 * When a namespace is not specified for a property, the assumption is that the
 * namespace is default namespace.
 */
const NIST_DEFAULT_NAMESPACE = "https://csrc.nist.gov/ns/oscal";

/**
 * Return the given namespace, or if undefined, the default namespace.
 *
 * @param {string | undefined} ns the namespace
 * @returns {string} the given namespace or the the default namespace
 */
export function namespaceOf(ns) {
  return ns ?? NIST_DEFAULT_NAMESPACE;
}

/**
 * @callback PropertyFilterValueMatcher
 * @param {string} value - the value to check against
 * @returns {boolean} whether the given property matches
 */

/**
 * A filter to apply to properties to find a matching property.
 *
 * This allows matching based on the namespace (defaulting to the default namespace),
 * the name, and the value. Exactly one of `value` or `filter` must be supplied.
 *
 * @typedef PropertyFilter
 * @type {object}
 * @property {string|undefined} ns - the namespace to check in
 * @property {string| name} name - the name of the field to match
 * @property {string} value - the value of the field to match
 * @property {PropertyFilterValueMatcher} filter - a function to match the value against
 */

export function propWithName(props, name, ns) {
  return matchingProp(props, { name, ns, filter: () => true });
}

/**
 * Returns the first matching property in the given list.
 *
 * @param {Array.<object>} props the list of properties to check
 * @param {PropertyFilter} filter attributes to match against
 * @returns {object} the matching property
 */
export default function matchingProp(props, filter) {
  if (!props || !filter) {
    return undefined;
  }
  if ((!filter.value && !filter.filter) || (filter.value && filter.filter)) {
    throw new Error("Exactly one of filter or value must be specified");
  }

  return props.find(
    (prop) =>
      namespaceOf(prop.ns) === namespaceOf(filter.ns) &&
      prop.name === filter.name &&
      (!filter.value || prop.value === filter.value) &&
      (!filter.filter || filter.filter(prop.value))
  );
}
