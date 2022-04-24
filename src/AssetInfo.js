module.export = function (app, pool, util) {
	app.get("/TEST", function (request, response) {
		response.end("TEST")
	})
}

