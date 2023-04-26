import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React, { ReactNode, useEffect } from "react";
import OSCALControl from "./OSCALControl";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import OSCALControlLabel from "./OSCALControlLabel";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import {
  appendToFragmentPrefix,
  shiftFragmentSuffix,
  conformLinkIdText,
} from "./oscal-utils/OSCALLinkUtils";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { Control, ControlGroup, Part } from "@easydynamics/oscal-types";

interface CatalogGroupFragmentProps {
  /**
   * The fragment that was handled previously
   */
  readonly previousHandledFragment: string | undefined;
  /**
   * Callback function to set the previously handled fragment
   */
  readonly setPreviousHandledFragment: (...args: any[]) => void;
}

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
function isMatchingListItem(
  urlFragment: string | undefined,
  previousHandledFragment: string | undefined,
  fragmentSuffix: string | undefined,
  listId: string
): boolean {
  // Ensure fragment exists and split by groupings
  //  & Determine if current control/group list state matches ID
  return (
    !!urlFragment &&
    previousHandledFragment !== urlFragment &&
    fragmentSuffix?.split("/")?.[0] === listId
  );
}

interface CollapsibleListItemProps extends CatalogGroupFragmentProps {
  /**
   * The current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * A catalog group that contains either groups/controls
   */
  readonly group?: ControlGroup;
  /**
   * Identification used for a list
   */
  readonly listId: string;
  /**
   * The title of an item
   */
  readonly itemText: ReactNode;
  /**
   * Children underneath the list item - either a control/group or control/group
   */
  readonly children: ReactNode;
  /**
   * The end of a fragment which starts with the current group/control being handled
   */
  readonly fragmentSuffix: string | undefined;
  /**
   * Tells whether or not the current list item is opened
   */
  readonly listItemOpened?: boolean;
  /**
   * Callback function to set list item opened
   */
  readonly setListItemOpened: (...args: any[]) => void;
}

/**
 * Creates a collapsible component for a catalog group/control.
 *
 * @returns A list item component with collapsible information
 */
const CollapsibleListItem: React.FC<CollapsibleListItemProps> = (props) => {
  const {
    urlFragment,
    group,
    listId,
    itemText,
    children,
    fragmentSuffix,
    listItemOpened,
    setListItemOpened,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (
      urlFragment &&
      isMatchingListItem(urlFragment, previousHandledFragment, fragmentSuffix, listId)
    ) {
      setIsOpen(true);

      if (fragmentSuffix && fragmentSuffix.split("/").length <= 1) {
        const elementWithFragment = document.getElementById(urlFragment);
        elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });
        setPreviousHandledFragment(urlFragment);
      }
    }
  }, [
    urlFragment,
    fragmentSuffix,
    listItemOpened,
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
};

interface WithdrawnListItemProps extends CatalogGroupFragmentProps {
  /**
   * Children underneath the list item - either a control/group or control/group
   */
  readonly children: ReactNode;
  /**
   * The current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * Identification used for a list
   */
  readonly listId: string;
  /**
   * The end of a fragment which starts with the current group/control being handled
   */
  readonly fragmentSuffix: string | undefined;
}

/**
 * Creates a top-level withdrawn control list item.
 *
 * @returns A top-level withdrawn control list item component
 */
const WithdrawnListItem: React.FC<WithdrawnListItemProps> = (props) => {
  const {
    children,
    urlFragment,
    listId,
    fragmentSuffix,
    previousHandledFragment,
    setPreviousHandledFragment,
  } = props;
  useEffect(() => {
    if (
      urlFragment &&
      isMatchingListItem(urlFragment, previousHandledFragment, fragmentSuffix, listId)
    ) {
      const elementWithFragment = document.getElementById(urlFragment);
      elementWithFragment?.scrollIntoView?.({ behavior: "smooth" });

      if (fragmentSuffix && fragmentSuffix.split("/").length <= 1) {
        setPreviousHandledFragment(urlFragment);
      }
    }
  }, [urlFragment, listId, fragmentSuffix, previousHandledFragment, setPreviousHandledFragment]);

  return (
    <StyledListItemPaper>
      <StyledListItem>{children}</StyledListItem>
    </StyledListItemPaper>
  );
};

