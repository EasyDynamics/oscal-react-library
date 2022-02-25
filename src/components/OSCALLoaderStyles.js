import { makeStyles } from "@material-ui/core/styles";

export default function useLoaderStyles() {
  return makeStyles(() => ({
    paper: {
      display: "flex",
      flexDirection: "column",
    },
  }));
}
