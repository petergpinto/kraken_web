
function helperFun() {

}

function checkLogin(response, session) {
	if(session.loggedin) {
		return true;
	} else {
		response.json({"Result":"Error, please login"})
		return false;
	}
}

module.exports = {

	helperFun:helperFun,
	checkLogin:checkLogin
}
