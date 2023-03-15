import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OSCALControl from "./OSCALControl";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { determineControlGroupFromFragment } from "./oscal-utils/OSCALLinkUtils";

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
  const [listItemOpened, setListItemOpened] = React.useState(false);

  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFragment = useCallback(() => {
    if (listItemOpened) {
      return;
    }
    // Grab fragment identifier following hash character if fragment exists in location
    const controlFragment =
      location.hash !== "" ? location.hash.substring(1) : null;
    const controlGroupingFragment =
      determineControlGroupFromFragment(controlFragment);
    // Locate the element with the provided fragment and scroll to the item
    if (!controlGroupingFragment) {
      return;
    }
    // Find control list state and open collapsable item
    if (controlFragment.includes(props.control?.id)) {
      setOpen(true);
    }
    const elementWithFragment = document.getElementById(controlFragment);
    elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
  }, [location.hash, listItemOpened, props.control?.id]);

  useEffect(() => {
    handleFragment();
  }, [handleFragment]);

  return (
    <StyledListItemPaper>
      <StyledListItem onClick={handleClick}>
        <ListItemText primary={props.itemText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </StyledListItem>
      <Collapse
        in={open}
        timeout="auto"
        onEntered={() => setListItemOpened(true)}
        unmountOnExit
      >
        <StyledControlDescriptionWrapper>
          {props.children}
          <OSCALControl
            showInList
            control={props.control}
            childLevel={0}
            key={props.control?.id}
            listItemOpened={listItemOpened}
          />
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
      control={control}
    />
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
