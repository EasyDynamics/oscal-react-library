import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import OSCALSystemImplementation from './OSCALSystemImplementation.js';
import { metadataTestData } from './OSCALMetadata.test.js';

export const systemImplementationTestData = {
  "remarks": "Example system implementation remarks.",
  "users": {
    "user-1": {
      "title": "User 1",
      "role-ids": [
        "asset-administrator"
      ],
      "annotations": [
        {
          "name": "type",
          "value": "internal"
        }
      ]
    }
  },
  "components": {
    "component-1": {
      "title": "Example Component",
      "description": "An example component.",
      "status": {
        "state": "operational"
      },
      "type": "software",
      "props": [
        {
          "name": "version",
          "value": "1.1"
        }
      ],
      "responsible-roles": {
        "provider": {
          "party-uuids": [
            "party-1"
          ]
        }
      }
    }
  },
  "inventory-items": [
    {
      "uuid": "inventory-item-1",
      "description": "An inventory item.",
      "props": [
        {
          "name": "asset-id",
          "value": "asset-id-inventory-item"
        }
      ],
      "responsible-parties": {
        "asset-administrator": {
          "party-uuids": [
            "party-1"
          ]
        }
      },
      "implemented-components": [
        {
          "component-uuid": "component-1"
        }
      ]
    }
  ]
}

function systemImplementationRenderer() {
    render(<OSCALSystemImplementation 
      systemImplementation={systemImplementationTestData}
      parties={metadataTestData.parties}
    />);
}

export function testOSCALSystemImplementation(parentElementName, renderer) {
    test(parentElementName + ' shows remarks', () => {
        renderer();
        const result = screen.getByText('Example system implementation remarks.');
        expect(result).toBeVisible();
    });

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

    test(parentElementName + ' shows component status', () => {
      renderer();
      const component = screen.getByText('Example Component').closest("tr");
      const result = within(component).getByText('operational');
      expect(result).toBeVisible();
    });

    test(parentElementName + ' shows component type', () => {
      renderer();
      const component = screen.getByText('Example Component').closest("tr");
      const result = within(component).getByText('software');
      expect(result).toBeVisible();
    });

    test(parentElementName + ' shows component version', () => {
      renderer();
      const component = screen.getByText('Example Component').closest("tr");
      const propNameResult = within(component).getByText('version');
      expect(propNameResult).toBeVisible();
      const propValueResult = within(component).getByText('1.1');
      expect(propValueResult).toBeVisible();
    });

    test(parentElementName + ' shows component roles', () => {
      renderer();
      const component = screen.getByText('Example Component').closest("tr");
      const roleTypeResult = within(component).getByText('provider');
      expect(roleTypeResult).toBeVisible();

      const rolePartyResult = within(roleTypeResult.closest("tr")).getByText('Some group of people');
      expect(rolePartyResult).toBeVisible();
    });
}

if (!require.main || require.main.id.endsWith("OSCALSystemImplementation.test.js")) {
  testOSCALSystemImplementation('OSCALSystemImplementation', systemImplementationRenderer);
}