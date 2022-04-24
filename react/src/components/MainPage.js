import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';

class MainPage extends Component {
	constructor(props) {
		super(props)

		this.state = {};
	}

	render() {
		return (
		<div className="MainPage">
			<NavigationBar currentpage="MainPage"/>
			<p>
				This is the main page
			</p>
		</div>
		);
	}
}

export default MainPage
