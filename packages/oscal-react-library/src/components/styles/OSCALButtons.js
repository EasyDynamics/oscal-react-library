import Button from "@mui/material/Button";

// TODO: Add class name
export const OSCALPrimaryButton = (props) => {
  return <Button {...props} className="" variant="contained" color="primary" disableElevation />;
};

export const OSCALSecondaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={{
        ":hover": {
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.white.main,
        },
      }}
    />
  );
};

export const OSCALSecondarySecondaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={{
        fontSize: "0.75rem",
        marginTop: "0.75rem",
        paddingX: "0.5rem",
        minWidth: 0,
        ":hover": {
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.white.main,
        },
      }}
    />
  );
};

export const OSCALTertiaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="text"
      color="primary"
      disableElevation
      sx={{
        ":hover": {
          backgroundColor: (theme) => theme.palette.lightBlue.main,
        },
      }}
    />
  );
};

export const OSCALDestructiveButton = (props) => {
  return (
    <Button
      {...props}
      className="DestructiveButton"
      variant="contained"
      disableElevation
      sx={{
        backgroundColor: (theme) => theme.palette.destructive.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.destructive.dark,
        },
      }}
    />
  );
};

export const OSCALUnsatisfiedButton = (props) => {
  return (
    <Button
      {...props}
      className=""
      variant="contained"
      disableElevation
      sx={{
        color: (theme) => theme.palette.black.main,
        backgroundColor: (theme) => theme.palette.lightPink.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.lightPink.dark,
        },
      }}
    />
  );
};

export const OSCALSatisfiedButton = (props) => {
  return (
    <Button
      {...props}
      className=""
      variant="contained"
      disableElevation
      sx={{
        color: (theme) => theme.palette.black.main,
        backgroundColor: (theme) => theme.palette.lightGreen.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.lightGreen.dark,
        },
      }}
    />
  );
};

export const OSCALImportButton = (props) => {
  return (
    <form>
      <input {...props} type="file" className="inputFile" />
    </form>
  );
};
