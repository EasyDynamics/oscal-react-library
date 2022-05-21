import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";

const useLoaderStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      paddingLeft: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
    },
  })
);

// eslint-disable-next-line import/prefer-default-export
export { useLoaderStyles };
