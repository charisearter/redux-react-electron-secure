const { contextBridge, ipcRenderer } = require('electron');

const API = {
	// Renderer --> Main
	send: (channel, data) => {
		let validChannels = ['message', 'fork'];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},

	// Bi-directional Renderer -> Main --> Renderer
	invoke: (channel, data) => {
		let validChannels = ['say-hello'];
		if (validChannels.includes(channel)) {
			ipcRenderer.invoke(channel, data);
		}
	},

	// Main --> Renderer
	receive: (channel, func) => {
		let validChannels = [];
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (_, ...args) => func(...args));
		}
	},

	openNativeFile: () => ipcRenderer.invoke('dialog:openNativeFile'),
};

contextBridge.exposeInMainWorld('api', API);