interface OSCALCatalogControlListItemProps extends CatalogGroupFragmentProps {
  /**
   * The current control
   */
  readonly control: Control;
  /**
   * he current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * The beginning of a fragment which ends with the current group/control being handled
   */
  readonly fragmentPrefix: string;
  /**
   * The end of a fragment which starts with the current group/control being handled
   */
  readonly fragmentSuffix: string | undefined;
  /**
   * Tells whether the current list item is opened
   */
  readonly isControlListItemOpened: boolean;
  /**
   * Callback function to set whether the list item has been navigated to
   */
  readonly setIsControlListItemOpened: (value: boolean) => void;
}

/**
 * Creates a catalog list item component containing a catalog group/control.
 *
 * @returns A list item component which contains sub list item(s) and/or collapsible information
 */
const OSCALCatalogControlListItem: React.FC<OSCALCatalogControlListItemProps> = (props) => {
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
    <OSCALAnchorLinkHeader name={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}>
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
      urlFragment={urlFragment}
      listId={control?.id}
      previousHandledFragment={previousHandledFragment}
      setPreviousHandledFragment={setPreviousHandledFragment}
      fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
    >
      <WithdrawnListItemText primary={itemText} />
    </WithdrawnListItem>
  ) : (
    <CollapsibleListItem
      itemText={itemText}
      urlFragment={urlFragment}
      fragmentSuffix={shiftFragmentSuffix(fragmentSuffix)}
      listItemOpened={isControlListItemOpened}
      setListItemOpened={setIsControlListItemOpened}
      listId={control?.id}
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
};

interface OSCALCatalogGroupListProps extends CatalogGroupFragmentProps {
  /**
   * The current group
   */
  readonly group: ControlGroup;
  /**
   * The current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * The beginning of a fragment which ends with the current group/control
   */
  readonly fragmentPrefix: string;
  /**
   * The end of a fragment which starts with the current group/control being handled
   */
  readonly fragmentSuffix: string | undefined;
  /**
   * Tells whether the current list item is opened
   */
  readonly isControlListItemOpened: boolean;
  /**
   * Callback function to set whether the list item has been navigated to
   */
  readonly setIsControlListItemOpened: (value: boolean) => void;
}

/**
 * Creates a catalog group list which contains groups/controls.
 *
 * @returns A group list component which contains a set of items
 */
const OSCALCatalogGroupList: React.FC<OSCALCatalogGroupListProps> = (props) => {
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
  const itemText = (
    <OSCALAnchorLinkHeader
      name={appendToFragmentPrefix(
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
      previousHandledFragment={previousHandledFragment}
      setPreviousHandledFragment={setPreviousHandledFragment}
    >
      {group.parts
        ?.map((groupPart) => groupPart.prose)
        .map((prose) => (
          <OSCALMarkupMultiLine key={prose}>{prose}</OSCALMarkupMultiLine>
        ))}
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
};

export interface OSCALCatalogGroupProps extends CatalogGroupFragmentProps {
  /**
   * The current group
   */
  readonly group: ControlGroup;
  /**
   * The current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * Tells whether the current list item is opened
   */
  readonly isControlListItemOpened: boolean;
  /**
   * Callback function to set whether the list item has been navigated to
   */
  readonly setIsControlListItemOpened: (value: boolean) => void;
}

export const OSCALCatalogGroup: React.FC<OSCALCatalogGroupProps> = (props) => {
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
    : undefined;

  return (
    <>
      {group.parts
        ?.map((groupPart: Part) => groupPart.prose)
        .map((prose) => (
          <OSCALMarkupMultiLine key={prose}>{prose}</OSCALMarkupMultiLine>
        ))}
      <OSCALControlList>
        {group.groups?.map((innerGroup: ControlGroup) => (
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
        {group.controls?.map((control: Control) => (
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
    </>
  );
};

export default OSCALCatalogGroup;
