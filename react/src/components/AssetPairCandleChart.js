import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import Chart from 'react-apexcharts';

import NavigationBar from './NavigationBar';

import './css/AssetPairCandleChart.css';

//This requires a prop "assetpair" when the component is used
class AssetPairCandleChart extends Component {

	constructor(props) {
		super(props);

		this.getPairOHLCData = this.getPairOHLCData.bind(this);

		this.state = {
			series: [{
				data:[ ]
			}],
			options: {
				chart: {
					type:'candlestick',
					animations: {
						enabled:false
					}
				},
				title: {
					text: this.props.title,
					align: 'left'
				},
				xaxis: {
					type: 'datetime'
				},
				yaxis: {
					tooltip: {
						enabled:true
					}
				},
				dataLabels: {
					enabled:false
				},
				markers: {
					size:0
				}
			}
		};
	}

	getPairOHLCData() {
		let data = new URLSearchParams();
		data.append("pairId", this.props.pairid);

		return fetch(window.origin + "/api/OHLC", {
			method: 'POST',
			headers: {
				'Accept':'application/json'
			},
			body:data
			})
			.then(res => res.json())
			.then(json => {
				let s = [];
				let entries = Object.entries(json).map((el) => el[1])
				for(let i in entries) {
					s.push({
						x: new Date(entries[i].timestamp),
						y: [entries[i].open, entries[i].high, entries[i].low, entries[i].close]
					})
				}
				this.setState({
					series: [{
						data:s
					}]
				});
			});
	}


	componentDidMount() {
		this.getPairOHLCData();
	}	

	componentDidUpdate() {
	}

	render() {
		return (
			<div>
				<Chart options={this.state.options} series={this.state.series} type="candlestick" />
			</div>
		);
	}

}

export default AssetPairCandleChart;
