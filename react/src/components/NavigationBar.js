import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import './css/NavigationBar.css';

class NavigationBar extends Component {
	constructor(props) {
		super(props)

		this.state = {};
	}

	render() {
		return (
			<div className="NavigationBar">
				<ul>
					<li className={this.props.currentpage=="MainPage"?"active":""}><Link to="/">Main Page</Link></li>
				    <li className={this.props.currentpage=="TradablePairsInfo"?"active":""}><Link to="/TradablePairsInfo">View Tradable Pairs</Link></li>
					<li className={this.props.currentpage=="Account"?"active":""}><Link to="/Account">View Account Info</Link></li>
				</ul>
			</div>
		);
	}
}

export default NavigationBar;
