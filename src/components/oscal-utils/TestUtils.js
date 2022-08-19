import { screen } from "@testing-library/react";
import { getURLMediaType } from "./OSCALLinkUtils";

export default function getByTextIncludingChildren(textMatch) {
  return screen.getByText((content, node) => {
    const hasText = (testNode) =>
      testNode.textContent === textMatch ||
      testNode.textContent.match(textMatch);
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

export function getURLMediaTypeWithUrl(url, name) {
  return getURLMediaType(url).match(name);
}
