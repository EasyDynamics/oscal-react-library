import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React from "react";
import OSCALControl from "./OSCALControl";

// Groups may not necessarily have an ID (it is not required per the spec);
// therefore, we need to be able to come up with a semi-constant ID. All
// groups will have a title. We can (poorly) hash that hopefully that will
// be good enough.
export function getGroupKey(group) {
  if (group.id) {
    return group.id;
  }
  let hash = 7;
  // eslint-disable-next-line no-restricted-syntax
  for (const char of group.title) {
    hash = 31 * hash + char.charCodeAt(0);
  }
  return hash;
}

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "0.5em",
  marginBottom: "1em",
  backgroundColor: theme.palette.grey[50],
}));

const StyledListItemPaper = styled(Paper)`
  border-radius: 0.5em;
`;

const StyledControlDescriptionWrapper = styled('div')`
  padding: 1em;
`;

function CollapseableListItem(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <StyledListItemPaper>
      <StyledListItem button onClick={handleClick}>
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
      itemText={`${control.id.toUpperCase()} ${control.title}`}
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
          <OSCALCatalogGroupList
            group={innerGroup}
            key={getGroupKey(innerGroup)}
          />
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
        <OSCALCatalogGroupList
          group={innerGroup}
          key={getGroupKey(innerGroup)}
        />
      ))}
      {props.group.controls?.map((control) => (
        <OSCALCatalogControlListItem control={control} key={control.id} />
      ))}
    </OSCALControlList>
  );
}
