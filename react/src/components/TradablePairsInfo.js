import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import AssetPairCandleChart from './AssetPairCandleChart';

import './css/TradablePairsInfo.css';

class TradablePairsInfo extends Component {
	constructor(props) {
		super(props)
		
		this.getAllTradablePairs = this.getAllTradablePairs.bind(this);
		this.renderTradablePairs = this.renderTradablePairs.bind(this);
		this.getPairsKeys = this.getPairsKeys.bind(this);
		this.updateKeywordFilter = this.updateKeywordFilter.bind(this);
		this.updateBaseFilter = this.updateBaseFilter.bind(this);
		this.updateDoTradingFilter = this.updateDoTradingFilter.bind(this);
		this.setTradingStatus = this.setTradingStatus.bind(this);
		this.renderBaseFilterSelectOptions = this.renderBaseFilterSelectOptions.bind(this);
		this.renderFilteringOptions = this.renderFilteringOptions.bind(this);
		this.setCandleChartVisible = this.setCandleChartVisible.bind(this);
		this.hideAllCandleCharts = this.hideAllCandleCharts.bind(this)

		this.state = { pairs:[],
			keywordFilter:"",
			baseFilter:"",
			doTradingFilter:1,
			pairChecked: {},
			bases:[],
			showCandleChart: []
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
			let bases = Object.entries(json).map((element) => { return element[1].base});
			let uniqueBases = bases.filter((v, i, a) => a.indexOf(v) === i);
			this.setState({bases:uniqueBases});
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
			}).then(res => {
				return res.json()
			})
			.then(json => {
				if(json.Result == "Success") {
					this.setState((prevState) => {
                    	return {
                        	...prevState,
                        	pairChecked: {
                            	...prevState.pairChecked,
                            	[event.target.getAttribute("pair")] : event.target.checked
                        	}
                    	}
                	})
				}
			})
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
				return <th>Pair: <input type="text" onChange={this.updateKeywordFilter} /></th>
			if(key == 'base')
				return <th>Base: <select onChange={this.updateBaseFilter}>
                        	<option value="">All</option>
                        	{this.renderBaseFilterSelectOptions()}
                    	</select>
					</th>
			if(key == 'altname')
				return <th>Alt Name</th>
			if(key == 'doTrading')
				return <th>Do Trading? <select onChange={this.updateDoTradingFilter}>
								<option value={1}>Yes</option>
                        		<option value={-1}>All</option>
                        		<option value={0}>No</option>
                    		</select>
						</th>
			if(key == 'orderMin')
				return <th>Minimum Order</th>
			if(key == 'id')
				return null
			return <th>{key}</th>		
		})
	}

	hideAllCandleCharts() {
		let hide = this.state.showCandleChart;
		for (let i in hide) {
			hide[i] = false;
		}
		this.setState({ showCandleChart:hide });
	}

	updateKeywordFilter(event) {
        this.setState({ keywordFilter: event.target.value })
		this.hideAllCandleCharts();
    }

	updateBaseFilter(event) {
		this.setState({ baseFilter: event.target.value });
		this.hideAllCandleCharts();
	}

	updateDoTradingFilter(event) {
		this.setState({ doTradingFilter: event.target.value });
		this.hideAllCandleCharts();
	}

	renderTradablePairsRow() {
		let items = this.state.pairs;

		let keywordFilter = this.state.keywordFilter;
		items = items.filter( function(el) {
			if(el.pair) {
				return el.pair.toLowerCase().includes(keywordFilter.toLowerCase());
			} else 
				return true;
		});

		let baseFilter = this.state.baseFilter;
		items = items.filter( function(el) {
			if(el.base) {
				return el.base.toLowerCase().includes(baseFilter.toLowerCase());
			} else {
				return true;
			}
		});

		let doTradingFilter = this.state.doTradingFilter;
		let pairChecked = this.state.pairChecked;
		items = items.filter( function(el) {
			if(doTradingFilter == -1)
				return true;
			if(pairChecked[el.pair] != doTradingFilter)
				return true;
			return false;
		});


		return items.map((row, index) => {
			if(this.state.pairChecked[row.pair] == null) {
				this.setState((prevState) => {
					return {
						...prevState,
						pairChecked: {
							...prevState.pairChecked,
							[row.pair] : !prevState.pairChecked[row.pair]
						}
					}
				})
				this.state.pairChecked[row.pair] = row.doTrading;
			}
			if(this.state.showCandleChart[row.pair] == null) {
				this.setState((prevState) => {
					return {
						...prevState,
						showCandleChart: {
							...prevState.showCandleChart,
							[row.pair] : false
						}
					}
				})
			}

			let html = []
			html.push(<tr>
				<td><a onClick={this.setCandleChartVisible} value={row.pair}>{row.pair}</a></td>
				<td>{row.orderMin}</td>
				<td>{row.base}</td>
				<td>{row.altname}</td>
				<td><input type="checkbox" pair={row.pair} checked={this.state.pairChecked[row.pair]? false:true} onChange={this.setTradingStatus}/></td>
			</tr> 
			);
			if(this.state.showCandleChart[row.pair]) {
				html.push(<td colSpan={5}><AssetPairCandleChart pairid={row.id} /></td>);
			}	
			return html;
		})
	}

	setCandleChartVisible(event) {
		event.preventDefault();
		this.setState((prevState) => {
			return {
				...prevState,
				showCandleChart: {
					...prevState.showCandleChart,
					[event.target.getAttribute("value")] : !prevState.showCandleChart[event.target.getAttribute("value")]
				}
			}
		});
	}

	renderCandleChart() {

	}

	renderBaseFilterSelectOptions() {
		let items = this.state.bases;
		return items.map((base) => {
			return <option value={base}>{base}</option>;
		})
	}

	renderFilteringOptions() {
		let html = []
		html.push(
			<tr>
				<td><input type="text" onChange={this.updateKeywordFilter} /></td>
				<td></td>
				<td>
					<select onChange={this.updateBaseFilter}>
						<option value="">All</option>
						{this.renderBaseFilterSelectOptions()}
					</select>
				</td>
				<td></td>
				<td>
					<select onChange={this.updateDoTradingFilter}>
						<option value={-1}>All</option>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</td>
			</tr>
		);

		return html;
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
				{this.renderTradablePairs()}
			</div>
		</div>
		);
	}
}



export default TradablePairsInfo;
