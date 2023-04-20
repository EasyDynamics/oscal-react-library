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

/**
 * Validates fragment and determines if top fragment item matches a list ID.
 *
 * @param {string} urlFragment The fragment currently being handled
 * @param {string} previousHandledFragment The previous handled fragment
 * @param {string} fragmentSuffix The current item and sub items
 * @param {string} listId The group/control ID
 * @returns {boolean} Whether the top list item matches a list ID or not.
 */
function isMatchingListItem(urlFragment, previousHandledFragment, fragmentSuffix, listId) {
  // Ensure fragment exists and split by groupings
  if (!urlFragment || previousHandledFragment === urlFragment) {
    return;
  }
  // Determine if current control/group list state matches ID
  const currentList = fragmentSuffix.split("/")[0];
  return currentList === listId;
}

/**
 * Creates a collapsible component for a catalog group/control.
 *
 * @param {any} props A set of properties pertaining to a collapsible list item
 * @returns A list item component with collapsible information
 */
function CollapsibleListItem(props) {
  /**
   * {string} urlFragment - The current fragment being handled
   * {any} group - A catalog group that contains either groups/controls
   * {string} listId - Identification used for a list
   * {string} itemText - The title of an item
   * {any} children - Children underneath the list item - either a control/group or control/group
   *   list
   * {string} fragmentSuffix - The end of a fragment which starts with the current group/control
   *   being handled
   * {boolean} listItemOpened - Tells whether or not the current list item is opened
   * {function} setIsListItemOpened - Callback function to set list item opened
   * {function} setIsListItemNavigatedTo - Callback function to set whether the list item has been
   *   navigated to
   * {string} previousHandledFragment - The fragment that was handled previously
   * {function} setPreviousHandledFragment - Callback function to set the previously handled fragment
   */
  const {
    urlFragment,
    group,
    listId,
    itemText,
    children,
    fragmentSuffix,
    listItemOpened,
    setListItemOpened,
    setIsListItemNavigatedTo,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (listItemOpened) {
      setIsListItemNavigatedTo(true);
      return;
    }

    if (isMatchingListItem(urlFragment, previousHandledFragment, fragmentSuffix, listId)) {
      setIsOpen(true);

      if (fragmentSuffix.split("/").length <= 1) {
        const elementWithFragment = document.getElementById(urlFragment);
        elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
        setPreviousHandledFragment(urlFragment);
      }
    }
  }, [
    urlFragment,
    fragmentSuffix,
    listItemOpened,
    setIsListItemNavigatedTo,
    listId,
    previousHandledFragment,
    setPreviousHandledFragment,
  ]);

  return (
    <StyledListItemPaper>
      <StyledListItem onClick={handleClick}>
        <ListItemText primary={itemText} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </StyledListItem>
      <Collapse
        in={isOpen}
        timeout="auto"
        onEntered={() => !group && setListItemOpened(true)}
        unmountOnExit
      >
        <StyledControlDescriptionWrapper>{children}</StyledControlDescriptionWrapper>
      </Collapse>
    </StyledListItemPaper>
  );
}

/**
 * Creates a top-level withdrawn control list item.
 *
 * @param {any} props A set of properties pertaining to a withdrawn control list item
 * @returns A top-level withdrawn control list item component
 */
function WithdrawnListItem(props) {
  /**
   * {string} urlFragment - The current fragment being handled
   * {string} listId - Identification used for a list
   * {any} children - Children underneath the list item - either a control/group or control/group
   *   list
   * {string} fragmentSuffix - The end of a fragment which starts with the current group/control
   *   being handled
   * {string} previousHandledFragment - The fragment that was handled previously
   * {function} setPreviousHandledFragment - Callback function to set the previously handled
   *   fragment
   */
  const {
    children,
    urlFragment,
    listId,
    fragmentSuffix,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  useEffect(() => {
    if (isMatchingListItem(urlFragment, previousHandledFragment, fragmentSuffix, listId)) {
      const elementWithFragment = document.getElementById(urlFragment);
      elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });

      if (fragmentSuffix.split("/").length <= 1) {
        setPreviousHandledFragment(urlFragment);
      }
    }
  }, [urlFragment, listId, fragmentSuffix, previousHandledFragment, setPreviousHandledFragment]);

  return (
    <StyledListItemPaper>
      <StyledListItem>{children}</StyledListItem>
    </StyledListItemPaper>
  );
}

