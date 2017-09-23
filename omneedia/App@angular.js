/**
 * Version: 1.1.0
 * Build Date: 13-Nov-2015
 * Copyright (c) 2006-2015, Omneedia. (http://www.omneedia.com/). All rights reserved.
 * License: ***.
 * Website: http://www.omneedia.com/
 *
 * CHANGELOG
 * ---------
 * 1.0.0	Initial commit
 * 1.1.0	Change iOS webapp settings for native app
 * 
 */

App={};
App.DB={};

// Change Settings REMOTE_API
if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.host;

// Spinner

! function (a, b) {
	"object" == typeof exports ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.Spinner = b()
}(this, function () {
	"use strict";

	function a(a, b) {
		var c, d = document.createElement(a || "div");
		for (c in b) d[c] = b[c];
		return d
	}

	function b(a) {
		for (var b = 1, c = arguments.length; c > b; b++) a.appendChild(arguments[b]);
		return a
	}

	function c(a, b, c, d) {
		var e = ["opacity", b, ~~(100 * a), c, d].join("-")
			, f = .01 + c / d * 100
			, g = Math.max(1 - (1 - a) / b * (100 - f), a)
			, h = j.substring(0, j.indexOf("Animation")).toLowerCase()
			, i = h && "-" + h + "-" || "";
		return l[e] || (m.insertRule("@" + i + "keyframes " + e + "{0%{opacity:" + g + "}" + f + "%{opacity:" + a + "}" + (f + .01) + "%{opacity:1}" + (f + b) % 100 + "%{opacity:" + a + "}100%{opacity:" + g + "}}", m.cssRules.length), l[e] = 1), e
	}

	function d(a, b) {
		var c, d, e = a.style;
		for (b = b.charAt(0).toUpperCase() + b.slice(1), d = 0; d < k.length; d++)
			if (c = k[d] + b, void 0 !== e[c]) return c;
		return void 0 !== e[b] ? b : void 0
	}

	function e(a, b) {
		for (var c in b) a.style[d(a, c) || c] = b[c];
		return a
	}

	function f(a) {
		for (var b = 1; b < arguments.length; b++) {
			var c = arguments[b];
			for (var d in c) void 0 === a[d] && (a[d] = c[d])
		}
		return a
	}

	function g(a, b) {
		return "string" == typeof a ? a : a[b % a.length]
	}

	function h(a) {
		this.opts = f(a || {}, h.defaults, n)
	}

	function i() {
		function c(b, c) {
			return a("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c)
		}
		m.addRule(".spin-vml", "behavior:url(#default#VML)"), h.prototype.lines = function (a, d) {
			function f() {
				return e(c("group", {
					coordsize: k + " " + k
					, coordorigin: -j + " " + -j
				}), {
					width: k
					, height: k
				})
			}

			function h(a, h, i) {
				b(m, b(e(f(), {
					rotation: 360 / d.lines * a + "deg"
					, left: ~~h
				}), b(e(c("roundrect", {
					arcsize: d.corners
				}), {
					width: j
					, height: d.width
					, left: d.radius
					, top: -d.width >> 1
					, filter: i
				}), c("fill", {
					color: g(d.color, a)
					, opacity: d.opacity
				}), c("stroke", {
					opacity: 0
				}))))
			}
			var i, j = d.length + d.width
				, k = 2 * j
				, l = 2 * -(d.width + d.length) + "px"
				, m = e(f(), {
					position: "absolute"
					, top: l
					, left: l
				});
			if (d.shadow)
				for (i = 1; i <= d.lines; i++) h(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
			for (i = 1; i <= d.lines; i++) h(i);
			return b(a, m)
		}, h.prototype.opacity = function (a, b, c, d) {
			var e = a.firstChild;
			d = d.shadow && d.lines || 0, e && b + d < e.childNodes.length && (e = e.childNodes[b + d], e = e && e.firstChild, e = e && e.firstChild, e && (e.opacity = c))
		}
	}
	var j, k = ["webkit", "Moz", "ms", "O"]
		, l = {}
		, m = function () {
			var c = a("style", {
				type: "text/css"
			});
			return b(document.getElementsByTagName("head")[0], c), c.sheet || c.styleSheet
		}()
		, n = {
			lines: 12
			, length: 7
			, width: 5
			, radius: 10
			, rotate: 0
			, corners: 1
			, color: "#000"
			, direction: 1
			, speed: 1
			, trail: 100
			, opacity: .25
			, fps: 20
			, zIndex: 2e9
			, className: "spinner"
			, top: "50%"
			, left: "50%"
			, position: "absolute"
		};
	h.defaults = {}, f(h.prototype, {
		spin: function (b) {
			this.stop(); {
				var c = this
					, d = c.opts
					, f = c.el = e(a(0, {
						className: d.className
					}), {
						position: d.position
						, width: 0
						, zIndex: d.zIndex
					});
				d.radius + d.length + d.width
			}
			if (e(f, {
					left: d.left
					, top: d.top
				}), b && b.insertBefore(f, b.firstChild || null), f.setAttribute("role", "progressbar"), c.lines(f, c.opts), !j) {
				var g, h = 0
					, i = (d.lines - 1) * (1 - d.direction) / 2
					, k = d.fps
					, l = k / d.speed
					, m = (1 - d.opacity) / (l * d.trail / 100)
					, n = l / d.lines;
				! function o() {
					h++;
					for (var a = 0; a < d.lines; a++) g = Math.max(1 - (h + (d.lines - a) * n) % l * m, d.opacity), c.opacity(f, a * d.direction + i, g, d);
					c.timeout = c.el && setTimeout(o, ~~(1e3 / k))
				}()
			}
			return c
		}
		, stop: function () {
			var a = this.el;
			return a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), this.el = void 0), this
		}
		, lines: function (d, f) {
			function h(b, c) {
				return e(a(), {
					position: "absolute"
					, width: f.length + f.width + "px"
					, height: f.width + "px"
					, background: b
					, boxShadow: c
					, transformOrigin: "left"
					, transform: "rotate(" + ~~(360 / f.lines * k + f.rotate) + "deg) translate(" + f.radius + "px,0)"
					, borderRadius: (f.corners * f.width >> 1) + "px"
				})
			}
			for (var i, k = 0, l = (f.lines - 1) * (1 - f.direction) / 2; k < f.lines; k++) i = e(a(), {
				position: "absolute"
				, top: 1 + ~(f.width / 2) + "px"
				, transform: f.hwaccel ? "translate3d(0,0,0)" : ""
				, opacity: f.opacity
				, animation: j && c(f.opacity, f.trail, l + k * f.direction, f.lines) + " " + 1 / f.speed + "s linear infinite"
			}), f.shadow && b(i, e(h("#000", "0 0 4px #000"), {
				top: "2px"
			})), b(d, b(i, h(g(f.color, k), "0 0 1px rgba(0,0,0,.1)")));
			return d
		}
		, opacity: function (a, b, c) {
			b < a.childNodes.length && (a.childNodes[b].style.opacity = c)
		}
	});
	var o = e(a("group"), {
		behavior: "url(#default#VML)"
	});
	return !d(o, "transform") && o.adj ? i() : j = d(o, "animation"), h
});

////////////

if (!Settings.REMOTE_API) Settings.REMOTE_API = document.location.origin;

