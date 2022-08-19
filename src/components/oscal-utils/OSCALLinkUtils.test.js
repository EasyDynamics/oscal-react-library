import { getURLMediaType } from "./OSCALLinkUtils";

describe("getURLMediaType", () => {
  it("gets favicon", async () => {
    expect(getURLMediaType("https://easydynamics.com/favicon.ico")).toEqual(
      "ICO"
    );
  });

  it("gets png", async () => {
    expect(getURLMediaType(`https://easydynamics.com/diagram.png`)).toEqual(
      "PNG"
    );
  });

  it("gets unknown", async () => {
    expect(
      getURLMediaType(`https://easydynamics.com/unknown/unknown-filetype`)
    ).toEqual("Unknown");
  });

  it("gets OSCAL React Library README.md", async () => {
    expect(
      getURLMediaType(
        "https://raw.githubusercontent.com/EasyDynamics/oscal-react-library/develop/README.md"
      )
    ).toEqual("MD");
  });

  it("gets OSCAL React Library PR#574", async () => {
    expect(
      getURLMediaType(
        "https://github.com/EasyDynamics/oscal-react-library/pull/574/files"
      )
    ).toEqual("Unknown");
  });

  it("gets NIST SP.800-97 Publication", async () => {
    expect(getURLMediaType(`"https://doi.org/10.6028/NIST.SP.800-97"`)).toEqual(
      "Unknown"
    );
  });

  it("gets US government configuration baseline", async () => {
    expect(
      getURLMediaType(
        "https://csrc.nist.gov/projects/united-states-government-configuration-baseline"
      )
    ).toEqual("Unknown");
  });

  it("gets Easy Dynamics SSP JSON Example", async () => {
    expect(
      getURLMediaType(
        "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json"
      )
    ).toEqual("JSON");
  });

  it("gets href", async () => {
    expect(getURLMediaType("https://github.com/")).toEqual("HREF");
  });

  it("gets bad link", async () => {
    expect(getURLMediaType("githubuserconte.nt")).toEqual("Unknown");
  });
});
