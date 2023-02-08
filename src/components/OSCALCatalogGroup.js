import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import OSCALControl from "./OSCALControl";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { determineHashControlType } from "./oscal-utils/OSCALLinkUtils";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "0.5em",
  marginBottom: "1em",
  backgroundColor: theme.palette.grey[50],
}));

const StyledListItemPaper = styled(Paper)`
  border-radius: 0.5em;
`;

const StyledControlDescriptionWrapper = styled("div")`
  padding: 1em;
`;

function CollapseableListItem(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const { hash } = window.location;

    // Ensure hash exists and grab element associated
    const elementWithHash = hash && document.getElementById(hash.substring(1));

    // Locate the element with the provided hash and scroll to the item
    if (elementWithHash) {
      elementWithHash.scrollIntoView({ behavior: "smooth" });

      // Find control state and open collapsable item
      const controlHash = determineHashControlType(hash)
        ? hash.substring(1)
        : null;

      if (props.itemText?.props?.value === controlHash) {
        setOpen(true);
      }
    }
  }, [window.location.hash]);

  return (
    <StyledListItemPaper>
      <StyledListItem onClick={handleClick}>
        <ListItemText primary={props.itemText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <StyledControlDescriptionWrapper>
          {props.children}
        </StyledControlDescriptionWrapper>
      </Collapse>
    </StyledListItemPaper>
  );
}

function OSCALCatalogControlListItem(props) {
  const { control } = props;

  return (
    <CollapseableListItem
      itemText={
        <OSCALAnchorLinkHeader value={`${control.id.toLowerCase()}`}>
          {`${control.id.toUpperCase()} ${control.title}`}
        </OSCALAnchorLinkHeader>
      }
    >
      <OSCALControl
        showInList
        control={control}
        childLevel={0}
        key={control.id}
      />
    </CollapseableListItem>
  );
}

function OSCALCatalogGroupList(props) {
  return (
    <CollapseableListItem itemText={props.group.title}>
      <OSCALControlList>
        {props.group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList group={innerGroup} key={innerGroup.title} />
        ))}
        {props.group.controls?.map((control) => (
          <OSCALCatalogControlListItem control={control} key={control.id} />
        ))}
      </OSCALControlList>
    </CollapseableListItem>
  );
}

export default function OSCALCatalogGroup(props) {
  return (
    <OSCALControlList>
      {props.group.groups?.map((innerGroup) => (
        <OSCALCatalogGroupList group={innerGroup} key={innerGroup.title} />
      ))}
      {props.group.controls?.map((control) => (
        <OSCALCatalogControlListItem control={control} key={control.id} />
      ))}
    </OSCALControlList>
  );
}
