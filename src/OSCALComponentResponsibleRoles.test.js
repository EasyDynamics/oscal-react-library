import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OSCALComponentResponsibleRoles from './OSCALComponentResponsibleRoles.js';
import { metadataTestData } from './OSCALMetadata.test.js';

export const responsibleRolesTestData = {
    "provider": {
        "party-uuids": [
          "party-1"
        ]
    }
}

function componentResponsibleRolesRenderer() {
    render(<OSCALComponentResponsibleRoles 
        responsibleRoles={responsibleRolesTestData} parties={metadataTestData.parties}
    />);
}

export function testOSCALComponentResponsibleRoles(parentElementName, renderer) {
    test(parentElementName + ' shows component roles', () => {
        renderer();
        const roleTypeResult = screen.getByText('provider');
        expect(roleTypeResult).toBeVisible();
    
        const rolePartyResult = within(roleTypeResult.closest("tr")).getByText('Some group of people');
        expect(rolePartyResult).toBeVisible();
      });
}

if (!require.main){
    testOSCALComponentResponsibleRoles('OSCALComponentResponsibleRoles', componentResponsibleRolesRenderer);
}