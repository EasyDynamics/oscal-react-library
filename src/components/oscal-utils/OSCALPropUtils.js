/**
 * When a namespace is not specified for a property, the assumption is that the
 * namespace is default namespace.
 */
const NIST_DEFAULT_NAMESPACE = "https://csrc.nist.gov/ns/oscal";

/**
 * Return the given namespace, or if undefined, the default namespace.
 */
export function namespaceOf(ns) {
  return ns ?? NIST_DEFAULT_NAMESPACE;
}

/**
 * Returns the first matching property in the given list.
 *
 * @param props the list of properties to check
 * @param filter the attributes to match against
 */
export default function matchingProp(props, filter) {
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
