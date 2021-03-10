import React from 'react';
import { render ,screen} from '@testing-library/react';
import OSCALCatalogGroupControl from './OSCALCatalogGroupControl';


test("OSCALCatalog displays controls", () => {
    const testControl = {id: "ac-1"};
    const testProps = {control: testControl};
    render(<OSCALCatalogGroupControl control = {testControl} />);

    const result = screen.getByText("ac-1");
    expect(result).toHaveTextContent('ac-1');
  })