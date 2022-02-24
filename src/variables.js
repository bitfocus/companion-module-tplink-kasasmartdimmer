module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function (i) {
		let self = i;
		let variables = [];

		variables.push({ name: 'sw_ver', label: 'SW Version' });
		variables.push({ name: 'hw_ver', label: 'HW Version' });
		variables.push({ name: 'model', label: 'Model' });
		variables.push({ name: 'device_id', label: 'Device ID' });
		variables.push({ name: 'oem_id', label: 'OEM ID' });
		variables.push({ name: 'hw_id', label: 'HW ID' });
		variables.push({ name: 'rssi', label: 'RSSI' });
		variables.push({ name: 'latitude', label: 'Latitude' });
		variables.push({ name: 'longitude', label: 'Longitude' });
		variables.push({ name: 'alias', label: 'Alias' });
		variables.push({ name: 'mac_address', label: 'MAC Address' });
		variables.push({ name: 'power_state', label: 'Power State' });
		variables.push({ name: 'brightness', label: 'Brightness Level' });

		return variables;
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function (i) {
		let self = i;

		try {
			if ('sw_ver' in self.DIMMERINFO) {
				self.setVariable('sw_ver', self.DIMMERINFO.sw_ver);
			}

			if ('hw_ver' in self.DIMMERINFO) {
				self.setVariable('hw_ver', self.DIMMERINFO.hw_ver);
			}

			if ('model' in self.DIMMERINFO) {
				self.setVariable('model', self.DIMMERINFO.model);
			}

			if ('deviceId' in self.DIMMERINFO) {
				self.setVariable('device_id', self.DIMMERINFO.deviceId);
			}

			if ('oemId' in self.DIMMERINFO) {
				self.setVariable('oem_id', self.DIMMERINFO.oemId);
			}

			if ('hwId' in self.DIMMERINFO) {
				self.setVariable('hw_id', self.DIMMERINFO.hwId);
			}

			if ('rssi' in self.DIMMERINFO) {
				self.setVariable('rssi', self.DIMMERINFO.rssi);
			}

			if ('latitude_i' in self.DIMMERINFO) {
				self.setVariable('latitude', self.DIMMERINFO.latitude_i);
			}

			if ('longitude_i' in self.DIMMERINFO) {
				self.setVariable('longitude', self.DIMMERINFO.longitude_i);
			}

			if ('alias' in self.DIMMERINFO) {
				self.setVariable('alias', self.DIMMERINFO.alias);
			}

			if ('mac' in self.DIMMERINFO) {
				self.setVariable('mac_address', self.DIMMERINFO.mac);
			}

			if ('relay_state' in self.DIMMERINFO) {
				self.setVariable('power_state', (self.DIMMERINFO.relay_state === 1) ? 'On' : 'Off');
			}

			if ('brightness' in self.DIMMERINFO) {
				self.setVariable('brightness', self.DIMMERINFO.brightness);
			}
		}
		catch(error) {
			if (String(error).indexOf('Cannot use \'in\' operator to search') === -1) {
				self.log('error', 'Error from Dimmer Switch: ' + String(error));
			}
		}
	}
}
