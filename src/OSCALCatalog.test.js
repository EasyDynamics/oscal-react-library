import React from 'react';
import App from '../src/App';
import OSCALCatalog from './OSCALCatalog';
import OSCALMetadata from './OSCALMetadata';
import OSCALCatalogGroupControlPart from './OSCALCatalogGroupControlPart';
import {shallow} from 'enzyme';
import OSCALCatalogGroup from './OSCALCatalogGroup';
import OSCALCatalogGroupControl from './OSCALCatalogGroupControl';
import OSCALCatalogGroupControlGuidance from './OSCALCatalogGroupControlGuidance';


it("OSCALCatalog displays catalog name", ()=>{
    const wrap = shallow(<App />);
    const group = <OSCALCatalog />;
    expect(wrap.contains(group)).toBeTruthy
})

it("OSCALCatalog displays metadata", ()=>{
    const wrap = shallow(<App />);
    const metadata = <OSCALMetadata />;
    expect(wrap.contains(metadata)).toBeTruthy
})

it("OSCALCatalog displays parties", ()=>{
    const wrap = shallow(<App />);
    const party = <OSCALCatalogGroupControlPart />
    expect(wrap.contains(party)).toBeTruthy
})

it("OSCALCatalog displays control groups", ()=>{
    const wrap = shallow(<App />);
    const group = <OSCALCatalogGroup />;
    expect(wrap.contains(group)).toBeTruthy
})

it("OSCALCatalog displays controls", ()=>{
    const wrap = shallow(<App />);
    const controls = <OSCALCatalogGroupControl />;
    expect(wrap.contains(controls)).toBeTruthy
})

it("OSCALCatalog displays control guidance", ()=>{
    const wrap = shallow(<App />);
    const guidance = <OSCALCatalogGroupControlGuidance />;
    expect(wrap.contains(guidance)).toBeTruthy
})