import { screen } from "@testing-library/react";

function getByTextIncludingChildern(textMatch) {
  return screen.getByText((content, node) => {
    const hasText = (node) =>
      node.textContent === textMatch || node.textContent.match(textMatch);
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

export { getByTextIncludingChildern as default };
