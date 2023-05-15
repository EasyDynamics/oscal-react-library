import { NIST_DEFAULT_NAMESPACE, propWithName } from "./OSCALPropUtils";

const TEST_NS = "https://test.easydynamics.com/ns/oscal-react/";

const testProps = {
  nsWithStuff: [
    {
      name: "test",
      value: "test2",
      ns: TEST_NS,
    },
    {
      name: "test",
      value: "expect-this-value",
    },
  ],
  noNs: [
    {
      name: "test",
      value: "value",
    },
  ],
  defaultNistNsExplicit: [
    {
      name: "test",
      value: "test",
      // This is the default NIST OSCAL namespace from the documentation
      // directly. This allows us to ensure that the constant we use is
      // defined correctly.
      ns: "http://csrc.nist.gov/ns/oscal",
    },
  ],
};

describe("OSCAL Prop Utils", () => {
  it("gets correct value using default namespace", () => {
    // GIVEN
    const props = testProps.nsWithStuff;
    // THEN
    expect(propWithName(props, "test", TEST_NS)?.value).toBe("test2");
  });

  it("gets correct value when provided a namespace", () => {
    // GIVEN
    const props = testProps.nsWithStuff;
    // THEN
    expect(propWithName(props, "test", TEST_NS)?.value).toBe("test2");
  });

  it("has the correct value for the NIST namespace", () => {
    const props = testProps.defaultNistNsExplicit;
    expect(propWithName(props, "test", NIST_DEFAULT_NAMESPACE)?.value).toBe("test");
    expect(propWithName(props, "test")?.value).toBe("test");
  });
});
