var EventEmitter = require("events").EventEmitter
var CAS = require('./xcas');
var util = require("util");

function CAS_Auth(options) {
	this.options = options;
	this.on("request", this.onRequest.bind(this));
	EventEmitter.call(this);
};

util.inherits(CAS_Auth, EventEmitter);

CAS_Auth.prototype.onRequest = function (req, res) {
	var _p = this;
	//console.log(this.options);
	var o = {
		base_url: this.options.login.ssoBaseURL,
		version: 2.0
	};
	// If we are in production
	if (process.env.task) {
		// NGINX don't relay hostname 
		if (req.headers['x-forwarded-server']) var host = req.headers['x-forwarded-server'];
		host = req.protocol + "://" + host + "/auth/cas";
	};

	var cas = new CAS(o);
	cas.authenticate(req, res, function (err, status, username, extended) {
		var profile = {
			service: "cas",
			username: username
		};
		if (err) {
			_p.emit("error", req, res, err);
		} else {
			_p.emit("auth", req, res, profile)
		}
	}, host);
};

module.exports = CAS_Auth;