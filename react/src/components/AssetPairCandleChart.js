import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import ls from 'local-storage';
//import {CanvasJSChart, CanvasJS} from 'canvasjs-react-charts'
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import CanvasJSReactStock from '../assets/canvasjs.stock.react';
var CanvasJSStock = CanvasJSReactStock.CanvasJS;
var CanvasJSStockChart = CanvasJSReactStock.CanvasJSStockChart;

//import Chart from 'react-apexcharts';

import NavigationBar from './NavigationBar';

import './css/AssetPairCandleChart.css';

const chartRangeSelector = {
	selectedRangeButtonIndex: 6,
    buttons: [
    {
    	label: "1 Hour",
    	range: 1,
    	rangeType: "hour"
    },{
    	label: "3 Hours",
    	range: 3,
    	rangeType: "hour"
    },{
    	label: "12 Hours",
    	range: 12,
    	rangeType: "hour"
    },{
    	label: "1 Day",
    	range: 1,
    	rangeType: "day"
    },{
    	label: "1 Week",
    	range: 1,
    	rangeType: "week"
    },{
    	label: "1 Month",
    	range: 1,
    	rangeType: "month"
    },{
    	label: "All",
    	range: 1,
    	rangeType: "all"
    }]
};


function makeOptions(title, ohlc_data, volume_data, signals) {

return {
    theme: "light2",
    title: { text:title },
    charts: [{
        axisY: {
            includeZero:false,
            title:"Prices",
            tickLength: 0
        },
        axisX: {
            lineThickness: 5,
            tickLength: 0,
            labelFormatter: function(e) {
                return "";
            },
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
                labelFormatter: function(e) {
                    return "";
                }
            }
        },
        data:[ {
            name: "Price",
            type: 'candlestick',
            dataPoints: ohlc_data
        }]
    },{
        height:100,
        axisX: {
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title:"Volume",
            tickLength:0
        },
        data: [{
            dataPoints: volume_data
        }],

    },{ 
		height:100,
		axisX: {
			labelFormatter: function(e) { return ""; },
			crosshair: {
				enabled:true,
				snapToDataPoint: true,
			}
		},
		axisY: {
			title:"Indicators",
			tickLength:0
		},
		data: [{
			type: 'scatter',
			markerType: 'triangle',
			markerColor: 'green',
			toolTipContent: '<span>{metric}</span>',
			dataPoints: signals.buy 
		},{
			type: 'scatter',
			markerType: 'triangle',
			markerColor:'red',
			toolTipContent: '<span>{metric}</span>',
			dataPoints: signals.sell
		}]
	}],
    rangeSelector:  {
		
    	selectedRangeButtonIndex: 6,
    	buttons: [
    	{
       		label: "1 Hour",
       		range: 1,
       		rangeType: "hour"
    	},{
       		label: "3 Hours",
       		range: 3,
       		rangeType: "hour"
    	},{
       		label: "12 Hours",
     		range: 12,
      		rangeType: "hour"
    	},{
       		label: "1 Day",
       		range: 1,
       		rangeType: "day"
    	},{
       		label: "1 Week",
       		range: 1,
       		rangeType: "week"
    	},{
       		label: "1 Month",
       		range: 1,
       		rangeType: "month"
    	},{
       		label: "All",
       		range: 1,
     		rangeType: "all"
    	}]
	}
	
	}
}


//This requires a prop "assetpair" when the component is used
class AssetPairCandleChart extends Component {

	constructor(props) {
		super(props);

		this.getPairOHLCData = this.getPairOHLCData.bind(this);

		this.state = {
			loading:"initial",
			data: [],
			options: makeOptions(this.props.title, [], [], []) ,
			ohlc: [],
			volume: [],
			signals: []
		};
	}


	getPairSignalData() {
		let data = new URLSearchParams();
		data.append("pairId", this.props.pairid);

		return fetch(window.origin + "/api/Signals", {
			method:"POST",
			headers: {
				'Accept':"application/json"
			},
			body:data
		}).then(res => res.json())
		.then(json => {
			let buy = [];
			let sell = [];
			let signals = {};
			let entries = Object.entries(json).map((el) => el[1]);
			for( let i in entries) {
				if(entries[i].type == "B") {
					buy.push( { x: new Date(entries[i].timestamp), y: .7, metric:entries[i].metric } );
				} else {
					sell.push( { x: new Date(entries[i].timestamp), y: .3, metric:entries[i].metric } );
				}
			}
			signals['buy'] = buy;
			signals['sell'] = sell;
			console.log(signals);
			this.setState({signals:signals});
		});
	}

	getPairOHLCData() {
		let data = new URLSearchParams();
		data.append("pairId", this.props.pairid);

		let ohlcData = ls.get(this.props.pairid+"ChartData");
		let volumeData = ls.get(this.props.pairid+"VolumeData");
		if(ohlcData && volumeData) {
			ohlcData = ohlcData.map((el) => { return { x: new Date(el.x), y:el.y } } )
			volumeData = volumeData.map((el) => { return { x: new Date(el.x), y:el.y } } )
			/*
			this.setState({
                    options : makeOptions(this.props.title, ohlcData, volumeData)
			});
			*/
			this.setState({ ohlc: ohlcData });
			this.setState({ volume: volumeData });
			this.setState({ loading:"updating" });
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
				let signals = {buy:[], sell:[]};
				let s = [];
				let volume = [];
				let entries = Object.entries(json).map((el) => el[1])
				for(let i in entries) {
					s.push({
						x: new Date(entries[i].timestamp),
						y: [entries[i].open, entries[i].high, entries[i].low, entries[i].close]
					})
					volume.push({
						x: new Date(entries[i].timestamp),
						y: entries[i].volume
					});
				}
				/*
				this.setState({
					options : makeOptions(this.props.title, s, volume, signals) 
				});
				*/
				this.setState({ ohlc:s });
				this.setState({ volume:volume });
				this.setState({ loading:"done" });
				
				ls.remove(this.props.pairid+"ChartData");
				ls.set(this.props.pairid+"ChartData", s);
				ls.remove(this.props.pairid+"VolumeData");
				ls.set(this.props.pairid+"VolumeData", volume);
			});
	}


	componentDidMount() {
		this.getPairOHLCData();
		this.getPairSignalData();
	}	

	componentDidUpdate(prevProps, prevState) {
		if(prevState.ohlc != this.state.ohlc 
			|| prevState.volume != this.state.volume
			|| prevState.signals!= this.state.signals) {
			this.setState({options: makeOptions(this.props.title, this.state.ohlc, this.state.volume, this.state.signals)} );
		}
	}

	render() {
		if(this.state.loading == "initial") {
			return (
				<div>
					<h3>Waiting for data...</h3><Loader style={{'width':'3vw', 'height':'auto'}} />
				</div>
			);
		}

		return (
			<div>
				{this.state.loading == "updating"? <div style={{ 'display':'block' }} ><h4 style={{ 'display':'inline' }} >Updating chart data...</h4><Loader style={{ 'display':'inline', 'width':'1vw', 'height':'auto'}} /></div> : null }
				<CanvasJSStockChart options={this.state.options} />
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
