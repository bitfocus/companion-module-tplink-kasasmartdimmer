const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = [];

		const foregroundColor = combineRgb(255, 255, 255); // White
		const backgroundColorRed = combineRgb(255, 0, 0); // Red
		const backgroundColorGreen = combineRgb(0, 255, 0); // Red

		// ########################
		// #### Power Presets ####
		// ########################

		presets.push({
			type: 'button',
			category: 'Power',
			name: 'Power On',
			style: {
				text: 'Power\\nON',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'powerOn'
						}
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 1
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorGreen
					}
				}
			]
		})

		presets.push({
			type: 'button',
			category: 'Power',
			name: 'Power Off',
			style: {
				text: 'Power\\nOFF',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'powerOff'
						}
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 0
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		})

		presets.push({
			type: 'button',
			category: 'Power',
			name: 'Power Toggle',
			style: {
				text: 'Power\\nTOGGLE',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'powerToggle'
						}
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 1
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorGreen
					}
				}
			]
		})

		presets.push({
			type: 'button',
			category: 'Brightness',
			name: 'Brightness Up',
			style: {
				text: 'Brightness\\nUp',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'brightnessUp',
							options: {
								rate: 50
							}
						}
					],
					up: [
						{
							actionId: 'brightnessUpStop'
						}
					],
				},
			],
			feedbacks: []
		})

		presets.push({
			type: 'button',
			category: 'Brightness',
			name: 'Brightness Down',
			style: {
				text: 'Brightness\\nDown',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'brightnessDown',
							options: {
								rate: 50
							}
						}
					],
					up: [
						{
							actionId: 'brightnessDownStop'
						}
					],
				},
			],
			feedbacks: []
		})

		for (let i = 10; i <= 100; i = i + 10) {
			presets.push({
				type: 'button',
				category: 'Brightness',
				name: 'Brightness ' + i + '%',
				style: {
					text: i + '%',
					size: '18',
					color: '16777215',
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'brightness',
								options: {
									brightness: i
								}
							}
						],
						up: [],
					},
				],
				feedbacks: []
			})
		}

		this.setPresetDefinitions(presets);
	}
}