var Latinise = {};
Latinise.latin_map = {
	"Á": "A"
	, "Ă": "A"
	, "Ắ": "A"
	, "Ặ": "A"
	, "Ằ": "A"
	, "Ẳ": "A"
	, "Ẵ": "A"
	, "Ǎ": "A"
	, "Â": "A"
	, "Ấ": "A"
	, "Ậ": "A"
	, "Ầ": "A"
	, "Ẩ": "A"
	, "Ẫ": "A"
	, "Ä": "A"
	, "Ǟ": "A"
	, "Ȧ": "A"
	, "Ǡ": "A"
	, "Ạ": "A"
	, "Ȁ": "A"
	, "À": "A"
	, "Ả": "A"
	, "Ȃ": "A"
	, "Ā": "A"
	, "Ą": "A"
	, "Å": "A"
	, "Ǻ": "A"
	, "Ḁ": "A"
	, "Ⱥ": "A"
	, "Ã": "A"
	, "Ꜳ": "AA"
	, "Æ": "AE"
	, "Ǽ": "AE"
	, "Ǣ": "AE"
	, "Ꜵ": "AO"
	, "Ꜷ": "AU"
	, "Ꜹ": "AV"
	, "Ꜻ": "AV"
	, "Ꜽ": "AY"
	, "Ḃ": "B"
	, "Ḅ": "B"
	, "Ɓ": "B"
	, "Ḇ": "B"
	, "Ƀ": "B"
	, "Ƃ": "B"
	, "Ć": "C"
	, "Č": "C"
	, "Ç": "C"
	, "Ḉ": "C"
	, "Ĉ": "C"
	, "Ċ": "C"
	, "Ƈ": "C"
	, "Ȼ": "C"
	, "Ď": "D"
	, "Ḑ": "D"
	, "Ḓ": "D"
	, "Ḋ": "D"
	, "Ḍ": "D"
	, "Ɗ": "D"
	, "Ḏ": "D"
	, "ǲ": "D"
	, "ǅ": "D"
	, "Đ": "D"
	, "Ƌ": "D"
	, "Ǳ": "DZ"
	, "Ǆ": "DZ"
	, "É": "E"
	, "Ĕ": "E"
	, "Ě": "E"
	, "Ȩ": "E"
	, "Ḝ": "E"
	, "Ê": "E"
	, "Ế": "E"
	, "Ệ": "E"
	, "Ề": "E"
	, "Ể": "E"
	, "Ễ": "E"
	, "Ḙ": "E"
	, "Ë": "E"
	, "Ė": "E"
	, "Ẹ": "E"
	, "Ȅ": "E"
	, "È": "E"
	, "Ẻ": "E"
	, "Ȇ": "E"
	, "Ē": "E"
	, "Ḗ": "E"
	, "Ḕ": "E"
	, "Ę": "E"
	, "Ɇ": "E"
	, "Ẽ": "E"
	, "Ḛ": "E"
	, "Ꝫ": "ET"
	, "Ḟ": "F"
	, "Ƒ": "F"
	, "Ǵ": "G"
	, "Ğ": "G"
	, "Ǧ": "G"
	, "Ģ": "G"
	, "Ĝ": "G"
	, "Ġ": "G"
	, "Ɠ": "G"
	, "Ḡ": "G"
	, "Ǥ": "G"
	, "Ḫ": "H"
	, "Ȟ": "H"
	, "Ḩ": "H"
	, "Ĥ": "H"
	, "Ⱨ": "H"
	, "Ḧ": "H"
	, "Ḣ": "H"
	, "Ḥ": "H"
	, "Ħ": "H"
	, "Í": "I"
	, "Ĭ": "I"
	, "Ǐ": "I"
	, "Î": "I"
	, "Ï": "I"
	, "Ḯ": "I"
	, "İ": "I"
	, "Ị": "I"
	, "Ȉ": "I"
	, "Ì": "I"
	, "Ỉ": "I"
	, "Ȋ": "I"
	, "Ī": "I"
	, "Į": "I"
	, "Ɨ": "I"
	, "Ĩ": "I"
	, "Ḭ": "I"
	, "Ꝺ": "D"
	, "Ꝼ": "F"
	, "Ᵹ": "G"
	, "Ꞃ": "R"
	, "Ꞅ": "S"
	, "Ꞇ": "T"
	, "Ꝭ": "IS"
	, "Ĵ": "J"
	, "Ɉ": "J"
	, "Ḱ": "K"
	, "Ǩ": "K"
	, "Ķ": "K"
	, "Ⱪ": "K"
	, "Ꝃ": "K"
	, "Ḳ": "K"
	, "Ƙ": "K"
	, "Ḵ": "K"
	, "Ꝁ": "K"
	, "Ꝅ": "K"
	, "Ĺ": "L"
	, "Ƚ": "L"
	, "Ľ": "L"
	, "Ļ": "L"
	, "Ḽ": "L"
	, "Ḷ": "L"
	, "Ḹ": "L"
	, "Ⱡ": "L"
	, "Ꝉ": "L"
	, "Ḻ": "L"
	, "Ŀ": "L"
	, "Ɫ": "L"
	, "ǈ": "L"
	, "Ł": "L"
	, "Ǉ": "LJ"
	, "Ḿ": "M"
	, "Ṁ": "M"
	, "Ṃ": "M"
	, "Ɱ": "M"
	, "Ń": "N"
	, "Ň": "N"
	, "Ņ": "N"
	, "Ṋ": "N"
	, "Ṅ": "N"
	, "Ṇ": "N"
	, "Ǹ": "N"
	, "Ɲ": "N"
	, "Ṉ": "N"
	, "Ƞ": "N"
	, "ǋ": "N"
	, "Ñ": "N"
	, "Ǌ": "NJ"
	, "Ó": "O"
	, "Ŏ": "O"
	, "Ǒ": "O"
	, "Ô": "O"
	, "Ố": "O"
	, "Ộ": "O"
	, "Ồ": "O"
	, "Ổ": "O"
	, "Ỗ": "O"
	, "Ö": "O"
	, "Ȫ": "O"
	, "Ȯ": "O"
	, "Ȱ": "O"
	, "Ọ": "O"
	, "Ő": "O"
	, "Ȍ": "O"
	, "Ò": "O"
	, "Ỏ": "O"
	, "Ơ": "O"
	, "Ớ": "O"
	, "Ợ": "O"
	, "Ờ": "O"
	, "Ở": "O"
	, "Ỡ": "O"
	, "Ȏ": "O"
	, "Ꝋ": "O"
	, "Ꝍ": "O"
	, "Ō": "O"
	, "Ṓ": "O"
	, "Ṑ": "O"
	, "Ɵ": "O"
	, "Ǫ": "O"
	, "Ǭ": "O"
	, "Ø": "O"
	, "Ǿ": "O"
	, "Õ": "O"
	, "Ṍ": "O"
	, "Ṏ": "O"
	, "Ȭ": "O"
	, "Ƣ": "OI"
	, "Ꝏ": "OO"
	, "Ɛ": "E"
	, "Ɔ": "O"
	, "Ȣ": "OU"
	, "Ṕ": "P"
	, "Ṗ": "P"
	, "Ꝓ": "P"
	, "Ƥ": "P"
	, "Ꝕ": "P"
	, "Ᵽ": "P"
	, "Ꝑ": "P"
	, "Ꝙ": "Q"
	, "Ꝗ": "Q"
	, "Ŕ": "R"
	, "Ř": "R"
	, "Ŗ": "R"
	, "Ṙ": "R"
	, "Ṛ": "R"
	, "Ṝ": "R"
	, "Ȑ": "R"
	, "Ȓ": "R"
	, "Ṟ": "R"
	, "Ɍ": "R"
	, "Ɽ": "R"
	, "Ꜿ": "C"
	, "Ǝ": "E"
	, "Ś": "S"
	, "Ṥ": "S"
	, "Š": "S"
	, "Ṧ": "S"
	, "Ş": "S"
	, "Ŝ": "S"
	, "Ș": "S"
	, "Ṡ": "S"
	, "Ṣ": "S"
	, "Ṩ": "S"
	, "Ť": "T"
	, "Ţ": "T"
	, "Ṱ": "T"
	, "Ț": "T"
	, "Ⱦ": "T"
	, "Ṫ": "T"
	, "Ṭ": "T"
	, "Ƭ": "T"
	, "Ṯ": "T"
	, "Ʈ": "T"
	, "Ŧ": "T"
	, "Ɐ": "A"
	, "Ꞁ": "L"
	, "Ɯ": "M"
	, "Ʌ": "V"
	, "Ꜩ": "TZ"
	, "Ú": "U"
	, "Ŭ": "U"
	, "Ǔ": "U"
	, "Û": "U"
	, "Ṷ": "U"
	, "Ü": "U"
	, "Ǘ": "U"
	, "Ǚ": "U"
	, "Ǜ": "U"
	, "Ǖ": "U"
	, "Ṳ": "U"
	, "Ụ": "U"
	, "Ű": "U"
	, "Ȕ": "U"
	, "Ù": "U"
	, "Ủ": "U"
	, "Ư": "U"
	, "Ứ": "U"
	, "Ự": "U"
	, "Ừ": "U"
	, "Ử": "U"
	, "Ữ": "U"
	, "Ȗ": "U"
	, "Ū": "U"
	, "Ṻ": "U"
	, "Ų": "U"
	, "Ů": "U"
	, "Ũ": "U"
	, "Ṹ": "U"
	, "Ṵ": "U"
	, "Ꝟ": "V"
	, "Ṿ": "V"
	, "Ʋ": "V"
	, "Ṽ": "V"
	, "Ꝡ": "VY"
	, "Ẃ": "W"
	, "Ŵ": "W"
	, "Ẅ": "W"
	, "Ẇ": "W"
	, "Ẉ": "W"
	, "Ẁ": "W"
	, "Ⱳ": "W"
	, "Ẍ": "X"
	, "Ẋ": "X"
	, "Ý": "Y"
	, "Ŷ": "Y"
	, "Ÿ": "Y"
	, "Ẏ": "Y"
	, "Ỵ": "Y"
	, "Ỳ": "Y"
	, "Ƴ": "Y"
	, "Ỷ": "Y"
	, "Ỿ": "Y"
	, "Ȳ": "Y"
	, "Ɏ": "Y"
	, "Ỹ": "Y"
	, "Ź": "Z"
	, "Ž": "Z"
	, "Ẑ": "Z"
	, "Ⱬ": "Z"
	, "Ż": "Z"
	, "Ẓ": "Z"
	, "Ȥ": "Z"
	, "Ẕ": "Z"
	, "Ƶ": "Z"
	, "Ĳ": "IJ"
	, "Œ": "OE"
	, "ᴀ": "A"
	, "ᴁ": "AE"
	, "ʙ": "B"
	, "ᴃ": "B"
	, "ᴄ": "C"
	, "ᴅ": "D"
	, "ᴇ": "E"
	, "ꜰ": "F"
	, "ɢ": "G"
	, "ʛ": "G"
	, "ʜ": "H"
	, "ɪ": "I"
	, "ʁ": "R"
	, "ᴊ": "J"
	, "ᴋ": "K"
	, "ʟ": "L"
	, "ᴌ": "L"
	, "ᴍ": "M"
	, "ɴ": "N"
	, "ᴏ": "O"
	, "ɶ": "OE"
	, "ᴐ": "O"
	, "ᴕ": "OU"
	, "ᴘ": "P"
	, "ʀ": "R"
	, "ᴎ": "N"
	, "ᴙ": "R"
	, "ꜱ": "S"
	, "ᴛ": "T"
	, "ⱻ": "E"
	, "ᴚ": "R"
	, "ᴜ": "U"
	, "ᴠ": "V"
	, "ᴡ": "W"
	, "ʏ": "Y"
	, "ᴢ": "Z"
	, "á": "a"
	, "ă": "a"
	, "ắ": "a"
	, "ặ": "a"
	, "ằ": "a"
	, "ẳ": "a"
	, "ẵ": "a"
	, "ǎ": "a"
	, "â": "a"
	, "ấ": "a"
	, "ậ": "a"
	, "ầ": "a"
	, "ẩ": "a"
	, "ẫ": "a"
	, "ä": "a"
	, "ǟ": "a"
	, "ȧ": "a"
	, "ǡ": "a"
	, "ạ": "a"
	, "ȁ": "a"
	, "à": "a"
	, "ả": "a"
	, "ȃ": "a"
	, "ā": "a"
	, "ą": "a"
	, "ᶏ": "a"
	, "ẚ": "a"
	, "å": "a"
	, "ǻ": "a"
	, "ḁ": "a"
	, "ⱥ": "a"
	, "ã": "a"
	, "ꜳ": "aa"
	, "æ": "ae"
	, "ǽ": "ae"
	, "ǣ": "ae"
	, "ꜵ": "ao"
	, "ꜷ": "au"
	, "ꜹ": "av"
	, "ꜻ": "av"
	, "ꜽ": "ay"
	, "ḃ": "b"
	, "ḅ": "b"
	, "ɓ": "b"
	, "ḇ": "b"
	, "ᵬ": "b"
	, "ᶀ": "b"
	, "ƀ": "b"
	, "ƃ": "b"
	, "ɵ": "o"
	, "ć": "c"
	, "č": "c"
	, "ç": "c"
	, "ḉ": "c"
	, "ĉ": "c"
	, "ɕ": "c"
	, "ċ": "c"
	, "ƈ": "c"
	, "ȼ": "c"
	, "ď": "d"
	, "ḑ": "d"
	, "ḓ": "d"
	, "ȡ": "d"
	, "ḋ": "d"
	, "ḍ": "d"
	, "ɗ": "d"
	, "ᶑ": "d"
	, "ḏ": "d"
	, "ᵭ": "d"
	, "ᶁ": "d"
	, "đ": "d"
	, "ɖ": "d"
	, "ƌ": "d"
	, "ı": "i"
	, "ȷ": "j"
	, "ɟ": "j"
	, "ʄ": "j"
	, "ǳ": "dz"
	, "ǆ": "dz"
	, "é": "e"
	, "ĕ": "e"
	, "ě": "e"
	, "ȩ": "e"
	, "ḝ": "e"
	, "ê": "e"
	, "ế": "e"
	, "ệ": "e"
	, "ề": "e"
	, "ể": "e"
	, "ễ": "e"
	, "ḙ": "e"
	, "ë": "e"
	, "ė": "e"
	, "ẹ": "e"
	, "ȅ": "e"
	, "è": "e"
	, "ẻ": "e"
	, "ȇ": "e"
	, "ē": "e"
	, "ḗ": "e"
	, "ḕ": "e"
	, "ⱸ": "e"
	, "ę": "e"
	, "ᶒ": "e"
	, "ɇ": "e"
	, "ẽ": "e"
	, "ḛ": "e"
	, "ꝫ": "et"
	, "ḟ": "f"
	, "ƒ": "f"
	, "ᵮ": "f"
	, "ᶂ": "f"
	, "ǵ": "g"
	, "ğ": "g"
	, "ǧ": "g"
	, "ģ": "g"
	, "ĝ": "g"
	, "ġ": "g"
	, "ɠ": "g"
	, "ḡ": "g"
	, "ᶃ": "g"
	, "ǥ": "g"
	, "ḫ": "h"
	, "ȟ": "h"
	, "ḩ": "h"
	, "ĥ": "h"
	, "ⱨ": "h"
	, "ḧ": "h"
	, "ḣ": "h"
	, "ḥ": "h"
	, "ɦ": "h"
	, "ẖ": "h"
	, "ħ": "h"
	, "ƕ": "hv"
	, "í": "i"
	, "ĭ": "i"
	, "ǐ": "i"
	, "î": "i"
	, "ï": "i"
	, "ḯ": "i"
	, "ị": "i"
	, "ȉ": "i"
	, "ì": "i"
	, "ỉ": "i"
	, "ȋ": "i"
	, "ī": "i"
	, "į": "i"
	, "ᶖ": "i"
	, "ɨ": "i"
	, "ĩ": "i"
	, "ḭ": "i"
	, "ꝺ": "d"
	, "ꝼ": "f"
	, "ᵹ": "g"
	, "ꞃ": "r"
	, "ꞅ": "s"
	, "ꞇ": "t"
	, "ꝭ": "is"
	, "ǰ": "j"
	, "ĵ": "j"
	, "ʝ": "j"
	, "ɉ": "j"
	, "ḱ": "k"
	, "ǩ": "k"
	, "ķ": "k"
	, "ⱪ": "k"
	, "ꝃ": "k"
	, "ḳ": "k"
	, "ƙ": "k"
	, "ḵ": "k"
	, "ᶄ": "k"
	, "ꝁ": "k"
	, "ꝅ": "k"
	, "ĺ": "l"
	, "ƚ": "l"
	, "ɬ": "l"
	, "ľ": "l"
	, "ļ": "l"
	, "ḽ": "l"
	, "ȴ": "l"
	, "ḷ": "l"
	, "ḹ": "l"
	, "ⱡ": "l"
	, "ꝉ": "l"
	, "ḻ": "l"
	, "ŀ": "l"
	, "ɫ": "l"
	, "ᶅ": "l"
	, "ɭ": "l"
	, "ł": "l"
	, "ǉ": "lj"
	, "ſ": "s"
	, "ẜ": "s"
	, "ẛ": "s"
	, "ẝ": "s"
	, "ḿ": "m"
	, "ṁ": "m"
	, "ṃ": "m"
	, "ɱ": "m"
	, "ᵯ": "m"
	, "ᶆ": "m"
	, "ń": "n"
	, "ň": "n"
	, "ņ": "n"
	, "ṋ": "n"
	, "ȵ": "n"
	, "ṅ": "n"
	, "ṇ": "n"
	, "ǹ": "n"
	, "ɲ": "n"
	, "ṉ": "n"
	, "ƞ": "n"
	, "ᵰ": "n"
	, "ᶇ": "n"
	, "ɳ": "n"
	, "ñ": "n"
	, "ǌ": "nj"
	, "ó": "o"
	, "ŏ": "o"
	, "ǒ": "o"
	, "ô": "o"
	, "ố": "o"
	, "ộ": "o"
	, "ồ": "o"
	, "ổ": "o"
	, "ỗ": "o"
	, "ö": "o"
	, "ȫ": "o"
	, "ȯ": "o"
	, "ȱ": "o"
	, "ọ": "o"
	, "ő": "o"
	, "ȍ": "o"
	, "ò": "o"
	, "ỏ": "o"
	, "ơ": "o"
	, "ớ": "o"
	, "ợ": "o"
	, "ờ": "o"
	, "ở": "o"
	, "ỡ": "o"
	, "ȏ": "o"
	, "ꝋ": "o"
	, "ꝍ": "o"
	, "ⱺ": "o"
	, "ō": "o"
	, "ṓ": "o"
	, "ṑ": "o"
	, "ǫ": "o"
	, "ǭ": "o"
	, "ø": "o"
	, "ǿ": "o"
	, "õ": "o"
	, "ṍ": "o"
	, "ṏ": "o"
	, "ȭ": "o"
	, "ƣ": "oi"
	, "ꝏ": "oo"
	, "ɛ": "e"
	, "ᶓ": "e"
	, "ɔ": "o"
	, "ᶗ": "o"
	, "ȣ": "ou"
	, "ṕ": "p"
	, "ṗ": "p"
	, "ꝓ": "p"
	, "ƥ": "p"
	, "ᵱ": "p"
	, "ᶈ": "p"
	, "ꝕ": "p"
	, "ᵽ": "p"
	, "ꝑ": "p"
	, "ꝙ": "q"
	, "ʠ": "q"
	, "ɋ": "q"
	, "ꝗ": "q"
	, "ŕ": "r"
	, "ř": "r"
	, "ŗ": "r"
	, "ṙ": "r"
	, "ṛ": "r"
	, "ṝ": "r"
	, "ȑ": "r"
	, "ɾ": "r"
	, "ᵳ": "r"
	, "ȓ": "r"
	, "ṟ": "r"
	, "ɼ": "r"
	, "ᵲ": "r"
	, "ᶉ": "r"
	, "ɍ": "r"
	, "ɽ": "r"
	, "ↄ": "c"
	, "ꜿ": "c"
	, "ɘ": "e"
	, "ɿ": "r"
	, "ś": "s"
	, "ṥ": "s"
	, "š": "s"
	, "ṧ": "s"
	, "ş": "s"
	, "ŝ": "s"
	, "ș": "s"
	, "ṡ": "s"
	, "ṣ": "s"
	, "ṩ": "s"
	, "ʂ": "s"
	, "ᵴ": "s"
	, "ᶊ": "s"
	, "ȿ": "s"
	, "ɡ": "g"
	, "ᴑ": "o"
	, "ᴓ": "o"
	, "ᴝ": "u"
	, "ť": "t"
	, "ţ": "t"
	, "ṱ": "t"
	, "ț": "t"
	, "ȶ": "t"
	, "ẗ": "t"
	, "ⱦ": "t"
	, "ṫ": "t"
	, "ṭ": "t"
	, "ƭ": "t"
	, "ṯ": "t"
	, "ᵵ": "t"
	, "ƫ": "t"
	, "ʈ": "t"
	, "ŧ": "t"
	, "ᵺ": "th"
	, "ɐ": "a"
	, "ᴂ": "ae"
	, "ǝ": "e"
	, "ᵷ": "g"
	, "ɥ": "h"
	, "ʮ": "h"
	, "ʯ": "h"
	, "ᴉ": "i"
	, "ʞ": "k"
	, "ꞁ": "l"
	, "ɯ": "m"
	, "ɰ": "m"
	, "ᴔ": "oe"
	, "ɹ": "r"
	, "ɻ": "r"
	, "ɺ": "r"
	, "ⱹ": "r"
	, "ʇ": "t"
	, "ʌ": "v"
	, "ʍ": "w"
	, "ʎ": "y"
	, "ꜩ": "tz"
	, "ú": "u"
	, "ŭ": "u"
	, "ǔ": "u"
	, "û": "u"
	, "ṷ": "u"
	, "ü": "u"
	, "ǘ": "u"
	, "ǚ": "u"
	, "ǜ": "u"
	, "ǖ": "u"
	, "ṳ": "u"
	, "ụ": "u"
	, "ű": "u"
	, "ȕ": "u"
	, "ù": "u"
	, "ủ": "u"
	, "ư": "u"
	, "ứ": "u"
	, "ự": "u"
	, "ừ": "u"
	, "ử": "u"
	, "ữ": "u"
	, "ȗ": "u"
	, "ū": "u"
	, "ṻ": "u"
	, "ų": "u"
	, "ᶙ": "u"
	, "ů": "u"
	, "ũ": "u"
	, "ṹ": "u"
	, "ṵ": "u"
	, "ᵫ": "ue"
	, "ꝸ": "um"
	, "ⱴ": "v"
	, "ꝟ": "v"
	, "ṿ": "v"
	, "ʋ": "v"
	, "ᶌ": "v"
	, "ⱱ": "v"
	, "ṽ": "v"
	, "ꝡ": "vy"
	, "ẃ": "w"
	, "ŵ": "w"
	, "ẅ": "w"
	, "ẇ": "w"
	, "ẉ": "w"
	, "ẁ": "w"
	, "ⱳ": "w"
	, "ẘ": "w"
	, "ẍ": "x"
	, "ẋ": "x"
	, "ᶍ": "x"
	, "ý": "y"
	, "ŷ": "y"
	, "ÿ": "y"
	, "ẏ": "y"
	, "ỵ": "y"
	, "ỳ": "y"
	, "ƴ": "y"
	, "ỷ": "y"
	, "ỿ": "y"
	, "ȳ": "y"
	, "ẙ": "y"
	, "ɏ": "y"
	, "ỹ": "y"
	, "ź": "z"
	, "ž": "z"
	, "ẑ": "z"
	, "ʑ": "z"
	, "ⱬ": "z"
	, "ż": "z"
	, "ẓ": "z"
	, "ȥ": "z"
	, "ẕ": "z"
	, "ᵶ": "z"
	, "ᶎ": "z"
	, "ʐ": "z"
	, "ƶ": "z"
	, "ɀ": "z"
	, "ﬀ": "ff"
	, "ﬃ": "ffi"
	, "ﬄ": "ffl"
	, "ﬁ": "fi"
	, "ﬂ": "fl"
	, "ĳ": "ij"
	, "œ": "oe"
	, "ﬆ": "st"
	, "ₐ": "a"
	, "ₑ": "e"
	, "ᵢ": "i"
	, "ⱼ": "j"
	, "ₒ": "o"
	, "ᵣ": "r"
	, "ᵤ": "u"
	, "ᵥ": "v"
	, "ₓ": "x"
};
String.prototype.latinise = function () {
	return this.replace(/[^A-Za-z0-9\[\] ]/g, function (a) {
		return Latinise.latin_map[a] || a
	})
};
String.prototype.latinize = String.prototype.latinise;
String.prototype.isLatin = function () {
	return this == this.latinise()
}
String.prototype.toDate = function () {
	try {
		var mydate = this.split('T')[0];
		var mytime = this.split('T')[1].split('Z')[0];
		var y = mydate.split('-')[0] * 1;
		var M = mydate.split('-')[1] * 1 - 1;
		var d = mydate.split('-')[2] * 1;
		var h = mytime.split(':')[0] * 1;
		var m = mytime.split(':')[1] * 1;
		var s = mytime.split(':')[2] * 1;
		var x = new Date(y, M, d, h, m, s);
		x.setHours(x.getHours() - x.getTimezoneOffset() / 60);
		return x;
	} catch (e) {
		return new Date(0, 0, 0, 0, 0, 0);
	}
};

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};



