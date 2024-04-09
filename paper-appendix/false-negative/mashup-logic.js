{
	name: "example",
	root: [
        {
			type: "interact",
			receiveIntrcts: [
                {
					direction: 0,
					type: 2,
					to: "Sprinkler1",
					name: "status",
					set: undefined,
                },
            ],
			sendIntrcts: [
                {
					direction: 1,
					type: 1,
					to: "UnicornPHAT1",
					name: "fillColor",
					get: undefined,
					defaultInput: undefined,
                },
            ],
			breakOnDataPushed: false,
        },
        {
			type: "interact",
			receiveIntrcts: [
                {
					direction: 0,
					type: 2,
					to: "SoilSensor0",
					name: "moisture",
					set: undefined,
                },
            ],
			sendIntrcts: [
                {
					direction: 1,
					type: 1,
					to: "SenseHat2",
					name: "showMessage",
					get: undefined,
					defaultInput: undefined,
                },
            ],
			breakOnDataPushed: false,
        },
        {
			type: "interact",
			receiveIntrcts: [
                {
					direction: 0,
					type: 2,
					to: "UnicornPHAT1",
					name: "pixels",
					set: undefined,
                },
            ],
			sendIntrcts: [
                {
					direction: 1,
					type: 1,
					to: "UnicornPHAT1",
					name: "fillRandom",
					get: undefined,
					defaultInput: undefined,
                },
            ],
			breakOnDataPushed: false,
        },
        {
			type: "case",
			content: [
                {
					type: "interact",
					receiveIntrcts: [
                        {
							direction: 0,
							type: 2,
							to: "SenseHat2",
							name: "pixels",
							set: undefined,
                        },
                    ],
					sendIntrcts: [
                        {
							direction: 1,
							type: 1,
							to: "Sprinkler1",
							name: "stopSprinkler",
							get: undefined,
							defaultInput: undefined,
                        },
                    ],
					breakOnDataPushed: false,
                },
            ],
			elseContent: [
                {
					type: "interact",
					receiveIntrcts: [
                        {
							direction: 0,
							type: 2,
							to: "SoilSensor1",
							name: "moisture",
							set: undefined,
                        },
                    ],
					sendIntrcts: [
                        {
							direction: 1,
							type: 1,
							to: "SenseHat3",
							name: "showMessage",
							get: undefined,
							defaultInput: undefined,
                        },
                    ],
					breakOnDataPushed: false,
                },
            ],
			condition: {
				type: "var",
				variable: {
					name: "unknown",
					type: "variable",
                },
				value: undefined,
            },
        },
    ],
	actions: {},
	functions: {},
	properties: {},
}