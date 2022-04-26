import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import ls from 'local-storage';
import {CanvasJSChart} from 'canvasjs-react-charts'

import Chart from 'react-apexcharts';

import NavigationBar from './NavigationBar';

import './css/AssetPairCandleChart.css';

//This requires a prop "assetpair" when the component is used
class AssetPairCandleChart extends Component {

	constructor(props) {
		super(props);

		this.getPairOHLCData = this.getPairOHLCData.bind(this);

		this.state = {
			loading:true,
			data: [],
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
		if(ls.get(this.props.pairid+"ChartData")) {
			this.setState({
                    options : {
                        title: { text:this.props.title },
                        axisY: {
                            includeZero:false,
                            title:"Prices"
                        },
                        axisX: {
                            interval:1,
                            valueFormatString:"MMM-DD"
                        },
                        data:[ {
                            type: 'ohlc',
                            color:'brown',
                            dataPoints: ls.get(this.props.pairid+"ChartData")
                        }]
                    }
                });

			this.setState({
				series: [{
					data: ls.get(this.props.pairid+"ChartData")	
				}]
			});
			this.setState({ loading:false });
		}

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
				this.setState({
					options : {
						title: { text:this.props.title },
						axisY: {
							includeZero:false,
							title:"Prices"
						},	
						axisX: {
							interval:1,
							valueFormatString:"MMM-DD"
						},
						data:[ {
							type: 'ohlc',
							color:'brown',
							dataPoints: s
						}]
					}
				});
				this.setState({ loading:false });
				ls.set(this.props.pairid+"ChartData", s);
			});
	}


	componentDidMount() {
		this.getPairOHLCData();
	}	

	componentDidUpdate() {
	}

	render() {
		if(this.state.loading) {
			return (
				<div>
					<h3>Waiting for data...</h3><Loader style={{'width':'3vw', 'height':'auto'}} />
				</div>
			);
		}

		return (
			<div>
				<CanvasJSChart options={this.state.options} />
				{false? <Chart options={this.state.options} series={this.state.series} type="candlestick" /> : null }
			</div>
		);
	}

}

const Loader = (props) => (
  <svg
    className="svg-loader"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    xmlSpace="preserve"
    {...props}
  >
    <path
      fill="#D43B11"
      d="M10 40v-3.2c0-.3.1-.6.1-.9.1-.6.1-1.4.2-2.1.2-.8.3-1.6.5-2.5.2-.9.6-1.8.8-2.8.3-1 .8-1.9 1.2-3 .5-1 1.1-2 1.7-3.1.7-1 1.4-2.1 2.2-3.1 1.6-2.1 3.7-3.9 6-5.6 2.3-1.7 5-3 7.9-4.1.7-.2 1.5-.4 2.2-.7.7-.3 1.5-.3 2.3-.5.8-.2 1.5-.3 2.3-.4l1.2-.1.6-.1h.6c1.5 0 2.9-.1 4.5.2.8.1 1.6.1 2.4.3.8.2 1.5.3 2.3.5 3 .8 5.9 2 8.5 3.6 2.6 1.6 4.9 3.4 6.8 5.4 1 1 1.8 2.1 2.7 3.1.8 1.1 1.5 2.1 2.1 3.2.6 1.1 1.2 2.1 1.6 3.1.4 1 .9 2 1.2 3 .3 1 .6 1.9.8 2.7.2.9.3 1.6.5 2.4.1.4.1.7.2 1 0 .3.1.6.1.9.1.6.1 1 .1 1.4.4 1 .4 1.4.4 1.4.2 2.2-1.5 4.1-3.7 4.3s-4.1-1.5-4.3-3.7V37.2c0-.2-.1-.5-.1-.8-.1-.6-.1-1.2-.2-1.9s-.3-1.4-.4-2.2c-.2-.8-.5-1.6-.7-2.4-.3-.8-.7-1.7-1.1-2.6-.5-.9-.9-1.8-1.5-2.7-.6-.9-1.2-1.8-1.9-2.7-1.4-1.8-3.2-3.4-5.2-4.9-2-1.5-4.4-2.7-6.9-3.6-.6-.2-1.3-.4-1.9-.6-.7-.2-1.3-.3-1.9-.4-1.2-.3-2.8-.4-4.2-.5h-2c-.7 0-1.4.1-2.1.1-.7.1-1.4.1-2 .3-.7.1-1.3.3-2 .4-2.6.7-5.2 1.7-7.5 3.1-2.2 1.4-4.3 2.9-6 4.7-.9.8-1.6 1.8-2.4 2.7-.7.9-1.3 1.9-1.9 2.8-.5 1-1 1.9-1.4 2.8-.4.9-.8 1.8-1 2.6-.3.9-.5 1.6-.7 2.4-.2.7-.3 1.4-.4 2.1-.1.3-.1.6-.2.9 0 .3-.1.6-.1.8 0 .5-.1.9-.1 1.3-.2.7-.2 1.1-.2 1.1z"
    >
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 40 40"
        to="360 40 40"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
) 


export default AssetPairCandleChart;