Math.uuid = function () {
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var chars = CHARS
		, uuid = new Array(36)
		, rnd = 0
		, r;
	for (var i = 0; i < 36; i++) {
		if (i == 8 || i == 13 || i == 18 || i == 23) {
			uuid[i] = '-';
		} else if (i == 14) {
			uuid[i] = '4';
		} else {
			if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
			r = rnd & 0xf;
			rnd = rnd >> 4;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		}
	}
	return uuid.join('');
};

if (Settings.DEBUG) {
	var io_start=function(io) {
		document.socket = io.connect(Settings.REMOTE_API);
		document.socket.on('connect', function () {
			var sessionid = document.socket.io.engine.id;

			try {
				App.unblur();
			} catch (e) {};
			//$('.omneedia-overlay').hide();
		});
		document.socket.on('disconnect', function () {
			try {
				App.blur();
			} catch (e) {};
		});
		document.socket.on('log', function (data) {
			console.log('%c ' + 'LOG: SERVER', 'color: #00F; font-size:12px', data);
		});
		document.socket.on('info', function (data) {
			console.info('%c' + 'INFO: SERVER \n', 'color: green; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('warn', function (data) {
			console.warn('%c' + 'WARN: SERVER \n', 'color: orange; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('debug', function (data) {
			console.debug('%c' + 'DEBUG: SERVER \n', 'color: black; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('error', function (data) {
			console.error('%c' + 'ERROR: SERVER \n', 'color: red; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
		});
		document.socket.on('session', function (data) {
			var data = JSON.parse(data);
			if (!localStorage.getItem("session")) localStorage.setItem('session', data.pid);
			else {
				if (localStorage.getItem("session") != data.pid) {
					localStorage.setItem('session', data.pid);
					try {
						App.blur();
					} catch (e) {};
					location.reload();
				}
			};
		});
		App.IO = {
				subscribe: function (uri) {
					uri = uri.split(' ');
					for (var i = 0; i < uri.length; i++) {
						if (uri[i].indexOf("#") > -1) document.socket.emit('#create', uri[i]);
					}
				}
				, on: function (uri, cb) {
					document.socket.on(uri, cb);
				}
				, send: function (uri, data, users) {
					var o = {
						uri: uri
						, data: data
						, users: users
					};
					if (uri.indexOf("#") > -1) document.socket.emit('#send', JSON.stringify(o));
				}
		};	
	};
	try {
		if (Require) {
			Require.config({
				shim: {
    				"socketio": {
      					exports: 'io'
					}
    			},
				paths: {
					"socketio": 'http://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io'
				}
			});
			Require(['socketio'], function(io){
				io_start(io);
			});	
		}	
	}catch(e){
		require.config({
			shim: {
				"socketio": {
					exports: 'io'
				}
			},
			paths: {
				socketio: 'http://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io'
			}
		});
		require(['socketio'], function(io){
			io_start(io);
		});
	};
};

var iosOverlay = function (params) {


	var overlayDOM;
	var noop = function () {};
	var defaults = {
		onbeforeshow: noop
		, onshow: noop
		, onbeforehide: noop
		, onhide: noop
		, text: ""
		, icon: null
		, spinner: null
		, duration: null
		, id: null
		, parentEl: null
	};

	// helper - merge two objects together, without using $.extend
	var merge = function (obj1, obj2) {
		var obj3 = {};
		for (var attrOne in obj1) {
			obj3[attrOne] = obj1[attrOne];
		}
		for (var attrTwo in obj2) {
			obj3[attrTwo] = obj2[attrTwo];
		}
		return obj3;
	};

	// helper - does it support CSS3 transitions/animation
	var doesTransitions = (function () {
		var b = document.body || document.documentElement;
		var s = b.style;
		var p = 'transition';
		if (typeof s[p] === 'string') {
			return true;
		}

		// Tests for vendor specific prop
		var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
		p = p.charAt(0).toUpperCase() + p.substr(1);
		for (var i = 0; i < v.length; i++) {
			if (typeof s[v[i] + p] === 'string') {
				return true;
			}
		}
		return false;
	}());

	// setup overlay settings
	var settings = merge(defaults, params);

	//
	var handleAnim = function (anim) {
		if (anim.animationName === "ios-overlay-show") {
			settings.onshow();
		}
		if (anim.animationName === "ios-overlay-hide") {
			destroy();
			settings.onhide();
		}
	};

	// IIFE
	var create = (function () {

		// initial DOM creation and event binding
		overlayDOM = document.createElement("div");
		overlayDOM.className = "ui-ios-overlay";
		overlayDOM.innerHTML += '<span class="title">' + settings.text + '</span';
		if (params.icon) {
			overlayDOM.innerHTML += '<div class="' + params.icon + '">';
		} else if (params.spinner) {
			overlayDOM.appendChild(params.spinner.el);
		}
		if (doesTransitions) {
			overlayDOM.addEventListener("webkitAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("msAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("oAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("animationend", handleAnim, false);
		}
		if (params.parentEl) {
			document.getElementById(params.parentEl).appendChild(overlayDOM);
		} else {
			document.body.appendChild(overlayDOM);
		}

		settings.onbeforeshow();
		// begin fade in
		if (doesTransitions) {
			overlayDOM.className += " ios-overlay-show";
		} else if (typeof $ === "function") {
			$(overlayDOM).fadeIn({
				duration: 200
			}, function () {
				settings.onshow();
			});
		}

		if (settings.duration) {
			window.setTimeout(function () {
				hide();
			}, settings.duration);
		}

	}());

	var hide = function () {
		// pre-callback
		settings.onbeforehide();
		// fade out
		if (doesTransitions) {
			// CSS animation bound to classes
			overlayDOM.className = overlayDOM.className.replace("show", "hide");
		} else if (typeof $ === "function") {
			// polyfill requires jQuery
			$(overlayDOM).fadeOut({
				duration: 200
			}, function () {
				destroy();
				settings.onhide();
			});
		}
	};

	var destroy = function () {
		if (params.parentEl) {
			document.getElementById(params.parentEl).removeChild(overlayDOM);
		} else {
			document.body.removeChild(overlayDOM);
		}
	};

	var update = function (params) {
		if (params.text) {
			overlayDOM.getElementsByTagName("span")[0].innerHTML = params.text;
		}
		if (params.icon) {
			if (settings.spinner) {
				// Unless we set spinner to null, this will throw on the second update
				settings.spinner.el.parentNode.removeChild(settings.spinner.el);
				settings.spinner = null;
			}
			overlayDOM.innerHTML += '<div class="' + params.icon + '">';
		}
	};

	return {
		hide: hide
		, destroy: destroy
		, update: update
	};

};

/*

Persistent storage

*/

Persist = (function () {
	var VERSION = '0.3.1'
		, P, B, esc, init, empty, ec;
	ec = (function () {
		var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT'
			, RATIO = 1000 * 60 * 60 * 24
			, KEYS = ['expires', 'path', 'domain']
			, esc = escape
			, un = unescape
			, doc = document
			, me;
		var get_now = function () {
			var r = new Date();
			r.setTime(r.getTime());
			return r;
		};
		var cookify = function (c_key, c_val) {
			var i, key, val, r = []
				, opt = (arguments.length > 2) ? arguments[2] : {};
			r.push(esc(c_key) + '=' + esc(c_val));
			for (var idx = 0; idx < KEYS.length; idx++) {
				key = KEYS[idx];
				val = opt[key];
				if (val) {
					r.push(key + '=' + val);
				}
			}
			if (opt.secure) {
				r.push('secure');
			}
			return r.join('; ');
		};
		var alive = function () {
			var k = '__EC_TEST__'
				, v = new Date();
			v = v.toGMTString();
			this.set(k, v);
			this.enabled = (this.remove(k) == v);
			return this.enabled;
		};
		me = {
			set: function (key, val) {
				var opt = (arguments.length > 2) ? arguments[2] : {}
					, now = get_now()
					, expire_at, cfg = {};
				if (opt.expires) {
					if (opt.expires == -1) {
						cfg.expires = -1
					} else {
						var expires = opt.expires * RATIO;
						cfg.expires = new Date(now.getTime() + expires);
						cfg.expires = cfg.expires.toGMTString();
					}
				}
				var keys = ['path', 'domain', 'secure'];
				for (var i = 0; i < keys.length; i++) {
					if (opt[keys[i]]) {
						cfg[keys[i]] = opt[keys[i]];
					}
				}
				var r = cookify(key, val, cfg);
				doc.cookie = r;
				return val;
			}
			, has: function (key) {
				key = esc(key);
				var c = doc.cookie
					, ofs = c.indexOf(key + '=')
					, len = ofs + key.length + 1
					, sub = c.substring(0, key.length);
				return ((!ofs && key != sub) || ofs < 0) ? false : true;
			}
			, get: function (key) {
				key = esc(key);
				var c = doc.cookie
					, ofs = c.indexOf(key + '=')
					, len = ofs + key.length + 1
					, sub = c.substring(0, key.length)
					, end;
				if ((!ofs && key != sub) || ofs < 0) {
					return null;
				}
				end = c.indexOf(';', len);
				if (end < 0) {
					end = c.length;
				}
				return un(c.substring(len, end));
			}
			, remove: function (k) {
				var r = me.get(k)
					, opt = {
						expires: EPOCH
					};
				doc.cookie = cookify(k, '', opt);
				return r;
			}
			, keys: function () {
				var c = doc.cookie
					, ps = c.split('; ')
					, i, p, r = [];
				for (var idx = 0; idx < ps.length; idx++) {
					p = ps[idx].split('=');
					r.push(un(p[0]));
				}
				return r;
			}
			, all: function () {
				var c = doc.cookie
					, ps = c.split('; ')
					, i, p, r = [];
				for (var idx = 0; idx < ps.length; idx++) {
					p = ps[idx].split('=');
					r.push([un(p[0]), un(p[1])]);
				}
				return r;
			}
			, version: '0.2.1'
			, enabled: false
		};
		me.enabled = alive.call(me);
		return me;
	}());
	var index_of = (function () {
		if (Array.prototype.indexOf) {
			return function (ary, val) {
				return Array.prototype.indexOf.call(ary, val);
			};
		} else {
			return function (ary, val) {
				var i, l;
				for (var idx = 0, len = ary.length; idx < len; idx++) {
					if (ary[idx] == val) {
						return idx;
					}
				}
				return -1;
			};
		}
	})();
	empty = function () {};
	esc = function (str) {
		return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
	};
	var C = {
		search_order: ['localstorage', 'globalstorage', 'gears', 'cookie', 'ie', 'flash']
		, name_re: /^[a-z][a-z0-9_ \-]+$/i
		, methods: ['init', 'get', 'set', 'remove', 'load', 'save', 'iterate']
		, sql: {
			version: '1'
			, create: "CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)"
			, get: "SELECT v FROM persist_data WHERE k = ?"
			, set: "INSERT INTO persist_data(k, v) VALUES (?, ?)"
			, remove: "DELETE FROM persist_data WHERE k = ?"
			, keys: "SELECT * FROM persist_data"
		}
		, flash: {
			div_id: '_persist_flash_wrap'
			, id: '_persist_flash'
			, path: 'persist.swf'
			, size: {
				w: 1
				, h: 1
			}
			, params: {
				autostart: true
			}
		}
	};
	B = {
		gears: {
			size: -1
			, test: function () {
				return (window.google && window.google.gears) ? true : false;
			}
			, methods: {
				init: function () {
					var db;
					db = this.db = google.gears.factory.create('beta.database');
					db.open(esc(this.name));
					db.execute(C.sql.create).close();
				}
				, get: function (key) {
					var r, sql = C.sql.get;
					var db = this.db;
					var ret;
					db.execute('BEGIN').close();
					r = db.execute(sql, [key]);
					ret = r.isValidRow() ? r.field(0) : null;
					r.close();
					db.execute('COMMIT').close();
					return ret;
				}
				, set: function (key, val) {
					var rm_sql = C.sql.remove
						, sql = C.sql.set
						, r;
					var db = this.db;
					var ret;
					db.execute('BEGIN').close();
					db.execute(rm_sql, [key]).close();
					db.execute(sql, [key, val]).close();
					db.execute('COMMIT').close();
					return val;
				}
				, remove: function (key) {
					var get_sql = C.sql.get
						, sql = C.sql.remove
						, r, val = null
						, is_valid = false;
					var db = this.db;
					db.execute('BEGIN').close();
					db.execute(sql, [key]).close();
					db.execute('COMMIT').close();
					return true;
				}
				, iterate: function (fn, scope) {
					var key_sql = C.sql.keys;
					var r;
					var db = this.db;
					r = db.execute(key_sql);
					while (r.isValidRow()) {
						fn.call(scope || this, r.field(0), r.field(1));
						r.next();
					}
					r.close();
				}
			}
		}
		, globalstorage: {
			size: 5 * 1024 * 1024
			, test: function () {
				if (window.globalStorage) {
					var domain = '127.0.0.1';
					if (this.o && this.o.domain) {
						domain = this.o.domain;
					}
					try {
						var dontcare = globalStorage[domain];
						return true;
					} catch (e) {
						if (window.console && window.console.warn) {
							console.warn("globalStorage exists, but couldn't use it because your browser is running on domain:", domain);
						}
						return false;
					}
				} else {
					return false;
				}
			}
			, methods: {
				key: function (key) {
					return esc(this.name) + esc(key);
				}
				, init: function () {
					this.store = globalStorage[this.o.domain];
				}
				, get: function (key) {
					key = this.key(key);
					return this.store.getItem(key);
				}
				, set: function (key, val) {
					key = this.key(key);
					this.store.setItem(key, val);
					return val;
				}
				, remove: function (key) {
					var val;
					key = this.key(key);
					val = this.store.getItem[key];
					this.store.removeItem(key);
					return val;
				}
			}
		}
		, localstorage: {
			size: -1
			, test: function () {
				try {
					if (window.localStorage && window.localStorage.setItem("test", null) == undefined) {
						if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
							var ffVersion = RegExp.$1;
							if (ffVersion >= 9) {
								return true;
							}
							if (window.location.protocol == 'file:') {
								return false;
							}
						} else {
							return true;
						}
					} else {
						return false;
					}
					return window.localStorage ? true : false;
				} catch (e) {
					return false;
				}
			}
			, methods: {
				key: function (key) {
					return this.name + '>' + key;
				}
				, init: function () {
					this.store = localStorage;
				}
				, get: function (key) {
					key = this.key(key);
					return this.store.getItem(key);
				}
				, set: function (key, val) {
					key = this.key(key);
					this.store.setItem(key, val);
					return val;
				}
				, remove: function (key) {
					var val;
					key = this.key(key);
					val = this.store.getItem(key);
					this.store.removeItem(key);
					return val;
				}
				, iterate: function (fn, scope) {
					var l = this.store
						, key, keys;
					for (var i = 0; i < l.length; i++) {
						key = l.key(i);
						keys = key.split('>');
						if ((keys.length == 2) && (keys[0] == this.name)) {
							fn.call(scope || this, keys[1], l.getItem(key));
						}
					}
				}
			}
		}
		, ie: {
			prefix: '_persist_data-'
			, size: 64 * 1024
			, test: function () {
				return window.ActiveXObject ? true : false;
			}
			, make_userdata: function (id) {
				var el = document.createElement('div');
				el.id = id;
				el.style.display = 'none';
				el.addBehavior('#default#userdata');
				document.body.appendChild(el);
				return el;
			}
			, methods: {
				init: function () {
					var id = B.ie.prefix + esc(this.name);
					this.el = B.ie.make_userdata(id);
					if (this.o.defer) {
						this.load();
					}
				}
				, get: function (key) {
					var val;
					key = esc(key);
					if (!this.o.defer) {
						this.load();
					}
					val = this.el.getAttribute(key);
					return val;
				}
				, set: function (key, val) {
					key = esc(key);
					this.el.setAttribute(key, val);
					if (!this.o.defer) {
						this.save();
					}
					return val;
				}
				, remove: function (key) {
					var val;
					key = esc(key);
					if (!this.o.defer) {
						this.load();
					}
					val = this.el.getAttribute(key);
					this.el.removeAttribute(key);
					if (!this.o.defer) {
						this.save();
					}
					return val;
				}
				, load: function () {
					this.el.load(esc(this.name));
				}
				, save: function () {
					this.el.save(esc(this.name));
				}
			}
		}
		, cookie: {
			delim: ':'
			, size: 4000
			, test: function () {
				return P.Cookie.enabled ? true : false;
			}
			, methods: {
				key: function (key) {
					return this.name + B.cookie.delim + key;
				}
				, get: function (key, fn) {
					var val;
					key = this.key(key);
					val = ec.get(key);
					return val;
				}
				, set: function (key, val, fn) {
					key = this.key(key);
					ec.set(key, val, this.o);
					return val;
				}
				, remove: function (key, val) {
					var val;
					key = this.key(key);
					val = ec.remove(key);
					return val;
				}
			}
		}
		, flash: {
			test: function () {
				try {
					if (!swfobject) {
						return false;
					}
				} catch (e) {
					return false;
				}
				var major = swfobject.getFlashPlayerVersion().major;
				return (major >= 8) ? true : false;
			}
			, methods: {
				init: function () {
					if (!B.flash.el) {
						var key, el, fel, cfg = C.flash;
						el = document.createElement('div');
						el.id = cfg.div_id;
						fel = document.createElement('div');
						fel.id = cfg.id;
						el.appendChild(fel);
						document.body.appendChild(el);
						B.flash.el = swfobject.createSWF({
							id: cfg.id
							, data: this.o.swf_path || cfg.path
							, width: cfg.size.w
							, height: cfg.size.h
						}, cfg.params, cfg.id);
					}
					this.el = B.flash.el;
				}
				, get: function (key) {
					var val;
					key = esc(key);
					val = this.el.get(this.name, key);
					return val;
				}
				, set: function (key, val) {
					var old_val;
					key = esc(key);
					old_val = this.el.set(this.name, key, val);
					return old_val;
				}
				, remove: function (key) {
					var val;
					key = esc(key);
					val = this.el.remove(this.name, key);
					return val;
				}
			}
		}
	};
	init = function () {
		var i, l, b, key, fns = C.methods
			, keys = C.search_order;
		for (var idx = 0, len = fns.length; idx < len; idx++) {
			P.Store.prototype[fns[idx]] = empty;
		}
		P.type = null;
		P.size = -1;
		for (var idx2 = 0, len2 = keys.length; !P.type && idx2 < len2; idx2++) {
			b = B[keys[idx2]];
			if (b.test()) {
				P.type = keys[idx2];
				P.size = b.size;
				for (key in b.methods) {
					P.Store.prototype[key] = b.methods[key];
				}
			}
		}
		P._init = true;
	};
	P = {
		VERSION: VERSION
		, type: null
		, size: 0
		, add: function (o) {
			B[o.id] = o;
			C.search_order = [o.id].concat(C.search_order);
			init();
		}
		, remove: function (id) {
			var ofs = index_of(C.search_order, id);
			if (ofs < 0) {
				return;
			}
			C.search_order.splice(ofs, 1);
			delete B[id];
			init();
		}
		, Cookie: ec
		, Store: function (name, o) {
			if (!C.name_re.exec(name)) {
				throw new Error("Invalid name " + name);
			}
			if (!P.type) {
				throw new Error("No suitable storage found");
			}
			o = o || {};
			this.name = name;
			o.domain = o.domain || location.hostname || 'localhost';
			o.domain = o.domain.replace(/:\d+$/, '');
			o.domain = (o.domain == 'localhost') ? '' : o.domain;
			this.o = o;
			o.expires = o.expires || 365 * 2;
			o.path = o.path || '/';
			if (this.o.search_order) {
				C.search_order = this.o.search_order;
				init();
			}
			this.init();
		}
	};
	init();
	return P;
})();


/**
 * Version: 1.0 Alpha-1
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/.
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */

Date.prototype.getWeekNumber = function () {
	var d = new Date(+this);
	d.setHours(0, 0, 0);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
};
Date.CultureInfo = {
	name: "en-US"
	, englishName: "English (United States)"
	, nativeName: "English (United States)"
	, dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	, abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	, shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
	, firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"]
	, monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	, abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	, amDesignator: "AM"
	, pmDesignator: "PM"
	, firstDayOfWeek: 0
	, twoDigitYearMax: 2029
	, dateElementOrder: "mdy"
	, formatPatterns: {
		shortDate: "M/d/yyyy"
		, longDate: "dddd, MMMM dd, yyyy"
		, shortTime: "h:mm tt"
		, longTime: "h:mm:ss tt"
		, fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt"
		, sortableDateTime: "yyyy-MM-ddTHH:mm:ss"
		, universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ"
		, rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT"
		, monthDay: "MMMM dd"
		, yearMonth: "MMMM, yyyy"
	}
	, regexPatterns: {
		jan: /^jan(uary)?/i
		, feb: /^feb(ruary)?/i
		, mar: /^mar(ch)?/i
		, apr: /^apr(il)?/i
		, may: /^may/i
		, jun: /^jun(e)?/i
		, jul: /^jul(y)?/i
		, aug: /^aug(ust)?/i
		, sep: /^sep(t(ember)?)?/i
		, oct: /^oct(ober)?/i
		, nov: /^nov(ember)?/i
		, dec: /^dec(ember)?/i
		, sun: /^su(n(day)?)?/i
		, mon: /^mo(n(day)?)?/i
		, tue: /^tu(e(s(day)?)?)?/i
		, wed: /^we(d(nesday)?)?/i
		, thu: /^th(u(r(s(day)?)?)?)?/i
		, fri: /^fr(i(day)?)?/i
		, sat: /^sa(t(urday)?)?/i
		, future: /^next/i
		, past: /^last|past|prev(ious)?/i
		, add: /^(\+|after|from)/i
		, subtract: /^(\-|before|ago)/i
		, yesterday: /^yesterday/i
		, today: /^t(oday)?/i
		, tomorrow: /^tomorrow/i
		, now: /^n(ow)?/i
		, millisecond: /^ms|milli(second)?s?/i
		, second: /^sec(ond)?s?/i
		, minute: /^min(ute)?s?/i
		, hour: /^h(ou)?rs?/i
		, week: /^w(ee)?k/i
		, month: /^m(o(nth)?s?)?/i
		, day: /^d(ays?)?/i
		, year: /^y((ea)?rs?)?/i
		, shortMeridian: /^(a|p)/i
		, longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i
		, timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i
		, ordinalSuffix: /^\s*(st|nd|rd|th)/i
		, timeContext: /^\s*(\:|a|p)/i
	}
	, abbreviatedTimeZoneStandard: {
		GMT: "-000"
		, EST: "-0400"
		, CST: "-0500"
		, MST: "-0600"
		, PST: "-0700"
	}
	, abbreviatedTimeZoneDST: {
		GMT: "-000"
		, EDT: "-0500"
		, CDT: "-0600"
		, MDT: "-0700"
		, PDT: "-0800"
	}
};

Date.CultureInfo = {
	/* Culture Name */
	name: "fr-FR"
	, englishName: "French (France)"
	, nativeName: "français (France)",

	/* Day Name Strings */
	dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
	, abbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]
	, shortestDayNames: ["di", "lu", "ma", "me", "je", "ve", "sa"]
	, firstLetterDayNames: ["d", "l", "m", "m", "j", "v", "s"],

	/* Month Name Strings */
	monthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
	, abbreviatedMonthNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],

	/* AM/PM Designators */
	amDesignator: ""
	, pmDesignator: "",

	firstDayOfWeek: 1
	, twoDigitYearMax: 2029,

	/**
	 * The dateElementOrder is based on the order of the 
	 * format specifiers in the formatPatterns.DatePattern. 
	 *
	 * Example:
	 <pre>
	 shortDatePattern    dateElementOrder
	 ------------------  ---------------- 
	 "M/d/yyyy"          "mdy"
	 "dd/MM/yyyy"        "dmy"
	 "yyyy-MM-dd"        "ymd"
	 </pre>
	 *
	 * The correct dateElementOrder is required by the parser to
	 * determine the expected order of the date elements in the
	 * string being parsed.
	 */
	dateElementOrder: "dmy",

	/* Standard date and time format patterns */
	formatPatterns: {
		shortDate: "dd/MM/yyyy"
		, longDate: "dddd d MMMM yyyy"
		, shortTime: "HH:mm"
		, longTime: "HH:mm:ss"
		, fullDateTime: "dddd d MMMM yyyy HH:mm:ss"
		, sortableDateTime: "yyyy-MM-ddTHH:mm:ss"
		, universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ"
		, rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT"
		, monthDay: "d MMMM"
		, yearMonth: "MMMM yyyy"
	},

	/**
	 * NOTE: If a string format is not parsing correctly, but
	 * you would expect it parse, the problem likely lies below. 
	 * 
	 * The following regex patterns control most of the string matching
	 * within the parser.
	 * 
	 * The Month name and Day name patterns were automatically generated
	 * and in general should be (mostly) correct. 
	 *
	 * Beyond the month and day name patterns are natural language strings.
	 * Example: "next", "today", "months"
	 *
	 * These natural language string may NOT be correct for this culture. 
	 * If they are not correct, please translate and edit this file
	 * providing the correct regular expression pattern. 
	 *
	 * If you modify this file, please post your revised CultureInfo file
	 * to the Datejs Forum located at http://www.datejs.com/forums/.
	 *
	 * Please mark the subject of the post with [CultureInfo]. Example:
	 *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)
	 * 
	 * We will add the modified patterns to the master source files.
	 *
	 * As well, please review the list of "Future Strings" section below. 
	 */
	regexPatterns: {
		jan: /^janv(.(ier)?)?/i
		, feb: /^févr(.(ier)?)?/i
		, mar: /^mars/i
		, apr: /^avr(.(il)?)?/i
		, may: /^mai/i
		, jun: /^juin/i
		, jul: /^juil(.(let)?)?/i
		, aug: /^août/i
		, sep: /^sept(.(embre)?)?/i
		, oct: /^oct(.(obre)?)?/i
		, nov: /^nov(.(embre)?)?/i
		, dec: /^déc(.(embre)?)?/i,

		sun: /^di(m(.(anche)?)?)?/i
		, mon: /^lu(n(.(di)?)?)?/i
		, tue: /^ma(r(.(di)?)?)?/i
		, wed: /^me(r(.(credi)?)?)?/i
		, thu: /^je(u(.(di)?)?)?/i
		, fri: /^ve(n(.(dredi)?)?)?/i
		, sat: /^sa(m(.(edi)?)?)?/i,

		future: /^next/i
		, past: /^last|past|prev(ious)?/i
		, add: /^(\+|aft(er)?|from|hence)/i
		, subtract: /^(\-|bef(ore)?|ago)/i,

		yesterday: /^yes(terday)?/i
		, today: /^t(od(ay)?)?/i
		, tomorrow: /^tom(orrow)?/i
		, now: /^n(ow)?/i,

		millisecond: /^ms|milli(second)?s?/i
		, second: /^sec(ond)?s?/i
		, minute: /^mn|min(ute)?s?/i
		, hour: /^h(our)?s?/i
		, week: /^w(eek)?s?/i
		, month: /^m(onth)?s?/i
		, day: /^d(ay)?s?/i
		, year: /^y(ear)?s?/i,

		shortMeridian: /^(a|p)/i
		, longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i
		, timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i
		, ordinalSuffix: /^\s*(st|nd|rd|th)/i
		, timeContext: /^\s*(\:|a(?!u|p)|p)/i
	},

	timezones: [{
		name: "UTC"
		, offset: "-000"
    }, {
		name: "GMT"
		, offset: "-000"
    }, {
		name: "EST"
		, offset: "-0500"
    }, {
		name: "EDT"
		, offset: "-0400"
    }, {
		name: "CST"
		, offset: "-0600"
    }, {
		name: "CDT"
		, offset: "-0500"
    }, {
		name: "MST"
		, offset: "-0700"
    }, {
		name: "MDT"
		, offset: "-0600"
    }, {
		name: "PST"
		, offset: "-0800"
    }, {
		name: "PDT"
		, offset: "-0700"
    }]
};

/********************
 ** Future Strings **
 ********************
 * 
 * The following list of strings may not be currently being used, but 
 * may be incorporated into the Datejs library later. 
 *
 * We would appreciate any help translating the strings below.
 * 
 * If you modify this file, please post your revised CultureInfo file
 * to the Datejs Forum located at http://www.datejs.com/forums/.
 *
 * Please mark the subject of the post with [CultureInfo]. Example:
 *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)b
 *
 * English Name        Translated
 * ------------------  -----------------
 * about               about
 * ago                 ago
 * date                date
 * time                time
 * calendar            calendar
 * show                show
 * hourly              hourly
 * daily               daily
 * weekly              weekly
 * bi-weekly           bi-weekly
 * fortnight           fortnight
 * monthly             monthly
 * bi-monthly          bi-monthly
 * quarter             quarter
 * quarterly           quarterly
 * yearly              yearly
 * annual              annual
 * annually            annually
 * annum               annum
 * again               again
 * between             between
 * after               after
 * from now            from now
 * repeat              repeat
 * times               times
 * per                 per
 * min (abbrev minute) min
 * morning             morning
 * noon                noon
 * night               night
 * midnight            midnight
 * mid-night           mid-night
 * evening             evening
 * final               final
 * future              future
 * spring              spring
 * summer              summer
 * fall                fall
 * winter              winter
 * end of              end of
 * end                 end
 * long                long
 * short               short
 */

Date.prototype.toMySQL = function () {
	function twoDigits(d) {
		if (0 <= d && d < 10) return "0" + d.toString();
		if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
		return d.toString();
	};
	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

Date.getMonthNumberFromName = function (name) {
	var n = Date.CultureInfo.monthNames
		, m = Date.CultureInfo.abbreviatedMonthNames
		, s = name.toLowerCase();
	for (var i = 0; i < n.length; i++) {
		if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
			return i;
		}
	}
	return -1;
};
Date.getDayNumberFromName = function (name) {
	var n = Date.CultureInfo.dayNames
		, m = Date.CultureInfo.abbreviatedDayNames
		, o = Date.CultureInfo.shortestDayNames
		, s = name.toLowerCase();
	for (var i = 0; i < n.length; i++) {
		if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
			return i;
		}
	}
	return -1;
};
Date.isLeapYear = function (year) {
	return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};
Date.getDaysInMonth = function (year, month) {
	return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.getTimezoneOffset = function (s, dst) {
	return (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];
};
Date.getTimezoneAbbreviation = function (offset, dst) {
	var n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard
		, p;
	for (p in n) {
		if (n[p] === offset) {
			return p;
		}
	}
	return null;
};
Date.prototype.clone = function () {
	return new Date(this.getTime());
};
Date.prototype.compareTo = function (date) {
	if (isNaN(this)) {
		throw new Error(this);
	}
	if (date instanceof Date && !isNaN(date)) {
		return (this > date) ? 1 : (this < date) ? -1 : 0;
	} else {
		throw new TypeError(date);
	}
};
Date.prototype.equals = function (date) {
	return (this.compareTo(date) === 0);
};
Date.prototype.between = function (start, end) {
	var t = this.getTime();
	return t >= start.getTime() && t <= end.getTime();
};
Date.prototype.addMilliseconds = function (value) {
	this.setMilliseconds(this.getMilliseconds() + value);
	return this;
};
Date.prototype.addSeconds = function (value) {
	return this.addMilliseconds(value * 1000);
};
Date.prototype.addMinutes = function (value) {
	return this.addMilliseconds(value * 60000);
};
Date.prototype.addHours = function (value) {
	return this.addMilliseconds(value * 3600000);
};
Date.prototype.addDays = function (value) {
	return this.addMilliseconds(value * 86400000);
};
Date.prototype.addWeeks = function (value) {
	return this.addMilliseconds(value * 604800000);
};
Date.prototype.addMonths = function (value) {
	var n = this.getDate();
	this.setDate(1);
	this.setMonth(this.getMonth() + value);
	this.setDate(Math.min(n, this.getDaysInMonth()));
	return this;
};
Date.prototype.addYears = function (value) {
	return this.addMonths(value * 12);
};
Date.prototype.add = function (config) {
	if (typeof config == "number") {
		this._orient = config;
		return this;
	}
	var x = config;
	if (x.millisecond || x.milliseconds) {
		this.addMilliseconds(x.millisecond || x.milliseconds);
	}
	if (x.second || x.seconds) {
		this.addSeconds(x.second || x.seconds);
	}
	if (x.minute || x.minutes) {
		this.addMinutes(x.minute || x.minutes);
	}
	if (x.hour || x.hours) {
		this.addHours(x.hour || x.hours);
	}
	if (x.month || x.months) {
		this.addMonths(x.month || x.months);
	}
	if (x.year || x.years) {
		this.addYears(x.year || x.years);
	}
	if (x.day || x.days) {
		this.addDays(x.day || x.days);
	}
	return this;
};
Date._validate = function (value, min, max, name) {
	if (typeof value != "number") {
		throw new TypeError(value + " is not a Number.");
	} else if (value < min || value > max) {
		throw new RangeError(value + " is not a valid value for " + name + ".");
	}
	return true;
};
Date.validateMillisecond = function (n) {
	return Date._validate(n, 0, 999, "milliseconds");
};
Date.validateSecond = function (n) {
	return Date._validate(n, 0, 59, "seconds");
};
Date.validateMinute = function (n) {
	return Date._validate(n, 0, 59, "minutes");
};
Date.validateHour = function (n) {
	return Date._validate(n, 0, 23, "hours");
};
Date.validateDay = function (n, year, month) {
	return Date._validate(n, 1, Date.getDaysInMonth(year, month), "days");
};
Date.validateMonth = function (n) {
	return Date._validate(n, 0, 11, "months");
};
Date.validateYear = function (n) {
	return Date._validate(n, 1, 9999, "seconds");
};
Date.prototype.set = function (config) {
	var x = config;
	if (!x.millisecond && x.millisecond !== 0) {
		x.millisecond = -1;
	}
	if (!x.second && x.second !== 0) {
		x.second = -1;
	}
	if (!x.minute && x.minute !== 0) {
		x.minute = -1;
	}
	if (!x.hour && x.hour !== 0) {
		x.hour = -1;
	}
	if (!x.day && x.day !== 0) {
		x.day = -1;
	}
	if (!x.month && x.month !== 0) {
		x.month = -1;
	}
	if (!x.year && x.year !== 0) {
		x.year = -1;
	}
	if (x.millisecond != -1 && Date.validateMillisecond(x.millisecond)) {
		this.addMilliseconds(x.millisecond - this.getMilliseconds());
	}
	if (x.second != -1 && Date.validateSecond(x.second)) {
		this.addSeconds(x.second - this.getSeconds());
	}
	if (x.minute != -1 && Date.validateMinute(x.minute)) {
		this.addMinutes(x.minute - this.getMinutes());
	}
	if (x.hour != -1 && Date.validateHour(x.hour)) {
		this.addHours(x.hour - this.getHours());
	}
	if (x.month !== -1 && Date.validateMonth(x.month)) {
		this.addMonths(x.month - this.getMonth());
	}
	if (x.year != -1 && Date.validateYear(x.year)) {
		this.addYears(x.year - this.getFullYear());
	}
	if (x.day != -1 && Date.validateDay(x.day, this.getFullYear(), this.getMonth())) {
		this.addDays(x.day - this.getDate());
	}
	if (x.timezone) {
		this.setTimezone(x.timezone);
	}
	if (x.timezoneOffset) {
		this.setTimezoneOffset(x.timezoneOffset);
	}
	return this;
};
Date.prototype.clearTime = function () {
	this.setHours(0);
	this.setMinutes(0);
	this.setSeconds(0);
	this.setMilliseconds(0);
	return this;
};
Date.prototype.isLeapYear = function () {
	var y = this.getFullYear();
	return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0));
};
Date.prototype.isWeekday = function () {
	return !(this.is().sat() || this.is().sun());
};
Date.prototype.getDaysInMonth = function () {
	return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.moveToFirstDayOfMonth = function () {
	return this.set({
		day: 1
	});
};
Date.prototype.moveToLastDayOfMonth = function () {
	return this.set({
		day: this.getDaysInMonth()
	});
};
Date.prototype.moveToDayOfWeek = function (day, orient) {
	var diff = (day - this.getDay() + 7 * (orient || +1)) % 7;
	return this.addDays((diff === 0) ? diff += 7 * (orient || +1) : diff);
};
Date.prototype.moveToMonth = function (month, orient) {
	var diff = (month - this.getMonth() + 12 * (orient || +1)) % 12;
	return this.addMonths((diff === 0) ? diff += 12 * (orient || +1) : diff);
};
Date.prototype.getDayOfYear = function () {
	return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000);
};
Date.prototype.getWeekOfYear = function (firstDayOfWeek) {
	var y = this.getFullYear()
		, m = this.getMonth()
		, d = this.getDate();
	var dow = firstDayOfWeek || Date.CultureInfo.firstDayOfWeek;
	var offset = 7 + 1 - new Date(y, 0, 1).getDay();
	if (offset == 8) {
		offset = 1;
	}
	var daynum = ((Date.UTC(y, m, d, 0, 0, 0) - Date.UTC(y, 0, 1, 0, 0, 0)) / 86400000) + 1;
	var w = Math.floor((daynum - offset + 7) / 7);
	if (w === dow) {
		y--;
		var prevOffset = 7 + 1 - new Date(y, 0, 1).getDay();
		if (prevOffset == 2 || prevOffset == 8) {
			w = 53;
		} else {
			w = 52;
		}
	}
	return w;
};
Date.prototype.isDST = function () {
	return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D";
};
Date.prototype.getTimezone = function () {
	return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST());
};
Date.prototype.setTimezoneOffset = function (s) {
	var here = this.getTimezoneOffset()
		, there = Number(s) * -6 / 10;
	this.addMinutes(there - here);
	return this;
};
Date.prototype.setTimezone = function (s) {
	return this.setTimezoneOffset(Date.getTimezoneOffset(s));
};
Date.prototype.getUTCOffset = function () {
	var n = this.getTimezoneOffset() * -10 / 6
		, r;
	if (n < 0) {
		r = (n - 10000).toString();
		return r[0] + r.substr(2);
	} else {
		r = (n + 10000).toString();
		return "+" + r.substr(1);
	}
};
Date.prototype.getDayName = function (abbrev) {
	return abbrev ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : Date.CultureInfo.dayNames[this.getDay()];
};
Date.prototype.getMonthName = function (abbrev) {
	return abbrev ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : Date.CultureInfo.monthNames[this.getMonth()];
};
Date.prototype._toString = Date.prototype.toString;
Date.prototype.toString = function (format) {
	var self = this;
	var p = function p(s) {
		return (s.toString().length == 1) ? "0" + s : s;
	};
	return format ? format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function (format) {
		switch (format) {
		case "hh":
			return p(self.getHours() < 13 ? self.getHours() : (self.getHours() - 12));
		case "h":
			return self.getHours() < 13 ? self.getHours() : (self.getHours() - 12);
		case "HH":
			return p(self.getHours());
		case "H":
			return self.getHours();
		case "mm":
			return p(self.getMinutes());
		case "m":
			return self.getMinutes();
		case "ss":
			return p(self.getSeconds());
		case "s":
			return self.getSeconds();
		case "yyyy":
			return self.getFullYear();
		case "yy":
			return self.getFullYear().toString().substring(2, 4);
		case "dddd":
			return self.getDayName();
		case "ddd":
			return self.getDayName(true);
		case "dd":
			return p(self.getDate());
		case "d":
			return self.getDate().toString();
		case "MMMM":
			return self.getMonthName();
		case "MMM":
			return self.getMonthName(true);
		case "MM":
			return p((self.getMonth() + 1));
		case "M":
			return self.getMonth() + 1;
		case "t":
			return self.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
		case "tt":
			return self.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
		case "zzz":
		case "zz":
		case "z":
			return "";
		}
	}) : this._toString();
};
Date.now = function () {
	return new Date();
};
Date.today = function () {
	return Date.now().clearTime();
};
Date.prototype._orient = +1;
Date.prototype.next = function () {
	this._orient = +1;
	return this;
};
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function () {
	this._orient = -1;
	return this;
};
Date.prototype._is = false;
Date.prototype.is = function () {
	this._is = true;
	return this;
};
Number.prototype._dateElement = "day";
Number.prototype.fromNow = function () {
	var c = {};
	c[this._dateElement] = this;
	return Date.now().add(c);
};
Number.prototype.ago = function () {
	var c = {};
	c[this._dateElement] = this * -1;
	return Date.now().add(c);
};
(function () {
	var $D = Date.prototype
		, $N = Number.prototype;
	var dx = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/)
		, mx = ("january february march april may june july august september october november december").split(/\s/)
		, px = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/)
		, de;
	var df = function (n) {
		return function () {
			if (this._is) {
				this._is = false;
				return this.getDay() == n;
			}
			return this.moveToDayOfWeek(n, this._orient);
		};
	};
	for (var i = 0; i < dx.length; i++) {
		$D[dx[i]] = $D[dx[i].substring(0, 3)] = df(i);
	}
	var mf = function (n) {
		return function () {
			if (this._is) {
				this._is = false;
				return this.getMonth() === n;
			}
			return this.moveToMonth(n, this._orient);
		};
	};
	for (var j = 0; j < mx.length; j++) {
		$D[mx[j]] = $D[mx[j].substring(0, 3)] = mf(j);
	}
	var ef = function (j) {
		return function () {
			if (j.substring(j.length - 1) != "s") {
				j += "s";
			}
			return this["add" + j](this._orient);
		};
	};
	var nf = function (n) {
		return function () {
			this._dateElement = n;
			return this;
		};
	};
	for (var k = 0; k < px.length; k++) {
		de = px[k].toLowerCase();
		$D[de] = $D[de + "s"] = ef(px[k]);
		$N[de] = $N[de + "s"] = nf(de);
	}
}());
Date.prototype.toJSONString = function () {
	return this.toString("yyyy-MM-ddThh:mm:ssZ");
};
Date.prototype.toShortDateString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);
};
Date.prototype.toLongDateString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);
};
Date.prototype.toShortTimeString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);
};
Date.prototype.toLongTimeString = function () {
	return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);
};
Date.prototype.getOrdinal = function () {
	switch (this.getDate()) {
	case 1:
	case 21:
	case 31:
		return "st";
	case 2:
	case 22:
		return "nd";
	case 3:
	case 23:
		return "rd";
	default:
		return "th";
	}
};
(function () {
	Date.Parsing = {
		Exception: function (s) {
			this.message = "Parse error at '" + s.substring(0, 10) + " ...'";
		}
	};
	var $P = Date.Parsing;
	var _ = $P.Operators = {
		rtoken: function (r) {
			return function (s) {
				var mx = s.match(r);
				if (mx) {
					return ([mx[0], s.substring(mx[0].length)]);
				} else {
					throw new $P.Exception(s);
				}
			};
		}
		, token: function (s) {
			return function (s) {
				return _.rtoken(new RegExp("^\s*" + s + "\s*"))(s);
			};
		}
		, stoken: function (s) {
			return _.rtoken(new RegExp("^" + s));
		}
		, until: function (p) {
			return function (s) {
				var qx = []
					, rx = null;
				while (s.length) {
					try {
						rx = p.call(this, s);
					} catch (e) {
						qx.push(rx[0]);
						s = rx[1];
						continue;
					}
					break;
				}
				return [qx, s];
			};
		}
		, many: function (p) {
			return function (s) {
				var rx = []
					, r = null;
				while (s.length) {
					try {
						r = p.call(this, s);
					} catch (e) {
						return [rx, s];
					}
					rx.push(r[0]);
					s = r[1];
				}
				return [rx, s];
			};
		}
		, optional: function (p) {
			return function (s) {
				var r = null;
				try {
					r = p.call(this, s);
				} catch (e) {
					return [null, s];
				}
				return [r[0], r[1]];
			};
		}
		, not: function (p) {
			return function (s) {
				try {
					p.call(this, s);
				} catch (e) {
					return [null, s];
				}
				throw new $P.Exception(s);
			};
		}
		, ignore: function (p) {
			return p ? function (s) {
				var r = null;
				r = p.call(this, s);
				return [null, r[1]];
			} : null;
		}
		, product: function () {
			var px = arguments[0]
				, qx = Array.prototype.slice.call(arguments, 1)
				, rx = [];
			for (var i = 0; i < px.length; i++) {
				rx.push(_.each(px[i], qx));
			}
			return rx;
		}
		, cache: function (rule) {
			var cache = {}
				, r = null;
			return function (s) {
				try {
					r = cache[s] = (cache[s] || rule.call(this, s));
				} catch (e) {
					r = cache[s] = e;
				}
				if (r instanceof $P.Exception) {
					throw r;
				} else {
					return r;
				}
			};
		}
		, any: function () {
			var px = arguments;
			return function (s) {
				var r = null;
				for (var i = 0; i < px.length; i++) {
					if (px[i] == null) {
						continue;
					}
					try {
						r = (px[i].call(this, s));
					} catch (e) {
						r = null;
					}
					if (r) {
						return r;
					}
				}
				throw new $P.Exception(s);
			};
		}
		, each: function () {
			var px = arguments;
			return function (s) {
				var rx = []
					, r = null;
				for (var i = 0; i < px.length; i++) {
					if (px[i] == null) {
						continue;
					}
					try {
						r = (px[i].call(this, s));
					} catch (e) {
						throw new $P.Exception(s);
					}
					rx.push(r[0]);
					s = r[1];
				}
				return [rx, s];
			};
		}
		, all: function () {
			var px = arguments
				, _ = _;
			return _.each(_.optional(px));
		}
		, sequence: function (px, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			if (px.length == 1) {
				return px[0];
			}
			return function (s) {
				var r = null
					, q = null;
				var rx = [];
				for (var i = 0; i < px.length; i++) {
					try {
						r = px[i].call(this, s);
					} catch (e) {
						break;
					}
					rx.push(r[0]);
					try {
						q = d.call(this, r[1]);
					} catch (ex) {
						q = null;
						break;
					}
					s = q[1];
				}
				if (!r) {
					throw new $P.Exception(s);
				}
				if (q) {
					throw new $P.Exception(q[1]);
				}
				if (c) {
					try {
						r = c.call(this, r[1]);
					} catch (ey) {
						throw new $P.Exception(r[1]);
					}
				}
				return [rx, (r ? r[1] : s)];
			};
		}
		, between: function (d1, p, d2) {
			d2 = d2 || d1;
			var _fn = _.each(_.ignore(d1), p, _.ignore(d2));
			return function (s) {
				var rx = _fn.call(this, s);
				return [[rx[0][0], r[0][2]], rx[1]];
			};
		}
		, list: function (p, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			return (p instanceof Array ? _.each(_.product(p.slice(0, -1), _.ignore(d)), p.slice(-1), _.ignore(c)) : _.each(_.many(_.each(p, _.ignore(d))), px, _.ignore(c)));
		}
		, set: function (px, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			return function (s) {
				var r = null
					, p = null
					, q = null
					, rx = null
					, best = [
                        [], s
                    ]
					, last = false;
				for (var i = 0; i < px.length; i++) {
					q = null;
					p = null;
					r = null;
					last = (px.length == 1);
					try {
						r = px[i].call(this, s);
					} catch (e) {
						continue;
					}
					rx = [
                        [r[0]], r[1]
                    ];
					if (r[1].length > 0 && !last) {
						try {
							q = d.call(this, r[1]);
						} catch (ex) {
							last = true;
						}
					} else {
						last = true;
					}
					if (!last && q[1].length === 0) {
						last = true;
					}
					if (!last) {
						var qx = [];
						for (var j = 0; j < px.length; j++) {
							if (i != j) {
								qx.push(px[j]);
							}
						}
						p = _.set(qx, d).call(this, q[1]);
						if (p[0].length > 0) {
							rx[0] = rx[0].concat(p[0]);
							rx[1] = p[1];
						}
					}
					if (rx[1].length < best[1].length) {
						best = rx;
					}
					if (best[1].length === 0) {
						break;
					}
				}
				if (best[0].length === 0) {
					return best;
				}
				if (c) {
					try {
						q = c.call(this, best[1]);
					} catch (ey) {
						throw new $P.Exception(best[1]);
					}
					best[1] = q[1];
				}
				return best;
			};
		}
		, forward: function (gr, fname) {
			return function (s) {
				return gr[fname].call(this, s);
			};
		}
		, replace: function (rule, repl) {
			return function (s) {
				var r = rule.call(this, s);
				return [repl, r[1]];
			};
		}
		, process: function (rule, fn) {
			return function (s) {
				var r = rule.call(this, s);
				return [fn.call(this, r[0]), r[1]];
			};
		}
		, min: function (min, rule) {
			return function (s) {
				var rx = rule.call(this, s);
				if (rx[0].length < min) {
					throw new $P.Exception(s);
				}
				return rx;
			};
		}
	};
	var _generator = function (op) {
		return function () {
			var args = null
				, rx = [];
			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			} else if (arguments[0] instanceof Array) {
				args = arguments[0];
			}
			if (args) {
				for (var i = 0, px = args.shift(); i < px.length; i++) {
					args.unshift(px[i]);
					rx.push(op.apply(null, args));
					args.shift();
					return rx;
				}
			} else {
				return op.apply(null, arguments);
			}
		};
	};
	var gx = "optional not ignore cache".split(/\s/);
	for (var i = 0; i < gx.length; i++) {
		_[gx[i]] = _generator(_[gx[i]]);
	}
	var _vector = function (op) {
		return function () {
			if (arguments[0] instanceof Array) {
				return op.apply(null, arguments[0]);
			} else {
				return op.apply(null, arguments);
			}
		};
	};
	var vx = "each any all".split(/\s/);
	for (var j = 0; j < vx.length; j++) {
		_[vx[j]] = _vector(_[vx[j]]);
	}
}());
(function () {
	var flattenAndCompact = function (ax) {
		var rx = [];
		for (var i = 0; i < ax.length; i++) {
			if (ax[i] instanceof Array) {
				rx = rx.concat(flattenAndCompact(ax[i]));
			} else {
				if (ax[i]) {
					rx.push(ax[i]);
				}
			}
		}
		return rx;
	};
	Date.Grammar = {};
	Date.Translator = {
		hour: function (s) {
			return function () {
				this.hour = Number(s);
			};
		}
		, minute: function (s) {
			return function () {
				this.minute = Number(s);
			};
		}
		, second: function (s) {
			return function () {
				this.second = Number(s);
			};
		}
		, meridian: function (s) {
			return function () {
				this.meridian = s.slice(0, 1).toLowerCase();
			};
		}
		, timezone: function (s) {
			return function () {
				var n = s.replace(/[^\d\+\-]/g, "");
				if (n.length) {
					this.timezoneOffset = Number(n);
				} else {
					this.timezone = s.toLowerCase();
				}
			};
		}
		, day: function (x) {
			var s = x[0];
			return function () {
				this.day = Number(s.match(/\d+/)[0]);
			};
		}
		, month: function (s) {
			return function () {
				this.month = ((s.length == 3) ? Date.getMonthNumberFromName(s) : (Number(s) - 1));
			};
		}
		, year: function (s) {
			return function () {
				var n = Number(s);
				this.year = ((s.length > 2) ? n : (n + (((n + 2000) < Date.CultureInfo.twoDigitYearMax) ? 2000 : 1900)));
			};
		}
		, rday: function (s) {
			return function () {
				switch (s) {
				case "yesterday":
					this.days = -1;
					break;
				case "tomorrow":
					this.days = 1;
					break;
				case "today":
					this.days = 0;
					break;
				case "now":
					this.days = 0;
					this.now = true;
					break;
				}
			};
		}
		, finishExact: function (x) {
			x = (x instanceof Array) ? x : [x];
			var now = new Date();
			this.year = now.getFullYear();
			this.month = now.getMonth();
			this.day = 1;
			this.hour = 0;
			this.minute = 0;
			this.second = 0;
			for (var i = 0; i < x.length; i++) {
				if (x[i]) {
					x[i].call(this);
				}
			}
			this.hour = (this.meridian == "p" && this.hour < 13) ? this.hour + 12 : this.hour;
			if (this.day > Date.getDaysInMonth(this.year, this.month)) {
				throw new RangeError(this.day + " is not a valid value for days.");
			}
			var r = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
			if (this.timezone) {
				r.set({
					timezone: this.timezone
				});
			} else if (this.timezoneOffset) {
				r.set({
					timezoneOffset: this.timezoneOffset
				});
			}
			return r;
		}
		, finish: function (x) {
			x = (x instanceof Array) ? flattenAndCompact(x) : [x];
			if (x.length === 0) {
				return null;
			}
			for (var i = 0; i < x.length; i++) {
				if (typeof x[i] == "function") {
					x[i].call(this);
				}
			}
			if (this.now) {
				return new Date();
			}
			var today = Date.today();
			var method = null;
			var expression = !!(this.days != null || this.orient || this.operator);
			if (expression) {
				var gap, mod, orient;
				orient = ((this.orient == "past" || this.operator == "subtract") ? -1 : 1);
				if (this.weekday) {
					this.unit = "day";
					gap = (Date.getDayNumberFromName(this.weekday) - today.getDay());
					mod = 7;
					this.days = gap ? ((gap + (orient * mod)) % mod) : (orient * mod);
				}
				if (this.month) {
					this.unit = "month";
					gap = (this.month - today.getMonth());
					mod = 12;
					this.months = gap ? ((gap + (orient * mod)) % mod) : (orient * mod);
					this.month = null;
				}
				if (!this.unit) {
					this.unit = "day";
				}
				if (this[this.unit + "s"] == null || this.operator != null) {
					if (!this.value) {
						this.value = 1;
					}
					if (this.unit == "week") {
						this.unit = "day";
						this.value = this.value * 7;
					}
					this[this.unit + "s"] = this.value * orient;
				}
				return today.add(this);
			} else {
				if (this.meridian && this.hour) {
					this.hour = (this.hour < 13 && this.meridian == "p") ? this.hour + 12 : this.hour;
				}
				if (this.weekday && !this.day) {
					this.day = (today.addDays((Date.getDayNumberFromName(this.weekday) - today.getDay()))).getDate();
				}
				if (this.month && !this.day) {
					this.day = 1;
				}
				return today.set(this);
			}
		}
	};
	var _ = Date.Parsing.Operators
		, g = Date.Grammar
		, t = Date.Translator
		, _fn;
	g.datePartDelimiter = _.rtoken(/^([\s\-\.\,\/\x27]+)/);
	g.timePartDelimiter = _.stoken(":");
	g.whiteSpace = _.rtoken(/^\s*/);
	g.generalDelimiter = _.rtoken(/^(([\s\,]|at|on)+)/);
	var _C = {};
	g.ctoken = function (keys) {
		var fn = _C[keys];
		if (!fn) {
			var c = Date.CultureInfo.regexPatterns;
			var kx = keys.split(/\s+/)
				, px = [];
			for (var i = 0; i < kx.length; i++) {
				px.push(_.replace(_.rtoken(c[kx[i]]), kx[i]));
			}
			fn = _C[keys] = _.any.apply(null, px);
		}
		return fn;
	};
	g.ctoken2 = function (key) {
		return _.rtoken(Date.CultureInfo.regexPatterns[key]);
	};
	g.h = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), t.hour));
	g.hh = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/), t.hour));
	g.H = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), t.hour));
	g.HH = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/), t.hour));
	g.m = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.minute));
	g.mm = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.minute));
	g.s = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.second));
	g.ss = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.second));
	g.hms = _.cache(_.sequence([g.H, g.mm, g.ss], g.timePartDelimiter));
	g.t = _.cache(_.process(g.ctoken2("shortMeridian"), t.meridian));
	g.tt = _.cache(_.process(g.ctoken2("longMeridian"), t.meridian));
	g.z = _.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/), t.timezone));
	g.zz = _.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/), t.timezone));
	g.zzz = _.cache(_.process(g.ctoken2("timezone"), t.timezone));
	g.timeSuffix = _.each(_.ignore(g.whiteSpace), _.set([g.tt, g.zzz]));
	g.time = _.each(_.optional(_.ignore(_.stoken("T"))), g.hms, g.timeSuffix);
	g.d = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/), _.optional(g.ctoken2("ordinalSuffix"))), t.day));
	g.dd = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/), _.optional(g.ctoken2("ordinalSuffix"))), t.day));
	g.ddd = g.dddd = _.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"), function (s) {
		return function () {
			this.weekday = s;
		};
	}));
	g.M = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/), t.month));
	g.MM = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/), t.month));
	g.MMM = g.MMMM = _.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), t.month));
	g.y = _.cache(_.process(_.rtoken(/^(\d\d?)/), t.year));
	g.yy = _.cache(_.process(_.rtoken(/^(\d\d)/), t.year));
	g.yyy = _.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/), t.year));
	g.yyyy = _.cache(_.process(_.rtoken(/^(\d\d\d\d)/), t.year));
	_fn = function () {
		return _.each(_.any.apply(null, arguments), _.not(g.ctoken2("timeContext")));
	};
	g.day = _fn(g.d, g.dd);
	g.month = _fn(g.M, g.MMM);
	g.year = _fn(g.yyyy, g.yy);
	g.orientation = _.process(g.ctoken("past future"), function (s) {
		return function () {
			this.orient = s;
		};
	});
	g.operator = _.process(g.ctoken("add subtract"), function (s) {
		return function () {
			this.operator = s;
		};
	});
	g.rday = _.process(g.ctoken("yesterday tomorrow today now"), t.rday);
	g.unit = _.process(g.ctoken("minute hour day week month year"), function (s) {
		return function () {
			this.unit = s;
		};
	});
	g.value = _.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/), function (s) {
		return function () {
			this.value = s.replace(/\D/g, "");
		};
	});
	g.expression = _.set([g.rday, g.operator, g.value, g.unit, g.orientation, g.ddd, g.MMM]);
	_fn = function () {
		return _.set(arguments, g.datePartDelimiter);
	};
	g.mdy = _fn(g.ddd, g.month, g.day, g.year);
	g.ymd = _fn(g.ddd, g.year, g.month, g.day);
	g.dmy = _fn(g.ddd, g.day, g.month, g.year);
	g.date = function (s) {
		return ((g[Date.CultureInfo.dateElementOrder] || g.mdy).call(this, s));
	};
	g.format = _.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function (fmt) {
		if (g[fmt]) {
			return g[fmt];
		} else {
			throw Date.Parsing.Exception(fmt);
		}
	}), _.process(_.rtoken(/^[^dMyhHmstz]+/), function (s) {
		return _.ignore(_.stoken(s));
	}))), function (rules) {
		return _.process(_.each.apply(null, rules), t.finishExact);
	});
	var _F = {};
	var _get = function (f) {
		return _F[f] = (_F[f] || g.format(f)[0]);
	};
	g.formats = function (fx) {
		if (fx instanceof Array) {
			var rx = [];
			for (var i = 0; i < fx.length; i++) {
				rx.push(_get(fx[i]));
			}
			return _.any.apply(null, rx);
		} else {
			return _get(fx);
		}
	};
	g._formats = g.formats(["yyyy-MM-ddTHH:mm:ss", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "d"]);
	g._start = _.process(_.set([g.date, g.time, g.expression], g.generalDelimiter, g.whiteSpace), t.finish);
	g.start = function (s) {
		try {
			var r = g._formats.call({}, s);
			if (r[1].length === 0) {
				return r;
			}
		} catch (e) {}
		return g._start.call({}, s);
	};
}());
Date._parse = Date.parse;
Date.parse = function (s) {
	var r = null;
	if (!s) {
		return null;
	}
	try {
		r = Date.Grammar.start.call({}, s);
	} catch (e) {
		return null;
	}
	return ((r[1].length === 0) ? r[0] : null);
};
Date.getParseFunction = function (fx) {
	var fn = Date.Grammar.formats(fx);
	return function (s) {
		var r = null;
		try {
			r = fn.call({}, s);
		} catch (e) {
			return null;
		}
		return ((r[1].length === 0) ? r[0] : null);
	};
};
Date.parseExact = function (s, fx) {
	return Date.getParseFunction(fx)(s);
};

