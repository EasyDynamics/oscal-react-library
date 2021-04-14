import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { OSCALComponentLoader } from './OSCALLoader.js';
import OSCALComponentDefinition from './OSCALComponentDefinition.js';
import { metadataTestData, testOSCALMetadata } from './OSCALMetadata.test.js';
import { responsibleRolesTestData, testOSCALResponsibleRoles } from './OSCALResponsibleRoles.test.js';

export const componentDefinitionTestData = {
    "uuid": "aabcfa61-c6eb-4979-851f-35b461f6a0ef",
    "metadata": metadataTestData,
    "components": {
        "component-1": {
            "type": "Example Type",
            "title": "Example Component",
            "description": "An example component.",
            "responsible-roles": responsibleRolesTestData
        }
    }
}

test('OSCALComponentDefinition loads', () => {
    render(<OSCALComponentLoader />);
});

function componentDefinitionRenderer() {
    render(<OSCALComponentDefinition componentDefinition={componentDefinitionTestData} parties={metadataTestData.parties} />);
}

export function testOSCALComponentDefinition(parentElementName, renderer) {
    test(parentElementName + ' shows component title', () => {
        renderer();
        const result = screen.getByText('Example Component');
        expect(result).toBeVisible();
      });
  
    test(parentElementName + ' shows component description', async () => {
        renderer();
        userEvent.hover(screen.getByText('Example Component'));
        expect(
            await screen.findByText('An example component.')
        ).toBeInTheDocument();
      });
}

testOSCALMetadata('OSCALComponentDefinition', componentDefinitionRenderer);

testOSCALComponentDefinition('OSCAlComponentDefinition', componentDefinitionRenderer);

testOSCALResponsibleRoles('OSCALComponentDefinition', componentDefinitionRenderer);