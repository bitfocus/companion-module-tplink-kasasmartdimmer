const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')

const config = require('./config')
const actions = require('./actions')
const feedbacks = require('./feedbacks')
const variables = require('./variables')
const presets = require('./presets')

const utils = require('./utils')

class kasadimmerInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
		})

		this.INTERVAL = null; //used for polling device
		this.DIMMERINFO = {
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
		
		this.BRIGHTNESS_INTERVAL = null; //used for brightness up/down actions
		this.CURRENT_BRIGHTNESS = 50;
		
		this.DEVICE = null;
	}

	async destroy() {
		let self = this;

		self.stopInterval();
		self.brightness_fader_stop();
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		// polling is running and polling has been de-selected by config change
		this.stopInterval();

		this.config = config

		this.DIMMERINFO.light_state = {
			brightness: null
		};
	
		//this.updateStatus(InstanceStatus.Connecting);
		this.setAlias();
		this.getInformation();
		this.setupInterval();
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables();
		this.checkFeedbacks();
	}
}

runEntrypoint(kasadimmerInstance, UpgradeScripts);