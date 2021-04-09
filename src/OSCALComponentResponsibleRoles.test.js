import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OSCALComponentResponsibleRoles from './OSCALComponentResponsibleRoles.js';
import { componentDefinitionTestData } from './OSCALComponentDefinition.test.js';
import { metadataTestData } from './OSCALMetadata.test.js';

export const componentResponsibleRolesTestData = {
    "provider": {
        "party-uuids": [
          "party-1"
        ]
    }
}

function componentResponsibleRolesRenderer() {
    render(<OSCALComponentResponsibleRoles 
        component={componentDefinitionTestData.components} parties={metadataTestData.parties}
    />);
}

export function testOSCALComponentResponsibleRoles(parentElementName, renderer) {
    test(parentElementName + ' shows component roles', () => {
        renderer();
        const component = screen.getByText('Example Component').closest("tr");
        const roleTypeResult = within(component).getByText('provider');
        expect(roleTypeResult).toBeVisible();
    
        const rolePartyResult = within(roleTypeResult.closest("tr")).getByText('Some group of people');
        expect(rolePartyResult).toBeVisible();
      });
}

if (!require.main) {
    testOSCALComponentResponsibleRoles('OSCALComponentResponsibleRoles', componentResponsibleRolesRenderer);
}
