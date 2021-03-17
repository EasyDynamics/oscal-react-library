import React from 'react';
import { render ,screen} from '@testing-library/react';
import { OSCALSSPLoader } from './OSCALLoader.js';
import OSCALSsp from './OSCALSsp.js';
import { systemCharacteristicsTestData, testOSCALSystemCharacteristics } from './OSCALSystemCharacteristics.test.js';

const sspTestData = {
    "uuid": "66c2a1c8-5830-48bd-8fdd-55a1c3a52888",
    "system-characteristics": systemCharacteristicsTestData
}

test('OSCALSsp loads', () => {
    render(<OSCALSSPLoader/>);
});

function sspRenderer() {
    render(<OSCALSsp system-security-plan={sspTestData} />);
}

testOSCALSystemCharacteristics('OSCALSsp', sspRenderer);
