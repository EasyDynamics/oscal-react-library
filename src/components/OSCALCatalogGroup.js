import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect } from "react";
import OSCALControl from "./OSCALControl";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { determineControlGroupFromFragment } from "./oscal-utils/OSCALLinkUtils";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import OSCALControlLabel from "./OSCALControlLabel";
import { propWithName } from "./oscal-utils/OSCALPropUtils";

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

const WithdrawnListItemText = styled(ListItemText)(({ theme }) => ({
  textDecoration: "line-through",
  color: theme.palette.grey[400],
}));

const StyledControlDescriptionWrapper = styled("div")`
  padding: 1em;
`;

function CollapsibleListItem(props) {
  const {
    urlFragment,
    control,
    itemText,
    children,
    listItemOpened,
    setListItemOpened,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [itemNavigatedTo, setItemNavigatedTo] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFragment = useCallback(() => {
    if (listItemOpened) {
      setItemNavigatedTo(true);
      return;
    }
    // Grab fragment identifier following hash character if fragment exists in location
    const controlFragment = urlFragment !== "" ? props.urlFragment : null;
    const controlGroupingFragment =
      determineControlGroupFromFragment(controlFragment);
    // Locate the element with the provided fragment and scroll to the item
    if (!controlGroupingFragment) {
      return;
    }
    // Find control list state and open collapsible item
    if (controlFragment.includes(control.id)) {
      setOpen(true);
    }
    const elementWithFragment = document.getElementById(controlFragment);
    elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
  }, [urlFragment, listItemOpened, control?.id]);

  useEffect(() => {
    handleFragment();
  }, [handleFragment]);

  return (
    <StyledListItemPaper>
      <StyledListItem onClick={handleClick}>
        <ListItemText primary={itemText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </StyledListItem>
      <Collapse
        in={open}
        timeout="auto"
        onEntered={() => setListItemOpened(true)}
        unmountOnExit
      >
        <StyledControlDescriptionWrapper>
          {children}
          <OSCALControl
            showInList
            control={control}
            childLevel={0}
            key={control?.id}
            listItemOpened={listItemOpened}
            itemNavigatedTo={itemNavigatedTo}
            urlFragment={urlFragment}
          />
        </StyledControlDescriptionWrapper>
      </Collapse>
    </StyledListItemPaper>
  );
}

function OSCALCatalogControlListItem(props) {
  const {
    control,
    urlFragment,
    controlListItemOpened,
    setControlListItemOpened,
  } = props;
  const withdrawn = isWithdrawn(control);
  const itemText = (
    <OSCALAnchorLinkHeader value={`${control.id.toLowerCase()}`}>
      <OSCALControlLabel
        label={propWithName(control.props, "label")?.value}
        id={control.id}
        component="span"
      />
      {control.title}
    </OSCALAnchorLinkHeader>
  );

  return !withdrawn ? (
    <CollapsibleListItem
      itemText={itemText}
      control={control}
      urlFragment={urlFragment}
      listItemOpened={controlListItemOpened}
      setListItemOpened={setControlListItemOpened}
    >
      <OSCALControl
        showInList
        control={control}
        childLevel={0}
        key={control.id}
        urlFragment={urlFragment}
      />
    </CollapsibleListItem>
  ) : (
    <StyledListItemPaper>
      <StyledListItem>
        <WithdrawnListItemText primary={itemText} withdrawn={withdrawn} />
      </StyledListItem>
    </StyledListItemPaper>
  );
}

function OSCALCatalogGroupList(props) {
  const {
    group,
    control,
    urlFragment,
    controlListItemOpened,
    setControlListItemOpened,
  } = props;
  return (
    <CollapsibleListItem
      itemText={group.title}
      control={control}
      urlFragment={urlFragment}
      listItemOpened={controlListItemOpened}
      setListItemOpened={setControlListItemOpened}
    >
      <OSCALControlList>
        {group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList
            group={innerGroup}
            key={innerGroup.title}
            urlFragment={urlFragment}
            controlListItemOpened={controlListItemOpened}
            setControlListItemOpened={setControlListItemOpened}
          />
        ))}
        {group.controls?.map((groupControl) => (
          <OSCALCatalogControlListItem
            control={groupControl}
            key={groupControl.id}
            urlFragment={urlFragment}
            controlListItemOpened={controlListItemOpened}
            setControlListItemOpened={setControlListItemOpened}
          />
        ))}
      </OSCALControlList>
    </CollapsibleListItem>
  );
}

export default function OSCALCatalogGroup(props) {
  const {
    group,
    urlFragment,
    controlListItemOpened,
    setControlListItemOpened,
  } = props;
  return (
    <OSCALControlList>
      {group.groups?.map((innerGroup) => (
        <OSCALCatalogGroupList
          group={innerGroup}
          key={innerGroup.title}
          urlFragment={urlFragment}
          controlListItemOpened={controlListItemOpened}
          setControlListItemOpened={setControlListItemOpened}
        />
      ))}
      {group.controls?.map((control) => (
        <OSCALCatalogControlListItem
          control={control}
          key={control.id}
          urlFragment={urlFragment}
          controlListItemOpened={controlListItemOpened}
          setControlListItemOpened={setControlListItemOpened}
        />
      ))}
    </OSCALControlList>
  );
}
