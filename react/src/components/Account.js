import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import Loader from './Loader';

import './css/Account.css';

class Account extends Component {
    constructor(props) {
        super(props);
		
		this.getAccountBalance = this.getAccountBalance.bind(this);
		this.getTradeBalance = this.getTradeBalance.bind(this);
		
		this.renderAccountBalance = this.renderAccountBalance.bind(this);
		this.renderTradeBalance = this.renderTradeBalance.bind(this);

		this.state = {
			accountBalanceLoading:true,
			tradeBalanceLoading:true,
		};
	}

	getAccountBalance() {
		return fetch(window.origin + '/api/AccountBalance', {
			method: "GET",
			headers: {
				'Accept':'application/json'
			}
		}).then(res => res.json())
		.then(json => {
			this.setState({accountBalance:json});
			this.setState({accountBalanceLoading:false});
			console.log("AccountBalance", json);
		});
	}

	getTradeBalance() {
		return fetch(window.origin + '/api/TradeBalance', {
            method: "GET",
            headers: {
                'Accept':'application/json'
            }
        }).then(res => res.json())
        .then(json => {
            this.setState({tradeBalance:json});
			this.setState({tradeBalanceLoading:false});
			console.log("TradeBalance", json);
        });
	}
	
	renderAssets(accountBalance) {
		if(!accountBalance)
			return;
		let html = [];
		for (const [key, value] of Object.entries(accountBalance.balances) ) {
        	html.push(<tr><td>{key}</td><td>{value}</td></tr>)
        }
		return html;
	}


	renderAccountBalance() {
		let accountBalance = this.state.accountBalance;
		if(!accountBalance)
			return null;

		return (
			<table>
				<thead>
					<tr><th colSpan={2}>Currency Balances</th></tr>
					<tr><th>Currency</th><th>Amount</th></tr>
				</thead>
				<tbody>
					{this.renderAssets(accountBalance)}
				</tbody>
			</table>
		)
	}

	renderBalances(tradeBalance) {
		if(!tradeBalance)
			return;

		let html = [];
		for (const [key, value] of Object.entries(tradeBalance.tradebalances) ) {
			if(key == "eb") key = "Evaluated Balance:";
			if(key == "tb") key = "Last Trade Balance:";
			if(key == "m")  key = "Margin Balance:";
			if(key == "n")  key = key;
			if(key == "c")  key = key;
			if(key == "v")  key = key;
			if(key == "e")  key = "Equity";
			if(key == "mf") key = "Free Margin:";
            html.push(<tr><td>{key}</td><td>{'$'+value}</td></tr>)
        }
		return html
	}

	renderTradeBalance() {
		let tradeBalance = this.state.tradeBalance;
		if(tradeBalance == {})
			return null;

		return (
			<table>
				<thead>
					<tr><th colSpan={2}>Trade Balances</th></tr>
				</thead>
				<tbody>
					{this.renderBalances(tradeBalance)}
				</tbody>
			</table>
		)
	}

	componentDidMount() {
		this.getAccountBalance();
		this.getTradeBalance();
	}

	render() {
		if(this.state.accountBalanceLoading || this.state.tradeBalanceLoading) {
			return (
				<div className="Account">
					<NavigationBar currentpage="Account" />
					<Loader style={{'width':'15vw', 'height':'auto', 'align-self':'center', 'padding':'5vh'}} />
				</div>
			)
		}

		return (
			<div className="Account">
				<NavigationBar currentpage="Account" />
				<div className="AccountBalances">
				{this.renderAccountBalance()}
				{this.renderTradeBalance()}
				</div>
			</div>
		)
	}

}

export default Account;