/**
 * Creates a catalog list item component containing a catalog group/control.
 *
 * @param {any} props A set of properties pertaining to a list item
 * @returns A list item component which contains sub list item(s) and/or collapsible information
 */
function OSCALCatalogControlListItem(props) {
  /**
   * {any} control - The current control
   * {string} urlFragment - The current fragment being handled
   * {string} fragmentPrefix - The beginning of a fragment which ends with the current
   *   group/control being handled
   * {string} fragmentSuffix - The end of a fragment which starts with the current group/control
   *   being handled
   * {boolean} isControlListItemOpened - Tells whether the current list item is opened
   * {function} setIsControlListItemOpened - Callback function to set whether the list item has
   *   been navigated to
   * {string} previousHandledFragment - The fragment that was handled previously
   * {function} setPreviousHandledFragment - Callback function to set the previously handled
   *   fragment
   */
  const {
    control,
    urlFragment,
    fragmentPrefix,
    fragmentSuffix,
    isControlListItemOpened,
    setIsControlListItemOpened,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  const [isListItemNavigatedTo, setIsListItemNavigatedTo] = React.useState(false);
  useEffect(() => {
    if (!isControlListItemOpened) {
      setIsListItemNavigatedTo(false);
    }
  }, [isControlListItemOpened]);

  const withdrawn = isWithdrawn(control);
  const itemText = (
    <OSCALAnchorLinkHeader value={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}>
      <OSCALControlLabel
        label={propWithName(control.props, "label")?.value}
        id={control.id}
        component="span"
      />
      {control.title}
    </OSCALAnchorLinkHeader>
  );

  return withdrawn ? (
    <WithdrawnListItem
      primary={itemText}
      withdrawn={withdrawn}
      urlFragment={urlFragment}
      listId={control?.id}
      previousHandledFragment={previousHandledFragment}
      setPreviousHandledFragment={setPreviousHandledFragment}
      fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
    >
      <WithdrawnListItemText primary={itemText} withdrawn={withdrawn} />
    </WithdrawnListItem>
  ) : (
    <CollapsibleListItem
      itemText={itemText}
      urlFragment={urlFragment}
      fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
      listItemOpened={isControlListItemOpened}
      setListItemOpened={setIsControlListItemOpened}
      listId={control?.id}
      isListItemNavigatedTo={isListItemNavigatedTo}
      setIsListItemNavigatedTo={setIsListItemNavigatedTo}
      previousHandledFragment={previousHandledFragment}
      setPreviousHandledFragment={setPreviousHandledFragment}
    >
      <OSCALControl
        showInList
        control={control}
        childLevel={0}
        key={control.id}
        listItemOpened={isControlListItemOpened}
        isItemNavigatedTo={isListItemNavigatedTo}
        urlFragment={urlFragment}
        fragmentPrefix={appendToFragmentPrefix(fragmentPrefix, control.id)}
        fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
        previousHandledFragment={previousHandledFragment}
        setPreviousHandledFragment={setPreviousHandledFragment}
      />
    </CollapsibleListItem>
  );
}

/**
 * Creates a catalog group list which contains groups/controls.
 *
 * @param {any} props A set of properties pertaining to a group list
 * @returns A group list component which contains a set of items
 */
function OSCALCatalogGroupList(props) {
  /**
   * {any} group - The current group
   * {string} urlFragment - The current fragment being handled
   * {string} fragmentPrefix - The beginning of a fragment which ends with the current group/control
   *   being handled
   * {string} fragmentSuffix - The end of a fragment which starts with the current group/control
   *   being handled
   * {boolean} setIsControlListItemOpened - isControlListItemOpened Tells whether the current list
   *   item is opened
   * {function} setIsControlListItemOpened - Callback function to set whether the list item has
   *   been navigated to
   * {string} previousHandledFragment - The fragment that was handled previously
   * {function} setPreviousHandledFragment - Callback function to set the previously handled
   *   fragment
   */
  const {
    group,
    urlFragment,
    fragmentPrefix,
    fragmentSuffix,
    isControlListItemOpened,
    setIsControlListItemOpened,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  const [isListItemNavigatedTo, setIsListItemNavigatedTo] = React.useState(false);
  const itemText = (
    <OSCALAnchorLinkHeader
      value={appendToFragmentPrefix(
        fragmentPrefix,
        group.id ?? conformLinkIdText(group.title)
      ).toLowerCase()}
    >
      <OSCALControlLabel
        label={propWithName(group.props, "label")?.value}
        id={group.id ?? conformLinkIdText(group.title)}
        component="span"
      />
      {group.title}
    </OSCALAnchorLinkHeader>
  );
  return (
    <CollapsibleListItem
      itemText={itemText}
      group={group}
      listId={group?.id ?? conformLinkIdText(group?.title)}
      urlFragment={urlFragment}
      fragmentSuffix={fragmentSuffix}
      listItemOpened={isControlListItemOpened}
      setListItemOpened={setIsControlListItemOpened}
      isListItemNavigatedTo={isListItemNavigatedTo}
      setIsListItemNavigatedTo={setIsListItemNavigatedTo}
      previousHandledFragment={previousHandledFragment}
      setPreviousHandledFragment={setPreviousHandledFragment}
    >
      <OSCALControlList>
        {group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList
            group={innerGroup}
            key={innerGroup.title}
            urlFragment={urlFragment}
            fragmentPrefix={appendToFragmentPrefix(
              fragmentPrefix,
              group.id ?? conformLinkIdText(group.title)
            )}
            fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
            isControlListItemOpened={isControlListItemOpened}
            setIsControlListItemOpened={setIsControlListItemOpened}
            previousHandledFragment={previousHandledFragment}
            setPreviousHandledFragment={setPreviousHandledFragment}
          />
        ))}
        {group.controls?.map((groupControl) => (
          <OSCALCatalogControlListItem
            control={groupControl}
            key={groupControl.id}
            urlFragment={urlFragment}
            fragmentPrefix={appendToFragmentPrefix(
              fragmentPrefix,
              group.id ?? conformLinkIdText(group.title)
            )}
            fragmentSuffix={fragmentSuffix}
            isControlListItemOpened={isControlListItemOpened}
            setIsControlListItemOpened={setIsControlListItemOpened}
            previousHandledFragment={previousHandledFragment}
            setPreviousHandledFragment={setPreviousHandledFragment}
          />
        ))}
      </OSCALControlList>
    </CollapsibleListItem>
  );
}

