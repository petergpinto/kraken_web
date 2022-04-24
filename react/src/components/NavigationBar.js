import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';



class NavigationBar extends Component {
	constructor(props) {
		super(props)

		this.state = {};
	}

	render() {
		return (
			<div className="NavigationBar">
				<Link to="/">Main Page</Link>
				<Link to="TradablePairsInfo">View Tradable Pairs</Link>
			</div>
		);
	}
}

export default NavigationBar;
