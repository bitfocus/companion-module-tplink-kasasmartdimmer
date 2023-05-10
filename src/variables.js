module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ variableId: 'sw_ver', name: 'SW Version' });
		variables.push({ variableId: 'hw_ver', name: 'HW Version' });
		variables.push({ variableId: 'model', name: 'Model' });
		variables.push({ variableId: 'device_id', name: 'Device ID' });
		variables.push({ variableId: 'oem_id', name: 'OEM ID' });
		variables.push({ variableId: 'hw_id', name: 'HW ID' });
		variables.push({ variableId: 'rssi', name: 'RSSI' });
		variables.push({ variableId: 'latitude', name: 'Latitude' });
		variables.push({ variableId: 'longitude', name: 'Longitude' });
		variables.push({ variableId: 'alias', name: 'Alias' });
		variables.push({ variableId: 'mac_address', name: 'MAC Address' });
		variables.push({ variableId: 'power_state', name: 'Power State' });
		variables.push({ variableId: 'brightness', name: 'Brightness Level' });

		self.setVariableDefinitions(variables);
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		let variableObj = {};

		try {
			if ('sw_ver' in self.DIMMERINFO) {
				variableObj['sw_ver'] = self.DIMMERINFO.sw_ver;
			}

			if ('hw_ver' in self.DIMMERINFO) {
				variableObj['hw_ver'] = self.DIMMERINFO.hw_ver;
			}

			if ('model' in self.DIMMERINFO) {
				variableObj['model'] = self.DIMMERINFO.model;
			}

			if ('deviceId' in self.DIMMERINFO) {
				variableObj['device_id'] = self.DIMMERINFO.deviceId;
			}

			if ('oemId' in self.DIMMERINFO) {
				variableObj['oem_id'] = self.DIMMERINFO.oemId;
			}

			if ('hwId' in self.DIMMERINFO) {
				variableObj['hw_id'] = self.DIMMERINFO.hwId;
			}

			if ('rssi' in self.DIMMERINFO) {
				variableObj['rssi'] = self.DIMMERINFO.rssi;
			}

			if ('latitude_i' in self.DIMMERINFO) {
				variableObj['latitude'] = self.DIMMERINFO.latitude_i;
			}

			if ('longitude_i' in self.DIMMERINFO) {
				variableObj['longitude'] = self.DIMMERINFO.longitude_i;
			}

			if ('alias' in self.DIMMERINFO) {
				variableObj['alias'] = self.DIMMERINFO.alias;
			}

			if ('mac' in self.DIMMERINFO) {
				variableObj['mac_address'] = self.DIMMERINFO.mac;
			}

			if ('relay_state' in self.DIMMERINFO) {
				variableObj['power_state'] = (self.DIMMERINFO.relay_state === 1) ? 'On' : 'Off';
			}

			if ('brightness' in self.DIMMERINFO) {
				variableObj['brightness'] = self.DIMMERINFO.brightness;
			}

			self.setVariableValues(variableObj);
		}
		catch(error) {
			if (String(error).indexOf('Cannot use \'in\' operator to search') === -1) {
				self.log('error', 'Error from Dimmer Switch: ' + String(error));
			}
		}
	}
}
