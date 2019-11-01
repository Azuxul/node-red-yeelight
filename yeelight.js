module.exports = function(RED) {
	"use strict";

	var searchRequest = "M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1982\r\nMAN: \"ssdp:discover\"\r\nST: wifi_bulb";

	var PORT = 1982;
	var HOST = '239.255.255.250';

	function sendCommand(light, method, params) {
		var net = require('net');
	  
		var client = new net.Socket();
		client.connect(light["port"], light["ip"], function() {
	  
		  var request = '{\"id\":1,\"method\":\"' + method + '\",\"params\":[';
	  
		  for(var i = 0; i < params.length; i++) {
			if(i != 0) {
			  request += ", ";
			}
			if(typeof(params[i]) == "number") {
				request += params[i];
			} else {
				request += '\"' + params[i] + '\"';
			}
		  }
	  
		  request += ']}\r\n'
	  
		  client.write(request);
		});
	  
		client.on('data', function(data) {
		  client.destroy();
		});
	}

	function startSending(id, method, params) {

		var dgram = require('dgram'); 
		var server = dgram.createSocket("udp4"); 

		server.on('listening', function() {
			server.setBroadcast(true);
			server.setMulticastTTL(128);
			server.addMembership('239.255.255.250'); 
		});
		
		server.on('message', function(message, remote) {
			var data = String(message).split("\r\n");
			var dataParse = {};
			
			for(var i = 4; i < data.length - 1; i++) {
				var buff = data[i].split(": ");
				dataParse[buff[0]] = buff[1]
			}
			
			if("id" in dataParse && dataParse["id"] == id) {

				if("Location" in dataParse) {
					var loc = dataParse["Location"].replace("yeelight://", "").split(":");

					dataParse["ip"] = loc[0];
					dataParse["port"] = parseInt(loc[1]);

					
					sendCommand(dataParse, method, params);
				}
			}
		});
		
		server.bind();
		var request = new Buffer(searchRequest);
		server.send(request, 0, request.length, 1982, '239.255.255.250');
	}
	
    function YeelightNode(config) {
		
        RED.nodes.createNode(this, config);
		this.lamp_id = config.lamp_id;
		this.lamp_name = config.lamp_name;
		this.method = config.method;
		
		var globalContext = this.context().global;
		
		var node = this;
		
        node.on('input', function(msg) {
			
			this.params = msg.payload;
			
			if(this.params == "" || this.params == null) {
				this.params = []
			}

			globalContext.set(this.lamp_name + '.' + this.method, msg.payload);
			startSending(this.lamp_id, this.method, this.params);

			node.send(msg);
        });
    }

	RED.nodes.registerType("yeelight", YeelightNode);
 
}