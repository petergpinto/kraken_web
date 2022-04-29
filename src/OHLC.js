module.exports = function (app, pool, util) {
	app.post('/api/OHLC', async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return

		let pairId = request.body.pairId;

		getOHLCPromise = () => {
			return new Promise ((resolve, reject) => {
                pool.query("SELECT * FROM ohlc_data where pairId=?", [pairId],
                    (error, elements) => {
                        if(error) return reject(error);
                        return resolve(elements);
                    });
                });
        }

		response.json(await getOHLCPromise());

	});
}
