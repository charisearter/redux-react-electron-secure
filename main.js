const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

// node testing

const { fork, spawn } = require('node:child_process');

let isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		show: false,
		resizable: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	mainWindow.on('ready-to-show', mainWindow.show);

	mainWindow.loadFile('index.html');

	mainWindow.on('closed', () => {
		// De-reference window object
		mainWindow = null;
	});

	// if (isDev) {
	// 	mainWindow.webContents.openDevTools();
	// }
}

app.whenReady().then(createWindow);

// Quit all windows, except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// IPC events here

// Say Hello
ipcMain.handle('say-hello', (_, args) => {
	console.log(args);
	return `Hello from Main. This is app version ${app.getVersion()}.`;
});

// Renderer -> Send Message to Main
ipcMain.on('message', (_, args) => {
	console.log(`The message sent to Main: ${args}`);
});

//Open file
//ipcMain.handle('dialog:openNativeFile', handleNativeFileOpen);

// node test
ipcMain.on('fork', e => {
	const p = fork(path.join(__dirname, 'child.js'), ['hello'], {
		stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
	});

	p.stdout.on('data', d => {
		e.reply('data', '[stdout-main-fork] ' + d.toString());
		console.log(`Stdout:\n ${d}`);
	});

	p.stderr.on('data', d => {
		e.reply('data', '[stderr-main-fork] ', +d.toString());
		console.log(`Stderr:\n ${d}`);
	});

	p.send('hello');
	p.on('message', m => {
		e.reply('data', '[ipc-main-fork] ' + m);
		console.log(`Message:\n ${m}`);
	});
});
