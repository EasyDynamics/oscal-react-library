import type { Property } from "@easydynamics/oscal-types";

/**
 * When a namespace is not specified for a property, the assumption is that the
 * namespace is default namespace.
 */
export const NIST_DEFAULT_NAMESPACE = "https://csrc.nist.gov/ns/oscal";

/**
 * Return the given namespace, or if undefined, the default namespace.
 *
 * @param ns the namespace
 * @returns the given namespace or the the default namespace
 */
export function namespaceOf(ns: string | undefined): string {
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
 * Returns the first prop with a matching name attribute.
 *
 * This is useful to look up the value of a specific prop under a namespace.
 * To check whether a property has a specific value, prefer {@link matchingProp}.
 */
export function propWithName(
  props: Property[] | undefined,
  name: string,
  ns?: string | undefined
): Property | undefined {
  return matchingProp(props, { name, ns, filter: () => true });
}

export default function matchingProp(
  props: Property[] | undefined,
  filter: PropertyFilter
): Property | undefined {
  if ((!filter.value && !filter.filter) || (filter.value && filter.filter)) {
    throw new Error("Exactly one of filter or value must be specified");
  }

  return props?.find(
    (prop) =>
      namespaceOf(prop.ns) === namespaceOf(filter.ns) &&
      prop.name === filter.name &&
      (!filter.value || prop.value === filter.value) &&
      (!filter.filter || filter.filter(prop.value))
  );
}
