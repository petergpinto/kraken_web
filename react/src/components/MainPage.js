import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

class MainPage extends Component {
	constructor(props) {
		super(props)

		this.state = {};
	}

	render() {
		return (
			<p>
				<Link to="/TradablePairsInfo">View Tradable Pairs</Link>
			</p>
		);
	}
}

export default MainPage
