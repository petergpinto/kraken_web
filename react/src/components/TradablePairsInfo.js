import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';

class TradablePairsInfo extends Component {
	constructor(props) {
		super(props)
		
		this.getAllTradablePairs = this.getAllTradablePairs.bind(this);
		this.renderTradablePairs = this.renderTradablePairs.bind(this);
		this.getPairsKeys = this.getPairsKeys.bind(this);

		this.state = { pairs:[] };
	}

	getAllTradablePairs() {
		return fetch(window.origin + '/api/TradablePairs', {
			method: "GET",
			headers: {
				'Accept':'application/json',
			}
		}).then(res => res.json())
		.then( json => {
			this.setState({pairs:json});
		});
	}

	getPairsKeys() {
		if(this.state.pairs[0])
			return Object.keys(this.state.pairs[0]);
		else
			return [];
	}

	renderTradablePairsHeader() {
		let keys = this.getPairsKeys();
		return keys.map((key, index) => {
			if(key == 'pair')
				return <th>Pair</th>
			if(key == 'base')
				return <th>Base</th>
			if(key == 'altname')
				return <th>Alt Name</th>
			if(key == 'doTrading')
				return <th>Do Trading?</th>
			if(key == 'orderMin')
				return <th>Minimum Order</th>
			if(key == 'id')
				return null
			return <th>{key}</th>		
		})
	}

	renderTradablePairsRow() {
		let items = this.state.pairs;

		return items.map((row, index) => {
			return <tr>
				<td>{row.pair}</td>
				<td>{row.orderMin}</td>
				<td>{row.base}</td>
				<td>{row.altname}</td>
				<td>{row.doTrading? "Yes":"No"}</td>
			</tr>
		})
	}

	renderTradablePairs() {
		let pairs = this.state.pairs;
		return (
			<table>
			<tr>{this.renderTradablePairsHeader()}</tr>
			{this.renderTradablePairsRow()}
			</table>
		);
	}

	componentDidMount() {
		this.getAllTradablePairs();
	}

	render() {
		return (
		<div className="TradablePairsInfo">
			<NavigationBar currentpage="TradablePairsInfo"/>
			<div>
				{this.renderTradablePairs()}
			</div>
		</div>
		);
	}
}

export default TradablePairsInfo;
