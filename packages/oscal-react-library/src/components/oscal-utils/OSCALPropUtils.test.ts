import { propWithName } from "./OSCALPropUtils";

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
});
