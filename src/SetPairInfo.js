module.exports = function (app, pool, util) {
	app.post("/api/SetTradingStatus", async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return

		let pair = request.body.pair;
		let pairStatus = request.body.pairStatus;

		if(!pair || !pairStatus) {
			response.json({"Result":"Invalid Request"});
		}

		updateStatusPromise = () => {
			return new Promise ((resolve, reject) => {
				pool.query("UPDATE tradable_pairs SET doTrading=? WHERE pair=?", [pairStatus, pair],
					(error, elements) => {
						if(error) return resolve(false);
						return resolve(true);
					});
				});
		}

		let result = await updateStatusPromise();

		if(result)
			response.json({"Result":"Success"});
		else
			response.json({"Result":"Failure"});
	})
}
