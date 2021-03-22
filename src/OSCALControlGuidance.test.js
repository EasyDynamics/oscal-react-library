import React from 'react';
import { render, screen } from '@testing-library/react';
import OSCALControlGuidance from './OSCALControlGuidance';
import userEvent from '@testing-library/user-event';


test("OSCALCatalog displays control guidance", ()=>{
    const prose = "Access control policy"
    render(<OSCALControlGuidance prose={prose} />) 
    userEvent.click(screen.getByRole('button'));
    const result = screen.getByText("Access control policy");
    expect(result).toBeVisible();
  });