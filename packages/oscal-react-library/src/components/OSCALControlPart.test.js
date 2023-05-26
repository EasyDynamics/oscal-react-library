import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALControlPart } from "./OSCALControlPart";
import { OSCALControlRemovedPartWrapper } from "./OSCALControlProse";
import { controlImplTestData, controlProseTestData } from "../test-data/ControlsData";


describe("OSCALControlPart", () => {
  test("displays removed part", async () => {
    render(
      <OSCALControlRemovedPartWrapper ownerState partName={controlImplTestData.part.name}>
        {controlProseTestData}
        {controlImplTestData.part.parts?.map((part) => (
          <OSCALControlPart
            part={part}
            control={controlImplTestData.control}
            controlId={controlImplTestData.controlId ?? controlImplTestData.control.id}
            parameters={controlImplTestData.parameters}
            implementedRequirement={controlImplTestData.implementedRequirement}
            componentId={controlImplTestData.componentId}
            modificationAlters={controlImplTestData.modificationAlters}
            modificationSetParameters={controlImplTestData.modificationSetParameters}
            key={part.id ?? part.name}
            isEditable={controlImplTestData.isEditable}
            onRestSuccess={controlImplTestData.onRestSuccess}
            onRestError={controlImplTestData.onRestError}
            partialRestData={controlImplTestData.partialRestData}
          />
        ))}
      </OSCALControlRemovedPartWrapper>
    );
    const result = await screen.findByText("< control 1 label >");
    fireEvent.mouseOver(result);
    expect(await screen.findByText("some constraint")).toBeVisible();
    expect(await screen.findByText("param 3 value")).toBeVisible();
  });
});
