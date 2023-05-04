import { Control, ControlGroup } from "@easydynamics/oscal-types";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import React, { ReactNode, useEffect } from "react";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";
import {
  appendToFragmentPrefix,
  conformLinkIdText,
  shiftFragmentSuffix,
} from "./oscal-utils/OSCALLinkUtils";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import { AnchorLinkProps, OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import OSCALControl from "./OSCALControl";
import OSCALControlLabel from "./OSCALControlLabel";
import OSCALControlPart from "./OSCALControlPart";
import { Accordion, AccordionDetails, AccordionSummary } from "./StyedAccordion";

const WithdrawnControlText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  textDecoration: "line-through",
})) as typeof Typography;

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

/**
 * Validates fragment and determines if top fragment item matches a list ID.
 *
 * @param urlFragment The fragment currently being handled
 * @param previousHandledFragment The previous handled fragment
 * @param fragmentSuffix The current item and sub items
 * @param listId The group/control ID
 * @returns Whether the top list item matches a list ID or not.
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

interface CollapsibleListItemProps extends CatalogGroupFragmentProps, AnchorLinkProps {
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
   * Tells whether or not the current list item is opened
   */
  readonly listItemOpened?: boolean;
  /**
   * Callback function to set list item opened
   */
  readonly setListItemOpened: (...args: any[]) => void;

  /**
   * Whether the control or its parent is withdrawn.
   *
   * @default false
   */
  readonly withdrawn?: boolean;
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
    <Accordion
      expanded={isOpen}
      onChange={handleClick}
      TransitionProps={{
        onEntered: () => !group && setListItemOpened(true),
        unmountOnExit: true,
        timeout: 500,
      }}
    >
      <AccordionSummary>{itemText}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export interface OSCALCatalogControlListItemProps
  extends CatalogGroupFragmentProps,
    AnchorLinkProps {
  /**
   * The current control
   */
  readonly control: Control;
  /**
   * Tells whether the current list item is opened
   */
  readonly isControlListItemOpened: boolean;
  /**
   * Callback function to set whether the list item has been navigated to
   */
  readonly setIsControlListItemOpened: (value: boolean) => void;

  readonly withdrawn?: boolean;
}

/**
 * Creates a catalog list item component containing a catalog group/control.
 *
 * @returns A list item component which contains sub list item(s) and/or collapsible information
 */
export const OSCALCatalogControlListItem: React.FC<OSCALCatalogControlListItemProps> = (props) => {
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

  const withdrawn = props.withdrawn || isWithdrawn(control);
  const TitleComponent = withdrawn ? WithdrawnControlText : Typography;

  const itemText = (
    <OSCALAnchorLinkHeader name={appendToFragmentPrefix(fragmentPrefix, control.id).toLowerCase()}>
      <TitleComponent style={{ fontWeight: "bold" }}>
        <OSCALControlLabel
          label={propWithName(control.props, "label")?.value}
          id={control.id}
          component="span"
        />
        {control.title}
      </TitleComponent>
    </OSCALAnchorLinkHeader>
  );

  return (
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
        previousHandledFragment={previousHandledFragment}
        setPreviousHandledFragment={setPreviousHandledFragment}
        withdrawn={withdrawn}
      />
    </CollapsibleListItem>
  );
};

interface OSCALCatalogGroupListProps extends CatalogGroupFragmentProps, AnchorLinkProps {
  /**
   * The current group
   */
  readonly group: ControlGroup;
  /**
   * Tells whether the current list item is opened
   */
  readonly isControlListItemOpened: boolean;
  /**
   * Callback function to set whether the list item has been navigated to
   */
  readonly setIsControlListItemOpened: (value: boolean) => void;

  readonly withdrawn?: boolean;
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

  const withdrawn = props.withdrawn || isWithdrawn(group);
  const TitleComponent = withdrawn ? WithdrawnControlText : Typography;

  const itemText = (
    <OSCALAnchorLinkHeader
      name={appendToFragmentPrefix(
        fragmentPrefix,
        group.id ?? conformLinkIdText(group.title)
      ).toLowerCase()}
    >
      <TitleComponent style={{ fontWeight: "bold" }}>
        <OSCALControlLabel
          label={propWithName(group.props, "label")?.value}
          id={group.id ?? conformLinkIdText(group.title)}
          component="span"
        />
        {group.title}
      </TitleComponent>
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
      {group.parts?.map((part, index) => (
        <OSCALControlPart
          control={group}
          controlId={group.title}
          key={part.id ?? `part-${index}`}
          parameters={group.params}
          part={part}
        />
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
            withdrawn={withdrawn}
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
            withdrawn={withdrawn}
          />
        ))}
      </OSCALControlList>
    </CollapsibleListItem>
  );
};

export interface OSCALCatalogGroupProps extends CatalogGroupFragmentProps, AnchorLinkProps {
  /**
   * The current group
   */
  readonly group: ControlGroup;
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
      {group.parts?.map((part, index) => (
        <OSCALControlPart
          control={group}
          controlId={group.title}
          key={part.id ?? `part-${index}`}
          parameters={group.params}
          part={part}
        />
      ))}
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
    </>
  );
};

export default OSCALCatalogGroup;
