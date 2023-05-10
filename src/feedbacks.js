const { combineRgb } = require('@companion-module/base')

module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	initFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = combineRgb(255, 255, 255); // White
		const backgroundColorRed = combineRgb(255, 0, 0); // Red

		feedbacks.powerState = {
			type: 'boolean',
			label: 'Power State',
			description: 'Indicate if Switch is On or Off',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X State',
					id: 'option',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' }
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;
				if (self.DIMMERINFO.relay_state === opt.option) {
					return true;
				}

				return false;
			}
		};

		self.setFeedbackDefinitions(feedbacks);
	}
}
