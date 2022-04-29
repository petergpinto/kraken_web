module.exports = function (app, pool, util) {
	app.post("/api/SimpleMovingAverage", async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return
	
		let pairId = request.body.pairId; 
		let period = request.body.period; //int value ex. 30, 200
		let field = request.body.field;  //open, high, low, or close

		if(!pairId || !period) {
			response.json({"Result":"Invalid Request"});
			return;
		}

		//Calculate values on demand using python script.
		//Pandas needs to be optimized for speed

		getOHLCPromise = () => {
            return new Promise ((resolve, reject) => {
                pool.query("SELECT * FROM ohlc_data where pairId=?", [pairId],
                    (error, elements) => {
                        if(error) return reject(error);
                        return resolve(elements);
                    });
                });
        }

		let elements = await getOHLCPromise();
		console.log(elements);

	});
}
