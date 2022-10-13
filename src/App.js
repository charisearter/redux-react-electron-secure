import React, { useState } from 'react';
import SayHello from './components/SayHello';
import Message from './components/Message';

function App() {
	const [msg, setMsg] = useState('Initial message');
	const [forkMain, setForkMain] = useState('');

	// One-Way: Say Hello -  IPC renderer -> main
	const getGreeting = async () => {
		await api.invoke('say-hello', 'This is another greeting: Sup!');
		console.log('Sent to Main - appears in Electron console');
	};

	// Two-Way: Send Message - IPC renderer -> main --> renderer
	const sendMessage = () => {
		window.api.send('message', msg);
	};

	const onMsgChange = e => {
		e.preventDefault();
		setMsg(e.target.value);
	};

	return (
		<div>
			<h1>App component</h1>
			<SayHello getGreeting={getGreeting} />
			<Message sendMessage={sendMessage} onMsgChange={onMsgChange} />
			<hr />

			<button
				id='fork-main'
				onClick={() => {
					window.api.send('fork');
				}}
			>
				Fork Child (Main)
			</button>
		</div>
	);
}

export default App;
