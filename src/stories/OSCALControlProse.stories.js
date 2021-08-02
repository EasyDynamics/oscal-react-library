import React from "react";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "../components/OSCALControlProse";
import { exampleModificationSetParameters } from "../test-data/ModificationsData";
import { controlProseTestData, exampleParams } from "../test-data/ControlsData";
import { exampleImplReqStatements } from "../test-data/ComponentsData";

export default {
  title: "Components/Control Prose",
  component: OSCALReplacedProseWithParameterLabel,
};

const TemplateParameterLabel = (args) => (
  <OSCALReplacedProseWithParameterLabel {...args} />
);

const TemplateByComponent = (args) => (
  <OSCALReplacedProseWithByComponentParameterValue {...args} />
);

export const ParametersReplacedWithLabels = TemplateParameterLabel.bind({});

export const ByComp = TemplateByComponent.bind({});

export const WithParameterConstraints = TemplateParameterLabel.bind({});

WithParameterConstraints.args = {
  modificationSetParameters: exampleModificationSetParameters,
  label: "a.",
  prose: controlProseTestData,
  parameters: exampleParams,
};

ParametersReplacedWithLabels.args = {
  label: "a.",
  prose: controlProseTestData,
  parameters: exampleParams,
};

ByComp.args = {
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
  statementId: "a_smt",
  componentId: "component-1",
  implReqStatements: exampleImplReqStatements,
};

ByComp.storyName = "Parameters Replaced With By-Component Value";