window.ondragenter = function (e) {
	e.dataTransfer.dropEffect = 'none';
	e.preventDefault();
	return false;
};

window.ondragover = function (e) {
	e.preventDefault();
	return false;
};

window.ondrop = function (e) {
	return false;
};

window.ondragleave = function (e) {
	return false;
};

/**
 *
 * Version: 0.0.6
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/


(function (window, document, $) {
	'use strict';

	// Plugin private cache
	// static vars
	var cache = {
			filterId: 0
		}
		, $body = $('body');

	var Vague = function (elm, customOptions) {
		// Default options
		var defaultOptions = {
				intensity: 5
				, forceSVGUrl: false
				, animationOptions: {
					duration: 1000
					, easing: 'linear'
				}
			}, // extend the default options with the ones passed to the plugin
			options = $.extend(defaultOptions, customOptions),

			/*
			 *
			 * Helpers
			 *
			 */

			_browserPrefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
			, _cssPrefixString = {}
			, _cssPrefix = function (property) {
				if (_cssPrefixString[property] || _cssPrefixString[property] === '') return _cssPrefixString[property] + property;
				var e = document.createElement('div');
				var prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml']; // Various supports...
				for (var i in prefixes) {
					if (typeof e.style[prefixes[i] + property] !== 'undefined') {
						_cssPrefixString[property] = prefixes[i];
						return prefixes[i] + property;
					}
				}
				return property.toLowerCase();
			}, // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-filters.js
			_support = {
				cssfilters: function () {
					var el = document.createElement('div');
					el.style.cssText = _browserPrefixes.join('filter' + ':blur(2px); ');
					return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
				}(),

				// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg-filters.js
				svgfilters: function () {
					var result = false;
					try {
						result = typeof SVGFEColorMatrixElement !== undefined &&
							SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
					} catch (e) {}
					return result;
				}()
			},

			/*
			 *
			 * PRIVATE VARS
			 *
			 */

			_blurred = false, // cache the right prefixed css filter property
			_cssFilterProp = _cssPrefix('Filter')
			, _svgGaussianFilter
			, _filterId, // to cache the jquery animation instance
			_animation,

			/*
			 *
			 * PRIVATE METHODS
			 *
			 */

			/**
			 * Create any svg element
			 * @param  { String } tagName: svg tag name
			 * @return { SVG Node }
			 */

			_createSvgElement = function (tagName) {
				return document.createElementNS('http://www.w3.org/2000/svg', tagName);
			},

			/**
			 *
			 * Inject the svg tag into the DOM
			 * we will use it only if the css filters are not supported
			 *
			 */

			_appendSVGFilter = function () {
				// create the svg and the filter tags
				var svg = _createSvgElement('svg')
					, filter = _createSvgElement('filter');

				// cache the feGaussianBlur tag and make it available
				// outside of this function to easily update the blur intensity
				_svgGaussianFilter = _createSvgElement('feGaussianBlur');

				// hide the svg tag
				// we don't want to see it into the DOM!
				svg.setAttribute('style', 'position:absolute');
				svg.setAttribute('width', '0');
				svg.setAttribute('height', '0');
				// set the id that will be used as link between the DOM element to blur and the svg just created
				filter.setAttribute('id', 'blur-effect-id-' + cache.filterId);

				filter.appendChild(_svgGaussianFilter);
				svg.appendChild(filter);
				// append the svg into the body
				$body.append(svg);

			};

		/*
		 *
		 * PUBLIC VARS
		 *
		 */

		// cache the DOM element to blur
		this.$elm = elm instanceof $ ? elm : $(elm);


		/*
		 *
		 * PUBLIC METHODS
		 *
		 */

		/**
		 *
		 * Initialize the plugin creating a new svg if necessary
		 *
		 */

		this.init = function () {
			// checking the css filter feature
			if (_support.svgfilters) {
				_appendSVGFilter();
			}
			// cache the filter id
			_filterId = cache.filterId;
			// increment the filter id static var
			cache.filterId++;

			return this;

		};

		/**
		 *
		 * Blur the DOM element selected
		 *
		 */

		this.blur = function () {

			var cssFilterValue, // variables needed to force the svg filter URL
				loc = window.location
				, svgUrl = options.forceSVGUrl ? loc.protocol + '//' + loc.host + loc.pathname + loc.search : '';

			// use the css filters if supported
			if (_support.cssfilters) {
				cssFilterValue = 'blur(' + options.intensity + 'px)';
				// .. or use the svg filters
			} else if (_support.svgfilters) {
				// update the svg stdDeviation tag to set up the blur intensity
				_svgGaussianFilter.setAttribute('stdDeviation', options.intensity);
				cssFilterValue = 'url(' + svgUrl + '#blur-effect-id-' + _filterId + ')';
			} else {
				// .. use the IE css filters
				cssFilterValue = 'progid:DXImageTransform.Microsoft.Blur(pixelradius=' + options.intensity + ')';
			}

			// update the DOM element css
			try {
				this.$elm[0].style[_cssFilterProp] = cssFilterValue;
			} catch (e) {

			}
			// set the _blurred internal var to true to cache the element current status
			_blurred = true;

			return this;
		};


		/**
		 * Animate the blur intensity
		 * @param  { Int } newIntensity: new blur intensity value
		 * @param  { Object } customAnimationOptions: default jQuery animate options
		 */

		this.animate = function (newIntensity, customAnimationOptions) {
			// control the new blur intensity checking if it's a valid value
			if (typeof newIntensity !== 'number') {
				throw (typeof newIntensity + ' is not a valid number to animate the blur');
			} else if (newIntensity < 0) {
				throw ('I can animate only positive numbers');
			}
			// create a new jQuery deferred instance
			var dfr = new $.Deferred();

			// kill the previous animation
			if (_animation) {
				_animation.stop(true, true);
			}

			// trigger the animation using the jQuery Animation class
			_animation = new $.Animation(options, {
					intensity: newIntensity
				}, $.extend(options.animationOptions, customAnimationOptions))
				.progress($.proxy(this.blur, this))
				.done(dfr.resolve);

			// return the animation deferred promise
			return dfr.promise();
		};

		/**
		 *
		 * Unblur the DOM element
		 *
		 */
		this.unblur = function () {
			// set the DOM filter property to none
			this.$elm.css(_cssFilterProp, 'none');
			_blurred = false;
			return this;
		};

		/**
		 *
		 * Trigger alternatively the @blur and @unblur methods
		 *
		 */

		this.toggleblur = function () {
			if (_blurred) {
				this.unblur();
			} else {
				this.blur();
			}
			return this;
		};
		/**
		 * Destroy the Vague.js instance removing also the svg filter injected into the DOM
		 */
		this.destroy = function () {
			// do we need to remove the svg filter?
			if (_support.svgfilters) {
				$('filter#blur-effect-id-' + _filterId).parent().remove();
			}

			this.unblur();

			// clear all the property stored into this Vague.js instance
			for (var prop in this) {
				delete this[prop];
			}

			return this;
		};
		// init the plugin
		return this.init();
	};

	// export the plugin as a jQuery function
	$.fn.Vague = function (options) {
		return new Vague(this, options);
	};

}(window, document, jQuery));

