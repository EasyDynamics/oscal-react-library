import React from 'react';
import { render ,screen} from '@testing-library/react';
import OSCALMetadata from './OSCALMetadata';
import OSCALCatalogGroupControl from './OSCALCatalogGroupControl';

test('OSCALCatalog displays catalog name', () => {
    const testMetadata = {title: "NIST Special Publication 800-53 Revision 5", parties:[]};
    const testProps= {metadata: testMetadata};
    render(<OSCALMetadata metadata={testMetadata} />); 
    
    const result = screen.getByTestId("oscal-metadata-title");
    expect(result).toHaveTextContent('NIST Special Publication 800-53 Revision 5');
  })

  test("OSCALCatalog displays controls", ()=>{
    const testControl = {id: "ac-1"};
    const testProps = {control: testControl};
    render(<OSCALCatalogGroupControl control = {testControl} />);
    const result = screen.getByTestId("oscal-control-group");
    expect(result).toHaveTextContent('ac-1');
  })