export default function OSCALCatalogGroup(props) {
  /**
   * {any} group - The current group
   * {string} urlFragment - The current fragment being handled
   * {boolean} isControlListItemOpened - Tells whether the current list item is opened
   * {function} setIsControlListItemOpened - Callback function to set whether the list item has
   *   been navigated to
   * {string} previousHandledFragment - The fragment that was handled previously
   * {function} setPreviousHandledFragment - Callback function to set the previously handled
   *   fragment
   */
  const {
    group,
    urlFragment,
    isControlListItemOpened,
    setIsControlListItemOpened,
    previousHandledFragment,
    setPreviousHandledFragment,
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
          fragmentPrefix={fragmentPrefix}
          fragmentSuffix={fragmentSuffix}
          isControlListItemOpened={isControlListItemOpened}
          setIsControlListItemOpened={setIsControlListItemOpened}
          previousHandledFragment={previousHandledFragment}
          setPreviousHandledFragment={setPreviousHandledFragment}
        />
      ))}
      {group.controls?.map((control) => (
        <OSCALCatalogControlListItem
          control={control}
          key={control.id}
          urlFragment={urlFragment}
          fragmentPrefix={fragmentPrefix}
          fragmentSuffix={urlFragment}
          isControlListItemOpened={isControlListItemOpened}
          setIsControlListItemOpened={setIsControlListItemOpened}
          previousHandledFragment={previousHandledFragment}
          setPreviousHandledFragment={setPreviousHandledFragment}
        />
      ))}
    </OSCALControlList>
  );
}
