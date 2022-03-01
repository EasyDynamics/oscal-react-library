import React from "react";
import Alert from "@material-ui/lab/Alert";

/**
 * A basic FallbackComponent for the {@link ErrorBoundary}. Displays a "yikes"
 * message using a Material UI Alert.
 */
export function BasicError(props) {
  return (
    <Alert severity="error">
      Yikes! Something went wrong loading the OSCAL data. Sorry, we&apos;ll look
      into it. ({props.error.message})
    </Alert>
  );
}

/**
 * Creates a React Error Boundary to ensure that errors are handled and that the
 * application does not get unmounted.
 *
 * The following `props` are accepted (in addition to standard component props):
 *
 *  - `FallbackComponent`: The component to used to display the error. A single
 *    prop will be passed, `error`, containing the error object that was caught.
 *    This defaults to {@link BasicError}.
 *  - `onError(error)`: A function to be executed when a function is caught, the
 *    error passed in is the error that was caught.
 *
 * Providing a `key` will cause the boundary to be reset and remounted when the
 * key changes, as with any React component. This may be useful for allowing the
 * component to be redrawn.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error !== undefined) {
      return React.createElement(this.props.FallbackComponent ?? BasicError, {
        error: this.state.error,
      });
    }
    return this.props.children || null;
  }
}
