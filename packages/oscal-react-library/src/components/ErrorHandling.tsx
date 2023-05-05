import React from "react";
import Alert from "@mui/material/Alert";

/**
 * A basic FallbackComponent for the {@link ErrorBoundary}. Displays a "yikes"
 * message using a Material UI Alert.
 */
export function BasicError(props: { error: Error }) {
  // Cleanup the message to prevent potential weird spacing around the parenthesis
  const message = props.error.message?.trim();
  return (
    <Alert severity="error">
      <details>
        <summary>Yikes! Something went wrong loading the OSCAL data.</summary>
        {message}
      </details>
    </Alert>
  );
}

/**
 * A really horrible hacky solution to throw an error at the right part in a
 * tree.
 *
 * This allows an error to be thrown as a component in a tree at a particular
 * point. Using this is probably an indication that the components should be
 * restructured or that state should flow in a different way.
 *
 * @deprecated
 */
export function ErrorThrower(props: { error: Error }) {
  if (props.error) {
    throw props.error;
  }
  return null;
}
