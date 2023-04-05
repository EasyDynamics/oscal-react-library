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
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import OSCALControlLabel from "./OSCALControlLabel";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import {
  appendToFragmentPrefix,
  shiftFragmentSuffix,
  conformLinkIdText,
  isValidFragment,
} from "./oscal-utils/OSCALLinkUtils";

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
    fragmentPrefix,
    fragmentSuffix,
    listItemOpened,
    setListItemOpened,
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isItemNavigatedTo, isSetItemNavigatedTo] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (listItemOpened) {
      isSetItemNavigatedTo(true);
      return;
    }
    // Ensure fragment exists and split by groupings
    if (!isValidFragment(urlFragment)) {
      return;
    }
    // Find control list state and open collapsible item
    const currentControl = fragmentSuffix.split("/")[0];
    if (currentControl === control?.id) {
      setIsOpen(true);
      const elementWithFragment = document.getElementById(control.id);
      elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [urlFragment, fragmentSuffix, listItemOpened, control?.id]);

  return (
    <StyledListItemPaper>
      <StyledListItem onClick={handleClick}>
        <ListItemText primary={itemText} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </StyledListItem>
      <Collapse
        in={isOpen}
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
            isItemNavigatedTo={isItemNavigatedTo}
            urlFragment={urlFragment}
            fragmentPrefix={fragmentPrefix}
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
    fragmentPrefix,
    fragmentSuffix,
    isControlListItemOpened,
    setIsControlListItemOpened,
  } = props;

  const withdrawn = isWithdrawn(control);
  const itemText = (
    <OSCALAnchorLinkHeader
      value={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}
    >
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
      fragmentPrefix={appendToFragmentPrefix(fragmentPrefix, control.id)}
      fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
      listItemOpened={isControlListItemOpened}
      setListItemOpened={setIsControlListItemOpened}
    >
      <OSCALControl
        showInList
        control={control}
        childLevel={0}
        key={control.id}
        urlFragment={urlFragment}
        fragmentPrefix={appendToFragmentPrefix(fragmentPrefix, control.id)}
        fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
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
    fragmentPrefix,
    fragmentSuffix,
    isControlListItemOpened,
    setIsControlListItemOpened,
  } = props;

  return (
    <CollapsibleListItem
      itemText={group.title}
      control={control}
      urlFragment={urlFragment}
      fragmentPrefix={fragmentPrefix}
      fragmentSuffix={fragmentSuffix}
      listItemOpened={isControlListItemOpened}
      setListItemOpened={setIsControlListItemOpened}
    >
      <OSCALControlList>
        {group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList
            group={innerGroup}
            key={innerGroup.title}
            urlFragment={urlFragment}
            fragmentPrefix={appendToFragmentPrefix(fragmentPrefix, innerGroup)}
            fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
            isControlListItemOpened={isControlListItemOpened}
            setIsControlListItemOpened={setIsControlListItemOpened}
          />
        ))}
        {group.controls?.map((groupControl) => (
          <OSCALCatalogControlListItem
            control={groupControl}
            key={groupControl.id}
            urlFragment={urlFragment}
            fragmentPrefix={appendToFragmentPrefix(
              fragmentPrefix,
              groupControl
            )}
            fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
            isControlListItemOpened={isControlListItemOpened}
            setIsControlListItemOpened={setIsControlListItemOpened}
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
    isControlListItemOpened,
    setIsControlListItemOpened,
  } = props;
  // Note: "fragmentPrefix" is specific to setting up a fragment in the url, by adding groupings;
  // while "fragmentSuffix" is specific to finding a control from a fragment, trimming found groups
  const fragmentPrefix = group.id ?? conformLinkIdText(group.title) ?? "";
  const fragmentSuffix = urlFragment
    ? `${urlFragment.substring(urlFragment.indexOf("/") + 1)}`
    : null;

  return (
    <OSCALControlList>
      {group.groups?.map((innerGroup) => (
        <OSCALCatalogGroupList
          group={innerGroup}
          key={innerGroup.title}
          urlFragment={urlFragment}
          fragmentPrefix={appendToFragmentPrefix(fragmentPrefix, innerGroup)}
          fragmentSuffix={fragmentSuffix}
          isControlListItemOpened={isControlListItemOpened}
          setIsControlListItemOpened={setIsControlListItemOpened}
        />
      ))}
      {group.controls?.map((control) => (
        <OSCALCatalogControlListItem
          control={control}
          key={control.id}
          urlFragment={urlFragment}
          fragmentPrefix={fragmentPrefix}
          fragmentSuffix={urlFragment ?? null}
          isControlListItemOpened={isControlListItemOpened}
          setIsControlListItemOpened={setIsControlListItemOpened}
        />
      ))}
    </OSCALControlList>
  );
}
