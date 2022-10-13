import React from 'react'

function SayHello({ getGreeting }) {
	return (
		<section>
			<h2> Say Hello </h2>
			<button onClick={getGreeting}>Greet</button>
			<hr />
		</section>
	);
}

export default SayHello