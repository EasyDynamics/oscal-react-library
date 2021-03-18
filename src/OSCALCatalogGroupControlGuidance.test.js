import React from 'react';
import { render, screen } from '@testing-library/react';
import OSCALCatalogGroupControlGuidance from './OSCALCatalogGroupControlGuidance';
import userEvent from '@testing-library/user-event';


test("OSCALCatalog displays control guidance", ()=>{
    const prose = "Access control policy"
    render(<OSCALCatalogGroupControlGuidance prose={prose} />) 
    userEvent.click(screen.getByRole('button'));
    const result = screen.getByText("Access control policy");
    expect(result).toBeVisible();
  });