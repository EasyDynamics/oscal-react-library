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
  readonly previousHandledFragment: string | undefined;
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
  readonly urlFragment?: string;
  readonly group?: ControlGroup;
  readonly listId: string;
  readonly itemText: ReactNode;
  readonly children: ReactNode;
  readonly fragmentSuffix: string | undefined;
  readonly listItemOpened?: boolean;
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
  readonly children: ReactNode;
  readonly urlFragment?: string;
  readonly listId: string;
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
  readonly control: Control;
  readonly urlFragment?: string;
  readonly fragmentPrefix: string;
  readonly fragmentSuffix: string | undefined;
  readonly isControlListItemOpened: boolean;
  readonly setIsControlListItemOpened: (...args: any[]) => void;
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
  readonly group: ControlGroup;
  readonly urlFragment?: string;
  readonly fragmentPrefix: string;
  readonly fragmentSuffix: string | undefined;
  readonly isControlListItemOpened: boolean;
  readonly setIsControlListItemOpened: (...args: any[]) => void;
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
      {group.parts
        ?.map((groupPart: Part) => groupPart.prose)
        .map((prose) => (
          <OSCALMarkupMultiLine key={prose}>{prose}</OSCALMarkupMultiLine>
        ))}
    </CollapsibleListItem>
  );
};

export interface OSCALCatalogGroupProps extends CatalogGroupFragmentProps {
  readonly group: ControlGroup;
  readonly urlFragment?: string;
  readonly isControlListItemOpened: boolean;
  readonly setIsControlListItemOpened: (...args: any[]) => void;
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
      {group.parts
        ?.map((groupPart: Part) => groupPart.prose)
        .map((prose) => (
          <OSCALMarkupMultiLine key={prose}>{prose}</OSCALMarkupMultiLine>
        ))}
    </>
  );
};

export default OSCALCatalogGroup;
