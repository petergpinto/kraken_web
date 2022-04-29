module.exports = function (app, pool, util) {

	app.get("/api/TradablePairs", async function(request, response) {
		if(!util.checkLogin(response, request.session))
            return

		if(request.query.pairs) {
			getTradablePairsPromise = () => {
				return new Promise((resolve, reject) => {	
                pool.query('SELECT * FROM tradable_pairs WHERE pair in (?)', [request.query.pairs.split(',')],
                    (error, elements) => {
                        if(error) return reject(error);
						return resolve(elements);
                    });
                });
	        }
		} else {
			getTradablePairsPromise = () => {
                return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM tradable_pairs',
                    (error, elements) => {
                        if(error) return reject(error);
						return resolve(elements);
                    });
                });
            }
		}

		response.json(await getTradablePairsPromise());

	});

	app.get("/api/Assets", async function(request, response) {
		if(!request.session.loggedin) {
            response.json({"Result":"Error, please login"})
            return
        }

		if(request.query.assets) {
            getAssetsPromise = () => {
                return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM assets WHERE asset in (?)', [request.query.assets.split(',')],
                    (error, elements) => {
                        if(error) return reject(error);
                        return resolve(elements);
                    });
                });
            }
        } else {
            getAssetsPromise = () => {
                return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM assets',
                    (error, elements) => {
                        if(error) return reject(error);
                        return resolve(elements);
                    });
                });
            }
        }

		response.json(await getAssetsPromise());

	})
}

