import React from "react";
import { Box, Container, Link, Typography, Stack, Button } from "@mui/material";

export interface WelcomeProps {
  readonly isEditor?: boolean;
}

const Welcome: React.FC<WelcomeProps> = (props) => {
  const type = props.isEditor ? "Editor" : "Viewer";
  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: "4em",
          pb: 6,
          width: "100%",
          height: "calc(50vh - 4em)",
          minHeight: "calc(50vh - 4em)",
        }}
      >
        <Container maxWidth="lg">
          <Typography component="h1" variant="h2" color="text.white" align="center" gutterBottom>
            OSCAL {type}
          </Typography>
          <Typography variant="h5" align="center" color="text.white">
            Visually represent OSCAL{" "}
            <Link color="inherit" href="/catalog/">
              Catalogs
            </Link>
            ,{" "}
            <Link color="inherit" href="/profile/">
              Profiles
            </Link>
            ,{" "}
            <Link color="inherit" href="/component-definition/">
              Comonent Definitions
            </Link>
            , and{" "}
            <Link color="inherit" href="/system-security-plan/">
              System Security Plans
            </Link>{" "}
            in your web browser.
          </Typography>
          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="secondary" size="large" href="/catalog/">
              Get Started
            </Button>
            <Button variant="outlined" color="secondary" size="large" href="/#docs">
              Read more
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ pt: "2em" }}>
        <Typography component="h2" variant="h4" id="docs">
          About the OSCAL {type}
        </Typography>
        <Typography sx={{ pt: "1em" }}>
          The OSCAL {type} is built on top of the{" "}
          <Link href="https://github.com/EasyDynamics/oscal-react-library" target="_blank">
            OSCAL React Library
          </Link>
          , a component library for visualizing the individual assemblies of an OSCAL document. This
          tool is open source and
          <Link
            href="https://github.com/EasyDynamics/oscal-react-library/tree/develop/packages/oscal-viewer"
            target="_blank"
          >
            available on GitHub.
          </Link>
        </Typography>
      </Container>
    </>
  );
};

export default Welcome;
