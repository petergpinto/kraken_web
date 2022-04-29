
const key          = process.env.KRAKEN_KEY;
const secret 	   = process.env.KRAKEN_SECRET;
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(key, secret);


module.exports = function (app, pool, util) {


	app.get("/api/AccountBalance", async function(request, response) {
		if(!util.checkLogin(response, request.session)) 
            return
		
		let AcountBalance;
		let apiRequestSuccessful=false;
		let retryCount = 0;
		while(!apiRequestSuccessful) {
			try {
				AccountBalance = await kraken.api("Balance");
				apiRequestSuccessful=true;
			} catch (error) {
				retryCount += 1;
			}
		}
		response.json({'balances':AccountBalance.result, 'retries':retryCount});
	});

	app.get("/api/TradeBalance", async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return

		let TradeBalance;
		let apiRequestSuccessful=false;
		let retryCount = 0;
        while(!apiRequestSuccessful) {
            try {
				TradeBalance = await kraken.api("TradeBalance");
				apiRequestSuccessful=true;
			} catch (error) {
				retryCount += 1;
			}
		}
		response.json({'tradebalances':TradeBalance.result, 'retries':retryCount});
	});

	app.get("/api/OpenOrders", async function(request, response) {
        if(!util.checkLogin(response, request.session))
            return
		let OpenOrders = await kraken.api("OpenOrders");
		response.json({'openorders':OpenOrders.result});
	});

	app.post("/api/OrderInfo", async function(request, response) {
        if(!util.checkLogin(response, request.session))
            return
		
		let txid = request.body.txid;
		if(!txid) {
			response.json({'Result':"Invalid Request"})
			return;
		}

		let OrderInfo = await kraken.api("QueryOrders", { 'txid':txid });
		response.json({'orderinfo':OrderInfo.result});

	});

	app.post("/api/TradeHistory", async function(request, response) {
        if(!util.checkLogin(response, request.session))
            return

		//TODO: Add options for getting specific time periods of trade history, 
		//		for now	the 50 most recent results are returned
		let TradeHistory = await kraken.api("TradeHistory");
		response.json({"tradehistory":TradeHistory.result});
	});
}
