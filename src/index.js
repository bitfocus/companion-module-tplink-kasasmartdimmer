var instance_skel = require('../../../instance_skel')
var actions = require('./actions.js')
var presets = require('./presets.js')
var feedbacks = require('./feedbacks.js')
var variables = require('./variables.js')

var debug;

const { Client } = require('tplink-smarthome-api');

instance.prototype.INTERVAL = null; //used for polling device
instance.prototype.DIMMERINFO = {
	sw_ver: '',
	hw_ver: '',
	model: '',
	deviceId: '',
	oemId: '',
	hwId: '',
	rssi: '',
	latitude_i: '',
	longitude_i: '',
	alias: '',
	mac: '',
	relay_state: 0,
	brightness: 50
};

instance.prototype.BRIGHTNESS_INTERVAL = null; //used for brightness up/down actions
instance.prototype.CURRENT_BRIGHTNESS = 50;

// #########################
// #### Other Functions ####
// #########################
instance.prototype.getInformation = function () {
	//Get all information from Device
	let self = this;

	if (self.config.host) {
		try {
			let client = new Client();
			let dimmerswitch = client.getDevice({ host: self.config.host })
			.then((device) => {
				device.getSysInfo()
				.then((info) => {
					self.DIMMERINFO = info;
	
					if (self.DIMMERINFO) {
						self.status(self.STATUS_OK);
	
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
};

instance.prototype.setupInterval = function() {
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
};

instance.prototype.stopInterval = function () {
	let self = this;

	self.log('info', 'Stopping Update Interval.');

	if (self.INTERVAL) {
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
};

instance.prototype.handleError = function(err) {
	let self = this;

	self.log('error', 'Stopping Update interval due to error.');
	self.stopInterval();

	let error = err.toString();

	self.status(self.STATUS_ERROR);

	Object.keys(err).forEach(function(key) {
		if (key === 'code') {
			if (err[key] === 'ECONNREFUSED') {
				error = 'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?';
			}
		}
	});

	self.log('error', error);
};

instance.prototype.brightness_change = function(direction) {
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
};

instance.prototype.brightness_fader = function(direction, mode, rate) {
	let self = this;

	self.brightness_fader_stop();

	if (mode === 'start') {
		self.stopInterval(); //stop the regular update interval as it will mess with the brightness otherwise
		self.BRIGHTNESS_INTERVAL = setInterval(self.brightness_change.bind(self), parseInt(rate), direction);
	}
	else {
		self.setupInterval(); //restart regular update interval if needed
	}
};

instance.prototype.brightness_fader_stop = function() {
	let self = this;

	if (self.BRIGHTNESS_INTERVAL !== null) {
		clearInterval(self.BRIGHTNESS_INTERVAL);
		self.BRIGHTNESS_INTERVAL = null;
	}
};

// ########################
// #### Instance setup ####
// ########################
function instance(system, id, config) {
	let self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
};

instance.GetUpgradeScripts = function () {
};

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this;

	self.stopInterval();
	self.brightness_fader_stop();

	debug('destroy', self.id);
};

// Initalize module
instance.prototype.init = function () {
	let self = this;

	debug = self.debug;
	log = self.log;

	self.DIMMERINFO.light_state = {
		brightness: null
	};

	self.status(self.STATUS_WARNING, 'connecting');
	self.setAlias();
	self.getInformation();
	self.setupInterval();
	self.actions(); // export actions
	self.init_presets();
	self.init_variables();
	self.checkVariables();
	self.init_feedbacks();
	self.checkFeedbacks();
};

// Update module after a config change
instance.prototype.updateConfig = function (config) {
	let self = this;
	self.config = config;
	self.status(self.STATUS_WARNING, 'connecting');
	self.setAlias();
	self.getInformation();
	self.setupInterval();
	self.actions(); // export actions
	self.init_presets();
	self.init_variables();
	self.checkVariables();
	self.init_feedbacks();
	self.checkFeedbacks();
};

instance.prototype.updateData = function () {
	let self = this;

	self.CURRENT_BRIGHTNESS = self.DIMMERINFO.brightness;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls TP-Link Kasa Smart Dimmer Switches.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Dimmer Switch IP',
			width: 4,
			regex: self.REGEX_IP
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'aliasInfo',
			width: 12,
			label: 'Dimmer Switch Alias',
			value: 'If you wish to change the name of the dimmer switch, enter the new name (alias) here.',
		},
		{
			type: 'textinput',
			id: 'alias',
			label: 'Dimmer Switch Alias',
			default: '',
			width: 4
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'intervalInfo',
			width: 12,
			label: 'Update Interval',
			value: 'Please enter the amount of time in milliseconds to request new information from the switch. Set to 0 to disable. Do not use an interval less than 2000 or the switch may stop responding.',
		},
		{
			type: 'textinput',
			id: 'interval',
			label: 'Update Interval',
			width: 3,
			default: 2000
		}
	]
};

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets(this));
};

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables(this));
};

// Setup Initial Values
instance.prototype.checkVariables = function () {
	variables.checkVariables(this);
};

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks(this));
};

// ##########################
// #### Instance Actions ####
// ##########################
instance.prototype.actions = function (system) {
	this.setActions(actions.setActions(this));
};

instance.prototype.power = function(powerState) {
	let self = this;

	if (self.config.host) {
		try {
			let client = new Client();
			let dimmerswitch = client.getDevice({ host: self.config.host })
			.then((device) => {
				self.log('info', 'Setting Dimmer Power to: ' + powerState);
				device.setPowerState(powerState);
			});
		}
		catch(error) {
			self.handleError(error);
		};
	}
};

instance.prototype.powerToggle = function() {
	let self = this;

	if (self.config.host) {
		try {
			let client = new Client();
			let dimmerswitch = client.getDevice({ host: self.config.host })
			.then((device) => {
				self.log('info', 'Toggling Dimmer Switch');
				device.togglePowerState();
			});
		}
		catch(error) {
			self.handleError(error);
		};
	}
};

instance.prototype.setBrightness = function(brightness) {
	let self = this;

	if (self.config.host) {
		try {
			let client = new Client();
			let dimmerswitch = client.getDevice({ host: self.config.host })
			.then((device) => {
				self.log('info', 'Setting Dimmer Brightness to: ' + brightness);
				device.dimmer.setBrightness(brightness);
			});
		}
		catch(error) {
			self.handleError(error);
		}
	}
};

instance.prototype.setAlias = function(newName) {
	let self = this;

	if (self.config.host) {
		try {
			if (self.config.alias !== '') {
				self.log('info', 'Setting Dimmer Switch Alias to: ' + newName);

				let client = new Client();
				let dimmerswitch = client.getDevice({ host: self.config.host })
				.then((device) => {
					device.setAlias(newName);
				});
			}
		}
		catch(error) {
			self.handleError(error);
		}
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;