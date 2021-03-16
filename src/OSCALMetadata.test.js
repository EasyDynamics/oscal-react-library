import React from 'react';
import { render ,screen } from '@testing-library/react';
import OSCALMetadata from './OSCALMetadata';


test('OSCALCatalog displays title', () => {
    const testMetadata = {title: "NIST Special Publication 800-53 Revision 5", parties:[]};
    
    render(<OSCALMetadata metadata={testMetadata} />); 

    const result = screen.getByText('NIST Special Publication 800-53 Revision 5');
    expect(result).toBeVisible();
  })

test('OSCALCatalog displays version', () => {
    const testMetadata = {title: "test title", parties: [], version: "Revision 5"};
    
    render(<OSCALMetadata metadata = {testMetadata} />);
  
    const result = screen.getByText("Revision 5");
    expect(result).toBeVisible();
  })