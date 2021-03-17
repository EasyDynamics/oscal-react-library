import React from 'react';
import { render, screen } from '@testing-library/react';
import OSCALControlImplementation from './OSCALControlImplementation.js';

const controlImplData = {
    "implemented-requirements": [
        {
            "control-id": "control-1",
            "statements": {
                "control-1_smt": {
                },
                "control-1_smt.a": {
                    "by-components": {
                        "component-1": {
                            "description": "Component 1 description of implementing control 1",
                            "parameter-settings": {
                                "control-1_prm_1": {
                                "values": [
                                    "control 1 / component 1 / parameter 1 value"
                                ]
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}
const componentsData = {
    "component-1": {
        "title": "Component 1 Title"
    }
}
const controlsData = [
    {
        "id": "control-1",
        "title": "Control 1 Title",
        "params": [
            {
                "id": "control-1_prm_1",
                "label": "control 1 / parameter 1 label"
            }
        ],
        "parts": [
            {
                "id": "control-1_smt",
                "name": "statement",
                "prose": "Some group:",
                "parts": [
                    {
                        "id": "control-1_smt.a",
                        "name": "item",
                        "props": [
                            {
                            "name": "label",
                            "value": "a."
                            }
                        ],
                        "prose": "Does something with {{ control-1_prm_1 }}:"
                    }
                ]
            }
        ]
    }
]

function getByTextIncludingChildern(textMatch) {
    return screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === textMatch || node.textContent.match(textMatch);
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node?.children || []).every((child) => !hasText(child));
        return nodeHasText && childrenDontHaveText;
    })
}

test('OSCALControlImplementationImplReq displays control ID', () => {
    render(<OSCALControlImplementation 
			controlImplementation={controlImplData}
			components={componentsData}
			controls={controlsData}
			/>);
    const result = screen.getByText('control-1');
    expect(result).toBeVisible();
});

test('OSCALControlImplementationImplReq displays component parameters in control prose', () => {
    render(<OSCALControlImplementation 
			controlImplementation={controlImplData}
			components={componentsData}
			controls={controlsData}
			/>);
    const result = getByTextIncludingChildern('Does something with control 1 / component 1 / parameter 1 value');
    expect(result).toBeVisible();
})
