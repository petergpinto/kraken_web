import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';

import './css/TradablePairsInfo.css';

class TradablePairsInfo extends Component {
	constructor(props) {
		super(props)
		
		this.getAllTradablePairs = this.getAllTradablePairs.bind(this);
		this.renderTradablePairs = this.renderTradablePairs.bind(this);
		this.getPairsKeys = this.getPairsKeys.bind(this);
		this.updateKeywordFilter = this.updateKeywordFilter.bind(this);

		this.state = { pairs:[],
			keywordFilter:""
		};
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

	setTradingStatus(event) {
		let data = new URLSearchParams();
		data.append("pair", event.target.getAttribute("pair"));
		if(event.target.checked)
			data.append("pairStatus", 1);
		else
			data.append("pairStatus", 0);
		return fetch(window.origin + '/api/SetTradingStatus', {
			method: "POST",
			headers: {
				'Accept':'application/json'
			}, body:data
			}).then(res => res.json())
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

	handleCheckboxChange(event) {
		console.log(event.target.getAttribute("pair"))
	}

	updateKeywordFilter(event) {
        this.setState({ keywordFilter: event.target.value })
    }

	renderTradablePairsRow() {
		let items = this.state.pairs;

		let keywordFilter = this.state.keywordFilter;
		items = items.filter( function(el) {
			if(el.pair && el.base) {
				return el.pair.toLowerCase().includes(keywordFilter.toLowerCase()) || el.base.toLowerCase().includes(keywordFilter.toLowerCase());
			} else 
				return true;
		});


		return items.map((row, index) => {
			return <tr>
				<td>{row.pair}</td>
				<td>{row.orderMin}</td>
				<td>{row.base}</td>
				<td>{row.altname}</td>
				<td><input type="checkbox" pair={row.pair} defaultChecked={row.doTrading? true:false} onChange={this.setTradingStatus}/></td>
			</tr>
		})
	}

	renderTradablePairs() {
		let pairs = this.state.pairs;
		return (
			<table className="TradablePairsTable">
				<thead>
					<tr>{this.renderTradablePairsHeader()}</tr>
				</thead>
				<tbody>
					{this.renderTradablePairsRow()}
				</tbody>
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
			<div className="PairsTableContainer">
				<input type="text" onChange={this.updateKeywordFilter} />
				{this.renderTradablePairs()}
			</div>
		</div>
		);
	}
}



export default TradablePairsInfo;
