console.log(` This is the child`);

process.on('message', m => {
	console.log(`Got message ${m}`);
	process.send(`Sending ${m} message was a success!`);
});
