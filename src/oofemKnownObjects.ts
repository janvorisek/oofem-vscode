export type OOFEMKnownObject = {
    className: string;
    hasId: boolean;
    params: { name: string;  type: "rn" | "in" | "ra" | "ia" | "ch"}[]
}

export const oofemKnownObjects: { [key: string]: OOFEMKnownObject} = {
    "node": {
        "className": "Node",
        "hasId": true,
        "params": [
            {
                name: "coords",
                type: "ra"
            }
        ]
    },
    "beam2d": {
        "className": "Beam2d",
        "hasId": true,
        "params": [
            {
                name: "nodes",
                type: "ra"
            },
            {
                name: "crossSect",
                type: "in"
            }
        ]
    }
}