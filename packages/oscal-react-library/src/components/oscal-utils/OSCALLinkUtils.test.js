import { guessExtensionFromHref } from "./OSCALLinkUtils";

describe("guessExtensionFromHref", () => {
  it("gets favicon", async () => {
    expect(
      guessExtensionFromHref("https://easydynamics.com/favicon.ico")
    ).toEqual("ICO");
  });

  it("gets png", async () => {
    expect(
      guessExtensionFromHref(`https://easydynamics.com/diagram.png`)
    ).toEqual("PNG");
  });

  it("gets unknown", async () => {
    expect(
      guessExtensionFromHref(
        `https://easydynamics.com/unknown/unknown-filetype`
      )
    ).toEqual("Unknown");
  });

  it("gets OSCAL React Library README.md", async () => {
    expect(
      guessExtensionFromHref(
        "https://raw.githubusercontent.com/EasyDynamics/oscal-react-library/develop/README.md"
      )
    ).toEqual("MD");
  });

  it("gets OSCAL React Library PR#574", async () => {
    expect(
      guessExtensionFromHref(
        "https://github.com/EasyDynamics/oscal-react-library/pull/574/files"
      )
    ).toEqual("Unknown");
  });

  it("gets NIST SP.800-97 Publication", async () => {
    expect(
      guessExtensionFromHref(`"https://doi.org/10.6028/NIST.SP.800-97"`)
    ).toEqual("Unknown");
  });

  it("gets US government configuration baseline", async () => {
    expect(
      guessExtensionFromHref(
        "https://csrc.nist.gov/projects/united-states-government-configuration-baseline"
      )
    ).toEqual("Unknown");
  });

  it("gets Easy Dynamics SSP JSON Example", async () => {
    expect(
      guessExtensionFromHref(
        "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json"
      )
    ).toEqual("JSON");
  });

  it("gets github.com", async () => {
    expect(guessExtensionFromHref("https://github.com/")).toEqual("Unknown");
  });

  it("gets bad github content link", async () => {
    expect(guessExtensionFromHref("githubuserconte.nt")).toEqual("Unknown");
  });

  it("gets bad diagram link", async () => {
    expect(
      guessExtensionFromHref("https://easydynamics.com/diagram.png/")
    ).toEqual("Unknown");
  });
});
