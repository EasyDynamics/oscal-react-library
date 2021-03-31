import React from 'react';
import { render, screen } from '@testing-library/react';
import OSCALSystemCharacteristics from './OSCALSystemCharacteristics.js';

export const systemCharacteristicsTestData = {
      "system-name": "Example System Name",
      "description": "This is an example of a system.",
      "system-ids": [
        {
          "id": "system-id",
          "identifier-type": "https://ietf.org/rfc/rfc4122"
        }
      ],
      "security-sensitivity-level": "moderate",
      "system-information": {
        "information-types": [
          {
            "uuid": "information-type-id",
            "title": "Information Type Title",
            "categorizations": [
              {
                "system": "https://doi.org/10.6028/NIST.SP.800-60v2r1",
                "information-type-ids": [
                  "C.3.5.8"
                ]
              }
            ],
            "description": "Example information type.",
            "confidentiality-impact": {
              "base": "fips-199-moderate"
            },
            "integrity-impact": {
              "base": "fips-199-moderate"
            },
            "availability-impact": {
              "base": "fips-199-low"
            }
          }
        ]
    },
    "security-impact-level": {
      "security-objective-confidentiality": "confidentiality-value",
      "security-objective-integrity": "integrity-value",
      "security-objective-availability": "availability-value"
    },
    "status": {
      "state": "other",
      "remarks": "This is an example, and is not intended to be implemented as a system"
    },
    "annotations": [
      {
        "name": "deployment-model",
        "value": "private"
      },
      {
        "name": "service-models",
        "value": "iaas"
      }
    ],
    "authorization-boundary": {
      "description": "The description of the authorization boundary would go here."
    }
}

function systemCharacteristicsRenderer() {
    render(<OSCALSystemCharacteristics 
        systemCharacteristics={systemCharacteristicsTestData}
    />);
}

export function testOSCALSystemCharacteristics(parentElementName, renderer) {
    test(parentElementName + ' shows system name', () => {
        renderer();
        const result = screen.getByRole('heading', { name: 'Example System Name' })
        expect(result).toBeVisible();
    });

    test(parentElementName + ' shows security sensitivity level', () => {
        renderer();
        const result = screen.getByLabelText('sensitivity-level');
        expect(result).toHaveValue('moderate');
    });

    test(parentElementName + ' shows system information', () => {
        renderer();
        const result = screen.getByText('Information Type Title');
        expect(result).toBeVisible();
    });

    test(parentElementName + ' shows security impact level', () => {
        renderer();

        const confidentialityResult = screen.getByLabelText('confidentiality');
        expect(confidentialityResult).toHaveValue('confidentiality-value');

        const integrityResult = screen.getByLabelText('integrity');
        expect(integrityResult).toHaveValue('integrity-value');

        const availabilityResult = screen.getByLabelText('availability');
        expect(availabilityResult).toHaveValue('availability-value');
    });
    
    test(parentElementName + ' shows status', () => {
        renderer();
        const result = screen.getByLabelText('status');
        expect(result).toHaveValue('other');
    });
}
if (!require.main || require.main.id.endsWith("OSCALSystemCharacteristics.test.js")) {
  testOSCALSystemCharacteristics('OSCALSystemCharacteristics', systemCharacteristicsRenderer);
}