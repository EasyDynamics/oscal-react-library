import React from "react";
import Alert from "@material-ui/lab/Alert";

function defaultFormatter(error) {
  return (
    <Alert severity="error">
      Yikes! Something went wrong loading the OSCAL data. Sorry, we&apos;ll look
      into it. ({error.message})
    </Alert>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.errorFormatter = props.errorFormatter ?? defaultFormatter;
    this.state = { error: undefined };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error !== undefined) {
      return this.errorFormatter(this.state.error);
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
