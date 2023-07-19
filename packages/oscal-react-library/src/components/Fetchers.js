//////////////////////////////////////////////////////////////////////////
// API helper functions
export function useFetchers() {
  const fetchUploadFile = (file, success, fail) => {
    var formData = new FormData();
    formData.append("file", file);

    const requestOptions = {
      method: "POST",
      body: formData,
    };
    fetch("/upload_file", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(
        (data) => {
          if (success) success(data);
        },
        (e) => {
          console.log("/upload_file call failed with exception: " + e.toString());
          if (fail) fail(e);
        }
      );
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // OSCAL Transaction API

  const fetchTransaction = (operation, request, success, fail) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    };
    var slash = "/";
    if (operation.startsWith("/")) {
      slash = "";
    }
    fetch("/transaction" + slash + operation, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(
        (data) => {
          if (success) success(data);
        },
        (e) => {
          console.log(operation + " call failed with error: " + e.toString());
          if (fail) fail(e);
        }
      );
  };

  const fetchRest = (operation, request, success, fail) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    var slash = "/";
    if (operation.startsWith("/")) {
      slash = "";
    }
    fetch("/rest" + slash + operation, request)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(
        (data) => {
          if (success) success(data);
        },
        (e) => {
          console.log(operation + " call failed with error: " + e.toString());
          if (fail) fail(e);
        }
      );
  };

  const fetchRestGetData = (operation, success, fail) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    var slash = "/";
    if (operation.startsWith("/")) {
      slash = "";
    }
    fetch("/rest" + slash + operation, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(
        (data) => {
          if (success) success(data);
        },
        (e) => {
          console.log(operation + " call failed with error: " + e.toString());
          if (fail) fail(e);
        }
      );
  };

  const output = {
    fetchUploadFile,
    fetchRest,
    fetchRestGetData,
    fetchTransaction,
  };

  return output;
}
