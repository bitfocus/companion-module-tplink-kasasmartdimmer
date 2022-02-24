module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	setActions: function (i) {
		let self = i;
		let actions = {};

		// ########################
		// #### Power Actions ####
		// ########################

		actions.powerOn = {
			label: 'Power On',
			callback: function (action, bank) {
				self.power(true);
			}
		}

		actions.powerOff = {
			label: 'Power Off',
			callback: function (action, bank) {
				self.power(false);
			}
		}

		actions.powerToggle = {
			label: 'Power Toggle',
			callback: function (action, bank) {
				self.powerToggle();
			}
		}

		// ############################
		// #### Brightness Actions ####
		// ############################

		actions.brightness = {
			label: 'Set Brightness',
			options: [
				{
					type: 'number',
					label: 'Brightness',
					id: 'brightness',
					tooltip: 'Sets the brightness (0 - 100)',
					min: 0,
					max: 100,
					default: self.CURRENT_BRIGHTNESS,
					step: 1,
					required: true,
					range: true
				}
			],
			callback: function (action, bank) {
				self.setBrightness(action.options.brightness);
			}
		}

		actions.brightnessUp = {
			label: 'Brightness Up Continuously',
			options: [
				{
					type: 'textinput',
					label: 'Increase Rate (in ms)',
					id: 'rate',
					default: 50,
					tooltip: 'The amount of time in milliseconds'
				}
			],
			callback: function (action, bank) {
				let rate = action.options.rate;
				self.parseVariables(rate, function (value) {
					rate = value;
				});
				rate = parseInt(rate);

				self.brightness_fader('up', 'start', rate);
			}
		}

		actions.brightnessUpStop = {
			label: 'Brightness Up Stop',
			callback: function (action, bank) {
				self.brightness_fader('up', 'stop', null);
			}
		}

		actions.brightnessDown = {
			label: 'Brightness Down Continuously',
			options: [
				{
					type: 'textinput',
					label: 'Decrease Rate (in ms)',
					id: 'rate',
					default: 50,
					tooltip: 'The amount of time in milliseconds'
				}
			],
			callback: function (action, bank) {
				let rate = action.options.rate;
				self.parseVariables(rate, function (value) {
					rate = value;
				});
				rate = parseInt(rate);

				self.brightness_fader('down', 'start', rate);
			}
		}

		actions.brightnessDownStop = {
			label: 'Brightness Down Stop',
			callback: function (action, bank) {
				self.brightness_fader('down', 'stop', null);
			}
		}

		return actions
	}
}