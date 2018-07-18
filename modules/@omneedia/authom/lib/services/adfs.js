var EventEmitter = require("events").EventEmitter
var util = require("util");

function ADFS(options) {

	this.on("request", function (req, res) {
		var _p = this;

		var adfs = {
			authenticate: function (req, res, callback) {
				var host = req.get('host');
				// If we are in production
				if (process.env.task) {
					// NGINX don't relay hostname 
					if (req.headers['x-forwarded-server']) host = req.headers['x-forwarded-server'];
				};
				if (!req.query.code) return res.redirect(options.login.authorizationURL + "?client_id=" + options.login.clientID + "&response_type=code&redirect_uri=" + req.protocol + "://" + host + "/auth/adfs&resource=" + req.protocol + "://" + host);
				var request = require('request');
				request({
					uri: options.login.tokenURL,
					method: "POST",
					form: {
						grant_type: "authorization_code",
						client_id: options.login.clientID,
						redirect_uri: req.protocol + "://" + host + "/auth/adfs",
						code: req.query.code
					},
					tls: {
						rejectUnauthorized: false
					}
				}, function (e, r, b) {
					var token;
					if (e) return callback(true, false, e);

					function get(key) {
						var x = token.search(key);
						var value = token.substr(x, token.length).split('",')[0];
						return value.substr(key.length + 3, value.length);
					};
					try {
						var b = JSON.parse(b);
						token = Buffer.from(b.access_token, 'base64').toString('utf-8');

						var profile = {
							service: "letmein",
							username: get('email'),
							userid: get('username'),
							org: get('organization')
						};

						callback(null, true, profile, null)

					} catch (e) {
						callback(true, false, e);
					}
				});
			}
		};
		adfs.authenticate(req, res, function (err, status, profile, extended) {
			if (err) {
				_p.emit("error", req, res, err);
			} else {
				_p.emit("auth", req, res, profile)
			}
		});

	});
	EventEmitter.call(this);
};

util.inherits(ADFS, EventEmitter);

module.exports = ADFS;