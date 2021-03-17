import React from 'react';
import { render, screen } from '@testing-library/react';
import OSCALCatalogGroup from './OSCALCatalogGroup';


test("OSCALCatalog displays control groups", ()=>{
    const testGroup = {id: "ac", class: "family", title: "Access Control", controls: [{id: "ac-1"}]};
    render(<OSCALCatalogGroup group = {testGroup}/>);
    const result = screen.getByText("Access Control");
    expect(result).toBeVisible();
  })