var Base64 = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};

function encrypt(alpha, key) {
	var keys = [];
	alpha = Base64.encode(alpha);

	function getkey(o) {
		var position = o % keys.length;
		return keys[position];
	};
	for (var i = 0; i < key.length; i++) {
		keys[keys.length] = key.charCodeAt(i);
	};
	var data = [];
	for (var i = 0; i < alpha.length; i++) {
		var _key = getkey(i);
		var _num = _key + alpha.charCodeAt(i) * 1;
		data[data.length] = _num.toString(16);
	};
	return Base64.encode(data.join(''));
};

function decrypt(alpha, key) {
	var keys = [];
	alpha = Base64.decode(alpha);

	function getkey(o) {
		var position = o % keys.length;
		return keys[position];
	};
	for (var i = 0; i < key.length; i++) {
		keys[keys.length] = key.charCodeAt(i);
	};
	var data = [];
	var i = 0;
	while (i < alpha.length) {
		var str = alpha.substr(i, 2);
		data[data.length] = str;
		i = i + 2;
	};

	var alpha = "";
	for (var i = 0; i < data.length; i++) {
		var _key = getkey(i);
		var _num = parseInt(data[i], 16) - _key;
		alpha += String.fromCharCode(_num);
	};
	return Base64.decode(alpha);
};


