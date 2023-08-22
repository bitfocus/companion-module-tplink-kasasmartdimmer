const { InstanceStatus } = require('@companion-module/base')

const { Client } = require('tplink-smarthome-api');

module.exports = {
	power: function(powerState) {
		let self = this;
	
		if (self.config.host) {
			try {
				if (!self.DEVICE) {
					let client = new Client();
					self.DEVICE = client.getDevice({ host: self.config.host });
				}
				
				self.DEVICE
				.then((device) => {
					self.log('info', 'Setting Dimmer Power to: ' + powerState);
					device.setPowerState(powerState);
				});
			}
			catch(error) {
				self.handleError(error);
			};
		}
	},
	
	powerToggle: function() {
		let self = this;
	
		if (self.config.host) {
			try {
				if (!self.DEVICE) {
					let client = new Client();
					self.DEVICE = client.getDevice({ host: self.config.host });
				}
				
				self.DEVICE
				.then((device) => {
					self.log('info', 'Toggling Dimmer Switch');
					device.togglePowerState();
				});
			}
			catch(error) {
				self.handleError(error);
			};
		}
	},

	setBrightness: function(brightness) {
		let self = this;
	
		if (self.config.host) {
			try {
				if (!self.DEVICE) {
					let client = new Client();
					self.DEVICE = client.getDevice({ host: self.config.host });
				}
				
				self.DEVICE
				.then((device) => {
					self.log('info', 'Setting Dimmer Brightness to: ' + brightness);
					device.dimmer.setBrightness(brightness);
				});
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},
	
	setAlias: function() {
		let self = this;

		let newName = self.config.alias;
	
		if (self.config.host) {
			try {
				if (self.config.alias !== '') {
					self.log('info', 'Setting Dimmer Switch Alias to: ' + newName);
	
					if (!self.DEVICE) {
						let client = new Client();
						self.DEVICE = client.getDevice({ host: self.config.host });
					}
					
					self.DEVICE
					.then((device) => {
						device.setAlias(newName);
					});
				}
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},

	getInformation: function () {
		//Get all information from Device
		let self = this;

		if (self.config.host) {
			try {
				if (!self.DEVICE) {
					let client = new Client();
					self.DEVICE = client.getDevice({ host: self.config.host });
				}
				
				self.DEVICE
				.then((device) => {
					device.getSysInfo()
					.then((info) => {
						self.DIMMERINFO = info;
		
						if (self.DIMMERINFO) {
							self.updateStatus(InstanceStatus.Ok);
		
							try {
								self.updateData();
								self.checkVariables();
								self.checkFeedbacks();
							}
							catch(error) {
								self.handleError(error);
							}
						}
					})
					.catch((error) => {
						self.handleError(error);
					});
				})
				.catch((error) => {
					self.handleError(error);
				});
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},
	
	setupInterval: function() {
		let self = this;

		if (self.INTERVAL !== null) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = null;
		}

		self.config.interval = parseInt(self.config.interval);

		if (self.config.interval > 0) {
			self.log('info', 'Starting Update Interval.');
			self.INTERVAL = setInterval(self.getInformation.bind(self), self.config.interval);
		}
	},

	stopInterval: function () {
		let self = this;

		self.log('info', 'Stopping Update Interval.');

		if (self.INTERVAL) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = null;
		}
	},

	handleError: function(err) {
		let self = this;

		self.log('error', 'Stopping Update interval due to error.');
		self.stopInterval();

		let error = err.toString();

		self.updateStatus(InstanceStatus.UnknownError);

		Object.keys(err).forEach(function(key) {
			if (key === 'code') {
				if (err[key] === 'ECONNREFUSED') {
					error = 'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?';
					self.updateStatus(InstanceStatus.ConnectionFailure);
				}
			}
		});

		self.log('error', error);
	},

	brightness_change: function(direction) {
		let self = this;

		let newLevel = self.CURRENT_BRIGHTNESS;

		if (direction === 'up') {
			newLevel++;
		}
		else {
			newLevel--;
		}

		if ((newLevel > 100) || (newLevel < 0)) {
			self.brightness_fader(direction, 'stop', null);
		}
		else {
			self.setBrightness(newLevel);
			self.CURRENT_BRIGHTNESS = newLevel;
			self.setVariable('brightness', newLevel);
		}
	},

	brightness_fader: function(direction, mode, rate) {
		let self = this;

		self.brightness_fader_stop();

		if (mode === 'start') {
			self.stopInterval(); //stop the regular update interval as it will mess with the brightness otherwise
			self.BRIGHTNESS_INTERVAL = setInterval(self.brightness_change.bind(self), parseInt(rate), direction);
		}
		else {
			self.setupInterval(); //restart regular update interval if needed
		}
	},

	brightness_fader_stop: function() {
		let self = this;

		if (self.BRIGHTNESS_INTERVAL !== null) {
			clearInterval(self.BRIGHTNESS_INTERVAL);
			self.BRIGHTNESS_INTERVAL = null;
		}
	},

	updateData: function () {
		let self = this;

		self.CURRENT_BRIGHTNESS = self.DIMMERINFO.brightness;
	}
}