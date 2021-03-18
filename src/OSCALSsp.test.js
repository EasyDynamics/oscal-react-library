import React from 'react';
import { render } from '@testing-library/react';
import { OSCALSSPLoader } from './OSCALLoader.js';
import OSCALSsp from './OSCALSsp.js';
import { systemCharacteristicsTestData, testOSCALSystemCharacteristics } from './OSCALSystemCharacteristics.test.js';
import { systemImplementationTestData, testOSCALSystemImplementation } from './OSCALSystemImplementation.test.js';
import { metadataTestData, testOSCALMetadata } from './OSCALMetadata.test.js';

const sspTestData = {
    "uuid": "66c2a1c8-5830-48bd-8fdd-55a1c3a52888",
    "metadata": metadataTestData,
    "system-characteristics": systemCharacteristicsTestData,
    "system-implementation": systemImplementationTestData
}

test('OSCALSsp loads', () => {
    render(<OSCALSSPLoader/>);
});

function sspRenderer() {
    render(<OSCALSsp system-security-plan={sspTestData} />);
}

testOSCALSystemCharacteristics('OSCALSsp', sspRenderer);

testOSCALSystemImplementation('OSCALSsp', sspRenderer);

testOSCALMetadata('OSCALSsp', sspRenderer);