const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
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
				regex: Regex.IP
			},
			{
				type: 'static-text',
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
				type: 'static-text',
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
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
				width: 12
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: ' ',
				value: `
				<div class="alert alert-info">
					<div>
						Enabling Verbose Logging will push all incoming and outgoing data to the log, which is helpful for debugging.
					</div>
				</div>
				`,
				isVisible: (configValues) => configValues.verbose === true,
			}
		]
	}
}