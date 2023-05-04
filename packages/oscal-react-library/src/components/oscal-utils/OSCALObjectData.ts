import { Oscal } from "@easydynamics/oscal-types";

export type OscalObjectWrapped<T extends keyof Oscal> = Record<T, NonNullable<Oscal[T]>>;

export interface OscalObjectType {
  name: string;
  defaultUrl: string;
  defaultUuid: string;
  jsonRootName: keyof Oscal;
  restPath: string;
}

export const oscalObjectTypes: Record<
  "catalog" | "component" | "profile" | "ssp",
  OscalObjectType
> = {
  catalog: {
    name: "Catalog",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/catalogs/NIST_SP-800-53_rev5_catalog.json",
    defaultUuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
    jsonRootName: "catalog",
    restPath: "catalogs",
  } satisfies OscalObjectType,
  component: {
    name: "Component",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/component-definitions/example-component.json",
    defaultUuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
    jsonRootName: "component-definition",
    restPath: "component-definitions",
  } satisfies OscalObjectType,
  profile: {
    name: "Profile",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/profiles/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    defaultUuid: "8b3beca1-fcdc-43e0-aebb-ffc0a080c486",
    jsonRootName: "profile",
    restPath: "profiles",
  } satisfies OscalObjectType,
  ssp: {
    name: "System Security Plan",
    defaultUrl:
      "https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev4/templates/ssp/json/FedRAMP-SSP-OSCAL-Template.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  } satisfies OscalObjectType,
} as const;