function Poster() {
	var postBinding = "poster";
	var receiveBinding = "receiver";
	var setMessageCallback, unsetMessageCallback, currentMsgCallback
		, intervalId, lastHash, cacheBust = 1;

	if (window.postMessage) {

		if (window.addEventListener) {
			setMessageCallback = function (callback) {
				window.addEventListener('message', callback, false);
			}

			unsetMessageCallback = function (callback) {
				window.removeEventListener('message', callback, false);
			}
		} else {
			setMessageCallback = function (callback) {
				window.attachEvent('onmessage', callback);
			}

			unsetMessageCallback = function (callback) {
				window.detachEvent('onmessage', callback);
			}
		}

		this[postBinding] = function (message, targetUrl, target) {
			if (!targetUrl) {
				return;
			}

			// The browser supports window.postMessage, so call it with a targetOrigin
			// set appropriately, based on the targetUrl parameter.
			target.postMessage(message, targetUrl.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));
		}

		// Since the browser supports window.postMessage, the callback will be
		// bound to the actual event associated with window.postMessage.
		this[receiveBinding] = function (callback, sourceOrigin, delay) {
			// Unbind an existing callback if it exists.
			if (currentMsgCallback) {
				unsetMessageCallback(currentMsgCallback);
				currentMsgCallback = null;
			}

			if (!callback) {
				return false;
			}

			// Bind the callback. A reference to the callback is stored for ease of
			// unbinding.
			currentMsgCallback = setMessageCallback(function (e) {
				switch (Object.prototype.toString.call(sourceOrigin)) {
				case '[object String]':
					if (sourceOrigin !== e.origin) {
						return false;
					}
					break;
				case '[object Function]':
					if (sourceOrigin(e.origin)) {
						return false;
					}
					break;
				}

				callback(e);
			});
		};

	} else {

		this[postBinding] = function (message, targetUrl, target) {
			if (!targetUrl) {
				return;
			}

			// The browser does not support window.postMessage, so set the location
			// of the target to targetUrl#message. A bit ugly, but it works! A cache
			// bust parameter is added to ensure that repeat messages trigger the
			// callback.
			target.location = targetUrl.replace(/#.*$/, '') + '#' + (+new Date) + (cacheBust++) + '&' + message;
		}

		// Since the browser sucks, a polling loop will be started, and the
		// callback will be called whenever the location.hash changes.
		this[receiveBinding] = function (callback, sourceOrigin, delay) {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}

			if (callback) {
				delay = typeof sourceOrigin === 'number' ? sourceOrigin : typeof delay === 'number' ? delay : 100;

				intervalId = setInterval(function () {
					var hash = document.location.hash
						, re = /^#?\d+&/;
					if (hash !== lastHash && re.test(hash)) {
						lastHash = hash;
						callback({
							data: hash.replace(re, '')
						});
					}
				}, delay);
			}
		};

	}

	return this;
};

