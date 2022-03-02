import { createStyles, makeStyles } from "@material-ui/core/styles";

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
