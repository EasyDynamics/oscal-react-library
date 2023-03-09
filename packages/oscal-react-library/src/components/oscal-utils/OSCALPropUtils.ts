/**
 * When a namespace is not specified for a property, the assumption is that the
 * namespace is default namespace.
 */
const NIST_DEFAULT_NAMESPACE = "https://csrc.nist.gov/ns/oscal";

/**
 * Return the given namespace, or if undefined, the default namespace.
 *
 * @param ns the namespace
 * @returns the given namespace or the the default namespace
 */
export function namespaceOf(ns: string | undefined) : string {
  return ns ?? NIST_DEFAULT_NAMESPACE;
}

export interface PropertyFilter {
  /**
   * The namespace of the property.
   *
   * @default the default NIST OSCAL namespace
   */
  readonly ns?: string;

  /**
   * The name of the property to match.
   */
  readonly name: string;

  /**
   * The value of the property to match.
   *
   * This must be an exact string match for the property value. For more
   * complex matching, supply a function to the {@link filter} property.
   *
   * Exactly one of {@link value} or {@link filter} must be supplied.
   */
  readonly value?: string;

  /**
   * A function to apply to match the property value.
   *
   * This function returns a boolean if the property value is considered
   * a match. This function is only invoked if the name and namespace also
   * match.
   *
   * Exactly one of {@link value} or {@link filter} must be supplied.
   */
  readonly filter?: (value: string) => boolean;
}

/**
 * A basic type to represent an OSCAL property.
 *
 * TODO: Replace this with the actual OSCAL type once we have that type information.
 */
interface PropBasic  {
  ns?: string;
  name: string;
  value: string;
  class?: string;
}

export default function matchingProp(props: PropBasic[], filter: PropertyFilter): PropBasic | undefined {
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