function getAllChildren(panel) {
	var children = panel.items ? panel.items.items : [];
	Ext.each(children, function (child) {
		children = children.concat(getAllChildren(child));
	})
	return children;
};

function getAllChildrenIds(panel) {
	var children = getAllChildren(panel);
	for (var i = 0, l = children.length; i < l; i++) {
		children[i] = children[i].getId();
	}
	return children;
};

/**
 * Convert an image 
 * to a base64 url
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
function convertImgToBase64URL(url, callback, outputFormat) {
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	if (!outputFormat) var outputFormat = 'image/png';
	img.onload = function () {
		var canvas = document.createElement('CANVAS')
			, ctx = canvas.getContext('2d')
			, dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
		canvas = null;
	};
	if (url.indexOf('url(') > -1) url = url.split('url(')[1].split(')')[0];
	if (url.indexOf('http') == -1) callback(url);
	else {
		img.src = url;
	}
}

if (Settings.DEBUG) {

	for (var i = 0; i < Settings.RESOURCES.length; i++) {
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = Settings.RESOURCES[i];
		document.getElementsByTagName('head')[0].appendChild(link);
	};
	/*var link = document.createElement('link');
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = "/theme.css";
	document.getElementsByTagName('head')[0].appendChild(link);*/
};

var windowWidth = window.screen.width < window.outerWidth ?
	window.screen.width : window.outerWidth;
var mobile = windowWidth < 768;

App.isPhone = mobile;
App.isTablet = !mobile;

App.onReady=function(){
	window.setTimeout(function () {
		$('#appLoadingIcon').removeClass('slideInDown').addClass('slideOutUp');
		$('#bootstrap').fadeOut('slow', function () {
			document.getElementById('bootstrap').style.display="none";
		});
	}, 1000);
	
};

App.blur = function () {
	$('.omneedia-overlay').show();
	if (!App._vague) {
		App._vague = $('Body').Vague({
			intensity: 4
			, forceSVGUrl: false
			, animationOptions: {
				duration: 1000
				, easing: 'linear'
			}
		});
		App._vague.blur();
	}
};

App.unblur = function (fx) {
	$('.omneedia-overlay').hide();
	if (App._vague) {
		App._vague.unblur();
		delete App._vague;
	}
}
