import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OSCALMetadata from './OSCALMetadata';

export const metadataTestData = {
  "title": "Test Title",
  "parties": [
    {
      "uuid": "party-1",
      "type": "organization",
      "name": "Some group of people"
    }
  ],
  "version": "Revision 5"
}

function metadataRenderer() {
  render(<OSCALMetadata metadata={metadataTestData} />);
}

export function testOSCALMetadata(parentElementName, renderer) {
  test(parentElementName + ' displays title', () => {
    renderer();
    const result = screen.getByRole('heading', { name: 'Test Title' })
    expect(result).toBeVisible();
  });

  test(parentElementName + ' displays version', () => {
    renderer();
    const result = screen.getByText('Revision 5');
    expect(result).toBeVisible();
  });

  test(parentElementName + ' displays parties', () => {
    renderer();
    const partiesElement = screen.getByText('Parties').closest('ul');
    const result = within(partiesElement).getByText('Some group of people');
    expect(result).toBeVisible();
  });
}

if (!require.main || require.main.id.endsWith("OSCALMetadata.test.js")) {
  testOSCALMetadata('OSCALMetadata', metadataRenderer);
}