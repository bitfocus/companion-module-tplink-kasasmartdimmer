module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	initActions: function () {
		let self = this;
		let actions = {};

		// ########################
		// #### Power Actions ####
		// ########################

		actions.powerOn = {
			name: 'Power On',
			options: [],
			callback: function (action) {
				self.power(true);
			}
		}

		actions.powerOff = {
			name: 'Power Off',
			options: [],
			callback: function (action) {
				self.power(false);
			}
		}

		actions.powerToggle = {
			name: 'Power Toggle',
			options: [],
			callback: function (action) {
				self.powerToggle();
			}
		}

		// ############################
		// #### Brightness Actions ####
		// ############################

		actions.brightness = {
			name: 'Set Brightness',
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
			callback: function (action) {
				self.setBrightness(action.options.brightness);
			}
		}

		actions.brightnessUp = {
			name: 'Brightness Up Continuously',
			options: [
				{
					type: 'textinput',
					label: 'Increase Rate (in ms)',
					id: 'rate',
					default: 50,
					tooltip: 'The amount of time in milliseconds'
				}
			],
			callback: function (action) {
				let rate = action.options.rate;
				self.parseVariables(rate, function (value) {
					rate = value;
				});
				rate = parseInt(rate);

				self.brightness_fader('up', 'start', rate);
			}
		}

		actions.brightnessUpStop = {
			name: 'Brightness Up Stop',
			options: [],
			callback: function (action) {
				self.brightness_fader('up', 'stop', null);
			}
		}

		actions.brightnessDown = {
			name: 'Brightness Down Continuously',
			options: [
				{
					type: 'textinput',
					label: 'Decrease Rate (in ms)',
					id: 'rate',
					default: 50,
					tooltip: 'The amount of time in milliseconds'
				}
			],
			callback: function (action) {
				let rate = action.options.rate;
				self.parseVariables(rate, function (value) {
					rate = value;
				});
				rate = parseInt(rate);

				self.brightness_fader('down', 'start', rate);
			}
		}

		actions.brightnessDownStop = {
			name: 'Brightness Down Stop',
			options: [],
			callback: function (action) {
				self.brightness_fader('down', 'stop', null);
			}
		}

		self.setActionDefinitions(actions);
	}
}