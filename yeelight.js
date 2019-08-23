module.exports = function(RED) {
	"use strict";
	var YeeDiscovery = require('yeelight-platform').Discovery
	var YeeDevice = require('yeelight-platform').Device
	
    function YeelightNode(config) {
		
        RED.nodes.createNode(this, config);
		this.lamp_id = config.lamp_id;
		this.method = config.method;
		
		this.yeeDevice = null;
		const discoveryService = new YeeDiscovery();
		
		var globalContext = this.context().global;
		
		discoveryService.on('didDiscoverDevice', (device) => {
			if(device.id == this.lamp_id && this.yeeDevice == null) {
				this.yeeDevice = new YeeDevice(device);
				this.yeeDevice.connect();
				this.yeeDevice.on('connected', () => {
					this.yeeDevice.sendCommand({
					id: -1,
					method: this.method,
					params: this.params
					})
				})
				discoveryService.socket.close()
				globalContext.set('yeeDiscovery', false);
			}
		})
		
        var node = this;
        node.on('input', function(msg) {
			
			this.params = msg.payload;
			var result = "";
			
			if(this.params == "" || this.params == null) {
				this.params = []
			}
			var yeeDiscovery = globalContext.get('yeeDiscovery');

			if (this.yeeDevice == null) {
				
				if(!yeeDiscovery) {
					discoveryService.listen()
					globalContext.set('yeeDiscovery', true);
				}
			} else {
				this.yeeDevice.sendCommand({
					id: -1,
					method: this.method,
					params: this.params
				})
				
				result = this.yeeDevice.device;
			}
			
			node.send(msg);
        });
    }

	RED.nodes.registerType("yeelight", YeelightNode);
 
}