module.exports = {
	setPresets: function (i) {
		let self = i;
		let presets = [];

		const foregroundColor = self.rgb(255, 255, 255); // White
		const backgroundColorRed = self.rgb(255, 0, 0); // Red
		const backgroundColorGreen = self.rgb(0, 255, 0); // Red

		// ########################
		// #### Power Presets ####
		// ########################

		presets.push({
			category: 'Power',
			label: 'Power On',
			bank: {
				style: 'text',
				text: 'Power\\nON',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'powerOn'
				}
			],
			feedbacks: [
				{
					type: 'powerState',
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
			category: 'Power',
			label: 'Power Off',
			bank: {
				style: 'text',
				text: 'Power\\nOFF',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'powerOff'
				}
			],
			feedbacks: [
				{
					type: 'powerState',
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
			category: 'Power',
			label: 'Power Toggle',
			bank: {
				style: 'text',
				text: 'Power\\nTOGGLE',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'powerToggle'
				}
			],
			feedbacks: [
				{
					type: 'powerState',
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
			category: 'Brightness',
			label: 'Brightness Up',
			bank: {
				style: 'text',
				text: 'Brightness\\nUp',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'brightnessUp',
					options: {
						rate: 50
					}
				}
			],
			release_actions: [
				{
					action: 'brightnessUpStop'
				}
			]
		})

		presets.push({
			category: 'Brightness',
			label: 'Brightness Down',
			bank: {
				style: 'text',
				text: 'Brightness\\nDown',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'brightnessDown',
					options: {
						rate: 50
					}
				}
			],
			release_actions: [
				{
					action: 'brightnessDownStop'
				}
			]
		})

		for (let i = 10; i <= 100; i = i + 10) {
			presets.push({
				category: 'Brightness',
				label: 'Brightness ' + i + '%',
				bank: {
					style: 'text',
					text: i + '%',
					size: '18',
					color: '16777215',
					bgcolor: self.rgb(0, 0, 0),
				},
				actions: [
					{
						action: 'brightness',
						options: {
							brightness: i
						}
					}
				]
			})
		}

		return presets
	}
}
