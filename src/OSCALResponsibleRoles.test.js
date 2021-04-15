import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OSCALResponsibleRoles from './OSCALResponsibleRoles.js';
import { metadataTestData } from './OSCALMetadata.test.js';

export const responsibleRolesTestData = {
    "provider": {
        "party-uuids": [
          "party-1"
        ]
    }
}

function responsibleRolesRenderer() {
    render(<OSCALResponsibleRoles 
        responsibleRoles={responsibleRolesTestData} parties={metadataTestData.parties}
    />);
}

export function testOSCALResponsibleRoles(parentElementName, renderer) {
    test(`${parentElementName  } shows component roles`, () => {
        renderer();
        const roleTypeResult = screen.getByText('provider');
        expect(roleTypeResult).toBeVisible();
    
        const rolePartyResult = within(roleTypeResult.closest("tr")).getByText('Some group of people');
        expect(rolePartyResult).toBeVisible();
      });
}

if (!require.main){
    testOSCALResponsibleRoles('OSCALResponsibleRoles', responsibleRolesRenderer);
}