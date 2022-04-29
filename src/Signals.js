module.exports = function (app, pool, util) {
	app.post("/api/Signals", async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return;

		let pairId = request.body.pairId;
		if(!pairId) {
			response.json({"Result":"Invalid Request"});
			return;
		}

		getSignalsPromise = () => {
                return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM signals WHERE pairId=?)', [pairId,],
                    (error, elements) => {
                        if(error) return reject(error);
                        return resolve(elements);
                    });
                });
        }

		response.json(await getSignalsPromise());
	});
}
