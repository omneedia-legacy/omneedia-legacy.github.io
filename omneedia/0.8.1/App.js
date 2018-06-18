/**
 * Version: 0.9.8pi
 * Build Date: 18-Jul-2016
 * Copyright (c) 2006-2015, Omneedia. (http://www.omneedia.com/). All rights reserved.
 * License: GPL.
 * Website: http://www.omneedia.com/
 *
 * CHANGELOG
 * ---------
 * 0.9.8p	Initial commit
 *
 */

// Change Settings REMOTE_API
if (!window.location.origin)
	window.location.origin = window.location.protocol + "//" + window.location.host;

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
		
		if (Settings.REMOTE_API.indexOf('https')>-1)
		document.socket = io.connect(Settings.REMOTE_API, {secure: false});
		else
		document.socket = io.connect(Settings.REMOTE_API);

		document.socket.on('connect', function () {
			var sessionid = document.socket.io.engine.id;

			try {
				App.unblur();
			} catch (e) {};
			$('.omneedia-overlay').hide();
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
		Ext.define("omneedia.IO", {
			statics: {
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
			}
		});

		App.IO = omneedia.IO;
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



Ext.define("omneedia.App", {
	statics: {
		remote: ""
		, APP: {}
		, libs: []
		, namespace: ""
		, md5: function(s) {
			function add32(a, b) {
				return (a + b) & 0xFFFFFFFF;
			};
			function md5cycle(x, k) {
				var a = x[0], b = x[1], c = x[2], d = x[3];

				a = ff(a, b, c, d, k[0], 7, -680876936);
				d = ff(d, a, b, c, k[1], 12, -389564586);
				c = ff(c, d, a, b, k[2], 17,  606105819);
				b = ff(b, c, d, a, k[3], 22, -1044525330);
				a = ff(a, b, c, d, k[4], 7, -176418897);
				d = ff(d, a, b, c, k[5], 12,  1200080426);
				c = ff(c, d, a, b, k[6], 17, -1473231341);
				b = ff(b, c, d, a, k[7], 22, -45705983);
				a = ff(a, b, c, d, k[8], 7,  1770035416);
				d = ff(d, a, b, c, k[9], 12, -1958414417);
				c = ff(c, d, a, b, k[10], 17, -42063);
				b = ff(b, c, d, a, k[11], 22, -1990404162);
				a = ff(a, b, c, d, k[12], 7,  1804603682);
				d = ff(d, a, b, c, k[13], 12, -40341101);
				c = ff(c, d, a, b, k[14], 17, -1502002290);
				b = ff(b, c, d, a, k[15], 22,  1236535329);

				a = gg(a, b, c, d, k[1], 5, -165796510);
				d = gg(d, a, b, c, k[6], 9, -1069501632);
				c = gg(c, d, a, b, k[11], 14,  643717713);
				b = gg(b, c, d, a, k[0], 20, -373897302);
				a = gg(a, b, c, d, k[5], 5, -701558691);
				d = gg(d, a, b, c, k[10], 9,  38016083);
				c = gg(c, d, a, b, k[15], 14, -660478335);
				b = gg(b, c, d, a, k[4], 20, -405537848);
				a = gg(a, b, c, d, k[9], 5,  568446438);
				d = gg(d, a, b, c, k[14], 9, -1019803690);
				c = gg(c, d, a, b, k[3], 14, -187363961);
				b = gg(b, c, d, a, k[8], 20,  1163531501);
				a = gg(a, b, c, d, k[13], 5, -1444681467);
				d = gg(d, a, b, c, k[2], 9, -51403784);
				c = gg(c, d, a, b, k[7], 14,  1735328473);
				b = gg(b, c, d, a, k[12], 20, -1926607734);

				a = hh(a, b, c, d, k[5], 4, -378558);
				d = hh(d, a, b, c, k[8], 11, -2022574463);
				c = hh(c, d, a, b, k[11], 16,  1839030562);
				b = hh(b, c, d, a, k[14], 23, -35309556);
				a = hh(a, b, c, d, k[1], 4, -1530992060);
				d = hh(d, a, b, c, k[4], 11,  1272893353);
				c = hh(c, d, a, b, k[7], 16, -155497632);
				b = hh(b, c, d, a, k[10], 23, -1094730640);
				a = hh(a, b, c, d, k[13], 4,  681279174);
				d = hh(d, a, b, c, k[0], 11, -358537222);
				c = hh(c, d, a, b, k[3], 16, -722521979);
				b = hh(b, c, d, a, k[6], 23,  76029189);
				a = hh(a, b, c, d, k[9], 4, -640364487);
				d = hh(d, a, b, c, k[12], 11, -421815835);
				c = hh(c, d, a, b, k[15], 16,  530742520);
				b = hh(b, c, d, a, k[2], 23, -995338651);

				a = ii(a, b, c, d, k[0], 6, -198630844);
				d = ii(d, a, b, c, k[7], 10,  1126891415);
				c = ii(c, d, a, b, k[14], 15, -1416354905);
				b = ii(b, c, d, a, k[5], 21, -57434055);
				a = ii(a, b, c, d, k[12], 6,  1700485571);
				d = ii(d, a, b, c, k[3], 10, -1894986606);
				c = ii(c, d, a, b, k[10], 15, -1051523);
				b = ii(b, c, d, a, k[1], 21, -2054922799);
				a = ii(a, b, c, d, k[8], 6,  1873313359);
				d = ii(d, a, b, c, k[15], 10, -30611744);
				c = ii(c, d, a, b, k[6], 15, -1560198380);
				b = ii(b, c, d, a, k[13], 21,  1309151649);
				a = ii(a, b, c, d, k[4], 6, -145523070);
				d = ii(d, a, b, c, k[11], 10, -1120210379);
				c = ii(c, d, a, b, k[2], 15,  718787259);
				b = ii(b, c, d, a, k[9], 21, -343485551);

				x[0] = add32(a, x[0]);
				x[1] = add32(b, x[1]);
				x[2] = add32(c, x[2]);
				x[3] = add32(d, x[3]);

				}

				function cmn(q, a, b, x, s, t) {
				a = add32(add32(a, q), add32(x, t));
				return add32((a << s) | (a >>> (32 - s)), b);
				}

				function ff(a, b, c, d, x, s, t) {
				return cmn((b & c) | ((~b) & d), a, b, x, s, t);
				}

				function gg(a, b, c, d, x, s, t) {
				return cmn((b & d) | (c & (~d)), a, b, x, s, t);
				}

				function hh(a, b, c, d, x, s, t) {
				return cmn(b ^ c ^ d, a, b, x, s, t);
				}

				function ii(a, b, c, d, x, s, t) {
				return cmn(c ^ (b | (~d)), a, b, x, s, t);
				}

				function md51(s) {
				txt = '';
				var n = s.length,
				state = [1732584193, -271733879, -1732584194, 271733878], i;
				for (i=64; i<=s.length; i+=64) {
				md5cycle(state, md5blk(s.substring(i-64, i)));
				}
				s = s.substring(i-64);
				var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
				for (i=0; i<s.length; i++)
				tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
				tail[i>>2] |= 0x80 << ((i%4) << 3);
				if (i > 55) {
				md5cycle(state, tail);
				for (i=0; i<16; i++) tail[i] = 0;
				}
				tail[14] = n*8;
				md5cycle(state, tail);
				return state;
				}

				/* there needs to be support for Unicode here,
				 * unless we pretend that we can redefine the MD-5
				 * algorithm for multi-byte characters (perhaps
				 * by adding every four 16-bit characters and
				 * shortening the sum to 32 bits). Otherwise
				 * I suggest performing MD-5 as if every character
				 * was two bytes--e.g., 0040 0025 = @%--but then
				 * how will an ordinary MD-5 sum be matched?
				 * There is no way to standardize text to something
				 * like UTF-8 before transformation; speed cost is
				 * utterly prohibitive. The JavaScript standard
				 * itself needs to look at this: it should start
				 * providing access to strings as preformed UTF-8
				 * 8-bit unsigned value arrays.
				 */
				function md5blk(s) { /* I figured global was faster.   */
				var md5blks = [], i; /* Andy King said do it this way. */
				for (i=0; i<64; i+=4) {
				md5blks[i>>2] = s.charCodeAt(i)
				+ (s.charCodeAt(i+1) << 8)
				+ (s.charCodeAt(i+2) << 16)
				+ (s.charCodeAt(i+3) << 24);
				}
				return md5blks;
				}

				var hex_chr = '0123456789abcdef'.split('');

				function rhex(n)
				{
				var s='', j=0;
				for(; j<4; j++)
				s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
				+ hex_chr[(n >> (j * 8)) & 0x0F];
				return s;
				}

				function hex(x) {
				for (var i=0; i<x.length; i++)
				x[i] = rhex(x[i]);
				return x.join('');
				}


				return hex(md51(s));

		}
		, shortid: function(previous) {
			var generate = function() {
				var ID_LENGTH = 8;
				var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				var rtn = '';
				for (var i = 0; i < ID_LENGTH; i++) rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
				return rtn;
			};
			var UNIQUE_RETRIES = 9999;
			previous = previous || [];
			var retries = 0;
			var id;

			// Try to generate a unique ID,
			// i.e. one that isn't in the previous.
			while(!id && retries < UNIQUE_RETRIES) {
				id = generate();
				if(previous.indexOf(id) !== -1) {
					id = null;
					retries++;
				}
			};

			return id;
		}
		, getArray: function(obj,field) {
				var data=[];
				for (var i=0;i<obj.length;i++) {
					data.push(obj[i][field]);
				};
				return data;
		}
		, info: {
			loading: function (alpha) {
				if (!alpha) alpha = "";
				var opts = {
					lines: 13
					, length: 11
					, width: 5
					, radius: 17
					, corners: 1
					, rotate: 0
					, color: '#FFF'
					, speed: 1
					, trail: 60
					, shadow: false
					, hwaccel: false
					, className: 'spinner'
					, zIndex: 2e9
					, top: 'auto'
					, left: 'auto'
				};
				var target = document.createElement("div");
				document.body.appendChild(target);
				var spinner = new Spinner(opts).spin(target);
				App._loading = iosOverlay({
					text: alpha
					, spinner: spinner
				});
				console.log(App._loading);
			}
			, success: function (alpha) {
				if (!alpha) alpha = "";
				App._loading = iosOverlay({
					icon: "overlay_check"
					, text: alpha
				});
			}
			, error: function (alpha) {
				if (!alpha) alpha = "";
				App._loading = iosOverlay({
					icon: "overlay_error"
					, text: alpha
				});
			}
			, hide: function () {
				if (App._loading) App._loading.hide();
			}
		}
		, stores: function (x) {
			var cc = 0;

			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};

			function counter(l, cb) {
				if (cc == l) cb();
				cc++;
			};
			var tab = [];
			if (x instanceof Ext.Component) {
				var all = getAllChildren(x);
				for (var i = 0; i < all.length; i++) {
					if (all[i].store) {
						tab.push(all[i].getStore());
					};
				};
				return {
					get: function () {
						return tab;
					}
					, on: function (event, cb) {
						for (var i = 0; i < tab.length; i++) {
							tab[i].on(event, function (x) {
								counter(tab.length - 1, cb);
							});
						};
					}
				};
			} else return false;
		}
		, reset: function (x, y) {
			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			if (x instanceof Ext.Component) {
				var all = getAllChildren(x);
				for (var i = 0; i < all.length; i++) {
					//if (all[i].bind) {
					if (all[i].setValue) {
						if (y) {
							if (y != all[i]) all[i].setValue("");
						} else all[i].setValue("");
					}
					//};
				};
			}
		}
		, disabled: function () {
			App.FORMS.destroy();
			document.write('<body style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA9CUAAITRAABtXwAA6GwAADyLAAAbWIPnB3gAAV0USURBVHjaXP3ZjiRJsiwIEjGziKp5ZJ07B4P+n+6n/v/vuMAAU5XhpirCSz+wmkeeDhQKubm5mZoszMS08P/8v/7v93XPY+x1FaaIZCYq1o45p4jstV9fr+u6AFRs6jhP2+uKAGiVNQbP8/TwtRIVAES416bQxglAVe7rW3Su9T7PX+/vNyUBmGq/Ahkimhnn6zyn/e///f/7669/RcZ5nv/5z/v1NdbK8AAAQE1RMcyoNLXv7/c8hqB+/74o/Hod16qMJaLD7Pf7VlEyjnls9/6pdW8RAlDRtS8A13Ufxwnaedr1vsysKkUEwFpF4V57zPHrNd3jum9RFVETbncAYx7X+1ZTFETh2z1SVYmwcZrhel8i2k/Ghq17v87jfd1ZPI6pjLUjs/pd9Z/MApBFYQGYx6sqw1dmvc7jur/vFaZK1tev//X7739XqZrGvs/zvO6dmXNqJFABmrCyCMD9/j/+v//9///3bwARION8ndf7+uuvvzzg7qoSkceQ3+9lZhm7f1BEem28Dvv7962KLJqiygGYHh43AMp5XZcp+v1kLNAAoBxAP2F37LUBjMG9C4C7H+eRmf3Xc873+30cR38F//nPv4/jNLPKAjDmOI75939+A/hf/+vXv//9b9D6vVXs168XgPf3Pg/b7qIjY5+HXauECeA4v97vS0Tc3cyMIiJUysIUJiBjGJIRyMw5xXdU7P4MUWkAAN8FGgkKARQEwJzy/o4xCCCKRgOgLFLIQsUwmVYxIaIREFGgAqjSCESionZIQu8d/bKRsZb26icDgJCFiBq50r5G1uUOVaUOAFEqkpkmamaioqogEfnsn4rKjCwTlkegWFnX7WoBhLuJzu1BMLNsqMhNmin6ywAQCRBA0iQzyNoLKBeyAKXBjBJVFKqqqFJtmhkAs0GEHBxzRCbIaQootRA+jldmACDSsyp8HudeCyCQOuw7ch7QcXKnmfdrqtoxD4ia2S1ipgfU/coikRQFqo8hIt0BKqhDSd6FqTptQHQaqyojMjOjIKzMzOJzJgIAeg2R0f/Aw9yhrELFrqhU2ZXlILDgk4SIZCyyVIeNfghwJwAbZ+ZbdJyHUUdVmpm7j3GIyHm+hJGZa52/fn2NcVzX28xMMae9TVGhArKO03y7KEqolD4lo5hFKQeV1DHQx0fEGsp7ez8T608ZlaiIdFXsVVl09+Mw3w5guwshapUlLEGpGRmkAZhD59DvVZFBobtXaWVVlruniOS1PYEAUndcd7rvaZJQQYADtfv/723A/fv330IB8ObviAiPyAVgrwAwJioWWFkpzL12ZW1g7SV8tvVeG+XA6e4iiDAKKiHKzKwsHZKxzMzDwDrPl8p8tqvi/V7H1O0FagZARHEwKUJNZREhVCXNrMrHHHe5u4MGFglUVSIFSI+wYaiMyMpwUfG9E7LWLigAAbe7u+PaYyhFKukRZHpsjxAC5CxBuW9RDWXRrABliXC7Z8V9L5WKzOhViipgmPU1BTyLGBWouFeQlRnv95WZsS8AyOibZ61cO5TuAQojQlUBRASAe8Ux9XmxLChEJABTPaZd5VSrVDUNR2ZWKRBZ8ryR/ikAcAC+LwdEPDP0ddzXvdf9vpa7H0PvHeHX9da9PWPtpedhw3pPElTKAVhWooJEVCpFRFQlo9SO3B6Ve2eGq0I5XFTooAIwivQdl0WhZUlWCouSZKgcuwpAZkRoFJkRYX3yVfkxjwQrN4BPkQIyzEwVw/TeMU+bWSL0MBvnceDndkOFCDMNVOCYU1Tnr19//fWvX328dYGxtwI4j8ws0eEbXdLYMNs15vB9TRM16xPLzKpghjFYBXcfc1BohgqGGwCyVBSIFD3kOI4ZkWYCoeoSUQXmtI0A0F//8+mEXaIEsHehqpAZiAoA7rvvGY9tyohTJUQoIkCuXeJRFeK7a5z7hgjCA8gCIrXcQYQXCJ0uRGaAzGJVkhJ+R3lfaUXu+wJLnjcZlRACqqIWkTZn334UqwLg1FN0fW5UH2q7qtdNFIESETMQqDI1AOAE5VSVvd3GPI7nPvx6TT9NKXPaGqDYGOOYavNcu8awvf2Y2DvWXmYvk00KgDXk3jnHdMcwiwzQ+oav0ixmRN/Mva7EncJ7hbBuoTkqa+31n7/t/X6Hh+83VSvC9MA0YN33qnARDlVBDeUdiACA8PUcBEkriIgoxcyUFUVhgkMDlDGmUQmYuwN42QDMPoshijYnkXN+eW7qVpX7XqqCDIiSIu5KySKyhFAmAGGJSHZlRQP25561iFRFRAI+TLosFiZoSgJhZpnT5rGjAFPdqgKce+1hFkUzu/ICUCVdgJqVmaEcMLPkjjFsr4AoigKPLGSgIsokqutjABHZhXJlyRweXlEeGFYUA8aYBMZxTFfuKAAqUBsVvvyc05RFncoUte3LAu6RqQWoMAvD4B6qsTaEQiRYmUWCxHY37UIL7pWZlIwkOVQzM4Cqgoi5J4sqllUeICISwrzvp51QJiorFrG9z3ugizkRKhGVzwFRqCjfBXgUgTBVxAWcGctd3F1ZFHrI+3uj/DzP63Zgj+nXdc3p3adtd/ex7p3F47g3YJJRspZn5r0kY0OoohDZOaOUEsdQnzoG3d3GaXt0CaoKFausiOwFqSxVHYOoEUUqqPR1Z1ZlgQYaUP1tdhsGmWqS685iFA3p6HOjfEeBiioRj1wDwwO+PSt7x3gxKzFnFFGeJf0+tu/0b3e6o/LaoRE4D0BThEB2J1flUS8REaaqoKiiVPNyVclMd59WFVtZyMiIKkequ4tUlFcRuDL89++srNJ9X+8soty9+lvda0eGit73uu/7OI7I0FRA+s59usxiRD5neQZ19HFH0hQiyKIZVI/7XmCpTVNxYA4XISjK9HIA9+URu+opy/bugm2pfN3uogFg6CrU2imszEAhE3uXsK9TMQVAM3tfu9+YKSoVKpVVYhWoKAKZbgozdY8xjkQIpSscApEhRKZnIIWm/lO1m1oXbt01PgW9DhWF2BSsnVGuKmR2lYtdahNUVKiK8lCtzaKQLEGRoUZVoJxCYFSWMLc/FU7/NwJFBoAg3bPL2u6hq3gvN7NMhC+U3xuV0kv2GHgjKJqZgPYN/DrHWkfGGnPYjmNOd5+iVV1ZYU65YlWW8qkj7h0VDlrFjcTzlgB7GsOyLAFCRNwTJZXP4s4sUcnYmQEoEICjPGKThmQvmgRRrjY9UeUoRFKh6DPqwRxYleGRwiwPr13XeSJiqygqAEkQ6LsYRlRpZKiCpDs/WIqCAsGY46+//hVFwDyuMYeyIoMOM+5dfZMCyEwzqxKPQPl9g9iZAmDtiIi1sm8hU9wrphVo7nBfwopypHlkRUUg00WqPkWailZ5la6IwSIti4nYuwANDzU103utY2hkVD3H9hhxXU7p5u+uFIoivRJmBgQZQuviW1UpNLO9N0BwFHLtONUyvbJK6t7pHipKkoxKvTwiQhWqGhn3vasc5ZXlRVUAHu5kRqBKAJDpDtGBIlgAxrAIIUWnIR20DyKAyko+laGIotz0A2FlNNpRpZkBWGRM7b0EUlU0s6ogqmqmhoi0Yccx33LZmO5Off31VzXil7FFh4jM4+v1ivuWOecZ0DHPlzR+9Xq9wu9IHOdThgBQxqnn9bn2qIwF0lE0HafsJBvkQiNfIkJ5ALhGpgD2h+kOCVVVrHo+FYCnXV53xPNQGciq8FJB+HOZnpR+aqJZ4sCDz0RGZmSG8vCAsnaUOxuxQeGz2KCimd6n11577Yu0CKho/xQgVeoBVYhko0CmMMMcFp7bGxixrqyGlVKGkooKFkoooEWG1WeJm1GplNBUBaCgRmlWPRvANYtmJuJjDt9+1xYR0kB9HQYxMKlP/egBFWTi9RqZNeYUFqhfr/l35mEVge47zKifqpMEykn27X8MvdddoVlCrqF2x/NIzaxfcMjY99sGSarom1JFEW34MtJOitO6sq1MQADJ7Cq53F3V9n661evCeZpZfEA8qFlmJEbllWT2Fx0/e4M7ugLR/moSD/S5dhwTEUCDRsCDdJe7+33fGav/we/f36pq2g/N1VRV//7P78hohB04r8srS8S7xo7KcM8sUaoKqY3DVlb2L6OJ+Bz9YixVqeqi3AFk7IjAUNVuP0qEmehdkZlCiGhXUT+977NWFCKkjPM8q/L1OomM4susKr9es9Guofm+J4Axjr3vY9raWbHHHGbDTCFQRkOl3bBX6c9WAWd4pFUVM4FyD9zCylLT7nozI1OyRwgE4EoBJD5vOKLUsopR2FFSBJh+m5IMFXH3CAcYERE4D7t37OWm8PDwcHdThEcXAB6gyX1nFdYutVQJIG6mWe7VYM8CpO/dblGqXGlXQDUyNsojde0FTAA4ZO1l+lx9kQ1QIkp2eJ9niCIrMkQUsZSi4lUqTCU3zR1AuXSX2ShfT0Lq3s8bO08DEO4qKsws6S3d96eI/HzRVdp7kVTARXQOeQO95QzRBSQbfwUiY681pqpM/7k7gC6kKRTBUGZSRMLRYCiAYTWt3ngmHqZUDVOjDDWNFWZ205RiCgdJixKlV4nahC9VIUVNWGr6H9iYY6pAUMvNxrT3+31dFxt3D3cd4U4d7jtTuybr9RcB1A4a0PAdjqFRMDMRzawxj9xOrCpUandaZAKovK43qtTMrvdNWSJSeVdxb4993/dowDiK7+sac4jIBu7bzYyMLFt7zZKgURr/xpyybgVVZGhsUVMVM8vMv/76l/tbdI5hFnmer6o4jhPlarZ2mo2qIHVvM182pimu20F9fU0VdQ8KtpO0ngaqCjVNUVADiBhjROw5zKNvb6iJULL4er2OaTbm3n4M8ZIxOMfYXmsFxYQViUhR1QTVlCSgY0yhRIaaZpcIUBEtEBRUig5VUdUxzLEADOUd3LsorBQHKOiVRu3S1LJ4nrbXIHmep++rt98xRPUgZc6ZseaYPesgde87IpUFYEc18iOo7k886B59vtzXvTy1QlnLcw6loIqiIiKmwJwqqqbKSn0wBmVdPS96AKifIWCqqAjIILW/6wh6QETvHb/KM3PO2e9Ex4mdZmhYJeoBMACQUpXhGbWqPNyXoaLudVfWN2BzzorzOI97+X1jWmXYMN327FQz65KODJBVIEPEMovaPXZlBhnIEGamkqGKz/EmAArzOA3AnMf58n5ZpEXl1+vr+y2v81W5rzVf58h87g0Ac05Vcfcu0hriBFCV950Vf4o0IVB+Xx5m7vf376ry7eypdk89Ir6V+b49M48j9/Y55b6uLoW79Lp2qGVlLE8RRZVK7S5bAr7dPeeUKpCSmZm2o8JLJAFWYUcCMQciS8LH0HqWwyAJmEjNIdtzjsqKLGkkVbuwQ0S6ilSBKI/49ACS4R5VmZs8ZmbBHWPg9/sGUlkoZmVPUdYOMwPhASora6103/fytdZ9bcqtFODl+xKdgK+V3QXttUFz96wu+aCUvuKAufYC0F2isvp6VVXtDo3dY1hkIBbQc5sRCDhERgNrGfEUw3/6CRdaCrsWys/skjr/cWk/RdJ930LpQdBtl7s3uiDYEaCmGfZy35cHcExAumDoFb1dxXgeZpm1o6y7rgybvyYWgOP11xj2XEaRqpIlnw3Kxi61SzdlV5NdeoL5AOO9d1mRgarwzKw4zvteIkLKdS1hKa91b8Cqcm939/B4v6+h/KEt/DRV4ZqZwuyZ4r3DPZTuvhPa5dz7vb/f7zi2UJan8rjvuyv119dwr/Ag476B8usyAO5q+uyl87A5DRBgmcl2UkgGMFRnRaUkIdIAOei8hSw9VKUqx9C1goSJXasiQaYnPCIiqqyyPFI1t2cVs0Bi3Ts8ilWVAHt0LYL6nGSqajYiUjVUDSgilQwBUCoigqyGKJiVPQjosaspmm8CqKiqPD2rqVbWZ1AFpQwtThOUu5uxR+ymEFERVrmZzUFCu6/ttrCXgSkag6FwTDumXXfPzUAbVTSzLOkxsKmdR5npnM8syEwyFDSRhCA8erxNPcxWY/QSNYY1MeS//rq3u9rMLPK59kVAqk17puk0takS4znNZ0Razx6BLKlMQ21hRqSqREbGcvfMXGtlJjIiI7NUj2cYLtKXVH7uLN/Or+omQ6no5UqbUwSVIPKZso0pmWWKzFj3Wwgyqrr62pGR4UJDuciAPNBek2T22svzmMjkcj9pPfR9vksbUZxzhsdxKiV7sgv2bTOaSVIlwDNtOaded6lKuJKxQxsFCnd373U8a7q7mu1dIvs8KjIics50FzONCtDUZq47IwqakUQSWoDQRUAUtaSkCqpCjSrYsIhlplVZBZKqRlqhjqEQVfVenFmpqgWaEpDIFJF7baE0iJ8pFCEpJEr6wH4wbz5lEAhRy8yMiER4qGgVQIQHheFxMz2ADWHttUDrsbNSVqxKycpp5YGK6gvT7CH5RLKyokJZe20zw4bv+sx5orKypIE+FQfMA1FZRRK9V/sSILxKUX5vCp2Uiu3lpci0nmFVrnvdPbqucsFWIquviYxYvr0hJmMudyoF5fuONDdTFVAzM0rs+/sd7h7N2fDv91rrDeh9X6bnvdFEoKdbB1JHNUUr9r1NWR647+0RgNbtkdFXnilUtEkXxN6rCwl0qfp8WlaCEciKY6jDPeABzWz+SV+Xa6Niu+c0AUtFM3MOnYddb28sAoGh7LZLZfavMDM1nYzuyH99nWtX1NvMlKnu/SMkTKlaCXHO7g36Zs4EM5vg1PBLZFRSWRWe4UIow1lZVpVZ2mdENdWkKThQsyRrmFTSTMwOt5rDoso9TeHu0fMbQwa78uke4EOMywivCkBQpUYCK/rfVDJEAEqf95nxEBAUkaFiDToBGJrnYfe6yWpEqJs6G2YD7h/iGiCqGRGqplqikUGBiEQgqke6iEoAA9BxMLOyXi+KiLJcR2U1CldiQxn5FAs/A/UGuKl0R+PLjXZ5wFgB+L6W5zS5gyoPYHTd0c9HojJA6r1XhVPobk0ky6r79iy6r17u7gFgrQXgvu4x+P5+2+scv980M1XZwBgm8svMzOw8zzlk7QS8h0SVOadtz2a/EQkOm/H1Oj2gKiqIxH0vlJ+vf4kw6jszUTbmaMzH97fpsd0LVcUPdeLskTQoZvZTF6akyDyHVCK/Lxusak6lrDs+l5JmkXTAQBVmMlAgC6SQK5dy/L78mOa+9mqypEQgwskgi5MNWxSaPdFcNZphdKsNRD1nVWRkyZxTMtRmQsiobljLs0hiry1ifSzNCffMcBeNWFmy7jvDwyQDVRUpatMoay1SFdWt7crtkXPMzABHFSK0klWRNZSVyW7AChoeYKydQjEUCDUtUNVE0NdIVu6QHbV3mQKo9amve3DbHE+qNqXqeGmVVjr6nCaHMoPWNBBB11E2GmhCZNRzBFQfnWvnQ/6hNr/jGYZEz0a119KHIWddZZjZmENVhokHjmP22X+cX/e95tA5JhmmzGBVmKKEEaBSvHk32TgNIedkwu5rkzqnAMhg13V2L2/Iqbf+Bhrd+/37bwDu5u7EXrQsVtbYz9nc0NicXlGX4P39pvDr1OZvhPsc3w4+REJqT47n4EWLYjN8CKjOLlS62G0qX9c2ay1hoQJdDKQ883kaiLUD1Ho64YqEFVEOkqwm6q3lHg5o0xuFqRQyMqkUVYgO92eo2UDEGNwrqrT/swjE5ZUgo/nUleIB1Hp/B8r7Qtv3t9nwALIZWryu/foaqEQlICQLioeMl8KmlBAIVGRWhpNSuaNEKaiIpOq47jsE7gW6SFf5DU6gAqpQ0RAhQGUmjgMoF1FQzykRhQqhVEJV5jhUbQzr70VEztH0EzHBmOO6/TgmaMcxr+sS0TGPcKrNvW5QzHS7ZgaFYzBTox5QoypRkUVlQVSbrMoecWLO6fKMmU0ts0zt733NqU0p/bl5UEqG73A3pVbWfa9uM7qr7O0KmM2DOmxOqru7Dbxev8x879uG9Jyb7vm06aPrt6hGzJbKtDk0s4bpjopdUJDx4LfPCAwZoDxrQmloPo9i7yhlFLNUxElLsPdJM4qU0nP7zPKkMNy9ygmEI8MBIO3DDUSVZyAyujBtdN8Ua0OJ7fF6TY9QQlnd9/QFIjpjxbQKWhQp0t1SBHo8PMcE7Hj9EitPmNkc6l7jeKV/i44xRiRVavuDXN33snF6XCKSSFNrLu5zQZX2rFRtPtUAMKRbDtowd/3h0KvOKicTMNLTKxlVOJUBVhWJSDmOiT4RgDFBiruruirUjjEsIqHRzGclQpkr7k2iSBBaFSqIKAiIbIq/7w2MyDANSsa+kOF+q0zR7CEXgGPOLFXtnlsaNhhmpIA2xtHvfx7j3gmqVvxwH5tH3d9gpe2o3KvCu0BqBOm6LpQrDyh7oN6DhR5W/EwYyMhilT6kQ7AvkMhAAdd3lVcOjzuzIPr83tjN/l/r7kVb9dBJFlAlZGaWiFLHqXAfwhrPmKNIHVIOs6HcpVn8ev06z7NiQ3SvGvNoGh11HPN4qEiG4zgz1hz8ZjM6cQzt6eyHQV6ZDQpZX4juqiYf6YxGpVmYDQAZpk8R1BwNmAG082VVqeMYw06m2WsM4/sNoELjM6+JUmrCgYrwH/avX6uovC5/nSMi1v07fESYxx0X3QOI84QpYiege7uICKsqj6FRzMzMEuztf2ihZrbujUggm9bS81F9xu8ibBxhRQiyULHWCi+UR5CsxAjf2/08GOXIkVkPOyvyOGytrOwpZERIzyUbwYiyptQL6b4iQhQRy7esfX+9DCgQAEWtp1+wUbm7g1HKGFRRFJtEkKUNnAPoXbH2aoJp5X29n0qh4tj31TRpNivTU9T7zHLPvd7n+cLT+QqFQFUWFR6Qz8DR/Znaurues1d/s3dJlAT54O/N7Gq81QMo7JB7wZR7e2YeQ95RmbF2KB8OacuYLkUE8l5mFu4grrweRET83rRrFcqv6zKzn6ahUta+f373db3PgJqGV9ZCxTzGgxmbNftdhGpmKqUC0b39db7AFtxIuKtZJOY8+oBpaL8qzY4qMRURqajIECAzxzCkbndgl0r4Ci9idbXWtVlfEcIqVsbiFEGZcQW6radkZo1BJUz/x8RaUFU6DHuVKqrSQwTxNJqFCIyMe92is7vM5SPTUY56uMRZRKYwPUCUiGVxu08dvUzHMChfr3+tdffJHbHcx3HMiPU6f/3n3/87MkfzlDLDHTge+DgWKjJvj/EBdKDiEdbUtBavJFDopSNzzCx+ipMa43NMU5uc3BNoKqNSs1SgrL3uKt93melaPoZlrBBB7czuYamipR5pT23Dh3CRWYeEiIyXPRw+w3kaYFVH+LJxrrWeIRprDDNBVFKya/fe7RlbxDMtE6KSARsm4j+XjCcRUCl+UNe+PUQBsdeB9xVTYPMYxWOIJ7o5ydzDlIpwqDb/Er6jiiJlc8pesDFJOQ5rUoro4MXzdfzU5WMOM3v7uylDgurfTWRlRkSVkw9d7N7h7u9LADQV9qlKgYh1X+8qkg3tG5n3dWEeVO4fxQT7ofgPbfPhbKYJy1iAZ+wqNx3ucW9WqaBIoh4aFioqkYy1oaIeeF9vAFVsKk53Ee5OGeHrmPPePb9vbCR2VJUOZUaIqLKycT0qSf0zm5tZCzhQoaqZdd8ZRSkQsfxe6/t63w0PuLuKXtdVWRk1j+HuVQA5BisNYhFJ/VR37LvIfXvmzIDRq7wpwbHvZvwSJCMCqgVEP8j7jsyICKX3hMsU1KYSPTqQyGiQmsrGncc4kHGc0/2v45g9CzIzBq3k63X8J3JY3ZugjSkP2ibI0qq47zXnV2a57wff/HRxIiQTMjXd7CC1e5XjmBH2GVb2kpM5ZuSc8/DtWTIlGuFQOVTNxtldpYggHcgINFiH8ir9UD6NjO2QfESwzxHAquKYh1XJn3JFxzABjr39Z4wCYN+OohIUNm85G+2nFiTqERv5dhtGJfafv+2WANBm9pua63guUwwzV44/p/Jn5oWKjGjZDYoZ9cwFyyOqaTkRiMztriyP7b6B1+fuW9QZEe67i6t7R+PTymaK188p0heig1aprOUQ5odFR1E2ozAztqM3jIh70Yb1+wwkEVXojSGCMWyYZaXIMAMSYxj2JlWoIjxkRuSYMxKqMNPt2cxhIpXpXhCtUmpTTfmgoll7V2TOejjxPQ+IbGDyYZ59gB1EIAL83EjU0TPH7oCpTC/CI8y365xCr7jvHdTl7iLSDWj4igcQT9/XFbjv6zjOLtCbutII414rY9+3Z97gOI5j328br7VXRpiN49hrx31fwF/v77eo/rCqfsbPGXGer8j49eurBcRRVEEyrrip9H09UEclYD+zLSJtnFQh8pgQHRQSOI55X9/9HKqStExEpO3t4QUsFfV9u5177cxAFdI8Q0Xd95jDvZoylbEEBxmRfCZokZEmIt1tCMvMjjmjRLiTDWnrMKvMJgmLQAXVUCjrKWwCjbd0ReheY7AlQh/1HUHrFYPbTVV0hscYYfb661dP6/LN1zyGOzJ2HxvnedZr6jhjX2o2j5cyI02fCaKMYaaS2Pt9V1YV79sp3nwvj1bxOSW235TRB0kEIgM7VDUiAFexyJU59SMccw/RkVmiMzMoWiBFpbyXLAFSj0FSCxMclE2VXqYqcw5rhEpV9ipQmccwIW3dz+hLCipKYU+OIFpZY1rd9xwYrTbQATyNUMTrOCaR+jX95+KVRwImrAeR7BqjmykMUxzHVJWTqaLn8byx1u/G63T3PfTr6zVm7n2IyHnYZaYqzZK0cb7O8f2+59DX11eT9oZZDLr7r69xLz4y+WmRNIEoqoiHHqunmVJEJyoar41KICPjQ79P93wqCNH8DLLcHbhsGAkyImMUba1VWZEEPCKq9tqrNXoeyMo55ve1bLxc4r6vJpd/X7HvBaxupXeUu1fWWmsO7cmaD6VmBFQ1Aplxb0K0CYDhBbOqIjXT/lmdNwLQfcJTBsjMNNP9wzaNh6OiQylkFSIiKgEz7WrLVBNFFUaZiEBEVTNEtNeDPH0fMEZjHYPM89AqHHOQoGh4HFMydBxNo1VlNcBH5RiUKBGLpDI9EIjr2oDaOben+x0phZWxQAUqE6Zc4RmRRV8rCsBdlcARHlVxtxTQvRIo3/4IRzI0M8xY2JXTHVlkZoRHijC6ZyOjazzizMyq5wZ4f78fvBv4z7//nX/9Naesu5UeEFEyw53DeiD+aJgCP1Rcr9B1b3cy3Ov+2FjsfZPi+1Lpb//5KXevIe7e0gt372lTV7Y/QzGIKpBS9ehvC12SJdSs64Km6FY90osHRGEiP2QMRMaqtPtejUM2NtQC9wisHXsX3rtrhLVXBKyJ4yJswPGYD79/qHZtoKbn+VLTocTX2UYmpnDVp0Cvh/f64FbF3jlUtkigFX2VNY5noTfZKXZU4jizyYaPIQK7a7OhXJLSjAZAWKvSoF3JPdUCbbvPY6y70DwzbA92taJdOodH2n01WO1V0eRAUjMDGSgPhw2rSE9k9eKeYKlqi0WB3WCMqm6xMQ9S5hDVeV/flKEKF6iVCJXn+fVlRtHaW8CcRidM9V5LBcdxrF3KPhG16bVTSR1qRep5GIDvzMjwwJj8dIcji6CRBTFVRyGzVEXkkeyDmsk56ilRo6qa3uHtZXIMiRKzMec0hSuGGXWoyus8rusNjvNlXeuaslCZSfa1oBAViUw1w8M/a8zjsFWSj1JRVnpz2lpsKLQs2DipBraiIFWtJ7BmFiFD1OZpwyMRseaYqlPtoJxTHzgoEgJ9sNHqptmHHGTOMau8x72tHLquW7NpYPZD1+t/ZYoxp7bRQ+uxK6vZTJVF+dHt/1Tnsj8NcRv+zCwyzmNSj6roNr9Hd/uYZH59/VflXju6hbrvdZ6vOWgCyNNXRazX61/u/+kH4e7tSfEg4jIbWm1FkgaOaVHckVT5Mc/5p9GA6BDgKpeWLOux3X86vw+ZL5aPY6BKt3sXYGvlnNg721MIyEqvRETQQUY4VobuivT77j5yvm+PveWRkHsmAI2K+14Rlo2exr6Bfa9xWB+M77dHRmWN6rb6+XLPF38MSB7alQZgalMzhoHPhNB0yK/Xed1XGN3T985CeEUsQJUVJMWUWk3eNmtFC4B7AbSsXGuVsieF2CEiEXld13n6WjmUGWt/SG/NbozAADIri2oSHhRrHT3ExsDeoDJKGjhB+Zxfa6VHqoTvQFkMeb+v2Pcy7Pu9acDdfiJktrQF5XVWZCA9/B0PdBGm2uZAfar2oamMD/t1UHlAd5SyjqlVf7C/SFD4w/8zDSDM3VuKbdqKIzT/vkTblEJEjqnKsinrVhFkyev1qtiAqVkWGrrOB5SzpkIopSquu7/0G+WZWYf9/ffvtgD4Hdhr+X/h9+/fc0zVP4yjvSX2vTwPOVAeIi3aeCQviiqr0q7vexSsCmX+kGybNLp8b+fDCnY/hn7oWYjKlhmg6IHKWEB4jHm2/DSryQ25dvaAph+RkSIy54zCUBIcQ7s1b/MIlWlmZhBwbXj1kfN1nud1W7Mw7stJE0E+jEAddvh2FUftvo27eF3r91PSsCh3lbq/TeGJ630/xTlz2PTI8zhAQ3kBmeLJ3+/7p3t+ff1VsW0epPbod04breDzrSpzHu6uOufMtZYHjOxq28bp3hOWBNUkPbIVC1kcDdpmT50f6wOUZxbKUWE2lFpoUyYdSpQJShQFmiKrVdE4T1vr+R6zpCqq52JsUmc9WiIgA1EwxbVqKCPCFNfVhZZmct9rzPnM0YrR+tja7uPh+anaf//3vx4LqkhlHuf59avWfVeFjePrl1buvb/UTAWmVnhggQcbqUcXdwgamDumkbLW6o4TrNa8VkYBVUFpPo+eRlOch2XMYWZGT7mvENHXIe+yCT+Gbq9plQFVq9oUZI2I7Gq4bYt650QNgL6fkc3KAHKvaDujSrRxQ28PQNogKFxVBYyhbB+bMZpEZzbG3iBlPQrudjzTofR92TNsljFFjX2DigiZcwxTRKWEmkFVwlF4AC7hMUcBGMeX+xtlAEUGKysUVNV2EBrurnKIqCFU2bMhVcviMe3BTyuqpJViVVElwuc+VBFVJfnr15e7r7VQsaNeh9332qx75w/4uO6tahk7wiq2MIEwNfclog0VQD5DYnJvT2RTHntTjRPv6y2oeRzU47rew8rsqRhVxdIBex0UHroh9jUP7XGQAruiF9gYjmHW9KCP9hCwerrzxs2syhkQUWFSTRBgO2qdZjaH/M1qGtyYOG3udc/j5e7n+XJ/K0XN7NFhlt/3EhaQ72s3/qg7VDQyrtvnnGPYfa+WZu71/ihuNgDBjtIm+q+d7t78FoiJpIgcx3y/U0R6itHFKLK5wNJsULO5tz+6x/qjmms99QdONTKqSvkQRzJrmJF3xFPktFkQpSX5WubHecwp1+U/JmciAhiFzZw7py0fZjKKGdt3hmmmV2kVTPjTKTWnt/uznxlN+1e4O5ABdXePaGOq2HdBxyz3EJG9IjLM7rUWKJTLfXmImUru7S70UaMiEpWx2xPmI4bkecy17qoSApXsdhHINoCjVmFM2+smofpIliNyrS3IriSPY6qa3N7fy8ca44cBOsxGqcS9AO9+NAuH8bo9cgkPAJ5OMZRnqkdErWPg7Y80XHRvz2YErV0P26ICVBHhXde13OM83+H+z9J0r33veCjW43T3zQp/KBV9x5ri+2ppLlRRhSxRSuLhnrQwI2uI0MYjqDqmtTgRQB8TXkDCmvd/DG1BJ8XmYWutoXzA4ygV7QKxkVrhrkyUgw/bd7v+KLZaVUyG+xuwdhpto0UAUbP5Vfe9hllmENkWWu1m4U00QnW31xVLgu0zR6EpmizezXQl8nlEIvoMZbvBUNPwGINt+XgMBcqmLEBV5pzXZSoKQ4JmiMqMnQk12d6kLkktSj6jKGdT1RfbZAVR3E7VD/kmRZV9M5AACDH0AAixH1Ftvi9HQZju8fvbhVSVe++IACi6wwOo99WmiHVnEAWx342w+D6O875973LfqIoK0lSrsY6Wjx2HqhIoYapkZvn2yvsd+3UesW+Y3feHWzbsvnOtpaz07wigYg4FVbm6WWorB3c/5nEvB3zvMnXQMtOdTTIDkLU+rZR/vY6GaxqoG3oIQ9mU1urza3+ULuP4svkAUCY4xqTI93v1+CqND0RLGcP2uiP54+/y8+dHcZVZ13WJCCp62AxmZiqrR657ezsjVBspojJjA8xYK6t29A+j3Gz49swS8QZqsmRYGzkN4P7RynyaATuby/TM4g3wMQzwj3jyfzTZ/XzXKkDCwz4jvWmGghJmYUbyaVpEJLtQJoYpIRlNoxWVcnc1PSfv9nXrIXQxM6WYmREZ4SiPRJas9ajMMoPUTKAZBoiMXdm3ED9nJFqtBpiZz6GRMkyJ8KofxzsKquTrNQsylESZzrQKL9FR6ar2ep0Rnpm/Xsfvb4+gmWY4SIDnMUDrERv5sPNNsVW+XtNMTtiSIpkZ+nAKWlHeuBmUNGVhtpwl83Gve1+47m0BSvwPCIF1305hxUpoRjxDBiwbLzLaFDGKDyrq7zHm3q6mVGpU6gMr388DxN4bFZ6sVFXc6369xo9V62MLUhUhzyQ0cm8Xpk1r073Wjnfh0M0AyfCVDxcjIh2YqkCFkjsra7X7AQXtLqHPL4ye7nX3bEY7z7MyqQdqV+Y8johwx4MbuKMyaC2Fbsvo2OUaGevy2KZDd5swR66KOF5/hcfaq5+pu1PyGRj1knEtVJVHUkTraaCjoc/IkMHW+SctWuYns2q37aFI96MMPl5GTamIitFXh1JZwkxYZlXxhwXUnfHjAYps57A5miJrgDXCSGH0eiAieZ720ZuXmgp7NtzSE2mAaRg9FAhhishagRRgrS5SYZl+fdzmNJ0IgBEpwoyi9Ngr55gRoSJVGeA0euBjikFQK6MSFC4vooBYmxGPWWcLrz72GWi2RH/wHor3pxhm3R2aWQMDUXR3URuTx9B7G8qrZnNyq2Yzn1XDxqkqLjSFe/Mpvc0FMS0y9q5JEZGhjOKYr+HZx20f8zZeaglfY47IaIwrCh6I8Ai0r4K7do/388d3RcWw+qfqra01qQfwDWpUW8/onF9VlwmiTPvm+JBzx3x1VXZMWGVG5WS0kQDJxyiFqWZKAeYxMafZALiOY/qwr9fRzodzCGj91xUWxfOw63a1Vh5Yj8fnlLV0KBtLFWbS5tB73T0WEVFS2wQ3s36cXMlUUSLJYJVweBKJQgkxlPtHh5GVmdcCUMsz6p5Z694eD82w6XEe+WgpPdsssbEN98dMV0VZD5TkXq2P/ccZmZmV657HQy7vK676Ysl4jfNTaLaADBEYBtIImhkKw5ipFBvDvr+7KVISShKseqi8FFVFJE0YGTbM+/HVNvnF1iszTKPb3e6dxrAmZo5hKlCbc46qqud2mpBoQ7XeAGZCEUb7RvYAscQrC2bRUFsW1aYC9+0N2+91g8OsbJygm9k8BipimA3MIVWGH1U7HyNREVl7CXlMu59/Z6R4riwRFqmm6XL2AgfgCdIKFBFIxG4z2WqNcnultV/JnzPuU4m0Z70wVxaoc05EAo7t3QRnHnbvVNZC9kPPTA9s9x2FppVi+a7Xr1dF7ftS1tpXRO61VVFhZn697zEYsQtjs7IHgbMvNXH3KpvTlAnBT3chNgaGjvkSj0gdUxMPgmRTU/xercuup3N9llBGiYiqIUOEVJqChhb79AcTka/XfAhI41QV/fRbpjiGUI+97tZnAJYl52F76evr5e4ZGwoztvK12r0rkDUz13P2oEcoj4MYsU25Vs4p1aqQVBE3I5W1XeTIzMglIc3E6rnh8ryXf7/DffcMsc8rCjOtYm+Wmq6VgHgAHFHpd8POUVk/Qw4ySFHTFlURvRoY8Wg8RCQjPJzYVcyoG0MZfQO0xGK59I19LwgfQ+q9NiXf1zKFjuN9rWPG2sGLTbJ6ZFX7IqtKGlMhA/Xq+cO6S4QRe5+vf//nG9X+HZ45Yz9sn1fc7VNEhvJw6N7eJhTtSnjfGzhNI8sq0KOJx2is7Tfz9hwiEuGqz4EVgTGyKnvOYPZW1l1J2eb7CtaX8fZmxkYUw33MDy+NoDzuDB7Y0V5U+TPNvneSAVgVzbCjsxhKKVGOcmEhoxChRNZ2l4zMdh2TjNXMDXs8cVOYvm+03dVjk1QRqCzqMyXJojtMsXe18wdArhzK0ER5BvZ6vNpBF1R4ZLaDS0UZvMGuD91VmbHNoirNcO3wwDyGuxZyrVZx8K/XI4+sKCiotOewHqQX2I44aiaCwENiqxLV0QSK8Dkfm3zbDhGZYw7N85Ct55zzn7MwM9uxKfwHeIWPVaujiiwddNceJoBW1RvjEXllpjIdGINqRkqpmMqFIVLDjM0SivJygZ6TCXRDpQRoY7Dd/d39mFSzloKqYpqYAoMgzVAlKMusY/4c/zZs2DjPib1TzdZeX19f676jnlOJFBd5DEnH+WW+DO5jTJtz3st/XMQBA3SObgOwP+Z5maFt8jfsvh8j2jY2FjVgN0chfKlos9kbEN+r2mOHVdUo1XYH9fu6/zUOEA3g9FrPACWH8k4bwzraAsB8yIVPTTaUd/4wGrB3tedCZkp0Edbjp2jjmnD4Q1Q6H/5Jlg1e9wa0HyoUIgrVr9e8mppqs0+445T2+eireQ6NJGDK/PXrr3///Q34HFNVbcS9vJ+CtnEUTSmtnNnhVKlSM0bocX7JdvkcxA+XLEv5bHszhRhiNSO3rXhUfIeYMjPMZvMXqmpvb2p3Y0kXA6WWOE8j2X47IvwEXmhLaaowjagxx/BIoE1a252KWQIiA5mB8kxURWVFWAN0ZHawC4Sqct/QnkgEfgDQ45xZOqyZVBS1ytTHT6vdvzST9ZBltwfWXlncuzyyUrArEird7zaxEvd1t2tDlR73tdZyl712gyXv1/vv3x0nw04Yyqz+IIK6bn/CbAx15b1zDAvPHvA9hQCsoxj+odM61Lz9USqvKihdxN1Z4QAup4qmVZ+YqD4v6hMuMuxal4qOqQCO4/x6ze259+OT3D3NXtKaLzz0qXZXbfqaAbsph1ZEgXoYcB61Q+eUagWTADgBZMo5+tVghYrHm2Dv1oaOvtD3ru+Lx2irwMc+0t3HcMxDFWuHir6/rzFHREaYMt3TgRnV9CyMPwdqREZh6HEeFpFqgnZugQFJRrjvHapa6Vk9eXkUenwKn0fboNpWK3dVuq92UwMi6iAFEFGpWlk2zLKhUHeREmqmRyBCMqOyuYtCZGVBtDsaVG5HoxYRGVmzLRRUs1IFjxy+BahRlIeO9dPAFCN8O8d2F9G97vCVJVUWvvaumxVFN7RviIdVgcyulNpufiij7DwMeH3RxuAx599ZP79Loe2bJMwA2mq7h9lmofqjQ/+heHRsTzOF4P4cnW0R0mBUuzdTpL3yMwtMVAFRhQgcU/fH+C2zKu61VtuogY+h0Bxl8+i57cnaUZ36dZ4v992JVkalqqlqU6M+En0TkWM2S2l9cEwcZ9k8Irph6JHH8IBI+5ZBRSt2hlc5amfsta/CWOtx6kN+TD4+xif9ypklIlmCuilsaZiy2hg+Mioi8UBG7+sCTo/bzO77VtXv92/bNsfRFJR2wkL5+/s7ofN2SoMbz5Clhlw3rvffFceHn3ePeUaaPke6sKU/go8w5R8ZGYyojPWdkZUeid0EhCRVI1Ym1tpqCjIz1k4RjGdQY2OcLkuIijwOy4CoHOfRuTI2jwgHsiIpqDIRLUhrGNQ0t+/tqsfDz6lQaIu2W0LVltp06mGZubZXFRkFxq6PB7hH4t4UkQr+3gvVVM0P2aD8uqGmkTdpGRV+tVsFRRpUeKoyRpZ1GgPFFdo9iT+oV1yXmz2jzMhY6/6ZbVUKJRGhFNDWegBDUyynxr53tOstn3SbaPfljwPFDz9NfsyFIuOco7mx+MgGoRhj9unpvlshGpF2Xd6a77W8hjX8su/vv1kd3VHlmTXHea/bI7oFH/rMoZ7MiH/M85qe+f6GB9aqj0PcH9B3qEaGfLwTH6eyRv2nOUdmmekcXQnUnALI8fpLmK2vMzPKEy9neqhoxaLOLqDPsyE8VVHqRMRDZX2QnI9RcMWHhZr9zx+XqkJEzGF4zhYUpB4jmJ9KrzlY4tmngDUXFYxK7O0kCpqJykAp4EKjkBmRAdRaPocCkd7zkA/VsIJhESEi7W8jrIhVxfveX6/TPVBcO36N9PYRQ7sRoXnsAwPlvbp8O0X7xJlTCUax8kIRNJUys2P0kaf3wk9QlwH3vaZKRHoOoSdGI7aNEGQ+8BdKo+NbbpiiYlNYZUC0zaiZfZ0aUdD20tc5D+qYIqjo8L8fsGgOAeD7bsq66BxrebSERdr34Zhm8wDwS/SYFonWcLfx9t5OtFcXPJB5A3BfhHQH6BFVs2FQMu08TwANxbSrj7uDY9ijue7QPzPdMQ1PyUu1AbRruwyhjtc53tdbdTbCQ3FVGcN61X7sVOEOM0Hb7rYaq5JMZYH6mbWxnuikfzKfVrHUZn8LIocJooY+5fn8SNiswT21afIAe2MYmUpR98xQI5A9gTYlpzUDsX1k29jQsz25ikRliEKEvc8jIFIVFZrSzm/VoGdrzXpw1wO49DKVeiRaZGZVQlTG0M+0GGaa1Y7MCRmq4g4zAmPv+LQDAlCU3CVKo6pgjkFi8JwG0XGGK0XVrntPhKoKJBG+XW0qQTVGup9mlrVa1KsmzUdo28ROG4tAhnc7oOKRNvD//mNm1+3nGBEQwZiPdc+Pl+gjTMVDxG/fkCc3gEWsgvbqititCfE52pXQ9D7mYeb38qwnt2HvWutv8rWjhOnuymM5UdEUQ9WmQnyJTgDneT6RKB0KqONHamNmpIrQOv9U6e9rd4ooCUq2yYRfV0MxKq1bK8s7aPmYjuM8Kop77bXW+/2eY0fGedh938d4PIKyVni0MVZjbdd7q6LlpBFp9qErl33usQJN9Glt+6geykaUqaNLFAR6ZUfEHJqxhh5KX1nGrKrO6kO2dQ0aNAwwytCmLO0Q+EwZ5dm92MPErVRNREUsa5u93N86zjFT+RDohVnVI0mtzCSq+lvXnyiDH8eXJjKhtu+73V/Uy+OPZUY93El/v7f72Pf3+45hagpwvK9LRSOzYnngXlGR1ALkBkT8YzWuETuyI5haKpTCfZyHSHM9QnlkLPe6rqs+FcV1XRo1lKuYmfftlMcR8ZhwN9+1vMEo//37LaqPWjJCdnRVs1eMmhRGUUuzWNAs6WDcKjd75OCkkRii+OQM/NOORaQt33soFKgAz8grEx7QihTuXZfWWvdeC8Dv3+8xZ1/ODXVc1xWVgFbWEppFE2rMcF1uimPOJ0G2bR121ACi2AE1n7QPHfMYJlEco5H4PzG6xznjsdmRNtPtVhG0cbwgd0Seh32/26k9K71CnwwBpiCU8B09pXra3PLMI9xRvmljZv/zjBCtDL9XoHzzoHZ4S7jv+xYzu9cddd63gzqndKfVpG5q7l1r38cxPsz4KPhD2fcdge/37+MYT2rKjqpWmr8bgd1rv16+174qzY4HNV+3in2czNnUsX7QD0pdvjxV4T3H4mhkzBQkhlBEs9rm2+7NY07QjiG/ARs9e85Gvf761y93B772usc89ro75aDtdO+dx+zfSJKiyoSN4fsys2PKvT+SGlHRyVgi7XAqP64zw0RjJySj7Ubtw7kvl5+BKsfUShmmc861nvgCrVn6HlbKGlaPJdrHyasRYd/VllcpVIWHG46GNhqieGyiZTy4KnVOWTfMuhGf3cgex/yN76/XfL1OpB/nOcz+tLznqyo0Sivak6FKO6I4MpR4iPGArR2muJb0ULnlFM0d6CaGcKRVpu9Oe36MlNqQem209NZ9tLdKl+Z7eTu0kHHh/PjjVJ98FR6f1+8xSmS0te0nbEeSCzJ++As/AsiVJQhV7Uuj4civ81AzUMc4TOBztMb3mEeVt7UBqa+Xt73Feb5ECH5/vWYb4Li/+q87iNvUxMacCuoAK3zMcZmd50vtjshWFWXSlBQ7pv6YNGXmOCxitKwnIs/YUY1Frs7czsAwg+h9r179WYKisO6dGRtjqLhHAfoTlHbfq922O7oifBVkCKqySqe1ujrUWKUiShNVuFvXh8cxmyj2M1IQETVjaXdEEdmomG9vygllPD2cNLcaKnrM2dWpKeaUjIelk9XBTUMVEl3HTtDmnFW5V5HhCVIo/CH2REYDa2ZwR1t09oWJjPBYQEs099r3vSMw7dGHXGa+r73r/wPc6xHLV6kZOlw98rnEgBj+uDHEZw4ARPvz2eiQQ1r3Yp1yQ/Zo0CAalaCRnlm+o61yShwYrdvoIY9QwxdsqvqYo5sVpPeAPVrVZ3qXi+g8TCl3m/slVSikDbsvN0NGC+e1jSx70JMVrV/5MTR3hBnWvk49K2NXYB4/xtGRQUb4QobNo4XLyaqQCGS04QDWvUHtUrh5ix4gJaLI8KjwoDJju8P3VZgNI7jf7XWntL388yZ5ve822X5kgbmayluxlicvVtZ9uymW5xxzJyKXmVVCFJlRn3QmEUEZfiCO4gPJu2eWPrpP7wSxgomUSHtT65hjjFH17v1fFcqyOVUlYqloxo6cxMbH7lJtMrNK4OsD0KWwyDaRKLOAmGg75vPx96wHK6c0weRJ9MlYvq/391utY8IQlZHo2L8eSnaq7x936CdW4plGqHb8x3MFmUJVe08+odRZWekee5fHFRGoC/hFYWTsFSL7XqXKT0LPvi57RMPtr5KZVE6lO5qu1D1HjxtE3ARq07dnTTJEgsxkZFpFtTTzAbAEEZXlze3e7t1MZ3jayJKIEG27hKiw0MwsG0Tin1ljj1dw4WEaCiv1I/vXrGz5y+MfV/FTU2Y9fUJXk1kCWtaDkYnOqDZQlcfHL+xDxQt3+n4DLxIDHr6y3d2a4u+jq+c7q2pB2dh8z0Oipypq1LHWgrR4X8arp7/txzR8X3jvOScqerccyrYi7g3TipPGRT4OMb7XzixK/phhRS5kL5SyVh/nXhtmTQ6LTMhAeCG94f9jzhbojRG+8VNpIFdBOkqaWOECCCkfCu0TBlMlHqCOeN7bx8iV0nNZgaIifFfKGmziminCPTKYbEOb5dl0G0pUFoRTubYXuvKEDaOOMaeqRaQoxjSbxxzaldtQNvcM8Nf5+n7fZ8bXX/+Fp3q/AD2mJegbw4q01wsR+OvX8b7V3H697Pfbj2Mex2kdx4L0Fgc1VlGxk1blBVSWSkTl7+/7mNofg9qh4Y8bntLX+vj2VGI/XPnmgX2sTCEiMjvLYKKiwwFF8SQ6fVhTfVn3//e51STvU4/Gwr7w6zzM5lRBZoJjTh/z6FlL23e2q3Ar9No1vvl1vYsed2s5omiGPgXMFBwUHuOYY/qEMikWWUCjri1FH/1um6Vs1uNAtnfnodIRyGvHRJueILOqbharnJLZuSlZYBM2vQHciv3INV1NH4qrljz55L57jJWZEbh3RPgYuvdqOdiHDVaZ5ZEgqsKUa69u6o5pj5luu92IZ5Z7jSm14unhq9pfw/fdw6m2UCez6UMeiMihjHSik0304eWLgKPloBnGDBGdx3HuRDkhpWpWItJuNyBUn8Orm0NhdalTWT02RjnwcvfbzPd1rwh74p/JqKjr9sgw+32vG7SmPLU/2nM2JaVzXfstjqRYp8dmrMeIXM00PSLDlw2LalKwzTn3dpsHkcdxHMc0f5DQyisCx9DKqYohfL8LNJNo5whlhfiOB4Pv4kFEvc+PCjKRnrHxj3woG+buuL4j9vtzL3fAyXU9X95eC3hpVIvUztPX+t0zINKo/PhdP0N1IaIe968P3cAiWqsq/uiVyv2jtllOZfguQXrsHQ3Mx77/MnX3dojoHZtAeYseF2gtFRMdk0/ihogAu0VsT2Z1qyulY5GUjDmlgldWC8ll9CF3mz7sThGAoymZvXmOY7bFC0mNJCLiiWkR4aAOU1EzO1qwckx7bLr7YvxglFSKTtVtiUxLDKpPVIaK8NktNuew6/Ina1DFS01HZgESGSbWXHzBJrXCOhdU0/femXlfG7XHnMvz+732Wo+ZdrWZQIjo41H3ZMyMH5S8G0si3c7jFFLMxnW9ldYCmohFPWzkc5HGBuRZOAnACyW0yo+9aWZmacZ22D/y0BM/3xCfaPU2H2258EdJAGEouavH/ozOD6b8w9nHyXamtm6sd9RQPB5L5cfQ9iIA8kPYtJ7+rnt/SO183v7jybryMTyLtZcp1lbhsdcW1u/vO1NM4bHXju/vdz+LDjSPXRhHS23cfQyutZQtELHG3TyCSg/AF1Xf3zsy5jBhzaGpOCdvsCoawF3r6SBRHUWcWYJKD/95jPlY7z9gVKZWsSIyBR+e3Ie2AGWzA0avV0T26YuMpiULQhnr0amucHYgQVZWZlWudZFnS1jqGdi1v2cKM0oEW5g7eo6pmd6kS5QnGr9yZVZVBBqo2VUAPBYy6scZbt1//77MbO0lwr1W+AWOm/6+7sTwuMNvDwhl3B4erfT393qWh+rydN9ZA74yojMkydir9lodgPf+fpPRtpkVtd3DfRyvtoWNglVEpG+fo0npTwA79bDai9l8Xu3oYpkiKUw1E01rRUTGvtwbIdr7QRg8ENdVsajax/w7qrL+BIN2YPCOHpCMQY9c+36ComhkuHc4z+Onsj+Whj9pZ802/6e7SfMh4tMGjfG4pwgL49XQR1s29PzuPMyGCeq//usvs6NjHn/9+gLw6zXvbeFvUqnRMsUxxw+DBciH0iPa7Uc9xgSjRRWxAsgPRvx40fwY6w7l9t1J8aRItvDyoall/WF0TrOKIzLGPJudyvYtBZv0EkFl/Ri3aGvjSS96BHb0rDyhbSnuEZ1R4B7nQaHIUHdXO7tE9qza67r3MbIjGrLchidGVrW7UYK5+lNHfIzJKitKVM0U6p7FZrnN4zRFFJV1in59/RpzDJP7tvP1y4a14u91zP/8PY5pY9jeX0AC8td//Wtd7+2vjJ2gO/71r3/p9+/4CDPOw67r6h6pYlNHZHQvKiLu7ICjVWxMYTzun16lnYaUWeHL3TPaSbsq7qjsGaIQ7qGKiJWxErivey9Hecd4Hnu7UuwQAAPjEYDryGg/nTXmgD/5gSTBp3ASF1WZHdop2CY2GoBjFY7RmR/PWhCRlGzqQUcuShTADiRsGn3uiKzIhS09c2liYwrv+z6mopDh4e8MnccoiDuOoSqzDcqV9cyVP25+VUDZaPpnfbe6F7AoxKdG6lihvd19j+PLnuFxsxXhHlmxlnZpHoHlratsz+Z8WC3Rh+XnpCwCYaprrdi3B0YA6FHDOaw6At53UXjvOJ7kuZyTkTTTqLNqH0Pv5UBMkza9aTt8YR1TM0s1my5uClTcm32FTqleOv0KgiJzKLfXo4Llk9CDdPfOaAr3JyuyP1T0iA1eicprl2beyvh+3+frvN43qeveVW1VX7+/bwBR5p6ZOaeF5/vONqRoWvH9/vde3jqKvfYxJLM84hDd7vK4H/xptZUSj5mpPnnptMqKgKBAI6+o8dHB5Nrx+rJyV5uI9jDvw8VEZ0M+qlCbFLHONu0IxhayuLt7WNG91UbYbeMXe6c19zU7vu4Ti/CJs9QIVCGiAHWt5gU1aaKi8lEqfjg5HRElFMGcopRj6I6CTwDHjGPadT9jgQ/fWFM+izuqLZQ9ERkD9pj4RWsau/HamX0d+WOrH2FGQUWpdWwpLTPHFDOspe07FJFjWPcnJEXmGNZzIgBsB81Za+1OE2uPR1SMOe8bKs40leceQ4Vac9Mxx3Ee1gcegIV3G4GR2TKuhOTjEPhA0j9qL6WESlVSh0jLJ9jXZrPIs/C4OSVaxNzBTyIdQgwq4f06if0QME0EtXpqrqxrrT+x56JroeDnafeCaXggwSpdK39sp0jrQeozPqJn7HB35loCeCfHCKvP1lZRZib/MKyElCxK+Rgksx0hm7dcgUaZSWTrYNw9kBiZmYEBVN6ZFkBERKz7dmFbBSM6hms8kG7jfve9SDNVbK/Wv/54+AirNaNtFTHGgfwOxRy22yYtYGYbHweLxlL0Eeb99DQiFNTKUGgUQe3kJjVtjsZy/sGAG6fUXM9330xVADWUOdiDmO1Qmx3qUXh47e1+Ljoh8SO49mcmGp9x23gc2BYoT5dLReVuTqq77BWYQQLU6/LW7BIe0aKUIsd1+5jsD94XXPHJDK7wdv5w10inVVXs7fWBt9Ek2TQg9DFW4iMUVhFWRCoDFVFTRAJ/xOPuHvVSlXYObTenqlKEe1XRfY/B665+AvLY1LEZjcDhHr1Go7KiqqgKpQCYQzO9b57zPP+Ip22G8zi/SP31qiiC/gnXIApR2XB+FVEqvSQK4X7dWzuW4icGWK3NKlvYDvZobD6mKQ05HgdoptYeQe5+nEflPs4j3IFUm5HwYRHZfmr3LXPMKhnjqIr3W02tg+/b9ERYItZMIWHKY9DkgJnokB8vO32ankbTK0tG+z1FFOVTPWdWlYGW0CxZe00ANiqr2ETLDp6RzDym2hhNem5OX5cc27NN5ddu62BrzT4AkfVz/vV4pS2Is3itWrt1cfr+fjc1Y68dGUZk2n2v1+tVpdq2+qj8ZBIqpSdrzQZxf2q5j7sTqTBtR1H7CXRoqH0OpRgiAaO4mXWdoKpV1TmTP+6oa61+nb58hOn10Ps8kOiRkBqzreAKs+GOn1GXCFvY9ZNI25Z+LbDOTHev7CxteMhj3QjsXWN0IHFV6hjlUeFF8t69Q59hy97Vl7d7mD1JRMqiCPDoAR4/wZ4Qa0YGaMKCGJhNiDR7nS9UFJ5Jy3joW1wN51OP+QgGe4KgvVhJWff7x5q/9zjK98LaAZwNoLm7SXMTG7jcY0pENsk50+7bUR4u4esjD8jKrIio/2E1ifSh3CGiA2zE3B5tXtOtHOhok5+wuswA0U56UdanuOo4zF7naAC7eXaqAm5VemCMPn3zyV9H/EzEvNIMlXLf62Es3U5h79fOFW6QFCBgx6hm8nSay3GevTS7CTZrx5RxvUMVVfXIQBlRKcIOFOrt8b6lZ+NZWCvv6/7442EvMavIeN/xpVPhmRoeQGSi2tbYPrZKsX0D1UlHqPCW10WIINjtRIKS4UsVovMxEXkiseSfhpUNh1flj2AkM1FlTFS01YcQERBEA8pBoEA6SX3iXOXjZl5mCngVsuCBoZxzrLtD9ZjJyjrm9FgdFLyjqLKWA1ieHr7XVtMIUJgPn/5qawxgkxGxMjYM97pV8ffft4qq+jDzfVcCeVTeFbVXkVlR+6G/PDu8s+n7IJiMu++QsM4k/2H2t30QkMhqSd0HT3sWdmUPBw1iwGpAwhRqdu9UFcD22jD1yAOI4hg/uZQGwJrQn8/8KzpLS8V9W+xNoRlRu/MR6hOK2MKX37//bomDiqtp5NKc0oxIPtniVPPtbYJiw7BdoG2mm4VzjmZ3NuwV+/KdY1j7GQK+3QE2zzGrjbazE6N2FCDP/2hVBeocU216QClOE5XMnKoAXofV5PdFlZpThp7bbczjE8UufTv1mHZOwRy+twiz2H6Je7uquI5ORtlbVUWOJsaclR6x5zg6bLSylP5zYH+c6vCMseNxnSFLhciI4tprUjMWWb7ZWb9kNC0HHDtqTlGowwsqFEqLltIeHw0CFGEBUhCRKMAR7lfxr19nM/7n+Yt6VNwA5nEMG9ctayeoZq/zJce07/cCcAy5P1e0WopIZXTVVPG0Fsq2ZxhNWgHYUMEz7g378Q9/HNJNK2tFG+d4R3165fZ7r8d6sNOmb462e/i4fWlE6PqOiPteqqz8BcD3e69X5JrVfMpqnGc/EpR16teux2okIk0c5Rm1XR6f+wS0IwZkiojpQR0q2mn0Y4zv77cIq3SMFkOCymkddAwRnPNxr68sNSMjUzNBb1lwL9/ukKis8CDDQ+51mwXgLc/9qXxI900ykPBo8sZCUpj3fuP4V8vPf8zTpe+uyl4QfZX/3ICt4QL48S8wqsPRFPbWR4uwYrWRtzsyrv7RHqqGJ+FI9rNDkai9HJR2Eq8CiveOvfxJgSai8jTba/+cahnBqV0zPTiszfbBPI/DxmxDkXF8uW/AgVfFhhyi/vX1y2RTRkddANYN3tMKM9Vm+ONuvb0O00YfMkzUPLzZZmvdEeu6vCGEMfD9fT0ojX+Hx53hu22Nf+2109QElXckWq3xdFPRlYJFLWENZSjMTBWqnXXyjJXATEaV/mR7qmhgRTwy14qg6toryxrwSLTv0h/frkZNfkiTQukI0JvzmHav+Gib8JMjkSV+PSV0C9+zxL0qKxFk2vt7t8dv+4TayIx1uQL+dJP0bfLJUHhu7cxYS7M6eKPGZO/4Do4Hn11BlhlQdMec4ttbHGRG9Se4XHTaaNchmMQzXs0Epo3p+zJDh9RWaRSzhB/ZjSjAAd/DLAqP9LtJNYCqZEqzbv4hrPEKr5ptri3yuKOiIhPf1zpef2XlYAUUtQBFYXmYWfORPGAIQEl6hBmJNunXfmA9xXxaiPjTG/zc4JUV5deF1mtHQO1hZWdJHw0PXlzetO0+/BqJVtn3DsJJNdOqyIxMZnn+ZMQ3vBkJref3Fqtm5kMTrJKHPZHRVwGo4RGlIKkQnYZ1DKBoQ6KEcnR6cTcMNsz9quo2V0WH6h+hcDcuImjT74bvmv4kghKOOa539NUSDjOM46ysZ4IpCkRl7wVkpXz+Vpi3u/sWyvsbZuZ7eWCvNSYqFoALr7WXUFB7eeK7Ecsn2C+IBtmrtr2+XoKdOJV5HF8qUJ0f6VOaYY55Hud1ezclH1siszFjH6+v17rfYFMPXYTYNebIVGFGoP0f+TGCJLl9P8tXtKIylru0oXaURKTqk2cPPJvEY3UStJn5vvrqdG8E492K3ipVmrDCF6oqs8fY+ImzFZoBDgo7VoSszCKccoQrGV/nw8nZIpWtYVARmPE45t7Nnui+rUgME1XYaFsAAeYzfBGClrFVMa2uP6Y9JZI2qKXDdH/mFUPJaeuuj92GDmWIoaA2weXuc8x+D4dpFAlTk49ZI+je3w+oppLVFlHVoVXRRCdm12PNNP5xNPqZGalCGbfHMWYPCimmUhU1JlZFlaMoUJEn/aRReeUTJ/csfSpp2dH1gR0lIhEgQTowqrRKOnZAZHQMAoDjMDLMSBnjk8H8er3m+91H5N7319ev47yb9//1mpGIeJmNve8xDvfmJo/ren+9ZpZe17uXzTFnVApKdFy3z6HzeDVfAM3yj8pj4H09JlttW9J2hh9TNIiYiP+4bfZWaUveJrhn+SdXcKrocR7cj9KUOtTk69drDDN9AwAHdTz2cgBjNfjV15wwxyejoIcVgFe5KQSPG1RVXVdUKoUdM5NlDYH3jg1vn8A4Zl1XVHgUsQMbFYgKIM3S9zuh9x2vL3g9MkT3BCNiReBhTtf2+Nh02qBE4SARsQ492tg/IrIg0hhOJIa2zYEoGWqjm+BGJLN4DFVFfvIwHw9qUTz+29JxBJlJypxzHiPq3bgakD/l9WPJHx7Q7AMOR0ROK2F1SkrHtykzlJbogM1TrafXe21QK3YDBii/bm9fawayyFbcRxuqLmV1AAqA66KI9PXo3j6/Vul9lbVtnina4b3Kw58mx6wfeDWvvr3o+lLN7ZlpNtZanbX6pOvG/v37+6mUMsODcnWg/KOq48Ouva977fvr9Qvl1nQm4DwZEcFaXPaxRgNguVbUFEXGFuEcmtWRY+7e2Q2a0bW7W/NzQjNjmN332stVvccf7W7yM1wk677a98bWytdh7+sWIXBllvswW6bWBCH3pxOo8u1ViezZS3XwQXWA+HXvlw5l2qO2/jNlo7BjYhO59lLVjkgws/1Rc4tIFqfO2DeAMWcLSVXU4cR+wC+xNK2MtqDZ21/MPt1BVQEo07QgVBuTmakKUORjKqGU1nCKCDDMXARq7Usug4/Rxhzi2xvTGCYmAOSRbYq0svnJI4yoqGjCFbJTF1CZ4TLOqioo4Jn5EGBLsyIyTC2b0mNsmWtKzcNU5xi9MszUtvJ4/brvCzi+XkdEZOkcVBVfN4CvX18REa8zIl/nsPGuqOM8VPV9SUWZKXcIi6QN29vnnOt+N7tuR6nw46mI1prOw8yG+7sR1c9B0Hy4aEnNpzYGdbRPuqocQ26RjJ0MFFQ1k8e0mzGnoKwzKO71OAyMeShzmqjZGGZ9QiT4RMvbqMqMh5/z01L0XSk6HoW2kDqo8xlQz6MVYkCxQZLhoIHIauZ9C/+kooYyPph3Y0qxNjB6m/Xt8f7+zsqv86A+8538YO0/Y+COhIl65rvtztApa8I6pjWz9cfGp8+AjK5/pf1Jf/KkKj1iqaJ9OIr28WMLUPrE8gDKEzimFsM9kqIqG5kRXu7uoFU4iJQHqwb9ySzhqlJ3LzP/MKI3cAKRIVAAe91teoehfXao7H1fUWmqW7TK3V/7vlr+q6YNnM5pzQRJbRfEvhlyL3dhZXk9hKh7B9UyNoSZ4T6ADF+dhDmGV7ltrvvdVDwq173x9XLPVqOv+wbwvl2Yi9nHatQyw7r3wzBlZRsQc6GqNaiZlVXhUeKg7fv9+3f+11+172svo1w//MWGv9r2uCW8T7ZDeQXvHfd91TjAFfZQiSLbvQ+AXrdHYq1sYlv7a7TIZGR4YnkeEmSaPuPioiYqhB/HK9E+a8wsS0UHMB4Lk8ofJ7Zh/Z/laK+HamhoAjMiP5rA2fZsH8abitD9+zgmuPo12+bNzUzhZr3xPnHnPx2k/QDJPZH4maIHggyluRDl4Fw7966svFdMq+WpqicQgaiMtSLi6bBqdwtliu9r/fd/vyJNFWR5dBC4hz9oUVYKxeNunk+BHkVBJEBpfVP2ZFgkA413dTgPJU3hvik0sb6so9jmPD9ku+4xjnN+v5dIdfQ53c/TzF573z/Bch3j4BFzNBujp+8CaGsVqEPVwR72maC67emAV1A8QjR7WiMiWcvDKipmZ5g3h6yy6OF7fyZx1WPvHR9aTntj4pPQvahrL1PtX9d4fxc8ahBxEZohHBMy5ugm4Q+g11Z51B6DAvg69Vr1JGC3sOQJL2zvxzZT6wyix0i0uZuR8aFqPTmOTenr77dKrH/3xzg/HvOOrJanR0bEMnt1CbRD/zmZrzb6FFbldjxGEtu7hplzvt9XB3GG+7I9j9H6w/Mw37eyMtx3ANit9AH84WnFfV+RZ+9se0yEqp1JH412Zjy3FvpFqBQvCqztchlDbXV8BUXlsScwapUqaxwvAL55zONWAJiB1+vsQlNVifTYGbjJYYzY5OzTYe0LqKENYvI45hxj3UaR7fYZcrduJv9wYIsv2jG09ZlIu59GC0rxx3PFPbD2I5/oqVOFr7sq6t6x150ZYZZZhLK9Noa1hq6SoLfEwt07SCrL99ZGpxqoIUPIYSLMBg+6ujAzL1c+obykUlNCADvnRqno6JnaZqEDLcuz5jMrGNkjF+HRaTqgggSl5VMiUmCVuveJ5pWOisr1hJ9Ss8RMUI6S9mtrKwqR1i2RyjXbJd9syAarVMrrw5vKDlkQKvRz+vDDPPd+zgDVsi35fahSkaFqhyaGPbqaHhfPQTNT6kNJiP0JeY2OhesR0ngUwNrpcV1TVT1GJqA0bC/PF/BwkkAjdkdOrJVS3Msjcd3+JQVpaDVNkQUbY62olB1VWRV/WMTNqo9AJFycOpo71IOtLKq4qQWbl+9t5VtRwWrWeHM0ItZeO4umoFhEqkClvesYEcOOjwLzSb3OtEiP2D1PnXOSPxTrNLP7zsajPnbCAfG2BX82sP8PWnh3+Z2N1ccBaD/EVbWjV+p9rwIpJWDXhJlOMRFtO2tVcbfMEtFhRlKEY5pStqsN69/44VpKxmMPfu+H8f6+vYGjhtiv6y36wIsPUrJmRAjivsZx2H29AWR+/f799xxHVqqiZenX9f56/dprZ2XGMnMK99rnea69KgIcplixTDWzL5blLj1I/sH4XbndK8KhouL+hA1XGvk84V4PnecwMZ8eoHyM1qYS5apQllHH0QlnhipRgbt3F9K/cq8Njoz9YTU/FwVSmymQZVmrxVk/3UICovy519owLHEq4d6maGjDSlBQ1oErc7qgMkDi16/XHNY+VoyPyDpTZbbHemxXtYiitk6g2iwKC52ktPAD8D/yUyoV6hGmI0tMDdpaZHmiR1Tf309U+OawURGuwuaukrhXVPl52POaQKz7mL49RChEZlVs75En695POM/acUwonynKfT8hu02rDI9plhki9eRIgx9JPXr+YMQOQRV87V02IqONXvkjG2ofq4R1Qtmn5myzScLLXbsU/SDUUVXHnBFthWsioqJdbXtgDEZWS8sy8/WaZqai25vu1TEZAI9WNnfR8joM+KvjhZodRMpxHF28tZvLx/hMqZxjlj3nt5RX/UGNj4EoSsYYz5nSmQlUbbkcmZnSelR0tp5iry1ar9epAt/3cRxjjh8Mv3vIKFLN1v3uN31O+r7Xsr3uZ8KniFyRtIr8yVmhiRSo1KEyQf64UT+kVqyO81ZaZCA1M9TMHaZPzmKC+czLogoov4rn2b5x/Gzix3Mv4n/EFUfdy1NNo3itysxTm6YCiQ/cJubhnQfcd0JEUtSiudJVFZnm4coe2UgnzAF4fQ29P1u9RAhVttlb1pwjxhztLD1mk3hBeRr0rncjiSLKd3SanWdGfEwtOzXWtHmjj/WIjCT5ZBbyqYg6DKHpelPbEzw9AtAxqC1rBTr5ohV8H8mluDuRe3sX6FnIoo7H2D00VR/PhcLxmZs+ZgIunHMuYBxynq/jjDZRQ/naYvYSBtbjQwiKWZsQ5lPB8ylNhelJxAaGWQvN60f+2u7WKtPUFpPU2Yu42LZI7hoZj6UZvGegfTTYOOu9SzQij4GhREa1C+I2wDo49L6+AUTsllBX1utrdNXQlm0d9dnR8AnoZ61ApDO4Q9sdIL1D+dqLOALkap/kCnCQpLKJoBHZanH+iK167NyH6Id12DQWZIJCFH+g/eocADYz8U+xVMUxaNYlu56TmTan+E6lqCmxzIa79BmgfKyU+sgJ6XmWsmRlVj0mis0Pafl8b7z3936Miar3QHuDOvgcQI/1/kO4gHtQhvsCtA19PdCIhTxJzgpg2hPu1IkmIu08nigzQZZQDITpg4M1ycfdO8QNz7AZ5CN60ozwDWQVYM0oLhGKSGQXpRzKP0xV/oyi7SdQozqBCibCHxO+rtyE+f+Q9bdNkiQ30i2oCsDMI6rJu3f//2+8svtw2JXuZnjZD7CI6pGljFDIEXZ3Vmakuxmgek5GVMjfv3+bWU+Q9rr7rHUoHlUZZzs29Opt5pk9PA+mVmmydYPa0aDe0hC7MvqM+t3E743PGtGjrAHrcyiZJQqUKrc7IFVJyZalqklUqko8zNg2ZjNaVKuzPKRFX6blGLT6j1DlqsP6N2PM8alNaGObWrT07Ke3V8MiMlQum1fEUl7zujq8WSVduLbZ74FORF/DpCAGePwGMAxjDtHp/pt6mS0br4oNUd+uookR5deQkeFhwO4LTR0qvKroIbWw4pi+jwBPmBFVUUp4eaZGIWLfj33Gsw5YVVSBWO51mDas1it8+WfvXwfXGhFKRFWTPqtUNeofS6f368p0DJ0mvuV6Dd/MrGG6o77SFNGRGctzEv1L0r7XMTLLycoosBcozejclU/GleGo2PvAxHniQ7Rhvp3CMWbELrDqzysISFKyKrPVTJFZpBXElKBtd+ro20Vf6D3/bJ2EZcquWHQvR3R24btKSLN5IR0CFYV3PNsoGj1hyhCpnj18jzFHY1FZNVuJgs9RsLJwnTwIJSGSuaR3dqKt7Opld98zc8cHXNLlSPddvsN3l+tPuKuZ4Z9Ad1jG3oXamb96JP2Vcdm//np9Vy0T/PUaVfHcbmN2tP3o1or9UXP37tr09UjFI0C+ulP3hXOQgby6EVZZkYuQyplYKBdGn5XXvq/XOwJkXKYr0/0M8lclM0CrAIXbVxYvwP2piAisva6rMyzcu1DYR9NQY0SFZUDVe1q3PCd86QDSXbsMn5k25ct8zgMmur9cre7jeGQ/riKwt4/J3jhmZk/M1JTkucgWzRQCE2RKtxFE53Vln0FfclFZJWam64mMLJlzvl8D2O5uc8JV7Br1PM8ie8B6oJRrrbVSiILwOzEUtAP4mP0QSfY4rX9nqh26qGvodm8HoSp2iIoOk3BmodtFmTmHqYoBqjZrzXFOz9Hflk+MyMYL8A4XSMsA1e7Hx7RXHc9nltiYpvjrr78adfPzO6KfsIUkARPxlFRx02uX9qC26UYfGznMpP9yU9neblK443UNwzgNk4F+FmsrCPQiteJRM1Vdz8+cMxIq+HmGqY0xrDLbAn/6AdNmXESO+UZ5xTUPPhtKBZIiPFjz6et5NkS+/RpksS9/p8GUqzuWWajYqsuG7V3P/Tz3z8+5We5nxffsG0cPvJXSUdOkZcYweb80wdd1VTnJMS61iYwuqVTaR8RwumPnBPUhWqKVoYAz2oGuwjM+rzypvsGfn43ae5eZeXgPz3g8jUqJrz+TCMAyPaLWjsnmoVcXr0Lkq/NQcdRBEwV3LYroSZhjVIbz/v1h4ffVGRnPej5DvQQLzKr8yIKAjKqzqPwjqI0NHZ0jIKJTNyKsjIxmPFcW3SNL7nUy+nujo+/35wv+pmibpriWfCtKvdI+iJBYfYD86w1VOLCcGft+8HmbNcC9SSQ5mlhDpWQvdyPSvuTpgs2rNRY9PTt7EcVnotiAkiCJ2oD1Tf3+uUVn61DDTUU/3zofZttdNPubE3UwCxXlgEh0JGFlyZzy83vPOX9+fq9nv2Lfj4d7D6p/fv90UNvOnQEq2/ePB8bUz6c8BZ0/PFTRzB3EVzfbrmZ3jzkAvN/vn5+fCHSAKWNHICU7OAWaOyioOOniPAmfIqE2n2fZEJ1Gqplnpql1MXIMs2FXgDo8bhGxCm3OJyBaWmHj1faNMXk6fmoA/v1/vatyjEsYmblWk06ij5WUP+S8KpoQpqo0s8bEZi1Vi0wz8R0HAfQJaPyjB+Pgu88GUB7kdVQiezHUFLTzce+B+mfS8I37IhhVp4IY1j19SlE6HHHu3wdSyxIYFOKlisjcu9qcsM9kQPu//p2rBx42bI5eqEtFBRGxhUPJZKFOuqljJp3aaL9dFt2f13VlakF83xiWsXbpmJof2k1nhKrC990Boef+neEVjGJm/VMtoSo/P4tYEdf2BrQgoq75h8fzhSHIp27a9Tp3v4Z2rjJje9da+AAvi0CmV2kbldzdHVUeYf3XTzl0dlEYoKaM2LtotPFOLJV5Oofdc+8BTkCFggu1swk5clLg71+mrD5dqGLMceVLRd+vq7frNmQd2mGQ1g2CrheLjjvvb7RB6RFH7xN7b+WO+vn5CZ/Ps9wfQJ/nvq6xV3S870B1ArrUmde08J+wd2Z113bM7HKdavV5rCpwouT9XVYwj/ArqzIqiPKKXfmgLUY2e1wR2Y/n4EcnlXkussp6tvcapAXgwqScxRBgc8pzP62nJ0O0CdTHDZrgZ35PD1yXmNnCahSfqkZCbZ6xN6xiR6kJ5jXIVEGqCzPqM9IlmhrUjzPR2SCBFle2vyfT1Cyqj+zscUWjSjp6SGH/4inlQ6HyoGVl5+T+/vu3sn7fz7///X918DuicXcL6Je/ny7YKQr7B6b8aYoLQR3XL1OoqJrZeJmZ7/5SRYFwF4XQGgcPYId07uOwt3je5PbXL2un1fuSa+Df//63yv9st2FyJZ77+fXrAnU9FpXueF3mITZat5Zq+g0q9Uuq6exZ0hUq4LrO0wvzGgfzSZ1jzimoOa1ccU3rUO6h7ph1wpnsgbGrvPIYJjQz2vARnytpj0G7d5cRMK+zHKkepImqqr5erxPq/JZlNvIzET+r8shO4ASYCeL8mHHuwWiMwDmHVHtaxcZrTOt4LMWQCdh1SUQqa//D+ax2XtwUinZ82nqQ0t8l9+o/4Gcu2RP9VjzwvkePHVEws5WJUpFONOYYBlIVlnjbmNfcDtQWnRnYnp4dSJYd1dSmnt/v5ZQBYNgxQJI5jaJNrj7JF+fds/yuyH1gftkQS5PtYduzA5sH6JvRgV+fFB2VSZH3X+85ZttY3u+/gJ+1IDzZmTGtIN8Az4Fb2T8e88zlT4WEbir32spWbzXC16jBD5ZPVHvlcL1+DZNq3mY8AMYQWzv6sq+0Z/mzPBIF2d4bwRihwnj2kW/WNTvZ38UffKruqkLkfeS1qOwsXgyz7ciiWvdWswt1oCpFdCQMjB01dagJKaKNLZjd7zPRYEDUVAqi+vRrxsbL/cTQx2BfN1/vq08aZkbvbS6/y+Djiyn2EV9ZqlXJz0DQu2z5zbYTaSqbWSVkgZ3J0zHVzCLieTYrUVW5PNBdBQ9Dluc6odx2m2YzsHCecNpyOAENzE5HVmXjUq6XfmD5bwAsBw3dgQc6KSAt/aIWaowjt+sXo7tlybMjaldl+AId5SraSZjQUwBA5Xp222DV+mcne1clqCd9tXeR6zklXFfZHshYt0d75HsJICIdhvsiskU6ZVNDcm2sx5uLrNrC7X5L+xiXux87/Hr2c/efusc1e21gVOz7p5p17v5UytrbbGhhdnBms8I7z3cyc1mmozVqXZfb64kYGXte797ZR03buxpp7c778crl+3nWM+a/1lqVtfcTkZ3mkw8Cv4UiHSJS7dvMATL33FrmUJ2iiMIw6+y7dU3uux6u6I2csNAHwZbhmGVmxhLRBg819IA00z/Q8PNNVxtj9N/tui5QkXG9LjNbu0Sodv96X+v5icIcU+mU1zW96RpzaARsXhoVGWZhdiF1mBQKsKzI1MgNlHIvT2GtvQDtDGmvBXxHIcmC8Ai0s0S8eRMf+qiqRmFm5udohIaKtSZ5O6L4rwkPGUPbkxjVBkv7ytS+eFMDzHYjVYgCpDKj5EBIK1amMPfaY8Ld9TWNokxPqM3cDgqYZy3DHNfsN3lv1uaQft4/z/r+B6qpSmcTepcisvs5C8iYggyIhi9QzmAwWYhupZ0MQXlEzwOr4lGWd9OgyJM1qqamis5e/ogqQ0uUjOt9/ee/Occkw0zvu6gALWuRkUkP9IoT5b1vjSzqGKztvthTF9x5W1vFUaAOFadM0V1tAxx9r8oPyw2ImJd36du0DbWxV81rVESAeWSflHL386PtrEFrVwTVTC1UkN2IZ9wuiqblCD/nP+DrEuyDw977dR2s/gd4dJg/vdiLgCr+/nka4NGTirXW3t6+e/yFvW7T6368EwGEbXfIKYWSqIrwMLGqyihpNlGxf2+vqZ2DODZP0yxVldar7NXseH5/7UUEIv3Uz6JAx7SeR3xS/tfeT0N+9l6oyJoF/NxbVQ7aICPK10oR6Wnb59uT7lEZc45+XlKJ6q1AZGFOC18UgtY6ZXfXIXu7MAlHmRBRIiy1q89RsR+YtTc7M33t8Lsjg74f37jmdQD63dBAh15XL55Oj6pcpAgHLDJsmD+qWhFoWe81G9GnURkZ7fo+BXk/L0yecSIAzCnPXW1AonKaoJxdlFQUQLaWL14vW89J71cv5mE2nGLUJjDIqgB1jE9DORM2eimbHl75+M5Oup6TT5Yp9y4584wC/vRcBRZAZ/23V4V7fSc2cdaNVMDIhBiymYSiov3HI61b7dkSDUEwAYyPHrnZTACuqD59ds1iDslS6q7YNi8VzFmZgbZbU1r5ijIqfHs/ZlSPeKayr9odVPYqkBOk2lw7I3dzkwqqKufsTu2Ymggolr5bvIxk5qGzmDWR5X+tw2JtGezw2pA+HBO1u/uigjlnxc5M9+6Cjea+FHH1Wman+5HjVgq6CMR+71dW9Z5oDI1EJSISNA+/ZqmyO6JKzczIIvF623p2xT4aEVpXGjJP5u9rN/rus6q0T+dfKWi4D7Ms8R2VqKxGSmYRxQKF9omgbBEIT6zmSGUAG5a5q0qYUKBciOx/7mdj7Y7Mc+r+SrZJU50FNzO0UIyz85d9SfvW8MnDtjD1KpnXe60Vkeb+mF177X665Mkw0gNmvTnXb7wu81n+rqxkiFjbI7oj13ifFsHfzx5zNpnPN/rVTUl3hwGxekIMTCo1ytvpUBSRygdJKj/RyF3l21NFnx2vl621Kp85Xqi4f/7r2645f34/kaGPv3+NHk6DzPK2p3yfmp0DRTGLr+sgVfof9DVANlOxPRHSWR/k3ovQP/O1fsMEpiRbkIp93C2NU94nlnP//PfMs8sjg2Fq6ft3x6Vqj74oo3xR1vPz0chhPRsZHs8qDffXC40pP0H8DA5DIjsNpybniZPDpCltnkE/ecQ+sVxDd5UZt5fM0bACUCHKtC7gnltEfNZPQz7iRyZI1nmlfVj2992VhhMNPKTAgHtR3I4xsqLYCtrG25y59qeU3F8GARu2161yAfgyMM2QqdfVVfXWeQpoatWrYmF1FabKCYRnh/y0DykHExgeeJ5V7XilVj4eNEDP9AptBS1lK2vKzIBXHz337ooeVCV7h5cF6jH+9TmBMpS3t29Tvy2Evru00OZ1nQju2mEa5xtXZ0aemShGMVcT20N0EgCiubC9whRhcxezbO+ykU1TorAZ13YkOqCwJ9wnvF0NS61mXKtoaGZa81oaSVBREdtdgdg75rSMnP+0hIp1+JRiEZHhvtd6brUOloYIeyqlpkB0YS2iTgMmrJ98KgQcqRlOxjkmpUX170/s0C40fztNWR4eIqPRG0dJVnwpAHu/xvN0fDAy4iOEkDotUI7rF3W3Erep4h2b29szAWZvW5uo3FIzVaUO6x214+PM0xaKdrWu+f0fP5q+XowmUtKENUypxHYy1OiuX0xBP0mBcbLiGRWWWcGwYbnO2cFFMvO///N3o+2r1P3IrSgJ2toLvYUMgHieTenIWheYitJ31HN6YeeNi1Vqc6iI9L97ji+0/n/prQHhKVj1t9X9HDDa2mAqNaWHaA2jVMW8Xj2CqEKVHmieAEhPyaLNC+IRmdHnEKjo9uq+BQqACtMjKmut032pUt8OHJnKl3fS6hd3p6SHsDwimiiorP4fjzm4w4wk5zjEcwpfl2XoeW+Kkoa+c6V+KucKKiqEifSI3tyxR0hzXiekiKEsm5ea99N0PfG+5KeiwzwiivKGHbVVkoxma7p3auheT99wNDPXXnPMb6dJTAJhhr2KyMqo8q6lV9b//AdZqarDNBOmmENAULIvJPv5fT8OeDcMG4pqiqoF9GG47RLIIjKVFRG+7z6sZ6YISUREZJtAIOxfSzTQpcFHotMDKhVAVrzUvv7gDkF+0ciZkC5zF8iisva45oTYNevZ8ddfv1QQLs/OTrk3779l6cJ6vd6Z+b7s2b2JyJ7n2svMbD0/jXuZ4xR6v72fjMqiNSLcPSa1sj70yXZmie87/JSwyMb65XeXSaDKw4HUHfWaHxBKLIx3U8KbodLj5jZyZ5ZJ3D9PxP+CS7u7vQ2h7lBVkehHtYiaemOFPoxVVLEXQ8Kikqw5TrJVODPDzPzMXtprhk6Yer9ndyXYTHZ3r/xi947fZ5gILcorBeydf/N2/pcHREX5WfD2VGq720dg2reaqs9FiM00tDhR8Orf+VIHekSLDP31633fd3cUVfXbJutJHRnuA+WF0cxdVV7X5dvHIFCkEvH79kjMUTuqPtRsVRuDSghrTrl/2N/ennEMvT6NoqgsU4QbgPt5KsX9x2xkHhHJKXPH+cSP2ZLj3REdq/5wEeUis5oYd2L+tfvepYMRoCXoAdPDsaysZ6fZWvt2z+dGt0eUuP0BLlPYuMaksrZ7zxLdacb7Z4kZqq8E/tmlMhmtP80KwkWo1GKgzA4D/3OdNcUdSZbqUJXPc/EwwCiJjE/isgqoVJ7CVK4TIUOrXLoheZLflb5v8MzyGhX4R2WXShmXluoE7vM+pTUG1d2pA7CsjEoKzzj8UE8OqS/8jybs+4a1wbNFMntWxNcLxKhoq498eg7aG9y///5dsZt3/Tz79erMa9+kYwyLksIQFkXn4PaoiswCT1qGyJ4wkFKsxKCQ5cgS4Te4f1p1xb4P9M9Y/hGX+Odu38wCWxWZqqwaNEVoI49hplUN5JNmD5pxjnG931c5AJvXuH5V/PT2sMp98xsB7E2zKvazv1dMCkSVStNe8Y8xR31Iw9c49cB++XxmieM0gNkq1FNP7e1hhPXbr0o9cN9eUR7bzmbQqrTrb5kKSBWVklkJKhHpleLuKPh+fD/ZxMj07mCYWv+d+9AorIryXWr1gSue7H1moQeJRLd4RKFzTncRncosjD4znItpwYyZpaWdVRKtU65hiJqZtN7Dd3Rr4XsNz6JJZknfqtHm9FbDYscnVo7KZ7eZK9qG637A2v1xbDLM0MujawZLWYmB8mdxPdsD4EM5CxGRikqGkt9EuNp4refnQC2VA9a75KgTOFPg9bK9fFr1MUkQhXL/Bv1pw1oRW8X1fLbEHRAyy0ThOMNVEO15pgBTzZAOPSXXb4htbVPmGCI6gXtevwpyAc+zUkffr8ywl1UDCVixy2NH7L27dY/IFT6bZxyBn98//838197u/jz3cz9jjr/eBtpJNQ/zQDbJU46uQYQiYNhJe9aZX38b/cnPALpPK10ob35eq6OlEfmlcjwp293sEvmw6uPgNJs2dQ15XXbj1RNzqonWnFNVRHbiT8XxNJA+dBLg6bHyPwPb/Zu5vfq/7q59FUEzdRsD5Zna5K7jJ29pj7sP5V5e6VXRdG/8//2r5zx6OELdIo2MjXFVJZXpNYw/tZ5HrteV4ZV1+1KZKL/dW712Px4Roqe3r6y+jvt2lCsPwqlvWnu5fvzgVPRYc/BqVx8Ur9crsyzQuQx308w5Z6P6v7bJvaUqRYfNCdE5LBSk2kDj5Cv2Ac2OXzZfQEFSWVc1kjmoBK37NyiQojoERVJ0ILP3PqTufXeWITOfnZ0KHgdScGL3fYDpuGIW5ZH3lT+PQ+6fn/sbNPgsEEoVw3R3yrK59gSJMoxxznvCbBXGmGMgXy/z3ZLO0UgFJUgZ8wLOduKsHTOj1CPMTLjPfIaqOvuDqCntAQIcKDP0bO/Z0WX2bkT16OIEBNKqisSn0MsKbZdhh16TFR4eyNj95l6ZqKjYHfbva3RFhbLJAKU9ovSPPUijMmMJrUIrv9JItnIzIlS059f16TGjdsVJv5tHNKtjx4XynyfvOyr2T2wKm7SYUEF0KMps3KrnSITHfZuN/MfbcO14njWGjhyfireCrLQ59DXZxY52EovIi7b9eCXalvOZ9bbvsddVq4IZXjRiZ/BTUH7tXTa86cEX9b4/ScP+ygMi+jxNjrgPpnxVZDhj7bBh+/lR/SsiUcFIwJ/7Nsmexth4ue+qEglUH+HaFkWQ7oGKSL+f1ZGKrBT9adhW6qisj+Qi8h94guVoVBtYp/np+sjR+IWHiOy1+1shrL6v9+wLyEjP1FP0KmuEdQef1JQVAMwupZRNi7Zt6736jvc0wGGv3aM5lQ9Ppbx97pV9Z1Eiq7zvfWd5d5LhIiZR+XqNZra1c+4wBqlQjGFIi6LZu+rEoiBX70auaVgqvuaQqssEUdlYTjNTtYOMFx0m4KiSLM5rhi9ly3brE6U98djm6PRgs+E0qlDTjGBB229z7FX4aokFqDH1NXmXqco19M4ak5XlOSipgMqbGkcmYJax+wFWJZl2DaXyvtHHwX4XW6v5+n2n59HF/pUtAa29lDvlfCrKoyzrlICoXdqQn58cw65pFy5h9niueeLXNe2jODhDekpD7TtL/D2JCfoqGGRFDQ+oHGhX22J21om3laiCYppZonMqYCJJuQbzNSXxeh34DEy9/cJZMpSREdHQF4qoCJLoZ/zhnNIqvc8PfRUZapXIKPDsIkxAxjEbxME51Uf/1s9zD1xT3Rv2BjV90arSPfCPK7O7Pjv22mOOSrx/icirT2vvS8JtzNFujudZc8peiKTIXLGaEw4O1UFWBPpc9/NzoyI8lbqXfwfqynrWU1mgUbJnr+0KqpD751GFHzSQr7WQ1/04Gb9//3b3p+sHs9a+97J5jee+qzTymXPO6c/j/YTtAWuPQaPY3gn9WAzHvPJZY9g+jr1TJ0REW+qEpapmGmlmsHn9hQxKif0a9ZBKHa/3qTyPORqTqKLPCo8wNWWp2bOiKsDxTzYlheGRqZLyBba515hR4YD/HJZGs+Gx10bthDZD+Lrw8/t3fTZTfUFv+WSPF+aYvVXo7sFe7wZknzpOho3hnhUL9d1YTelr6SearyoZZdYlX1FFgijPwnp+hpl736Xy2W7mz7P3DpUAcN9+jf2sp9PzRJBMlc4V23hliegUnaekwjTTBqoBKsKsS/s3U0emQlTt3eOag1UEQDNFT0syVcSpI716FGvGSFTkXnFnAJgxM9b505lG9Iqg6pPqQbmqdmX0IEaKKEdxPXuYCesYFQ7C8dxq+n6fxUjf60FGv9yCZoP95Ooh4Y7qvn8dvuUecyorz3vSIywSlf6lZ5/DEk2kYxF/vIZz/uovbDt63+/eSJh5nnflmTWEY47IoA5TVEkD2sa4zIzUdrhUbNHxer1RO2NH6byutiLZ/fvvKO61+nP51zu+OadPsDMidMPd6+h00odZa6H659Qa6mZ6Bbxd7XPOhZWZY47rmtGzvnOynZn5ellbUfsnZxqvl1W+X5d1RePsSj5smd5qKWYgFFAOStv32Dc50jO22djPnxXgJ0c+24i23fsQTBE1UTUXNJig+frKUO3cnpjSTMxMxdT0hEypPSNSvXz9FNJdtgdq77Uj1/NYxgJmu8jdeYbPFSQyreNSOJsbc/dkhwVZFW0P8Ug1FRmZWRhVMubVQx7K4UKrqhozXJhUtBJ9KFU004bpVzZxNrKKCAzlE95kgn+WTvr3QlT6Z/fJup1/vS4DbUw7v8w0wIR7TlmPirA7tA0R6mNCV5mriko9AT79uvfMdLt+MVOmo8OqBzKy7x4knqOK49QnjmM3vyTqvba77/1z5pmX/ffv+4oKDwr7eRoZn2exd1C0851VaqIQFKCvSaFROVrCgzYdSMSZXT4PTSH/+3KsomWP0vSc7F2VVEW57xt1zhUReT9u6sBLWb3P76LdHx1ThKBQrmo78MEqJsrVbJitfVMkMv71r1czKBs/jygcPq6JDjOjHnxNk6XPlSyr6iHRUYIx/v08/0OKsrK7LDr2enj19WsAT8SufGXEfa8xpErHWNe0jL0CwyoySDXLcJ/z1Sv3a9pe+kXQfOtgHWgBqsRRzDi7oR6wZjEDQv2TqGWrWFHh4efh95kdJdlwyCyo2gzv4L5CpAlna3v38SNCZWZ2+rB6Fky9qrw//VHMYh+y0ZqCWL2zQ8ra0WJ3s2rSYzLMjl3v28ew4cSqKCB7dtbjsX8Odnvlp7R+cR2VQTmA21tQNHuNnRl//76nyfKczzUGnxUZYVZZKfweHBRUD5g1XjK/j85TdlOMQU19ssyQKSiN9IxdpTx9zWKlLOf9+KwTM+4BTppmLHc7bTchAu6+dlRscFR5ZLj4SP7cSxV7hQfKhH5Ijp3ya1RcZvpB1Cf7PROIDGbf4RDFPpD0b9TOA5CL5JlyfFChVW7jTcoOB7pSBBG6dxBYM909qumijSdSNEBTRVEb5YC3IIc0Fc30b1Q7Snol3DeufsKZGQWiQDlEM4oFRdPvuJ4NaD+eVDTbgKRN3QG0mRFt2jzPMjLx4e5XaZQvHR497pS1l7LuZ3ugLWYVa693nM1dP4+EOAcVEntHeLiv/MDr3bcgsvKvX78gyKhhVDV2u1GH2aj4GUOQ2rq3f8I651CzX509+3NCGwbkuV8JG8mRWc0Gfhb6m1nFa+qXGtiJ0THHq0i9rhkQjTjkLMG2ca292vd4vZ5v5FFV5OcOj14LRkYVuzc7p2Sc1k7lQQn2dBFz/jxh42gz60yj0LNR0oVq1YkIO3/Uk9FVBvuZik8tS1oNdviBBbMRRQrLhcY5NC6pIlTHJzT28URgTlllx8D16YP2Hwzlr/erKvdq4HMJGkJ4zBGx8eGjcO/q2E+426Bvx7DukeHE1GpeoJ6YoYq+3ldnNKjD3U2l6zuv11Vtcs4T1zN7Qx5TWdj9kq3TuWO/Dt2jEQHtsZP0KlTFz0/42muBkgBmjKPgrvBI3efp/jHsfTwxmIUGvSQBSu+S+Lrs/jjLulX31tHXfRVEgtQG+kZE+Fo77idQAdreS0XBJpjXv/56/fMk8+zM2GR4gIv7+U0MRq21Mtbr/drukuEba7mKinjZqwuTq6ii96pzUzcrlgdsYK/tgUcODuy71x+DHpAoRIXvz73u0Wc2OeHvn+dgCoT9YKq8+wOGVzQX6OdnrTn/el89H7s/OdAWNAmrpQRV1d98EXkClPiMhtht9SY49y8PEJWKqijYkTAHzFB6kekuVKBM9Gxq55ydHvs8FGwI3d36ax1NomVfhvoHc02AJh+r/Vraay1X77JLlS6sVpp53GZW5YnRgIYsQf6xBfY6ucUwVX3faqJ15xraavhVIVmltO8ait4N7xXPDpTvpWPQN4j8uZ+o7MvWsx7RzFiYVwQEOzEqV0aEx30/fQn+DZgditba2Z6Y98tuzB7MZYapgfZ62f3jAK45999Pr1DCFdSm+lQFhX1QzIzXe9y3C6sdhnv7p1N6pkN7+6/3PKGu2Bm1lhOprGvo2lsVpudrWE896/kIVat9sq+XrdRIqrhSwEGaMFU0aHPMBgaamcUtp2c5bBDlmgVqE/czDx7lgiqhZjbimnrapmvbgG+I6JSmF4qLf71doFEaQHXSCo2uoMOu0du0D72Zr2uAaqZcT34Ypl9GYn2kcnoIuqceKDorn9fkM67rdYUHBq45/Wd13lEVJK09xqINchvha47OuB2d2D+vQYdMrSMzQVH1KrXxylqgAGLj1QUcFbUxsq9vyr3rdVkPxcywFr504iw5jF9rR/CJSYVHCk8MzvNSVsT97Nc1QGsZW0ej3q/h+wYyD9hdv1Pes7MMV9M5xbLTKNFp22+QToTP7uhiRimVZCRGk3PUrMe4BzijZyTf2oHzv+ukAq37UHNOtWVqNl7XLOr1r3/b86xGjHyLXXKqkikqIlSd32/2gcNRjjzT45/MNgKd0Awj4JlKJd0aHLT3bfoiUpXv1/Sch9l6zMfNC6+opGRPyTKqcncTELRzkVVEKegNqe6/dq0/04VmDFJMxDM1MXBk9N3J+aDvcBwrn+SzX1O9fA5Zz+cacPLiqKrIbo3wGOErTFpwCFUdg6AkVyeiIX/mHH35zsy9yypQuFe57xGMhIpGHbxuywF6/2tqdlB7FIxXox9EAWfTkUTEzqPllNb/+fvQ2bjM7OaJO0zdeyI7rBerY/I0XKlNRItPG/Ayex55vd4irJI57PXC9Zr4PPufZ13X1emgbqC2oLL1EL3q65WwSJ0CaGaz0b9sjK7tg2ai2703CYUzVzEdoPdv9Rgu6LqwiM7CrMw2YffNIQLP9kqgakV3oEhmpFyXVXX9De/3C8iz3vddlaqiguuaRJIHI9CfjF4RvPC1tar7qrzdX83zcHcRVx3Z6LsQpXtkRogg4xG8+s9+33eVmwlFIiJKmv3Y0d3q9Yscbb22C91SRftH1rsLlc63sJfoHy9vzmEVtT7JsShq1G6BUACfnmGv9gFksqefB+zc98mARO1dax8Wk2n3AdkiKZVzDrdBklYgrVnZWvhWDkDrV0d/ps1MWPM61YvXe9w/MaesqWbWjyxTU90ANDuJ6HO87DO6aUZ27lXPel7vV2b+/P4Zc+znx324e1Ow8+hpWbH6qF1ZIp5B/+ii9q6KfRe71rl3ZeZaa1j5zi/H2DeiFaIsAM96wu1//uf3Xu9eKfRzqHOR31u4IdyHB6ohbUuOtzGAKihEZBWNrdCCKXzfKur72f2wYSoLmd/qek97ldwppHrErMhYGSvjFZlEeJgKdnwOwUqDkgpUxM44EpS96/fP+qKhUa68+rfit6+mGh7LU5057/IF4H7c972fwi80nGbOrKwdfbqV3p4+G6oJikdmhW+p4r2qsqJCTSu16kRQlfnsRewIzKENwOh/dP8yRMagjWnx0MYcca5S7Ghzua4nT+4gAGs/Q7cWvy+rLXo1hUGyMw59Eh6KT0BIPlsFNY05JYPfQI0HjNbDTkO5/0ROofkuaovW4YGf3z9ZOf3qLAMA6mypz1kofcqT34R8RYWvHPOPKJFxwMM4u+1GcisQ31T9Na+OaMugslz4elmF3vctKpTrVITP7LgiVyS4ai3/GoxRktAukR0Sr+8IBR75BDCpY+/ywEfjqjbMbLS29RraHD8ju3Pd6QaylKWi1Hi9bA7z/dvUukHTod/vvw6fTAXZhkZkhpCAdmMI6KLq6a0Lu2VbbZBU7dyy8BNj7/fhV4vSMfaMIw/vWr0yYajoqH1Dto9eoNuuvc0FsPYNHnVxR7Wpo/uZQn1f9jBVGJR+FLYKtlMDppqppsh2MP7jJKASHBcpEDYaqAfq//37zkr3PU322ms/ERUR7tfzPCj/+/czx4yMr7C61bengtifqtKooLuIqDJi9UfIWA4cQajIKP+yX0kpPZSUvb3zRf39PCF50xNlu+axvdtQe0jpdu/rUuGbjDFfVafT3GiP42I6Kz8IqrJZMrqj3CPcz+uiD+WfTkIEKpYdiXTARm8lKt2jxp+ps06g28T9GTqbwt4LXa9fPz/aq3WhqVy3yff1BIAkGGOQ8icF6YGuVI9hqFOZ+0ONZoLV0MwIqP55qJzvj/J7wjk/koz+96kakXv1iPPV9qh9RgeG8o65uITV4fNYWWaeuc0XowwB8Kx8XW6CJ0RImxcjgVfX81TUfT3LM6virnz1wqXq6WZWE3ar/OdeHQxVaaIElp5P7EfTveJqMdSu0AZFVVud9yEsAlhLMl1fCnDtDWCMUaZqhhpqk2THETJje0bE3tkPjkg2I3/orz4EPs9wf+aY79fs1nWT/972bmj+KH+9X+vZx2OibBJTZV3jlOymfjbusO/k9Ast3lFTpc9L9uFNqGDMa8z3+5c3i/uL+UDGJ0Xv/cHt2clNbUJCz3/b1BYJIyKKOlqIeNgLrn0GBtTGmzpOUbOyMD7h/4O166mqgdjbh3Kt1cyFO0/GtWKFvwGsvabJCVU3pDalT35kRH1YOjpMkTV7iJHJ68gTvPsAe/uUOOm3a6o81+sCsMwo+OuvX31h6LZeJ7RsXgBer1f/Jpi9myfZ7/HumnksI+aU6sop7Z+8bxERExS1pOcSyqS8euSC9IfZxva+MjYF7KhgE6gyk+dZvYH/+ckDXSIODU3GNS1q/Pz+mddYO16v1+fgZ3h3naoJxLOrnmv9tB69uV02bK8dlR0O3WvdOsNDTf/3ShvrEKPcFJGa2VCLyu1zSBWIEmoT53tT+zxu1mv19QREVGmVFb7LJGqgvOIhtm9XXqca/lnCHI8JTMQDwdObS5QBJTrDA6IDEekZLrRn++vN8HBxPdibE+b5b+y1g8z//vfuBa0qOi+8RcKb9mdNme/y03EZ4s8jr7srqoCyqnC+SyYKteqozzVtLT0pBEBb3YlzFe7jkPWY/2wf0V3eGIMSQmoWix+tAAPANa1t6cMk05SVB4hoWamn6Akg9sYY1kIrdO5cuwAeZ/1e7i6REe5R4u5KuX8eNW+zyPldz+pPnrunqAgtfio72jk+F0cRFmQ2HrSNJl9dTf/plNxRw4iMQpSiKdOdpnD3LLl/njEHhaoTWHOMNqCQEa1uh6y9zFhZ/bFDQZU9ijFgzKE6//Uvm0Oe5ZlJHUPycwaVO2+zlxlQkzN6AfesZ465bCPQJjVizCnr+6H3FIQBfdrq13dAbSTKG0hhRvce7AgrPZDgffcVtZN/cejZk1Fce2VK1TnbJEga2anPfsCfkUBmZaYyvbw/eT0wVPb8sKeKAj0ThZ509fvcDB3sO3xSM9GhAdU5xw5WVF5TTW07hClzZPfeQ06eV+sYB/VDgeeZFmZ6plEo6An4LrLjJ/fT3rTY28P7uJvCzHKR6t0uGdZLysbK9e9i9/QitgiH6FO+Vg5lgwHbMqSC7dWOiJ5kVeze8kQu1Zk96UlW+d6N7tj4LHEzFllezJIMB00Z7jFNPwys6IPyjlo77BsRcZc5qiqzqqLnV3s9/aHJzE6Kt+FUWV3oyczvu7k3nRFJlW5vqQo1I8PGrJHhS8WJFFQ7d5We1IYbA+AE4JA2l3R+qyUG4zCxI9daFfz752lGSPcMv2SNTaHOipVQwQJHVv7+Wc/jWcmb5875mV1+uRIUGm1ellHkIAlohj+IKu0m/vdL6jdAXyfCHRVdYxgjGqMgbDPyockqpZflEdETVVBFx6XX8yxk9j32U7Uz4CNoqyCjAyYqmuEZyIxrmop32Onz0OX2sOLaC3lFYHn2GYSMP6EJapUAKSIwI6MvSN3huoZWPU1TVWVVXOPq1TXV1OR6CYC/3lf/jokINL4Hs4ZNqLbfyax31K9xVTxz2u+7228XtZ+C2FG/3nP7MV8ABsmIzKJwRmSLDK7XhaV7+xejcn6d/Hh+IAClGUOicyh3t3BKu11hR4etqsiyT2rlmOGytKoVI3+MogBMdhZ/fu/+hHW+qE+ETwLlbTjYS4BNYZ/ZIs9S/e/fz/s1s7if3+PCXvv9Htk173YnZ3h2my43JDO7rt/RukxXU1Xxf/Cqer6hikZgvC6LwHGhZlZAx9XPNlVUzTGvvZ5f79kl13lZlewtn33A+fl1napf9cPobqCaIhRqlrFFT+tF1IhaC71SjIjepZwPGE3UxrQr6kO9RnukjzustM2+ex8q7bm5KT+Dyz/DltB2mUXNErFIPxHo0ih8ZvzoWDGgWhBW3zrM4nDns/CBpLs7ajVcPiVR4YGw+NqlKiu+U5huP0aFR9QDvJWy19PAYMhnBNJxSZue/v51uTv56R489+8qDV9719gHgdjnlqaqh8deu7GvkdkPs+4HHlErIxO+n+d+vhdTEQU1SgH/YsGbqHr/PGIClOgY0yKjSsBQ6VdqZHZN6fzKKnd/GWfALKH8YlmtDz8yqKlkjCnuSMmT5HNcr0PsMLOK/c3i/nr/2r5//frVEcXfP5OU1+vl+yat73sFtWHqiRFjDFPej7tDxQsK0UJVRgIRuNA7Mo0jmEGWrL3+cZZrRHPGWkdJvz2qQzvxLO8pTZPVKrYzAfz87M4UHLYFzR1iHTWPkJmpzFz73KvVQJxm4piDgVU/2OccWIjygiLjABA6SX+QDawq9oYxU83wrYxHRiQjg8IoNE/g2Y4NjzA9b8idUllRPckdEUc5dd93m5Ujg3K5+7wy4lCNzfDz+8fMxuDXTtKYj8ho6a978fPpiojZMYNERLYo+pOuZ7gHDeX//Z+99qOmaz0q9Rvwfd+lrWeeM8PDKkvtc0As729BT/ehH1mfDnhvXrVHX5XIz9LnXJXeFJ2xn7226azSbtB/Foefd21Gx9B3ijAqpcrJV0KooOCa13a38Vpr9TxzFM0sa3Vg7oNaoIjWBw+dWWuHKbg9q/mB1gaKM89WrEezCNEGpIEDtX//rF/veb4wFVWpmohUm75chB5FVCbcQ3WqivtHrZVUAWUOM7Vh88pYc06zt/KhyABQcQ2BmLLGHIVfjYOtiohscAZEX6+X2Xj/Snd/9XJm45qzx0SZhQjq+E76EvmP3nWDeoSHxRSl1UTL7UkmqHPMjlhXlAcYsNG242Vmvv1ZYRqriWble7f//LjEWw/+HViZdQvsuIWUUqWqQqUUg6YKFKZVxnEN9gAjitesMcfv3z89YBz8uBUZIrBhM6tPCl1bY6g3NefzGKUwj3AQEeg/aWRUYoxQuVy8sT9DLSuHMlVBtjTW1KsM7g1IbC0h1KDNuiDJf4qw8AnxorL6Ih2uIIQNBQkHv6EdUYyp31/ftvlG0Zjd0czk3egBWpQ35jvu28z22n/9Mo8nE52QQfK5l7ur/kJFJSJjYLRiTEUhOsZr2BNFDUiLqzISuAaehSpWFdAdzqhSHLuHVzxR+X2/3fdjFifgEIjRtiFpJE9z1p7nBMq7S34vF9EhTdOXCI84NLl+VGeWqFOkGiFYzU49MG137x2TKIGco9WO+3u1oEgduYWqoBHCwKTKZMXMglD5UTXbhxgJQe74R3C9AuUZcb1+PQ+M3SQUVUzM65rDBMC4fl2Nkmeqzba7ngZ6oyXGa9aaQ8koTDP0IbnPUUMpKDP2h74J202ayVjhugEyehe5dogw9v7mVlQ0i2tlnCABIiNW9E2pVwVVevpP79k8izl07RjD5pzr+RFh1wxE0AWaGtNMn91fjFzX9O0i/CzG1L5G9WdTtUQss1SQtIPiMf0MHw2Ib+Gu9xeVPj/1bWF6scFyRpqZGVaZAiLwYqMl/vrrncXrmntrW1W6taQfgsildZKbczIya/UZhkL7DDYzK9PHPEW4lnsO0zEHY4CuNq1MZfc+oXNHqLB5wT1CdLymatXfY1yjdjPw9pbwEPGo0XvT8CfLeQoSQCFrouJ44zIKIqi9tl6zIvZzx0BVAU+Cvu/fOZsY2TGNLM9ac0pnbMg4PllMYVWdLebnHnK+sVGeyWZ3NhR+70WZSmbxMnpE+DJTVBT6E0BSWpnYb49+1i5fr/HZ/2SQ42yIavfGoFgq+rV297y1/2Pfd7/AiM7q9RRkR/Uozz1M0d2UKq0e/eu5A5ChanNo034kducyRNhsxhrWw+hxhgr2TZiepW9UD7Iqa0X07rUV8NdlUQ0+baaJRC736GNV88zDtZG6/Y010ESVOq4+GxREurN7bhhA4hSp/uyTRQ1wYQYOSkl0NPskIiex9lOx97IPLf784gyz+74p3Kv/X56xGu2/l49Jd/dyG8zYz+02LGMNvRIfs3Ro8ektifjK2M96RGdleTwa8B1V7rsq0F92BooH7/U8y/dNVmzElvX8/YmLuveeXFVkKMU/BAShJT2yKyMyhj1PCjGGrYVhyk70jcvzfv36S80ysyCzn0Nmprjx6t/dhvgS+Xr/az0/jWxpCM2HzKWeAEspUdIRSNA6X3jWxnqp7gKo9J9+QeOaWtkRbkHANJXtJTtUub0eUBuEc+7xZlVCu6RLpzzr8ygCna0ylHd8sP+cJ2VIdlj9fhxVlMjk9zzcr/0EI/C6+KzIYnOI+y9fO0ANLxQ83MwiqnkZlaXmX37bP2jYTcc4fioz83IDuq7RParGWJi5jdd93/1iaY/6+d8IuzJ/YhzDrFOZR6PwUXTLl7rA+vzmdQlYv9We7hBk2jEBZ4ZHZQn75R7RMZkI6eNvVu81l+ccMz+RErJ6zPxd9PSz9nZmQKU8Gu7aYVqNDJ7r0Jk89n46EK3gPseqwI6KgEiJWBZBCOsaHeitP9xjpbIp1SehAQrEhmrvPe7bs+rDzcy9vU8jpKhE1kDHGMP7F+zzmMBnMenu6KWYSOt58gvYi9hzKJUqh5YcJSa5P2KsE4ouB4YwAVcWERE1JoHxuur1/uX+85pW0PrZAkbt+/HuoBLbM0fx1693ZVusjdKnjmqEY0/uv5CBL4rn/Ps/culV+k8+bhejI83MriE+rEWlPDfyUz+/Xr++ue5fL6PyNQ3AvTqmhjEGyaqKCGHunRQZY6xHPv0kJeX9GhHx37/v65r9NYev/jVGNOBeQev7/Xl/4qBg++OH8qHXjt0AO6tS0EhRm4rzR+kfT1/uzqtT8zPPsrus4/igqW6KVewxbAzzfbLdHkNYoqOlKSISef5W11QRtEz3uqazjgV2Yg5ZOyv2HLMNItf7lyoSA/AWXX1kw+fzIaJk4wyRGcqh4pFG5VTesapYFT1FeaI9lk+liI5rwAPuKMYXaHNNA6o16+HLiSzfe2Uo5qjYkX+YpNsDdKKqksw4PoiIojICR8+2/egK0c1MlY6CZlHkgiggY7zmtQDMIWZTzc1szPHz+2eMa2/79euvfhxWbrVrrwUQ8Od5sio8Korqz9qcbeI54OUM9LzF/b9dQVQzXONAHKZUtBYt985vWfaEEc1Qvre0ufBZUDo+QcMu0Ha1F4AnDmf3YO0k0xsC0jnwxmI/jJ+/jwZmPbsbDll3h5nXWirq+8fGm3J3XEVFRW7SBHvteO59iA/lHpi1UBHuGabM8B/VgXNlQvYdlSZNsadG0QNVAoR9YnrJ8+Te/om/krmeLcK+anTpzkybs5Wl7ai6jA/QF6mI1zCYWqtK3q/x++/aUQcB9HoDSKfoGCbb0zSfT0rE3Vs2s90tr+/K7O/fTmnMrR9ncvzufLnS8gyaxjdZ/nlNGXBmSlmco0SoWWPO65rI+PXXO5L/+le+r1mVqki8q/K5f58EhHtVmYUpf73n67rULN4zMz3g7tc1ewwTEe0g7WCwnCAGPvtpzU8GE591bBs/P/faBqvUejao7ut15f34deFZ/ty/1eZ//+dvMvv0XyUj/VlLVYdOEW3gR2+CAWRVpFDHmVPndWle1+y0y/3gkx7rLIFRBz7TGGWl6LyGb0eh8ViffRyGVRU9AtC1EhVNZJomfz8twFgtDq2UR+H+3DfcH6W4joqKimEWxd6uZpF0QK+hVChtKFVxP+8P4P+o2Vpnf57Cg83VAk/nZm8ALWCVnjvhUOWqF9IdF/BOp/5jK2o9rmlBdJZ030WYcv6RrjYTCVqeRJGgVsf93R0VvUPx8Iraz72fk9X2iIpfzXltbdP9wdWYxRZ91mPj1XHrj/WxImPtkGcpK8Mr5U+i4eBOTQkV/57HQKso0Aivst6WrLW6eu+BMbi8G3SSxY5V76ih/Pvnqah9PIRu1qtQKMsPErm2QwS/73VdJBVU7X4bGw4nZqoqc8x+R7WnQ1VB88Q1rf9nUf2yPk2APyeNjIyoaoFhZERG7eUdYt1r711rP2tda605p0i3qFBQQK5LKbJXAVKgSpCsCvd13xCR2M93nfUcpPMnj338u5+QsH3UjlEq6jgBQfm88TqYYEoghprZBTwhSuH/9WsOk4L8/Nx9v3y9/602x7juuw/hw30DPuevBmwCsGKmtP9PdSI9MqjWeadeN7n/AHi/Z4SCPJjNYr+0q3T0uKKoQEEizp+oJ7dRpyvjvkxh2sOM3bp522sBAbzDC4iox+Obt/aKRfWeUX4h3T3+n3Vei5QzmpiGloE2j/Zldr2unrt/TZJV4oGesolOZYWiJQMJ23Hmft2dR0VUrr1kRwN3BdHPg/4GRWDM9R1MVQtfTjVsoFryARFcHyXJMG0s4ZzS85YDwvCuKNTRyPV2Mzbw6gf8HLLXB8uR0Q9y961qEdH/9Obyzaj+iQJ47nvvmbG+up22/Sgr6oDRATssMOysvtWwPZ4NCQYwxzWUcpmaReQc4xElmeG/fxawIuJZzJLtrjZFYDZ7G1j5jMbZZmRWAKLD1IQHjy5qqq7jpeVzzGdJw9ggOsaF2mOMiFBt4+qJ3VP71eFA9G9UZUaheSQJoHZEDttN3AF8rzsCgspYrSA6GUERICPSVGy8lDnH4dGrYYx+5+B1WVQX1ktZ/pnKtAz4FLPQrzKvYqcw3IeeL68cFBF3JPS+HYC937N/JKujNXW9ftleTxZ/vfReszujzYcdVqq0OlPqPnmD0kqMthRGoEUg0Ub49XQhptEgp1jDahntEkak8DCwmrh93z8R789GeTdD3dp7ayMyOsKfB2v713F/Z32NAR4B9syu4mj89PAuRYchaqhOas4o1QnF6IkHBvetShUdJqVqRlPNFFWx8fqW4Pb2awg6x0Hb3pHO0sL7sn+M8K2hPdfU+/F+v+enrqmKCEbxY0Vr3OqKMrKQLqj+WVKyT67Ayqxw6VN4C2laWdm+lvORqPOYV0ZXWD50ukBVBvaqM75cm+rP4311McNz33y/KrbH0/nk/hB3o6CBP4c5wJ7VRASQESTQbK+Or3vGzqiMY8T6Rs5OhEHygH2tJbDeZU2YHqx5dXdHVdSMUWw3JmiUzq21X9k8WluqmWxT+t4+hlbWtApX0yqDf8W6ICnD/uGY6OmpCMJXUzp629b99DpQI1dRD49ozrOd0Fs5cFFOxf7TG44xx7PDrPoAOqe4m7u/Lo3ScLYS58CKe4kLCOJf//rV3LyOFv8TFP56va7RPQG0BOSs4WhkrHUA2S2eKWCvaCZkkzP29m++RVnP/RzM+t4UB76pmN8ZYTY8tqlVUaSOBflrDUz0S9OjCI+wyicDUQORB3fOqvozPYNovzo6N7a9RJCxYaMwVIea7S4rYqhZeJKmNqp2L6FBE3EdL94PWWpjjpjXS0TM3nPcoaI6qzwjVCUKIpqIjsd8/3PjkXvw+n0TwtF7bt+unefpONZnCmRmohxzRqSQEJuTFbSh3RAQFUAzMjLNrtaK9wBNALCHgRBR0lXfQ/XZ21Qp2cm6htFF9F8VpBTDlKAoqWbucWojnDZmYYsqopRt8y6VrCwhMuu6NGFmhSYYM1VEVfaQaVIoixRV6a+p269R2E4V+YpyAdkVLbrz8NZ9mmpk47CZ3RA4Y0dv40uUVaZKRUWvq1FCJJEJJdPMBL2sqfAkZQghupaacSQ9THXO+ZHafilLYq83InJMmXOO6aqyATMxE5SKmNrcW4n4ZVdVmkGlwCIyWa3XRHEMjmERKXYJ1+e+BRXFOBSDns11RGpeoxVux2YhIDCMe6OZtBRWSZ9eKADTxkWKDZEdpIgKIb1DjY/YCzA5lJH2rUsrhCk5rCDiQlJMcV0zwlQKhKoJOiR7R1T6TSQqhI0t4TXb+3Ihw+aVv/9WG5IUGapmxh7vUpVaqmXKMcbPjdkOzaUqHWnB9mzPJCnhQXbx3TK2e5BBaESp8nm8x25m+jxrmNyPCxPtYGVsr0yQmhXCDiBFZit0WWBEeqBnSGBEglCEp2J56zD8fmrtjWeRhbpir6hSKTXNLGJtjzmtqqwiC7HQXZeUSjREQ3uoQ4qwyRNCUvpIJ+0HzVqew6SDapGF0sxA1phEIjPm9dq73ENFehtXBwTpkRYRJIg8+QqK6AAYUaqakAhcr6spIL6dyG+eVMWRK/bTD9BMy3SRisDzeDNOesOnqms/oHns53kAXFe5P10wV61KLWWiRIjKKj5PR+xKwivRuIox2Hurjy9RsiDseCNEqESJRlZ382OfR0CVNK2psnoiC8DDmiMLQKAeAL1DiJ+7r/dyUOmZIazmcVQKKiKc7RmRQPl6fsJ97797W7eWAyyVSIgasBMoMBPue2/P8Kh3jzf2rndx7dA4hrXt0fi3O0mKRw4Tkh5+/9zNR+ldtZoScA9J7SeIB4SIyEbEogD2P9zKgyQgqlnpKkJyDnYgfaiERx9NSVZ5VjcKkIV2KoPinmPMa3KhSBh09EmOHVqjR2TVMFGdmf6ackPhIYKh4DRAZK1rWgLheQ3bkWNMFRT6yxtmVyFN1HgC5IgIVNhoQ2CoKZEqUoVpLIgUAM55hVN1VknjJNS0gyhmbTsdzBzknO8C3TOr65sU5arISCKnzShRZUZVwT1ADOUShWhWDr0oRh1k+wCLp4Fx6rZVIHXOSQJ1XVMjoGqqModVlRCmBlRVVkFJUbbQitUNbqqKp5MWGXSt+oPcFpHwe5dExP1zjyEev7pkMESAVrdLZfVFCPaxTRbWyqE73DGu8FAByn27Gfba8g9N4nZXtc8k4E+wquKpb0K4uYLCc7/qtHaiVMzSDEpFdVS71va9fPvTRPtG2+9lpIB1XeqeKvIkCnQvtSSlU6hru0dIVGZ4NKMmK/sgV0JSJLYXufZ6xYiIyjLTYyeOFB2VEr72jgKbg9QKktf1VmWP3UWv9TymaITtSYD2ZTV2Brb3TxNzEpT980NKC6qrMhwiWsiK/GHG9me7GSia21XtWetLqeIb64ln3fpRdT3PPecMDyNpZlVBJBOghns/7eREEYMEtSOK3glkFY1YeycZn/RvCjKyxXLob15WVkZEVtU1LVFKZnhUqSKiQYIhEkP57ADKVFCO0/27VbHXNrNMJyuT3yxQyxeEcZothOjw2CpCgqLCPYZtR7WfXhwl7Z4VhJC7QkVVlcDrda29TPF//vP3X3wBfi4DJSTNxl9/6RhiZmttoMJTEJklklEQVhsv3QuMl1r3M0Tvb8ahk7bHwxWlppXROKO1yZ/n517d4GmTL2Df5kNltcm8CqImFFUtlHtvpqXjZSI6xhQpVbvSGmW1V+PW7D///S2km0XkNa97xRzDfc3R7hkRtb/e8/cP9Mw30DSXfRICELWuxV6TQJixIz39CzCMv4Mm2IVDpqGiXJQsIUEVxBkP8JMrq/IqFqSyqCnH7/mJJYhtx+vVRfNS0QJUEBmv90WK7/v1mr+Blw5hdbrsNbVyXtMscD/BDoyxxjh1+FM2MhzwbUTZmcWh3L7PIPDw4c7aXBLAfd/NM8z2AQWqUkTX48hD5b3vH1Gd1/M8q+c1VZoBUTRqL4s2DLUJAE18CSEiEcVIPPcDeCHcDwlVEGIDXmZ/JMxrp0f2n0JIEqokwyRDJUuuWWsdMUXh2GB7FlGFIz3RoWpCtfGe9lNneVKmiMhsGE8WQwopoipQm5Epev6h6EmYnjn6+/3X3v66rPdlvmimkUc8dWq+FWZBWpa8XnOMofr7OgKI80L4cglWLOsdH9XMKNKrBrWhSjUOSGaaoG1PmdHuWdW5kMKE6Ps1w92GVGVUWysJKMgKZBUre+Opn/uJEH8qMex8uvBZ4CBRVf0qI7g85JCHtZMI9gmEVBSlz8AxlLtYVe2lLTGQne/oiF0gunVJGYEgGhCo7YMhmgwCZbWDZ++6ZkYT2GmNefx5EIHlzMy1Q60i1/JMRKdZTU/uxsgUhBJNH+idX//tMq9wR/mmjS4iRnZNkEcPgYg6y5QuO0ldl2bm6xoUCmQMo3v0LUpENHutc11NdOtcVPTS6vFtE+5L5N+v9xUx/nrPs7XJIIU0VQXqukbv51Vl2JGZRmaGZ7J/Npkl4pXaQstMkBBhppH9VI6h7OAXycwI7/DtxwjYbfoztexMVdOMGb6prOxupGZm5vZ94EXKWDvcX77vRkFG2v08EY9Q+u9c0bOp5kO+X+/8z3/+z1chcz9Z+OD2+9rSVl2yIwDdFAWjn5TKApOi/aqR/k6EP49krGwbexEfBKLq7I5XRlQZ4BlJiCqrHGl9nxeyQ248verq/fYc07fbuO51H3VVWdebThYwC2SPhvbnl7mi35NAAaysjFyKGRn+c7w1IuK7OhS8yzMN5KB2/qIr1IVKHm3KozJff71Lerl+XdPdunHR7sZmL6CiIsZUkT5eVBdcz+S4jxmR0Qejrw4suSDjs2IIEVSBCI/w7XtXtCSuPEsj6r4fQID4/Xtd1/zrF7JEdYJxXcNskPp+e4tJGggH/u5KytrL/f3rNf4/WWYSaRHrnzyjKvYXAMje0RWkiOXuZipCpVBMP3b7zBAxMz6LvYdS072j14ckKiWKiBObqdLIE1USta7JCwFKNZikPAIRvndUFcAIx2t22YBih5dW2uDi814SyYANw+Oz280p1FFSNtpb6K/3mMPer/f1ujJTbU7bbWK8/VG4e+NDQqVPzFc/WzM2Sd/fh3T59mtoZbVI/GOgEFMz9Z1YO3d/xzqgKdzbTSEqIDzOX2WGnaF6LXdUHMFBJXz1al8P/1jOY6FSdKrlNQ/UwwTUqyog+tUiUbNiP7uxc1c7JSRE1Wy0wC8zLDN21P3stzCLez+9ilX9wDMjRAQZf/88Jvj5/RwNQrm73z9fGOuBta0dy5OK1xhZzER38+z1MqU8rU1PqlBIG/bcboaMZuU1Y+hc0lBqimvOLGcEBUglocKuJoTH+9U0mI58FVDhG5k2r65IJ6tCInrZj85FgeoeVbm23/eDdHftqng/OCmzMvVTFG4uTbsNKx2IyiXS2IxOm3rf6dvS/smj4+xxI0/dPPBVyXugWTcqOue875sIpEeUu49pKiyV6xqVWH4SfgUQJcLGZ0SNf1xes+lMlRWSCNjHE9Gn5E6mCtP0cLmHyU2jMleqTACvl6kpKlocaMphqqoFmI2qMoEnhGrma6+1Q3vWTk3WUHr0AyuUfcHI76iNtMwOzGinJyGNl9MvJ0nEu+LWSQoP3+664ftBWYXej5P53Lfyqnzup6ijLSvhMWbutXtVut0bJ1PlVZolpKlNQIBsTUGVDmWXq4RlguuyCIzRg+MK0TmnKfDz9Jd33HPxjyKyEtDIPa0267pGn3zMzOw1hjmWVVRoZpYNIg+8wA+UuIut2NvVlDw/ZjWp0qgcyjtUiBIKSliqIkIZbJy/fmKPraQ8zwydUdG5pXMHOpm8ACKCFQv1vqY+D2xe/HkUf2LYIqQw1xMtQarKRH/ot0eVtE06Tqag8GG1Z3Yt3aqOsKJR7MsJ9NlAm9iRmXOK76jYPFncVFVStB1Fo9ReEWEoQlTqfs7PJg6VEcoihSxUDJNpFRNdN2uRaPQ7JxCJitohCX1252wlMtY6UrcT7iALETVypf0a4Cp0DAnPk8MMmVkZUaTqWZSeH+iXFvh5bH8HTeWuzUQzFWX7huc1Lau7dZ2ugzv75+XerQzrx2F/5rKqHyWkRMBdo0LPlCJl0AzhBVSdnxoFiOhqePRQuBBZVRCUR+LZdA+VKcKe2ZMeIVnsSzDgeWB1UB2tah5j7vX0KnbMqdkYAdVxMc+ZtprtmgVOg6iqiaJKmgbHT/uzOXXtGG3/wdreQ/KqnMOCLl7zekU4oGJUPEp4OhDKvqghwwntJnY/dzqB11AqytUbeBuvzFSVxo/ee6M8oi+weUzd3KjxrHxW9lN8YobfVa+e14hklolMwECjqKnd5f1zer3hfuTHAKKCp1F42jYi7FVGPwK2O9s1mKWmZCjgSPdQ/WmZsxDxSXk0q7XfPCkieW/vrzN1x/0cLGFf6LuU3P/+bAOev//+b1dvf/h3RIRH5Gq2O4AxUbH66CzMtVwFGUqx8Gfz2tGztRxmWUsKEUpBJUSZmddlQEFG1qIYsKljjMgqkhXxVKFy74W8egon2cVfzqGmHb0oUqhkoEpEJ0kTSYhqPyXKLOClApXc0dPkFMk++AOBkkx29bcSVbFcP2HPrFLSVWCmlPLA8qrcWTpHCnriJKgMCHt7JWJDIkhyzEkKoKKj4MNGVPWuRpVzjMh4/3rNaR5qZCI9Y6P+wRrppOf9O2L//KmqFAkz3vd2d5Nff//+XYX7J7J0mP/++7/XNe/HIzHneyj/85//UGZBIilyVGJ/iJBqEY4KM+kPHKo88LqGh7svU1krM5/39RdGT/1PkOS6xtW9Ph33TwDB3q2Gkh6umOgirId02V8JQXWMtE29eqzx+aVegkZ5yFC5dp2wjarZawIh+g5UZP56vdSuyIWKzHNAPqAlsxb6Pjvmy2YjQcNsvK4L13WdOtKBGhmowDWnqM6//vrXv/7917eSMua1twJ4XW3vGr6/0ACzwBjW8yfyNabBw0yqPMJVUAV3b86XGSp4LyfKdHd9SQRVHlFkFD4er6pr/gIwr8sejeIcc+17rcgSJiK7qEWQyBwq3SHc26v6cDUzBWBWeSCyGkLjXhlekJ47ZUFoKtUMFVOhSkQvB13I6vfVGbJvVB96rcnvz4IGzEQEkbsKa7kQkLF39Fi/AwgZoaoeUVXDxvP8uLvo/LlXpff3+rhubFhFRcZ6dhe4qthTW3cnIUT+s23N83aJ7e61PeYsUVXFGKaE6KwCMmkMX7AJnHvJGFxr9Xm036cq6hEEMwkQkH+6pfrFTUaWZiSoVK6Vb0sRFHSaUGVMVkZEzCG39LSwVNGDDpKkZe6+RbTDuXUJmREZdKpMyhjTqARs760i1HoeMFZVVhVWXoL1bDUV7Uh+b9elUWakiLuyrVslPLmxNpp02Rw0YB8mJvri2Po3HybHPsTE8a+FmWVOm9eOAlS4qyrTPRhRZvj9e71eowoU7TetWX1ahWaWs1kUfZKlAkkKqGpU7do0936eClKe/W3nZQamIlEFFfoBVUCynFShDM1MCQ+KCVPkjHpVLZsVIwpolWShRb6ZATASFGYFRcK9gMxYewtH5s4sGwOovffyvISRUeFbRpurTcVMDroXVdC1e7wL9vkCGEOrZA4ZJmqtTrP+tifMvkmtb0sw+2d09GHauf8xJhAoUARU028zWrNyDhHBaw5VHcbtIDOBtoiWFIExpB8x/Uz6frb7PNpo5V49UIDyiFRyxfIAVgiF4qrM8AwXTfeRmVGynrIRz8aA7hUkqnTtfNahBtw/K6HPs6L44bGdsnPVXnupamLstZAFyYHhAd/eCfDIrdCMUNOMigxUzdC1420a/kRKSFbeOzQCrwvQfqbkyQmXR727qtGcJhWlmperSiOdp1XFVtanHuDINgNUVId77wz/+++srFKu/Vix90UkAQpZRRWuvfez5uvluTT1K4U/v72Varo9RTSj5JhYq7V2lDFZPbdBelRe0wTpMVCpKr7SpgEqsVAyTSFAaQKrYKpm5lGAZDpJU4nMXpdkRtXJ0zZjBAiRQpUSO6PB7hl8/dKCSNX7/croECkLGAYOU52RaaZqY46RMBO/Pg2LtiJE7Dlmb3WBIHUMBWqaBV3Vli8RtR0FcK8NWtOOckdkRS5saXIdykvsA8HbbRnpZ5iKkFoooL9gREY/1KnM6lV6r1poQyCC+t2JfMCi8MUyN0rADzz0NUepQgGzf7UgtuPv273U5tQxTVXmnDbHBzssqgFoS2dVNTIGX2NOj1N4LdbypPaaXSm8rquLiK/X+3XZf/++P9ObEpWM3UszCscwYfLc/8S0TBmOZrJ7ospRiGTf2jurHNH+qGztTZaH16779ULEVtEmLCQISK+fjB+Zn4KkO+V7eaVAYNPe9SszQUYQqHYNaiq1Y6t9GjlDjyrxs3aQiPOhJEJkkATbyhFmqLyfAIDFIq2NT/fjpgWWL96P83SUUaV5FYHI2Lt+7t/vaxKvtdac196VtTPWs8KE/xTXAtmbG9MQmKcXrKCZ62yVIqji23/q/mqUmsJWpZSKiJ59rUrBWsD6LLJEpLkHAH7+/lGz7l1Mf3XR7+TnY7cOBqqHmD6nKOUauqPgE8A145p2PyeBU6UoNja+17mJMO2pBfB5h5yfFkp74yPRZZjzwSqJCDMKKkqtEZe0zBxTTOtOFdXI+yDaKz1gQ4QscM7pHhExMsnsKrqwiMgEqCJ0p6oMK9UxrfZSIOaYjRJoFqKpi+i8rPMdfV+vXoDwDxEEgJLLj+ihUTamUNpGdhyI5F5Pp8c9nIGsCi8VxCEsxOtgVEo0S/zTqjnPi8xQXl1c3lHuPGyPwrek3t7Frpr4arm6ZrJF1NdIIIgEhDxUUOIUoOaw8Fx7e4zrEgCxu2UaqAJ2scy4VqJUBC1IwMkEQ1kqdEdrEa9xTJjuTvRY1lQqsjc9VEVnKYdyZQkiPv64D1gfH8x1uLjvTdrzOGovz4gaU+HuvhvL1eXYxmhnLHenJKDCvB+PiNYaVH5VBsts/Pze97PNj4m98M/fwINEMADr84D5s3nX/HCJrf88QImoIw7H6zPwVlFAVLUiC5ItFCpG+JijIJmIpEoAstc2Gx/mEXpj2iKQagyCYSWeZ4uo+27w1rNCKCgHrTLJrEJkmVoUgfU8zzQRpQjZfaVypFex+/59AHD312XBIkOgEVU8E9iK44vOrsePDjVQeA4ZpqjEa3Jx0P0zV62+Wn2pNSKkjNfrVZXv94vIKL7NqvLXe1almQ3Nn2c2gHXv55rWHIAxh9kwUwj02A/OV1XnRRqt9AqP0Mps033pHyq/etSUbFpjp9l6UKns6B5bOm3DGu91TdsOEe7og+rBrbWNSEQyAQ6qAwLp9xqo4zWHB4C70faqGhE7yoaZitNMzbXxkgMHk/Wq/FGzLF5DPZ5By9RhduM9r9EsBRu19jJVER02VEejaMJXlpz17bzauaaC69XffEN5JIcho1pjNaecHlmGB16XZpYo/vvfEAJmVbD3+6WCtZt6aMBpB4qsL6ekBbSRQEWmoeKv97XdSc3Svj2stedlqCrIa6qZ/twPiWGKXm1kf+KlN2vufsDZtKa2W3+AUEvxmhb+ev8aFSZyGniVPmZ/oGut7eEk//vfZ5pQOK9fRKjZqFhbPsTjQ4JX0UDsqO1H5aLEdlIqvDZ8zN01IPedqeHrhE/ISBmG1/uv//Of//7f/6+/Mivay0mbKqkKmIcTqw/YHfHopU/lff+gSs3s/nkoS0Qqnyru3dnt8WmB8ee+22GxgedxMyMjy9ZesyRovWxWxZxyPzLtCO0i4r6fv97Xf/7n/4zxf485z5rI8vV6V8V1vVAO5N8/rjZ9r3/9+/+999MIk71LDR+mOd+/ruf+ndW3c/z3v/9zXdMLpKy1xpjT+Ox4v9+ueNaOKFV5v9/vy6tKZPz6Nb4BTzO7rgnIrxf/zk0ZRkZuygvl83qt51bFc6/t+/26qvjXr1/3KhHuVZn1umiCe1fkSgVoz/5Nyu+//5vFiFUpZlw7VFUFkTnnK3z953+2if19AJ7pKyF26DVZ7rco7bl/q+j9OIVNpRRUgq3NAgjYNWptp4CHl4Vnx14+L845kKlaMi3PwQyN7vkch/Dt0Rrx80iPt7OwVj734757cLSXtAva3Z/tkeGb/YLrO2sUXy8ROQsfL1IsAkUMARER3rdGIimzM5hA9uhQVVuqLKoKRQWLQ5nJ5tIUBqhNXe2f3DHqIADN2JTsZVBkiL5FIkEgmxGW+Vkzn/lBb4jn9WpB8vV6H8Mu0qLy1/vX7x95v96V+17z/RqZ573RatqO1rHbMXKYeFX5PN14YtPHr2u6xzCaqZoAFe7bk4hTplOJ+K3MyFIpE10pVX2GFTOsvS6dTcQBXAVzaKNommj0PRzMYWoEUplEqcApqqXk7obB8ndvvwrdAl/PBqEqq05oSlQi0iwjD32xQ3Wkqur2c78S1YgyBdUgZiMMSooZ+0kdMVSBnBStzO1FkaY3Xa/3c69//bt6lhgRH9D22e1EQuRXZViWvObogfqRcu7bd45he/Whyj28upAOpRKhQvSzqlJECRACJikpGeAADNhZCiolmejc7Puymvx9U6XmlKGv7Tbm1RVfISn8/RvXGJVhw2ZJ5dOvb4OOMVApIrsMwDXUHaaHZ5qlIl6VgPb0NjJYr6iP/uhT0u3tpopTTcMztZvKqLje/2q/pbujc6YdcY6Kvvy4R9Re+37czE8wRhWsKjQCsc/NPS8Kz8yK6/U8S0RIue8lLOW9ng1YVe7t7h4ePz93F+obSJMfR0t47y6ykx1rN/UX2W/n9MwWgZlv9/C9XGU+z6GjvX8N94piJp69e+n+rCXk7+V77R8WwHB4yBoZHuSzd/UpvKXLVRDBs9qokonfPQypIm0gWv7Xf2qeGpCCAv3iTKZE9N79MGgj+m+RBVNVj/LtlRKZprzvpapzYs4KfygTtXxTLdfaAFRYFfOa7tj7aT8vqjyfvbeqhj9ZaWrreU4pHCFiKA/X7WEZy0Oe9ZhFHxY9/3nycd8ECpUeSpz9PBk/P2vOOa9z/q1E5gG4CwD42s2RnFXVd+hPeYAffZ1RHY5+EXepUoQduGt/Aaavx0Ctsx2IQmQyM1SwQ/eKMhmDlRUe9dn2d42xKzx9AZhDBYVy9xNJaBSIe+NasyUXzVNBRjMUzF6gqErPK83GmEOHmNmw3Vk2okw0urZJm1P6LYrsyouNKZllisxYz4+wxxpHahIZrRVCuchoRMIZQwn32svzmsjkcn/RvqeLvvB1PNZsZNXrGiJWT2HKh/1nldUQqNYETmNjREzR8FBeQwWgqirgpsgIER0jKFqRXyy56kTAw68pGZnZxjYI6sShwUh+nutdCKkxxuNVUV0uO0BUMdIBziFr1RxyP6nkBtQs946EwFVUBab9I9AsdB15GEUMCA9R1cqEgeQwdBocFe3wdu9feBDV/cQsoBBZ+RV7iU4bs2+oJp0/6SPgtDF9L7MAUYlx+BH2fkMacEVSrMqnjkJWiaooWw/hXV0H6qNxLwAZXuFVkzyZzRM6r8iEd9wytoet1bz8Q6nfHgCrSlgi1nloSopMU4ayilklBLt+e15rrqzMSIw/2D8GgGn2mc75sRU9/zV9PRvNLv/JmwjCzl23dmYBCVCEfd6LQKZHRsUChylU9NnepJO9qsOae5+oc2+mG52ZFddQhx8lY57GfUNvVmt3PKcJDrM259B52XN/Y99BMtPzEPjQmH01BaJv5H/9eq1dVQupNoZHiF1WQgIIJolqa3KTM7rnOezCDhiuOTP74MdMF0LU+h1VKTolEZk5L+MJMhEoFYhYIqF2qbj7NIV1vM4FpdeM4jVUFO/XX3N4H5jHtGmIgulf1zC1OebwgCqQFraV4ymfc2YlGNMMSPCtLLWrfGebPoW95+78VWbPTo794Jr2rLSm7Gcsd+ltZZT0VrJrDWSj43qrpRWVxSG6c4vRPc2oucjy8Cpp/HejJ0khFUigTphHaIa2DSADndrMIpxyhatIuw9SFIIaSs4TDqPQTKoYvilGMTM99W0gUSJNV8b3wJOxM9Y36eCO5uy16WQMLmcXdFxHuIP611//er1eDWkEXFUjSlD3isq4H1/bzazKs5TgHC952TRGsV1mr/e/RRj1OzNR1kqOMS7fv02v7d4a30904gWRHvCb/REtpqTIfA2pRP6+bbBrejZkPYH6I1Cqyr4cU3qrGHs7kAQjl3L8ffs1zX21ovhV5R7DnggI2QrXHqaOkeFeYAYyfVf1lvBGkciEUN3dI64a4Z5CEV3eMq+1tvh+2mDnEVB1hyoq9nK6O2l9NdrLv+hC4HqeBPZ6fuY17sch2q3R+/HMmrCofd/362XP/VNFM4/Y93NCJe5Vgb18l49i5+T9bBID1bDeHiVb1Z+dL2j269cbHNQxhxxGcSxTK0gHm4VQk7Xjn+6jKEZxdMsKqKr1lIhU9YrMK+HxZArYVVGgNDKuWfcdFR5F7MBGBaICSLP0/QNaFnSgiqfRszAnyHA/SKaIjSqR4W4ttR1TyXnfLkqhgvXs03z7RO7Y+Jb+kAlT1bJa4WZqNa0qOab8P//Pf5rK3bR+EcvSBntQeA1xH2enWuEhey/S8dL1eFvM5vjtPUXotEh5lszBmxbFTvgQUJ2gd5v0C5rts81a61ATm6iU4rsADxp40MpVmQmPuObMqqZZaqveze57eTigXdcUpjb15TyPUFXuISJ7R1v63u+379g71CzSTY8zTln9YxZ2o0gR8KAHDBXpEVA7lf8u06F6JgvTeJ5DodvP78p3x/SfxylR7W8NRK4KDfcya40smom8duUA11C6P+6WAQo8UAEiv/2hyBiDmWaG9USHkb8y32rDWL8Hii3g2O6osPu+gTuz3IfZMrXG0n+v/1XujkrWxxYj3tn6QGUk1CaRpJPMBMlWR0XAI8dAZfk+6KsomtnO89svIlmcOmM/AHp+t/cyxfrH1uK01xTXfFH4rKnS9/pAKeacQ6/rV+H5k+czNJ0F6VHs4LGoPc/f19QVaNTZfR/JeHuK/FMtOTu7wCmDm4nS4cAkxQaFJlLTJCMBAker05bj5sKaIrM8KQx372JaOI57Pa3+QKq9V7ldKD0CY8XaUGJ7vN/TI5RQtrbxs/ASXfsEiqRPLiCZKscl0cDG6/2XWP08/9/MJGdWkGrGlslRB2++37MiGs3U5AUAXWyaLPaOJXpnV9r/H/2oOCtU9FO6GIdL3tzCEe/XBeSjv2y8qrInVWNee+nJ/C2YqZqpov+PZJWOSm31bZRSzLCfrkdjeWod99790RB+CFGaBbKoRFlmCi0/NnFT6JF3iO/bvmfTWBsY30Wxu//8/l0o8qIYUKodWLVzFE/5R+cTBc2Eagg7qCYieinIpCiJE1upRv4DVf0kzn7tCM2s0jNdtXmvqqysU/MhazutMhYyVgZULMLve4nqQpjN8NUTGBFUsG1tama1MvqSJ3NMG6PdfU2N7yM7lfePm/EX/nq9juJ8rxrzyixV7ABpUVm5MjTl/PpXCaiouoaufZNfXUid21hvG3e6N8jnBPui0iz63pVheg5BHTmBGUB7va0qdVxj2Itp9h7D+PPTBaNCDx68ku7bFGsNM+usO8rvVVTetzdV/Gt0rth9/Wsbw/VSd3dPsm/qOYf2xez9etkhW/UpSKvg4b0Or6wxxyGLxSYDbV7ojbjk8YJVusPdVfazA0O7fdoUKeBq7RUZiaEUUAvaE3fqAKzFj2bvMY9tWljzencN8nXZ/bimZqagmmUYPMBZVG1vM7ZnWkR5rD4LZJZdr1/g6iWImRHpZqZwO8+nMTTCP9jDU7BqOWGWfJAqxW7eHxzbiXB6tG8i1uPfVcWr33qVsdbXQoXaHnDfHe7zbY2v6c9Kb+aHRSYy3L1EGF2AmGqqZJnZ3o3xAT5fA/k9X0DYkEV0Fjrcdah0CpCcKBHNrN8/f3/Jbff98wqIfjgXZ/CiADMlj7KAqqKmgDYI9f16g9bj+3BXs0j0vOw72q9Ks6tKTEVEOoQrH48gzkxzl0r4Cq8ug7ufsxnKI8UUqqbSxyrPTDPlEc0is8agEv8wbf8RXnUV1t2V1YaV7pgDpAzUKug18H1H9a43IsL/WA/JAP7YHcdglQKNRIdEULXf/3sXqu7HD3w3q+tp+LD6lOa7Iltq/Hx8ZFG5ReS+E+XUBhs7yjID8L12FtOqX6r8TDK+dZ+GOaidQwQZ3c2Sk4QP8/VkuO8AsHX2qtlxkg7PelBvCAGhWAZPoeT7kcouTMOEWRHZXRPTMa8ZGp5FU0mryBQ2XUIoadQqVda4Gt7Ea15riwpVrRfswvRAxr5ev9bzEzVRGUJVU9V5XfcNs/xuHOcYCXafKOvr/cwzSlKIFMozKaIe/uy4oFmU8oRlxjWv63q93tf392bMYSYV7ghCKyrdS4cdSVt1XCzCK/zZ4e4/t3TDM4stHQMQsfoCd/g/aV0gxLyobHBn40Aisn+cWYymBWQwTVjGAjxjV4XqBLLSG+YxlE92JqqWe5ZAcu0OmePn/unW9UfYscc8QpdVKbHzZPVSKGpZCUo8y3GQmAeLcl3qiqwjnBPWh5MnZkZ2xwDKiYH/H1fvuixJbiRpqpoZ4BFZ7B7Zef93XNlpVh53wC77wxCRxSFFKNVkddY5Ee6AXVQ/zWy+77bxAl31+uRb+bMN5RJFmjBLnDpscMyeBWuPbkwxBueUCnq4Umz06Ew62KGnHfeqjp+qwNNYZ5a7w1pAlSId9WI9dVRFlXaQyseLSCP2WcGslOJeHtkL+ZQCWSiiIlNOGC3Zp0OPqyksbxkfSFeVZz1VABUKG2bV6dRuanEuU69qr0YFy4wemYV970Inuujejoqo53m8VXedZ0P2+w1+tk6i4uFZ7dxsZCcAvBWrGcj9IBY1KzJaYrWj9tob4OOVhaNuOhK0/XhjVkKvKRaRY1qhIplfFzokMkyUyk4jbXXdSdqEfqKOzXWc8w/DzJV/ZrLfnRcqMj7U6GJGHRFleW/iOnU4MrevzlggMjvNIFbVm2Qk3B+nAvXsaOKBsv7X//pfvu/r9et51uv1loMkWq9p93KzNwDBTgjByPxsSyAipirThOrqiVI1M4tYJ23XTFmRVJtIgygyokaXGU017cCRDq1pdgY/CZ+NvF+lH5tEEz2sVWiCSiW+0HPWUMYXV6qwIb5bt3wwEJ3OuHfd+fRsug31jciv7tpqA7Dd0i4K6lhA5vR2m1Hk16/365pruwhUJ7lByTSwodCy9xKdGcUjVyxUmiHidOhkZXqnNVY4hJ017xGmI0tMDdrSSOn40YS4IytETlDzyEB5hBYSUvfjmZT39i4PhA6YafYfAnz11QDAIby/23zT07io4vUyQc359hP2VmPO+/ffSPNs/sIeczzrMMvC113m7gW9ppKlJElQC22NLjO75owS4W7oVeu9KnPvfh/Qdq2q4ifExQPfCK0q7RFtE62/+ZwdumGmeHyYqc0u/Egdc7h7xMtMUblVGi8uzNfrVe+p4xX7jnJ3z99/Z/G+f1oo1ZfP/XObteZKnsfdO34GrTmTz1x7bRcmhWZeWWRcsyIDGZ03s3dFLqV4nL4OFUR2Le4RZvANVWQ6O7qq3COy6L46bkMoY/BDZMXdIOuoMemukasQcawOHXzUWOWDkjcDIBskOWCZCmrGqlJlhzv2uU8AdlIGAFTcN1+vky8ZB0oma63IQiJi+f4Z1y93RwEJj6iStZCZ1+hoN53TTGXMt++7aV4EO2J7eYlqRSWo0hZp8XBli+i6m4QwVDHNfDvtJBD2HsS0KDonzExkqnaafJ+iJqKRJOUa2I6z4ar9eYZUmIBmnrKkogLYkeF1Jj/U+9lNFJxj/jzL5puMfmXOvfk5s8mIKvdyf6owh4a7B3woNdtvEIHMeDYhinIKwwtmVUVqpv2nOlc7y6QvCjJEZqaZ7q/aNKpDb6msQj3bybOBD4/+L0mAMGWUNX1fVTOk1j9CPgs7T8LDffveBUJEpiGHqNgYswdlc84xzD2IAo4VpAGsDV1U0R+/m8E4roFso0upaKcyFiRLMpeI6vE/YcfBaQLzyrB5/fzI9wjvkl01vqQMr68AeQIwPcSAyFgZZvY8jypiATXPnmeeHkbto6jta5k4bQzNVAEqqUIlYSrtwuy/NjMblpHv90XifsYc0/cDSFao6PJUFd+g6lBxX+ELqR7Yu1pSKmqqSnR4JY+y2hXpNjSjSioi9orwFXlE80KC5rtXyAHEhxIIVFVVlmcFUWRSXkj/ZPwdAXMSVShU67eJENHoh71VEEAdotZBITVKoOUDanpdb1MVSdLW9o/ZF8euKI1NZzsesthvDpWfKyVIVNa4vsEFvZ2LSlyvU4OdRf2Je7ChXJIi8ztNWpWG45sTFBmkbfd5jcw8Eg3TILZ7gcPUUR5PpD13Bwh4VXzHwZGoD+fvM/TbFEbkWkKiKsjcHnstU9weIFThXkRG/XGrdtp2Z4VMk2beOEhhow9OMqQHoJnxrOiHCu57RV9ToBnQkDJhgjJGsxkvU9i8GJn5Y6Y7vhm1s7FoDeLuv+hf5/0y99qKeVnFSaCrkRGJhUAc5lW3VWbGk8kcAD3wrG2mlR68qsKMv3+e3ixu94oTtRARY5pSfDfbLNUuIbIQGa852r+LqkJWdQx7n9Y9bsu98xAgEzwmQWMWqapiJrHWGL3NtloLqpl6XVqFLKhqxiXDt6exre7BFr5D5tC9WUCliqTavEafHOJBUU3br/fLt4+JMfR5Vq9Rv3OPP3zcxJwqn1iABgaDUB3XfB0irMgw2dck89ev/67ca5942i6456AJIEfJE7He7/9y/58OcXH3varjkwGozJ7njmERooFrWhR3JFUOGvVUdNqJmaYktDFlWVSxaLWP/mEdRHh22sSnqW0yrA0b2XEyjbnNCBlDqlA2jgxOu6C/Ra5vFgs5x7xe74vkWrsKc5rvx8bVeWQQhZLgmKMnjY1QUiWYVRjKTKD8eaoJAwCqFkqq3D0qJ/jdl8UZIjM/KPbVIu1Gp5xBllzjguo9hvKaJDK26AuotZt7osL2y29b20U6GRTL4xJmxPJYe9kgIGvVfd/f+JaHvvYzTe4Vc19zjGc9KkrhNfEsb6NYZj3rJOdQ8v2a7fMv6LPzJVWQrnq25xgi2QgkgDBTj2gha/cVIqTq17UT4VXpi3s/VUfm0QGpponGLLJazcb+4jO2MNzVxl6rWdN7rWetngn0vZzZAYr67BCRa6oQOv6DE3OMRZUZ5funRZARDlhLIZRSFffThcmDjr+97N///rtTPP4O7LX8v/H333/PMY9cqhzA3hL7WZ6XXCgPkb22uz/CjySzgz2VFXv5dleGR7V3P2LPMcTM99qODkntpMqPRX2rKrRxr4WqjFKpDyY/VCSSRHaYVVZmCuCqlyDPKogneFxEDmKpqrErlaV6nXQFkSwkSrUzbJxgVpppRIg0vsDZ1Fvjeo4BaBgKZJWpUNhtW3jvG/vfWogojjEOMAeorDE6rAb3fe/tukr4VLUg/FaVvX27q5y1A1nWhHFVVb0KCzwREeJ1zYY18PV6va6+X86zYooXB6XU1NJUEIkxX4XVXMhhtjQ+3JEgQUGDW3uD3VWEEo4Ehgrb1uv+ZG7hyfKOjGpA5D/Sa1UZKaoqgUgDhVjKoSxVZm4RVW0LDlQlEqSiigzV+bNvG0NkkowsD77f2DtUtSB//aKN69dfWrn3/kURj12VEedXc3cXzpJwN1Uh1dQ9OgxvrdUdJ1iUNLPKKKDqwM1F9GU0xeuyjDnMzOgpzx0i+r7kp2yiw1VrWmVA1ao2BVmjo0bMmOhKTxuzKcSc876joOt+osK9P+eqxO4MGJbvfQ4awKN6ENMPjfsSSmED6hEe91pPVaVdUbn996/3df/+sTE+dh+tdKikg6yK2PvsRtfPIs6nHRm/f6J3gsMsw71OvkxsB0u0hGB4VQHR7yaKHmqWVaU2EPu6VKCva1IKyd4hdtxIM7obh5FRqlB5LVumQ4gIP8Rt1OtVviNRQnPfVWnsOQYC0GGEDDn4uOv1eo0xtuNfStUZkQ2Sb+JxJ7+OcfVeaQyaopRBQKmKObQDQ91JMVBeF54dqtIEzLUzYIA3vZ+VFBVRGy93VwrG6wAjihogI7PAEUlUJNL9UIBIdHRUT5wiwkY3Ie7OcJCxnSgMVFXvvFaUoNIUgl7pE8DPfeuOdo3dj3f4APmHmmRmFA4lKqunQ0+Cvev1c4+LiRws689PipyZ30nXyo4rkFaDms29/dOl/VFbHUL6GacaGVWlPNHpfSGQWaURERnTXjEwB59SlAIx55xT7tu7rbwG//0//nqJjV8miBJ3L0hBrutEWf783L/ec7td037/rP6uw5favK4XRT8A2lPdtejf3dW0oxB//frr9++/IzIDaiJlez3zet8//zY1d8yhyzmt7uoVp4wpe92qBtp1zTmvn58fM11roeJ5dhuyM9cJn3YHYLo6WStiA9jO1+v1lTI8zyOUMcdem5KVMgZf79d9+zX09t/dpHUfAHco/aSdl2dieW7PjN/3qvAYs6NOQ3Q0Ht0DGUWeDEqhgUN1R5myOgAHWa+rvqHWgWHFFtZXZvPH1xJjfijt2Wy21roo08/p9WcZ1AzGhAGmupvkkdFBGJv8kp/R6igVTfWvFkNQCe1wS8D66blX7V1rUFk6XtSWJ5RKL1bjGry3oyWuwsraUVVymCRSX+cxGe4/gPXHFXF2kFFTRMe8nmeN5hQgu6vukEJvcBCqGc49o0gcwumpBMobK9tj00xkQQQqMzKiJBylLPC82ExArqFA2ZS1fXv8+9/LrCjs/lUQCX1u+drJ12rcLzJi7fXrNQHYqL2en3sJpYV3vcHthrKyShzwcN9Leo3Ye2IyP/qUf26kPWoC3kI935lZVU5uZyH9vr/hn2cY2vGxppjXaCJi5rHdNb1iDlWWDkW5KTAPu/f9/lDpVeZ8mS4PSBHlHSaD7xYyMVr2OEcI56/3RVJ0CVLHFckIV7VrCEUydpS+ptT7MqPatDGcFxXu3tbBk8GWtfcJIeyt07b2oCy5+dw7c3QpecJY699CQb1F+POzeyJ+SLeKxBAhsvRIKXFpeYaHn1qL5mEDyJKsjGLWaQW/2NSeQ7f8uzmsOTit+gaoHSKCCpQPsy5hbByhTpZExlD6wUuhZdg4AeP2Yquz45PX7WM0liuQIfyPJnu7q2KtamSYjWMYmGYoKGEWZuw4xDO+6MA/suUJ/WKTmEOWgsoL0opG/ez+MlOK15zXNa/Z6J7D52t1wOcXkb20R4QfcIjamGSI6lAuDeXJ/EwkT87OAjTTeqHR/+jMzIBFqTY2RrKYIKhRCgSZnWhtY551mKgwqUPHvLLNOrm3dIgbygesYeMi3j8/KaCBKdIr3hMw/B0rZ6zIooLYqOH8jPerI81hnRulpu4FxLMjYmfAff+/GX1loNxsZVYvt/2DRai6w8ffv59rKuivV7adSqStAPXBC8dQ06NuGi13UQah15yZNexQseQyEYJ/Zeav9wSHjf25EA5s7JtHTbEsF51RFGlRmnWlcQ0FbIxEBkSUCmiDqW2+3u8SEdFBkTMF1mGDDQy78AE7VwZNiJMZZk0wRm6nMIoR0TjNrKjw+forPNZePUdqdMeZXQBm5q6FqvJIimjlJ7cUNpSRIYNKMUXS+imBzKrdMNMWCJgyaAUlXSjBOeaocKCTEzoqQTq65KsCajtlVE+9LVveqqLv63kWKF0jHZ1phSmuoZs14arIxPiUtVl8vWw9Gx24pnQ/b5EZwrfSbve+Fo7YJMPXg/IKzVidQLVWoiorv0uPjmj0fc8hez3D7FmPiO6Nj4KQIoJs7yUzdrE6B6FKAV3OLHlWNOlepY88F1YmPWCDJ5+tBLVil/XKcJyjHybXSbmKvK45h5p1VPexrva+bZhud9I8ME0aRNyW4hboRZ2S4Ito/udVY80fkBf1At1MWcPdh/XoJntElSdg+VNFeFC49vLtVa4BYUdSYwXQvpbOBo7N5m2VixxOVsfBk/n8/NvGm8K09ryvRrb0ElEpHRgIzGv2098G0TJBAwPbiUKZIhRpwBGPJtF0TgGsf/I5ZS0dyn1Mz5m0OfRZT8vIRJTUhuB+vGb9oaWKEkkGq4TDk0gUSgiVWqsi1rP8uZ9O0IHo2quAjPK9o1DJMTodVTzSRv9e+ACzWk7ipCnpsSr44VFju68OsyBI3I+/f4029zU2nIxGITXRNWtlsQLu9bG8/jmJe9S23UGDaEbNKesJ0x7RJNnLQescklZ6ip5hfzuMj19FpBfkWVTF9j/Ktmm2dsuZFPuI9iqtg3BETVDTEKWqsiuS7E3wejIxNIqZdz9q/SA+zxnDHdtBhFCy0l31s9pcnuAkvbMJlJVZZtbzMVJJgyjZqlp3b3PKJz6WDc49nZ/aNMpaiydSuuFK2zPnmHnCiStC22IbNfTEswYZH+Dm4bODdpZ+bPdmKmVcv77xHKNuM5tDT25p5M+z8LS0cPmu96+3e6ogIsqoqvmBpapKhlciEFm2WZ373H5cEXH3KpvTlAnBUHZ3ITYGho75Fo9IHVPzQEfUpqb4s9xxrK4dDkszQ0aJiKohQ5UFvi4paKVFLhMM02mGKVspQhsvVdHPs1iVy1Nid60f/m6+U5SrVGSIe3cFAKgzIj7BHFCBO7oKz+xGSD8lWQyByBRBCccc1tFTqe2G201sV0cn+TEbB5rZLLOjb/2U9fX7Z/W/GgBeKb3Op6pSlK8uleeY96oINJq727PGG4tI0Lp9LwnARNhzwW/Sc9sz7HVZi5be73f40yLI5/6tNeecynTndXX2I+77nkOf+8dUgaCgCo3lkWYEdVZy5UnBEEJMZH1jxFu4djw32wGv8v4/uyyrdNIqd5QoBS2h03E/Txw+Qxdg8TW+VEAVKur9zPP4dzt9RIUeUYXnXqpwV/cHwN7PsBYbL+L187N6nPVHl0ZQuNbOg/rCcu719I+qZn7CZqQTfHdUFoFSSpSjXFiNvQ8lsra7ZGTW5+VZ7hmRdpi4KUzfD7JjTrpqqoi2gHjbTbLYWhX3kwfDBr2teNbaHmYVa2dGhIIuqPDo8vWvX7+kjaSKkHeXlAUoNYuKOa/Rz9N37RPxYWgLv1nlwgQrGUIVkU7OjUDrxCrz2adqHScRXqjXsNY73N/mpBcgyoLiH07FjvBIZfWO73pfz/rDbjPT67KeBWsf7SInR8NOKk9vbIYJ+QLc2rgjMueVeVhm//NvAWCdyIDyH6CLHGG27xMVr8uIHWFZbnqi/1pHeTS9wiiHuyncf3zfmd3TZIOAfD0tTG1vzvkEP6A8G6cxrfjQQtPONlRnQ/F78KrqqlC7TkukJ3hHiVDmimfznCKFvatXyE8A2DiudJSNyHie3fbOveW59xj08MxsElaWgH+GDz2F1CF2qsSWcI4O0YioXgt9BckfRQP2LjJ2NDe5i+ymHUYHkka3jO7A66uSt8G7f7wqQaFFrKq/3vN+HH1DmhF5vSTCtxlQqGWq1+tXVc1h+r7WesCcY6qqjXiWhy/q9f6VyoLo5MkH/PmBiAyV8KU6X1e1lrPT4YXyel9k3rePOayBilnDrIH2Zh/vXjXTfFcpKjKa5HeOtqrYhxIJwKK8BwYntFc0HB8Pxzm8OPiPfbz+E2UQ0Vb1AuJE2pRHlMvdMW0o32sD78ysfBatyq/Xe+38VumNrrDXq4OZpPMl+4ZtPx4A0VEI0gHbu9YOVXxxzWNEpX4wJPjGUfW4BgXQqGwNmRkOk/p0yZWNJP5gszJLpbenM7OQ31bE1soTepURIc0tPAOZDrQaL1UJb21tfMkr1kEOmH/Mh1lC6XZlKNcHod5namb861/v7bk3GpEpIpTYDtTSl6KikWnN940kCVaRpA4rokC9DHhdtUPnlOqfUAC8AGTKawiAa8AKFQoUFHv/8ROSsXf9vnmNo7Tp0tzdx3DMSxVrlwpFqGruIsjrerl7wSIzwoX8QjBaMCP845HI9DFsf45qsxZr5nbPCmHNqz/hbKWNyIk3BfV8euehFFFEgEobryxJDBsja/Us2z2/vuf+6qs+6YMimRmRZsgs4QlOhhjwFKaIoDyK7a4UYUT9Q9nRh0/+c6p21Iq0KH+bqcrzdBdB1Umk6FxrXZc9D8zMfn5vESfNFBUbn1VAG+nvxz8wqZJBlIjC9NXs4vb//2l0KN+G9YtBbfHWNa6oA98byg51FCbVcoVvZlamVUWVRmS4A9fBS0XnUDweAzhNnIpHWM/X4tM2Z8KUDV9Tmwe5zn43Vr8wTXufs1c5Z05CalZ1jyWUa7ZxZwMFWASth6pgLx1F0c4lUy1oZ9dV7AyvctTO2GvfhbHWh42X9aFc5ecmtI+bQrIE9ZyKPENZpi1DiopInJHRz30DL4/nu+iJjOu6iNi7fv/+P7///rmuEVn7eaJkPt4s22cHymPA3bMLHJG9D1e4K/JWC5MhnKioElNsSn/CXzF5I98AhC8VLQQqIpdRfd8Z7i56HP3Rx9Ne24ZFQDVQ2aqnVlMfil7wqJJLkxHRrpKF0iqnSGYbZYw0inyfuu9H2YsRLakMD9C9sir2z2riiVWWjSWoSu+wSnffS/9IDCqTSiSuOb//5a/3XNvOIJIS5UR36zGsF+l6rI/0qPd3zVGljasGsNc6sO9PCEDLLccca33flkM5Vmk/u0EsIqkfJ1tjeMp9e+bMgNH70HL32A9obbE7kvpYjZ2i+H0fWWwbXt33fd8i8uwDzGh5Y5e+f//+e4zh7mS5+xjXXqvHEaeZ/IrOae5bDowEHj6vcd/0qLUq4+Qu91UYGUM1MihFGb2X+X5cc5pzZJaZ9gY9s+YUQK73v4Rp47XW6iX0dU1lDHsLufb+9de/IuL19l+//tt3Xa8REe4FdzVti19bc9SmqWeiAeCfs78lpZoVgESaSAuEReWgJMxw/6wo6ff/w7CYAPb2MabuMjud+p/8v04nITBHRYn4sNd2P8e8aThU6tMlx1ef83mEkAgPmmXLqveu/pz3LtS28f4QfLOyUDvcfP/8PJGV7vvZo6cyUa6sn99oUMCOg0wkw1SRNb65YB6wyrbJq3i/Jqf6SCibrFZmBkSBbVefo/GXs3GQFaQOXTrnnHN2ffKZSDv1+nzxW0SedTiE4Tjaqlb8IpXpXhCtUupxkPV7//Fe5PwOkoWN1f+Hkj57gjHHeUubYrA9XlmRIe30UP1nDo3qhSNh1arwSA9oxcp1NAqP92rdzCMxh6pJhrRunET/p6jaGA0oj5K905SEhW+pMtPKFGmGl/remS339376q/siIGMVS20KM8pFLhNEGemelZn3/Xdl1RHhbV8NKGeVjGFkKkXdM+O5n712iyy+t/deRUYwO0jmGEGHubufkyl7x3LC7WikKNM9qEQFkih3p1l3X/44KsrDRdje39fLMvCgqxbJWNe0ow9hQ8X1G4arTFHUx9VkHQxgEdncJBtzCG1e46N27hGzjXltUxvRCoh//fXqLutf1+yQ1vYhWEVEVhCi9vffP8cnVe+1Y6/1POp+OOZVz8+9TqLbeUXWzxOqnCbAos72j1bWvFbbq1EOuu8f1BvwivJA6yuF2UnlzaXQZo/ADhtUx2CRWpjgoGzq+ZtV5hzNQ4eq7FWgMq9hQtp6SgSZh4ohPOyXU9WoAZhydAfvS/sD6s89P+GBPc0QKZERsV8vvQMqMkxFOPoJyI8i1Z08zJLOXs5CS+nb2QQgc0VG79EivEr3joj9fv/Vj5cqTI3CCm1uZUVRzATVhMAq0RPp3KYfdlKVV/MqW1WY5d+EOUpJZ9llz6AAQ37Y+TaopZmhpuEfc4yMDw1FVLww0Xq7KO0N45nq4rvjg/3HMrvnj2ozy9XMhlQ0BmraSN+dEnna3HOcRwEylJE+p6064CkRUq/C+mItTy5q6BgAUukndydqR00VNCDIInxVHn+1u9+P+777HajYf/9NMxPW2gvQvZZI2l9/vZtO8bpsmO2h8xp73UcAPO2fKszwoAyz/eUCVGn02Fiy/daHQET/eYIaw6wL0K6Cotzj1EhqKsy9tkbFfqJoZ2R9hUdVPM8hF1QC5dvRl0CG9hSssCvn16efGXvXGLECr5d1lSmiqtLusCPygTY1aE65Y5m9zEZVNqs9s8dqOcfcvhs+2+g1dwdo2pFHOWUmqzxtvDs/KjNEube/Lq2Cqrqjo2V8FwB7zb0xB/d2EWb0Zmg05Uqlng1VEPGsqGu2oUzI8EI11aLCCYAQU4KY851lgpqvv5ZXtV2VTuGzo2WxHthr/+///b/WUvcArPfiAPbWRk9XGfWygYiM+q4xEZ80ZZSTgWJmFS0yTG2YRTECKtWtdo903UNYUeKeNl5zSE/2iBSRGAKAeokQ5ao6x8zMHoi/LkvXD1MQajMSvp5x/aoKVZP1f840LBoYZa+rAKMOFd3+UDrIQzJUC8IK2hza2FYRquijUIVVfaLjwChksUpacX5+RGWrPqsiYgGtIZMmD1JH4/DBF2Cv1+to5oSmeP36NUwgurcc22SEqT7LyZhzrAVtVNscrd7pbZFakdoa7N+ZHXAwJjMtE6IjT/hFQUzVUWh6TyVORVNuFu6aGehoiQNEcEH4dhGu1RF05f6zd5tdtqiJlIgur/A0iyzPOBOhLsd932YGSkU0qTySERmebx2VACPSqoIMlKAAMLOy4n72693Cql3FqdL5IkMNqFwxhmaYyJOJqhCilfptf0PBIyuDoplYyyN+KrYHrsfX3oDMaT3qJqEigF7TzPT/+5874yg19NMDEDtxtYZFGXt5Px8tREchUyuYsbK7NQJgFD2gUjvqA7DRn5/7HGRmrcHsZtfdK/S+b8rdB194iDjF55QqiVgnOBAA8G/8rMdFoq0gmtIl+n3/APj1RmYhkkzTbn/z2VFZ2mM1Vuss+/3pjAXg9PrReQgXKis4LNPc3dQPs6A84qyHRfTYmTHdd2tTwSNybGWvRB1TV97X+OXlhEeeT/h5VoT13KNiP8B+1rish50/v3fH2ozJz5gyMuL15j+Z9CICDcDUpmYMAw9B0HTIX+/X/dxp4tGUzFQVSl7XjFhjWse7d6d1EPv5vl6/untuErp2YKiv+ib5UBskodK9B4hdiRICR4ty8OtCM+bOboeA7DOlr+kIVIYNyRIgrmH7KTmJZsys//6vd2atbhm0yLrmVFX+7hiRJ5Ki+nOvOUzoa6cNRAQ/n1ilRmV3dZWkdDZ9RniE13TRGZ6RodIxePyaOk5MkDIysjxCycg8c63MGpOgUCE6M3OOAmUozaAf/dy0uhEkREYKp+i8jNhV+uulX3Xa2cgLhzIjutavYFQqz2qpNQ76mWxmkefxOw2JSDNboSpVuc9YAsJKoYi4Jz95ZFVNpNVh8AqV6zTcX64RdsPoTIS9RYuw65qZKTIyExyZP5ohGh95I77j2P9L2FgVma22byfNbPSagGvDi2Zm+uv1et2P9SLpuZ00EeQhhuuwy7ereKOyTNFnw1p/kz1uKspTpe4/pvDE/fN8lwmVR4iyV4PKupk7Q8Punu/7R03P5guvve+h3FGZXYIDdWciY1f5dnQSfaa1IaHPc/fnr/cvDF07wGblCng2JyeMXkQEkMN+IuPZbDE2AHcl4+feZubb3RGG++fuO/25fzdThIxwq9inB49N/qqCR6pUj55NtURFx5gUkSoAS9WAoqipAmCKKfbqr8zzS3YpFCr2pnBHxT57erOWYeecshZiP+67M8yX8HXZJ5GOEWiGz14bVesgHlLZhocGn7Ub3VRlu5Mlwo7l1QNKChGt2Nqo5w+dsuuv/rLkBAriO4Tdh3nLaIfAy/KTdvV5Vg8qK6VUkeBLcS+hDh01lH9KfGWHp4AHTp9j2Bg2zGxeKhBnB0s18aIPIFPJBCpsvGzMidEzUxEBs1OcMlPbc6gSX4lUheprjgIwrl/uP8CoqHZAV2xwNFSvDRAil4gaQrWzfqvptte0fUK2g0SJtRyc35gt4PV69W7/r79+dRXU+6kIu4Z4CpknIYtm1qdps+8pwgjNompVVRXvVc/j7vE3nlbL3D8/a+/9/M7KzH+5rx59ItmZBx1E+U+0cGZ8kw8jji7lO4SpzIZmn8cCAvRmwIBsskgHjrSIEp+XqnMf/qFlqGFNJYk5lGIeZ9rbJB8A2wsVNphZwizFZdbSqYiBchtTmX9nDh0dM97B8Vk1lN/FVNMWwIbqYo75T2XyuQHIzKxsgiAsKooZuzv47qxYfPZ5HwCQjtSh3KWgVj6A907944vG/bgHxuCB72eQHUoxmlS5/7E+I4nyip2x/Gs4EoFne2eTlIwlontFTPN4sFCKDA93HdfJ4mNUqe+7sqLSMv59YtlARriuvb6Ii/38TugcFRkqey+PjLGeZz2f8esT7XsU39uJdfHqOKeMjYq+thp88nq91vPzXeKgIos4DKEYhu20HtQIK+u+78hA4nmWtoI9aodnLOW1o1pM0nkP4ThsrQIpR8+cnVreVcYZn39QhyiUCnC9UTWHqL5Qqx+UDnLsKw5Qs9FCIMIiSrQtjl5ZJ7+js5XUpIN1yzpA5SsHOHJO2ifnvW+nECml+WcE/NXbZGo7IrLEnxN8JqwWRODzHlZpVdiwKo8IEYSnf0LR1fpcgFJPDLjifaUnJqMttTZQH1lOf5hzgDqkXFVIyVBRy0wwsjqUiFqSqaB8Zj5xDYXIXtrrgkizoRE55gUgQszeZn6S83p4OCX6hREFq6G/ACCzlZGguCepUievEqIiWgWrrLUXSrIkPFD+70UgDCduutVR7KCeogIiZx7f5bKKoZZHW3D++E6+5P6mU/l+5pgVa3v/ffH3z9P7Cw+chKLPWRKJ1xs9aW5YUsaXz673fbs3FX16fAM4Dv6tx8kimgiyxuA1tHfb09onHBAdgieP2tQM0Y79TiXIqpIOQxepYarKE0YERPicIE2EjTlRJSF9somKCNdSUiknaYEUNVaGWaewQE0yq3LZeAHIMqpl7eosHm+sUI/LhBLLE483uYS3uz+VE1U4el5UsR+C1n63QLKHIZnZbjJhgVrlfS6S6fUHv4Uv1rf9MRSVu0+ltbOh+1G8eiRE1cEp1eve1ysBDLM6o6pP2iS9GYLH8VIuRCFQJqyKAqJXTB9re9v9O1vI5IBj8c1HQ7kwQJvDVGUMlQ/+1QxVzdHIr24vAlkwdWFFpfy5Bw753NT0kkvFX5f9nWn2Hn3oUjNzzrnWvK5J5DUv7JhzVnC7nySsgugYRQ+03vjoukq/eg9UXJdR+P411oNfv957bY/oSoak6dVXQeO9vcIURJppD8U8DqinVTHXNVVcOUAdJj1O/TOhT1Mp0SFHx6s2r6Ysig7TSb35kYL1J6tq2o8a5b5/hAVK/79WQbA9IEQ/DWY9eXCzS/JQ1NmwJ2cHB5GgSFMBGxdMwD0pERGnQAI7Y5hEQVuxlwWPmGqAfCY5SfC6LpVjQDMzoReIQoaLYjt7HgKw0ob+xwhBRPYK1VNXNGFgXn/gRSIN1cNashba6wZD7ALrvu82ytx+3Boicg2JSK9KUOk9CXS3z/zNhB1qbW1tobJ5QThX684kdVRUB5LHP0J8e+inUrdHm5Ey22wdZPl+Kp+1ZhcXc8r9c3vEMFE9K/wAMu1fppGhVf2ef00pX6YvadZ2io3WCfuhXMT5UZ/nDo/2Pt/374iGXHdxtr7vbIZX6RGHqLeu40uf6z1D14aZUZAo9tSyi6bQp+uoOhtodfftaYJnrQ6KBHBRq9Tdn4c4rUgsR+wnhZXVheDelZXfjnlj4/HIeJ47/K/Xtfdaa62M5XEwY+9foyMrzUxNVbB2CN39VNikR2qkK+tnHcFwlUfuvQLv2AFAgBCBe2YG88CLqkLEMjOy6BkNvM1wP3fah8xwOJjhgdmE81lt3FbwsMMjgMuwoB7S+Ab7YzqRofSsSETkHAPAUMlKkQINZBYi3RQV1sqCyKh9IFlaAYR79M90P8e+utfozNa9VmtYlBpFJeKkmXQ8YWM21Yb1Q5lNUNETh3NdvyIy/BT9jYrPjHmN/Xma1srw2mth6l6xgfHpewFV4vTclr6XiFawOdLaY1diO5VN/QMQFCULiApLJcozq4WPlWX/+uu13fr+iqYXZTyfk2OY4LJWELyuqxv/7jjB2YI2NdtdQNOi/qhlVDo1VmRkFau0okQU6Rm7MNRmZr2MPYzvDV4bDyLDBFX9E+n3fqhySl5D195j9Meq/JQiPQpsQZtHRMCm9tXRoAgKqTQb3VQZ7brm3q4651woAzvKgCqwMVqcJzoydYwDQXhf1p1JZ72oxJhv8R4cBWCtZhGBAFkgYgz1nRFdomRlZHXVWwJPlArUmFFRGCrT7BGtSiESUpVCSeSOJKTACHTnQ0nRjvXCnJJBkYNn7fwkD6doFrVCCBGiIKJmHEm1Gd7/ufqq9GWR0eOaYw7W0054xF9/vUH99Z6V2TnzZmhaI2AifV5grcOqOCHEUqoQUZMMd5Fjce4EoN7pivgcr2fFUIqMzkXHjI64bNo2PnX4Ub+1D6EGWa9rgEYhUabNOSn/h06Un+Wxu7cCQ+SDA+kT+oxUMVDxAT1kYT47rr6V3Csr0lqsO0ZU1irOkozV70ZmVlTUc5znjZwpd9/L84RBFPf6rngrK68LO3ZzG7/Y7gbGAYgPylOEwMgsm1dnFX/wtzZH5Sfwz7QX1fotBFvy8O0xsrJzjinZTsihvB+PXIC+3y+iwn1RYxfgPSfoEWrXppmZRWS0PmcO+b0+UiLR+0wheqqd2zEv8UgVPe1g9UDWyHh2ozbjL7FvXRTnum8CcXfAmZ5m5t6GDi2kMOOPWCAEBin3ap8VUJko1Gsgg5llxsxqOqJ7EyjD3bMk9t4sPE5GZYFNVHUAXuwRVWU7Y3KvjQOOpqEtvhAdSut5S88PKZxj1ltaTzAC83pH7Q6JuaZBJqnucw7BgXKbzYux3IewKNZY895LZ1F0mhnKbLzu+xYqDiYGZkGaxwDRGndSVCbIOXTHISP0TLhtDJlh1DEmu4Aew0ipEgv0mGwO/WFRaWoR24smUaXstJlBA8aU9eiUTqaf6ymeEbj0LNXsL6S7R+OAhkkkMnPM91oPkWOM9TxNwuqMpr/e8/3rr0iEP6rzuX9nVpagwvfP8wz3eJ7HVW3sdngppf+EvUJUT/vkK6HwRyhrPxR2BlJHgqP8el/Pesx0ZFhpRIs0S7TJP9bBTc9zEJk9fDzMiFNT7rXjWY+ZVbXQ4BvJUd99kym8TunZXamDKIwhFRUKM0LmdAd1jjlmdLgYP2gQYVVRVc2u8L9tvJoM8B28iBqSNgrY0aJLwXGHNt7ZTIFmPNq84E6miA5tU0NT2pUaJOfQ+znc9nmZb4ed/HcqlEDWsyNTXpNVvhf8vDzWt5O7//5Zvu+9p4jc99O27D7d3f1oasrdX75v0RleWXcb6pOHvLvWGnoEfGAIdma1Quwjzqt+IE/Pw8QxUUmbNvvZbuvNQgpTdc7L3N0qdif7AYj96LhOI1ueomtHBFq0XEUVrQKF5QVlr3LoWDuaBhflfRBmdERX3T/ReMAotijomtd938tT9d+V1V1O5Gq4jdknIkEkYyfYfdJh5xfBoSqZcl2XKd7vd8WO4tcYoBJHyhoghwjHfLmDN+ecNkTVzxMZRmWnFXXggrI6cbtTQQFEAtsrCzZMvcO8QM1iFPeuxDGAZ4n7sxXuC+hWstdwW0R/7pURtuu+f1QVaLEA+yoDjWK9Qv/OZAnPo3/sqQ5nI5Fz34/PWse2ptETi83qhO2sDnRjY4R5uu2Pt64jlc+sQhqKwQyKqQp8ZXaIb0egA9iAqUlEqnhG6biiRDVeesK2VAdFMkmFsMYJenJllYJMM5lDhzL8LAR6QtW3/VePGPV034hyz6wUT48MDN1rmY21Cfby8diIUahyEWsXuAj2LtUtRMWD8rWCUyvmnOIumW3n8PCV2ZwMwFprSntfFiUzf/oz/eClQoQQ7ZyVvgr7nWlb43fRfeqEP1K54+Wh8BA1S6mkUBWv6/sQRJuM59A/ok4gwSqJXH/ku7Ssg2QC4BV7/Wz3zPANslRHe1WrtArAWTb1dkyY2vtonYCpJSBjitn1em3ft4pWRlWMYTYmkO4FIOXUnXOY6OiXzczMNP4dKiY65xwivK6XPM+xw5lW5LP3r1+vMa/wdb1+mdm//usv8iO5rW3ajBrRM1PacRjIzTHXKnfPCPTxGTXacfLRcYEkxf8jxjPCzNRGZo45RLVPRMDc/XXZdXX8+P71/isigJeqEAlMRJqZmlx9iXpPzITMql8RGZX64ZEB3l87cLQCWdgOUKu0edQFqZI+MlQhYlnSk1kzgw4bcv9AWS5s0gfqlLdZvIaqInOSNXrkp5hT7tuaw3DQFYLKini+0xdyHMNtHSaPMoRVFfg8Y5YYolUVXbF4gjyLVSGQrqKZ3rqUyiqi8yn7zK5Y7ta1/t8/zz8MEdaSTzLGYNY0pohAoBQbr6rd8WT9Hnf0mBJqs7lx8/qFtYURZroeKqsuUsys9/C+70wFB/DT2p6+W+0/TD4d/4gsEdH8GF8iVmOu5zWQVfG4Z2Z5xOt1obCWZ/Tb7qpnc6SsCGTewKvVTYVSRfhTleu5qyoM4TsTorbXNkNl59F4VkWsyP33378brVMV7g3LjLWXO1rNtnauHRUroa3rioD7FsrPfavZ7/uZA6gNDg+a9nHuA0aGiW0Eyn27iHYB2c2eOzL2Hae/OsP1jO3e2oT7Z5ORoe7jHE/lcRIlPptpmiOo2aXBnNJzv96/Vukwi4zH/fW+sk3xzI/5LjwMyD4Wux2yYTZeEBGdny3VH+tpZKj23sr3LpdoooKwIvVrKxNWiVer9LKoo0cydX5sANJkLpJRzJIxzQDPWM2+JBypXozog78+bt2gdpftUTCl8FyPY85rNImyQysk0g5kvIoSnzCmVaVZy8yiEuWRy/1qzET3+CL0vm+PSP3uPLn7vhvW21z8+3mUv1r95+7v17P2Oq12wKx8/xxP8wnGiQ92zs0QU+I/NvT/97/u+xFBRFCMKBGjaHu3QRuD4Ou6untbBE1B7Q1qnoAPNbUmq2lUXNcAZEzj4jRTHdpVO5WUMVSlE7mva0LIMecYU4isqnC1kVXDIzNNdV7X62LVL7WZYWuHiorqUeCaAhd1vP86NiNV+fW+mtUOCOpuJL/9w/m9HWBHiMwx0TVe16K9S24XPBBkjzW6cKj+hwLyEZ5AJAqKE4SxP6MLNGv69YJv631cZAhPUmgHnymt75DwrPLKElpvsq6phzwpjRiuT66Uf31kEUay9TJkS0WM4mOOygI7tVsyndIbdAFgfUh01nEH8aFRsqso9Gy6wZ80hA95IaO0paedxwT8SQ78ykIaXtLVtkp97+jMqhRSPj0lM+tAcNuByh5P5euSnlT2qqsggFKJ5aqqai3cB5A1huIaeuNNjc6pJYW0XsQIa8xLW91IcYEcA3E2Ik71IlP1Utby1Sl0EfyoaqVlJ33D9NzWzJqJGJFVzaZuzn14RUSRWb2Qh2x3akdkE5CmAiMdiCz19YTq2mt7XFeutRpLquFVEFUiqkCEh6kywlvTElCGkrW32cjtD6Ke+7kuqxa2ZbS3W00b1hCxW4j2e5WI3PetLI+TSthWtDvv/fz+GqE+iLtoBbiajXlFeESpSa+T23gJxFBud0qSWeVms6lGc8xOdotiSgKd7w01+Yf3JTJxEpcPZcOiWpOSwNMmaWGLCJfZ6Dc5aiklEZVVwIP4y7Sy+sdWvA9fUP44oZVhfcyrYgzbK+qTtdQ4xWHiFt+1biKFJmrfmNVjcu9Wlj7ma6+OZukjQT+M/y+byRt0jNq+75NvzPI4WX3HdlSO8p+f7T728/vniWHah/rPfatoJGr9eOCkSiESCqBydnY8pj7PForpfjhOuMHj1+vaaz96/P59ax3NUjTLLRfw87NU91nlAihfT/j+AUePaHdUBMAKd8wBSmVjrqV610mxTuesFJ1KqJmAZhSBUoRiIhyjKpHeiMwKo8A09Rrb3cRU2YClHSqAXkNVw2mghw2MRkFGcaqojjlRkL29/tES9AKbIuE6DElTohQdt9HAw8vKhtnAempeQ1CPzBZNdIG6HkQoNap0XsNUtqLxzif1I1dLlf7+CSB+/17NtDJXyuq2+++f30qhHrduT29agQ8e9fKBo5Co6nwdZVI4dXYGQi9xh5nbjMAQgGblnyD4+s4S+un6LohUJcoaGttUCzvTpUNcWqCutZTVI0UP990/5chYe/eTrl9jRGW1Oq/hjKaV2YMHy0JXKaB2ibI8VeG+IwGOJueYgsQQdoCrKXTYs3nNCdo15G/ARp3mx2Y3ke4O/NrrGfPa65HTgpcIX3I9im51v9qkMUe7WK4plbBhr49cjEoB1z4knKwO3jnpqy0D8fjTkI05vpNcU/z7t7xevzL+bdqzcETpwdWCWrH3MhvVtMLC86yqF6b3Uvbn79/9Q77f6UHfvSWttaIA92qHsKqhnDSJuNNbYFEV+1nUU4L6Bl9zrYhEhq8ISn3AquF+HO59xnteyAMZiQBqr2K7bLtEXM4IdHCYb59Dhx2WPRDKq10TgugwUzPStQEizKia1wWzM5yprA+XQD1a9RpR0JRWK7VA/ehYewAK7ezhzqSr2D+e2nBTRYH346ii8O/f96/XFZWa1REkveT+AQD8vh+hvGiR0bQ5pYD27JD4RJNXsSfK78tEJGMrFRWmbTNzpYjOwRSRMWytdSqTxhvq6D+nNxpfCMy4LGI06CoiX5955fOsvfaYIwPDDKLPs/rpzxIUhfXszNgYQ8U9CtAqR7YUYmkHwBTN7BO+aR8sKaq0u97PgHyYwf1EKDfN09136xyOxKgiV0WMi5ny8/v3WdtlAujLobLu2Duq092amp+ZBx2ZVFUVxE5pql1WQijDzNLLzK5r7uUUEVD44W4CEVGJOo4KrdQ8TugYY0YsEbjTjBGlKoRXpQjMRlR29ymilVRVIDmsKRrDcgyt0sh/uoxg0mD/iCKFldZalW4RgfOJyZfKGydPUoRV2oMgkUPh/RyIzd0AaCqFtVUn5azbyTDT7ToFomaKMzIUmXN26dtpURFp5r3Z7eettWtgvd5XOyUApGg4QF7XS7SUM4tNbjT1968hKJQCQynvX8M33b3FiFXHIG7uTfBStQyPmKKsYpAsRI/nqpSfxVZ/dioakY2f//SONwCB7uUH8FK8f562B3wC/VZnJ1as5cmbldUBwMtzjrkTkcvMKiGKzKiyP76wMnxTkoqgVTY7usaUD6LDAOQnrKGZ7J25UPV3h4qalui4Jnqj3LFf2xO4kDHm8ED++iUi4dGf/np68O9dMvU/qI15qKiKTremjgj4vtVm7OxMHmFm7KiDE40MTU3MrAD5fr/d/f0ec0xLmGBHaVt0TddTaqNAVJipmkXmGGOvIJWkxz766E6jUsAhKtu9Ez/aVSICoYpJxhYB+KJ2AByQUJ17PaJtdu2CTTrp9bB3KuY1Buz7DgiKIqglRESqaPemmRUB1U+8MUBspLYVM+qbWM6IzX/YUdy9P9Ve5nTm+9m7MQUVsfszPkA0j/cvWdXKwgDklNCBCl+ew5F5nBuh4N25rvBdbeI7JkHRiYpsh+7XV1XqXiQG/HP4ubJ2bNCiJHKN6jHR7sKgK7coBavvjbUWpMM9Zbz7yOwovOH7xs+ec6KOHv3q+bx9GEQCVWmf3GcL5nvtzGrTY39MkQtpmbG3/3pP9EMPZKz1RM/syPBVSN/rCV/XnNsdopER9+82v86hz/2ctcaOw3Iyrp1tYP3D/+qtTcXeLbX1vXzYs5dHrgbex979DaVp03I7auVoSSIyVivBKvjsG+W+m0t3BHmYK8MbHtXl8Aemec3ZO/ire2+zah71IUmOsfdGRkTOOff23tKoKpFU3DtEekIdSAcSWfsEKtEMz9MRUHlIdSdRlO5nDNpWQxvM5vMAahm5IlUJSk+KlGIiV/Oit1RL68Ycz3OHjb2rIcsAxhz//ve/WwEZ3z16FdUjmjhWK2N77hVm8AjjURDFOb6lJ1eEiygHAVGWTYmGmyE+5kzrJA4VpXKIfrbWgfv2yiplv3ZZuMY1x3QHyqlv1h4zVDo6Nn/9eq29zjTNxgDc9yfYMC+VLqXWjgng8Hyq6mGxNW3fugJEZBu1Zs/XzxTIGwFtUaElUWRG+A5fPSSOwLPDI6bifrzn1i1JyOKzQhXafKtscr90OZxF90dl3tmg3OaxSUto5ugR/iEDoNyPrLXZyO1gPZr1FtipQXLMoQneqUOZ0QsdkHGNoVSUi2Aexo6BGRnNCOmxUuLQV1vi2YPCXtUHK9P+Zfu+j6u9lx5rL//Zv95/oX6o4/WyjgDaz880FaYnzExU3QuO7zIEQJQoQZUhKUwVVco1VFg2TKXW9szjIOtrvBNBweE+lHW2nExTPVcQ9eOb+GZsWksPx9Q59LpGT+3IaHn5dc0ukvdCMyYyM5PXUHd9va9hYk3gfIM6fON6/VJBLyI9sfeJHD61d6DH/YKiDgM8sJzfYa7Hh/HTg+TmtIlI1ooarStG+bOcymPXrzbFV89zwmPt9O2toavKLsG7MgatfZWiY1K/YxZgd8jVd/RUpehsD1Ey5pQK3lljDpTLIETJxxRjWHiIABxqx3tTWdc1TWFjvl9j+xuAMB6VrlUaHKk2x7hAy8xrWnO+VNTUdmhjEjU1M628RXMUkLymiHDh0h6CxW7meBcze/tr6nY5HA1EVmWStIKqBkUb5w9IxCOiwyzchSUIVKhahUfGHPDQj2+wH4IYdrk/h6AYABGVPYurLOqoD0khMoCEe+fx/P3zPDv0cXdHbfeDRjUz3z/UWbHmFADu9exlZnsXJg2IoggrispaHIOgjW8K7zpytw6X6USSb+ZAFasCtH9GzUbnhIN7xd+//Xn2XjFma+lCKH+kAxXP5qm0y3ecsrb1aZ1XMIcfermo6/P75wHwrAifra5vJVIk3AdAlN9HRnpFIPOp6jSGyxIeOLGSaz+d9F2ly1PrqQiqNrhBRVs12Qu/HT1zuKvc9PJ49ha2/v1kb6SH4/Ogf4Is5WMS0CpWROdvfs1lleUO5cevQMtMxOnwkGEWVSoIZayTY7fCmU2BvN239+CoP7XMHMc4K6j9SUmRoYTMjz38P40jz04WWGSrMFit8mcCksUMqJ12sjWhkQC8R3at/22aRpM9zVpoqFStHRQBNRJZLGgUsnQMgr1soYhGVp9kO6qTTr4K84w8d2a5+3HpnRzBxBdipaJmQ00pRNHsvPMARIaqZapSIAYFNasyTfsYvi64yzEM0b82sfZ295t5XdNUxhhVz2mrxiHsNvmni0l3//Wej5I6+oh8XdabrF7G7VOOW8cxfZxkOYZ6eJ1UGPnapiMy7TQGH6mTfthF8fHHORCV8mHUxs/9o6p2N9d+55kOe8ux7Lqua6iyXq/X/XgfvT0miKKaxorOZusS9qs08EBlEz8hTAHjC48HBOxp6/cJm2YVV2SM+XL3KqUoKlpcR0YElfUNdm7NlpJe9IgzBgeaquABj6gUD7S4Wmqcd8+rCS4V/rc/KvN1wcHMzHIb/uwQqef+ifGOXN+iy91/7vu6LuX998/z1/tSuyiC8hWo3O77dY0OA1XWriazRaRWelV6JAFVUKo8fAcpmQj7BEN3rj0lYlVVBlS0VSwqfHZTgDBMqqaqboICiplqRomO98RemjVeKns9KoiMMcfAUJUxRkZGph4jeSUMtDngO8GOxLEsj0rEUkpFbHcyIqQNLuGuos9ZHvcY9CZf7tjPz/3syoo5fv+sRrK+Lrvv30r5+Q3K3a8ohc9zZ/73WsssPpbU135+X693HyE99DRDX2Xdj/U+tG0YelTJCcsMQ/0tnCr60c/JGbdEXFN7pGZiqONMVVaq/te//jsrW4lcgb45qfbXe/6I2HVNUqhh83rrMAVq9O9vwBjWiGobtp5zZDbX5RrXsx6RmVlkRaB5q4eeF9G/VdTRuq21Yj8ex+Dz++fv63oNK6EBpzfvSKnGFc7JSJpp1KtqX0Of5UBMEyqvXnvFFtZ1fZyK+6QAzfGRiFSonnKw/wRBtRZa+GsOXZug9aHwul6oPS9mvn69bUy1canWc++/3q8dlT/51fntqEzPUhFVGZUKBMEEhwqoNobHDfZKQYEZCbVLdJteRMwhEY8KIdJbeg2PZKVntio1MhxlnUYMqYodsMxNCpqY0vjo0JY8ERGfVnVHrR0tCHXvdHH//fvnffUR+KsXos/j7ca870OUycozK4zV+8vnudtB4r63h7m3SvIJNDu+IkKRhcuuE1chUrG+Uu2uq/vkGh8T5oHd+sjO4xYBJKOyE+GpkVGx/RMX/ZU/mJkNUUqn2I+porOZZf1U9J1uZlEUzZblo8GKOu67lafSVKgmx1e/7t5+vfRGrLXm0be3brY75kZ/UYdo9z0mwq4d0cbAijHn80DFmY2d0jEMFWofUue4Xpf1UAjAwk8Wr2uS2SzBhORBbnXM6MkIiYJSQqUqqUME7i46q6QnBqGSRRMD/hOGgRJRkuX12UlrZoEZXmrqOxKagagTDVTYEZIBjPNjVNaK9cejDT5rk0kkwGPCgkU8Y1hled7DWDkh1VEeTRXavuZ8rQVKTXIXokpEq2JlShagsRdA96BwDuy9NlJt7u3v1+UZ7hoRqATV5GzrGlSqIpmHHa/CLKia2UnjVNZxa5g9j+dZ2POPjPcYklSyAVDSe8DEyeY54t9Khc5rfM1AItLJxENJVTPMoaCAFrXMaDY6t0r17A463pzTBNXbBlO6dzBefC3C7syULNm7hTbQAd/1enVblfVJ6Gp18ImUyid2ue9eOwCYOrppNBvu2/7+uwFM0XSddh60Dr5Xmfd9u7sFKvbynCYpstZjgW+vk4UvNTszKxxUEXHXSKdVVeztXx4BGqKf1gSyLxLsZDGwIlLZgPkp8h+OaXePeqtKk0P/ZKcxVxSAt2XF9upFOqpcYFH8nCLXs5eIxC5TrB1mjAwm99oZwalaqtegQFhzyh2k0hJlQqHRrnFkFy1GFhFURQSpVYjwQno0qIt7+TJX5d51y3ru+wc9btrP2h6Jl5x1LASIDtgkUdTGkb8uTXDOWQilmqqojWkPHnc5JhDkMMksJUuYhBDR5l7iMu3Yi9eLhZmZrXtXlX+Jfj/5YbKv+UWCunsLqPZ63q+rJzb//p+/37/eqmJyVu8fmxUiYjYJndVX03r2aXaltVFw32aWSBT2/lNRV1Qqd2QWh2geSopSR0ZdV1vD5mcWIqoSJWrWIsUDCc5U5ZcppIrt6uH5cc+4O7iee4/AdeXzLPsz3ma6e9oRCSqr6rgxTA9eVDUoCA+lfGRG6MYgkd/7ro+HtVb/Oc1UkwPhiKaJJJpEoMZsFFxhfkdJ+I4j6j86zs6l/UZHunvlyYDpMW4n+LbmorVAWToHdmR4keyYx3YwUzmsrpetJe9LfliZj5lkNcxHxjBVE02llM3MajrNMPksTKBmY4jvbM8jex9nuv3kq1aAZByNlojK+3rfz6qTxJQtn05JEYno2AFQsiLARsYfVxhZGLqeZ4AR3F5dvZihwnbknHoSkSEeIYpCENXbP48qzE9OtQEZ0XZpoGJvMbHWlfRvkiwRfthBQepeT+dkm4FirW22YabXjqoK9yNMUhUbNeYljXBzgFDKmKe8gkzGGoPUE12qJXPCd8Yfp2ec0JY4yZBkdvAwYKZwHR+JaLpDJLqg+LM+AigphSZXH1POCfvqra4IAB2XiFTs82FnRVHhmRoeqHq2Z2VGlCKhGSGajU1331l5LIi1EyoIKiprJygZvlQhOr8emr5Vv6SKr2Whd7ffmwRVxuw6vv0JERBE48KDLTprcV+KAja4g0pVNUWNY+veUUM551gPzJApwkyiQcHVBpP6YyAGQVQzATxyDFOz52d9T8rKbBOZSAoTxchCVRVElLJULmcntOYpuIA5LDNAzUozNRtzFgpz6LOzz1R8UCiAFo8wCWwQZ9tfjt9ZSd8Ex4e5Ccl0x+1Z5b4rK1TV3Rdl+uFbdf5nn7jPDlNvPUJljSnu0fJjsGceiCjMI4ynXuTvishYgqtOmsYn8oiZnwqqrc//eBBbqm0UUZkiVJvICFG1+X5d21EVRHrI6/3uB6kyRYfNSR2q0mVb60kbzvW9qYQFjs5ZOqc54iuEiQAwkNELzagRRa1OqVITppm0oiHD5jXWA/A0QXMK5lxrvf+aB63M+rAKT6+TYWNeJ+QiEuURe46rs0DqE+n+1cz00jjbFRAHO06WClu5sPaa1HYp+P6T5nCgVxw7ak5RqMNbA/ORtaEtv5VVYoC3fltEmvcd7nc73IV7+bzGs4Iv7rXVDl1w2kzI4870tUgc4LyZFYtqVZ3rKmZ4vc7moSDIGNevqi36el3XFRkllTFNr9dr7d2RAnMoCR02rVkmmhEqpYJCqlqmVxlFTPk8W8YAOlrm4MJFUEU1VT2XrVKKaoMZRUJVfbuqqBA25jRTW3uJiEzRVBEZ15u6W3tzBN2FNoj3q/jRRwxVyTBSK57M8kCbp43NNFjBbNJ1U3eU2rC9yIjIs9vqbFZILzqGyf2kmv6zsu1o+Pv+MYNv711nP3JdvfTI/rmfHp5eQ/dzj+vdK/ke5a2VUbQGLYblZ8j+ZUmI5ienC1Rac36+eEDBnyjMrDYQ/ZzOutqmfSBe554yrL2yGnj/+TSLH+xCfz2IypfZXls/72VX2y0FOxVbq8bdX9dlY1ZZP1LuG3DgXbEhl6j/+vWXyaYM6uiB7hzSU2TRnGOOecwTY3Bv61FaVGZYt+DXNR9bZu859jXQjNSh5htQY1FV5nwJ4og7zCKWx2OiZHqkb3f335kN1q18vu1az5Hv2xtW5e5UrufuIX0mydbDlXuajawNkCIZkemZBCUjRSxyE42WCDkwryM9WmyilKopRdxjmCUpGsoRfr/eFyAVa8wLKKBE7Xtyoba7m70jVps6Mo8N/77vOWffFRrQyyIQlRVVRVElgzqq4sQGlzRsq4HsvSvoY2iv3d7DzHie+9dL9/Nb+N4uHVqBivU5OvXExcLU1sqvUbhDLNtVMqc0qWBeJqheFq29rnl29m2GrNJK31KV1bHHygo5ER3xsUTV0QLJkd1kMUqBVuNIVg5WUisf6kjvKUrU5x1QbROwVBYEytpZatqvRockHzhC/OkNvmGXlRXl940KPyQ9857Kt5aGjBNlVd4LP1VtsJQpVPazg2hN1ejlJSq+cb+V6seInPFBxaOYJUjPzG5IIHPH3UQMQAC678gzOnBHxnoeMWsG8kEfqWhwdzHaibEor7OlqubPAOb+KKWiExb7Gy0RkkkVa6afNHCT0XxqUAgVEKnySQWsorRMXqt60sDwiFz+E3P+d7grNTHW2nOOjkbOjIxglBAEVMXs3dX8GAb667LGuc1jDR/C+DfwvuwH0MIwM6OGKiU0RVRYquegVBaJprP0l9tT9S6BwkPt8JxFp0jFJ8CqH/Qmbfa6V0S+0aWV6CXGISFEZGqGV1YL+LtNMqMqhNnldFQMK4qoqGov8nkX1lahUIkNUYjI+zWpwxS70mI/vc6gsGLvLWu3s2ZU7C2SsT4gIX7cYYEqtYNuLMUYVGF/UiICTGGeEQEtY6tiWt2fp58skey4nmG6+WfDwGnrqZ6ZAjqUIYaC2gSXu88xW157mUYRMFUxldtdq5e1u6ecXSIk2pckZEaaKYgVJRmrghEb6XN2mmcmtAnREVGFgo1xDObfyJSmbFeUSAdXhIrQKnKYWcYGjHoA4i1/b+RRTxcKyCgqepljg5802DnUo8Y0O+R+iAfMrCCl1ded2bhhU0nlGIxHQRGUjX6bHBXuAsReTxYrUVgi4vv5rplURRjuGeMkS7v7MBFhRr7fL1X7JcvDzd4inLUoMF7u6CVslJqAQtXDcJd+mDOg+dy36Fx7Tcw2ZAFwj+dZDSwTfGeG8TyrEySuoZ4B4NnDPdzju3ilZH+AFVWlqLMIa0FAz6z3WgdA7k4Z+14NO2yJ2lrXicLIjXJXXyvXWqZmreav2C5eFT3iUIXXB9xVdIcH1l6qqAhwUCm0Xo9rts8NGWvo1WD/iPiORzMjceRTfY2oHcd+a0v+mP/7IopsZSVEEceR2MLx5lfPOec1on76AO65mJnt9SSYRelOIxPlVTMip5WwVOzZeFGq9GsM/6ZKtU8NtMrjTKpKUzTP2T6k+Mx01GXDrHwzKtRMIwGKjUxXvSrosRvapazQr+mHKm6qkQGRn98/a69p0vHOokCNvZw00HreNefc7u95ETYHr6E2L1VTdXBlpo3rg/AYLUbIfLcg/Hk+sp99+lEVRUZ4uuPn56flt0O5HZZ3h3Mi72fnfn7GhWvIfa/X62W6Ud5y7kvA9rBTwAQOuHPHJ47qsz0wRdWMjDEhIqZ63MOsnjR+OUtx5jzV2fHCU25khqntNMB3VOQyuw4DTXTM0S922QA45hDxOZQY12usdRRWc0qLncccneenNBGxKscHGB27BWRnqeFwYhfYMVtmr1ZxdIfQIIYeU4554sttvKg2JjNTtRMBpQMm2gh3cLkYZi4CtRmRgAyWzSsi55Bu4CJs2PHbdKrAl3DU+52IqKiob+KAeLfdJQ0B/wAgPqDg0qwWjTgw/9nwKMtMAdtydab32bFndrS2u5vAA3hWT659e2apart1Org8IlWKNPXnfjZYEVlZaweJKiAeZO3quz8B+et99ZVIImsUTkndeSWfEPKTNS3YGWhgPWy5V2sQfv/O1ve2/FZtZizfza/7k/3YZ4o2iQjqHteQlZmxoNdej1627pUljX+M4ksPR8P3LdAqD//hfLuHaoSHzP5CZ5c6rQUWaWz9/upCKwuQzPSAuVNZiSiaRKZmpoh+5t22o5o225GRZ8zPRcmhTD2QP1UZg9Mqh8pH4q8sxzjKvE8MVESs1Xh/b1q4ElWBCstAZnU0GrGFo125nbZSNAozvTH2ER2Gh8iyccgiTczsqWrG9vJjsgkHkZLNawC9G+7kasZtmflHEb2BVwuAoQD6+nYHhjaVUWXv545KU93SqJz3fu7Dr7RXD7CJrdROKVZ+ZIYZe51pgleA9sFZdmciwJ8YH2GZWdUlAlWuZ2VGMPGRoKyFzDRTkSAbOKUqWM0KFAMYniBQUFVow0bLA6qzCmbyQRdmoUsjrQ4q/o4tgEYpqYgyFjQjOty2SiFKEZuCn4dqHdkrDZ3myWIpdPTvAFKglKlCBVpIogrxqoqhdKBx39RLyxFJEbPz+kEMdO3tVbtsACoTB+D+9Qn0Y9Ay9Uz/fa//bjsCTh3SbWEUp0giFVrp8y1rofW5T9ow2JB2IAmts+BVGLQPeEIbIKtqoOWXD/fl4xmj59FK8aLkpAylkJHZRwAgicwSE0WB/2S/ObytaJGmChF4WA9iUU1bR0kIbGWIUBAislYObRepkEWRrI53kwwoKzwimlCSpui6zcRa2xjFI4X9lCXHkvuav3+WSNm8RpHur5eZvfd++ow0s+dZc0ylUMTDbP561U3mZ763qUPVux8wNbWpasBOkDRwQFLNrFLl4wFAa6JrmG0HaFQbI/Dp8Kp680I1JTCmFBh3kLiu2RqO3i0UVJUETCsSPeWJzMqscpF5TbUx19OAgwQhjHZXk+W+s0zYUKxUiUKzhmLtCL+BV49iOKUjUkSJfdwLoKEAGdckKGZjGLZjGBJbFMudtOrE0lh9Tmdsd669ALyu6Ai9DhX2EHc1LaD36Nbv5OECxZ/wlDkm9WgrzUZWo8TG2UYRt69rqqD63ojqIwCm5uIoQfXS1yKytZUfMbapiqqqShWaV3fkLTy0NfdoM3oEithR0TZSkUhnsQsZUx09f/z5uTtjQ0RFeL1ePZrtyYAws4ybqrNHwnOafXwF//prZokKxhxjjPUYRbaf/Lm1Z9/jnfrYZ8Cb1rWsuyPtOR8l2rndvF4PrA3ft4h2kGCFr6d6ibPXkxlhlllrH3pw26Cf++5qssdzfsQhzPK9de/n/St7J+C+xvP7fnyv53n8577/61/vTYavpKBse1Z4O0IyvHdSKzyaIV7I0mu2qTcrN0oznGBmiQh63ACoWi+ctt9sgYIoMn17hrejcR3te6Dqvp2CiLiuq1CqdA8ioqwT6PvaEcqhN58JVColfBGnyCGzysZw9wUa4BXiHu68b//XX53qWSCeHS99dc2S4HnCTMccr+I36pxCs6C+q3IOBUqEXkffpoooEZraB3QJQ7mohMfrMvcxTMf162KoKESv9197/fRiy8tBE502vDXFNk7Xd5akokgq0z1VrQtv5PUJvh+qgu/4UWRcRHmvipPxj8WDAQ422sTXhw7y3ZxVxNprZ9H0Prhzlb12HiBKRklV7u2ZyJIszcD2jm7xbt1IPXvHSjN7nmw/Yd/zzw6Ik+K5jpzT/2OJbdrLWs1iRX3QiB9mt119GDzP6lli/+Eda97ip7OIUHG3zDqWlPwDUm0zB4WtnLuuyVN2Q9TO+EvBFgX9wMwgMjVdpKrawtvbYRFQhggj0sYlEqS21A7osrWqhZbyGf+l2DAchuGec0R4lTUoCVU28LFiS1VkSQWrIvMkPlAbfVMRLjR3gJmJJqFHSAu9KtAipUyZ84zAz5y+q9ACGZ1zUbkFL8onZKnFCJ9U7YoVMS3+JM53xFNUu2TOCt/v3/3XPQ/MXO51t99SBPuJyL1crdZ6VASR9tljorxBaZklzg+0pv83r3LqOwJrrQ7v8P2caDcer5yK7tg6Wj2Z9iHEtBAwCmemV25rL5Wp8tz30/E/TaH4Cay9BLE5zKrR4cqzevjTYzEqyvezdsyhnTIrRJtUHGiB3rPbNr7XjmtCeeDuz9O3XlRptynTrBOvDkgZ/Fjqj/3AiB2CKvjau8bM03h84t+674Tyox3iN3OzrU42XmZDbc85F2DzgrTH4g4PEt0GjNkoffmaGrp1yZSh9P2I6C5Fu3y9msMTWSQqO1iqqpjFqpRc1VLxyspOlk+giOxKI8PXgkrGCX3qFqHzEmsO8ygR7GZzBlTi2dH3OyMrmYXsPL2soHz5yVWkmpQ3OgCwKFeVMaLZwGRQRqbqB4HY+U5jNGjcDKNZHmY90ReqvRSbn+idIRmbNLJ1qCGiiNVPf5V70H3vZccSrVTCGUQgJVIA2Z49gTj4Ctq80AHaACqlKnreNea7Fb6/3rPSn6cSY47dCKM0AUfLJVSl/r6rtQKG+3GJgwm6b6/YZqogzfR1dUg6u3N/vYc+f0YHzMu0KXHRyzYVRbPKPklE35a/u6JIoojyHSXsbikiThRKRwWbtm70fAcykqSZeXxSNiiN+2wr4Ow1JNMjAB2Dqp+UNe6GElOt7fOo6Ltkb2naTB5m/zlIzno7VwTOGB3oBAlVoggi3EnOYUqoYsypjMSxWalKRohIRPDkIIUKSjUCXtH1jPt6hEqJ6qlUp64FUar/RWoPyqT1lQTZYWcNhNE5idqqUulz2h0OFJX11He9KKpmQ+hZjNyoJmx2W4WK9MBau8uSykrTY97viDHfX+V5hf88OqfstanYrGfHZ6Dpz13XZcXadfwrfUd14dCZFI0nMVXQgK06+k4fg8A0YxxhZm9X5CviP6naQzIjM+4br+tPk01W3VFZr6tx//XsEJHnfii/GzhiFpU1xn0/j6le88p8UNiODm8/4rdP1qA1ZflZyJKWBbZNoWp3K5x1xrRZRwveAIwdBUgGPJDg/eyXXOEetC/srW9vYYdHKIBpBzPTPEYRHAx1mQmyhGIgTL3FRRTpvxAmTqBsqaKDZjNLMzIWSteODr2hPKqdFXcsBB9z+tnV9ylIWgtOdfy6xIHskrGA1zWa0ErUHNP3Q71UTfZvM9NOQW6MKxhhQpLeiM61QwXTJKtUpkcQqXqdwK9TN0evWauQsTPDPQqpxYz2PSvTr3Gk44REm9MJ1U5uRU97MyLPaIHTuL2qAoVP5Uk5iu2WhvdnIomcU57EkZrTUA0ps8wqxQHe0EQkig0CVNFneVY/6y4SJ766vO9Gd3wAidiJSHjcJ1NUuNc6grFM066aWCzXiOJ9P6/LUF6BKPvkJooH3MP0nJhdukSdGKEmXZ8jgNL4rcjA1o4u7gSDxilkmUd43HPOnycrdlRaE79UEdGESxtz9MrpO342w73jmhbb+80R4ZjSQ/jzkA0Ok0f4eg/f7cDXDmf3T/ZRZizPSbS6qzfbY2SWk9URxx7ef7/KrnwyrgxHxd693w4e+RBtmG+n0sYrM1/Xn6ifyMi0RkNX1jB0xnWPO1Bpis1Q2vId++44ysp7l/bZkyUt8hHm/bjp89evV+Xtq0L5tW58G5IuVAAgPUHwqnz8bBJwDWv8snuPujvxClUKhao2ilh0wKhHGSEAhpwloMruVFPVa8zC9jGuuLLVvz0Vua7XVf4s7zlyWzKGdY6dvF5cTw0dZrbWqpLCUJVstYJph2RmeuvVVaqlNQ2GypIW6qri2M+hVToM38JBRIdpaweH2X27mv05vONbhUuX5r0ejhzHPZ/6+35MMfbYa20PVba+uN3WzcpukpyIqKgZbJjuIuFAZwJZr9JL+pYec6o0j7iGScGGkso7aJ1HG0UjqG1r8Collu887uNPgHOc36SRYwCMCmZUVbN/P665zyVoCoEJMo9YSnReVzas4SUXlVViZrqeyMiSOef7NYDt7jYnXMWuUc/zrM4LItkQuM65E6Jhpv2YziwyttdXcSTU+CgBRdhBticfUi/qoHuUUFMpTiORZWoTkRB5aax9nu/2vLegtd/qDoNppMJRAfZFL+fbFeYY+uzopF6hmeEogau7sc5H8Sxr0nLb8YbBc30FUc2ubOJ819yxn6pX63NbsKTUtZZghx/ERqYnruWSma9ZvkOkM6IrYwWT2BHW41UqhWgvFVnXODEOJ6qDMdSefUzo3bM1IeHze2vPKva5jXoai09ScnS/fnR4tOYTUihjXrMjMX3M8V/4C8Dr/V9716v8vN6KNvV3m9cC1R4wQlzVXlcBVo+POc67oXI/PmiobOVOjw1IioqZuocqCtM8ULmV9uz+ZZpsvsFC7fbseHgXZx6Iamp+tcJkrx2VfdBuz7VjUpvu6x47KkROmIW7iqPQwrTgrkURDV8RuzAqw3n/jt3o867wkPGsR+Sja2CBWZUfMDeQgYo8rzsE+o9VEk7SFkbHVvf4PFNNZLt/lvZt+MRxnVKJVLZ7nd/oXFLbgSqCaZVRr8u+U+c+Kc72MKuOHzfMrud5OkTe7VWxqE+7GvpI+9//+/+xaNTXek3bIRFpCsZw9/G2nkRXPFGpvHo8/dy8pkW8vsZrM6EOofRq/Cz1v5L1pnV8kQWiX9yYtj6JB11jYyiLOpQJHsv4WrheFzUBr7pMjvszY1OviGVqla4iEGsRz/uafDjH/D5V6riuOYaNce399F3dq0MRMb/m/OX++0tU98DVo+PyDBSr0rJlCmy9BvbaJmeLF7m4Q0SVRAYQGXuYBcXGGZpF/InybpKNCWu8LxM0QvA8Ung1ymKMq5URv39WZr4tOz8QGfw46OPx65oROUzMbM651spaqhaZZuI7DgLowwv4hw/GwfdZyh6J9pCoRI45dhREm10nwt6MfPlHX2kaoMiI2Of3rAN8Bz4JauUN3T53cUbV9bnEvcJ2uM4OkOvpvIhmT0s6VS6LUccXi5IEe5w67QQQJQGq326KMQe15tCqul5WVSQrXdRK0RMqbXR2+V7e41H3Mq29vHvX66IpMoJMwb4dAKHyrFCCLZf5XG7tD7Tay6PhoW1nM5OubFHZNnPQIEI+HQikoqa8fxYQZla1Muf2GPPIVsgUBLHCzfchPHdext4l4pTKTOHum0pkdVfQZshlmbHOw5dLWc96kC3yhfvJ5jLjs8Ps7lnnWqsDlOb1rspwXK/5JdQ3gjYSRI4p1GteYjZE5AuojcSMmnOajd2QejQYpvqzoopkqE2b17tXXZ3PE5FKbPchGr7I1mHjlPIHVhgeT+/SDi+6J8QpTayvfACSVJsNW4/s7js6HKnr4G5klfVsB62Fzd3vUrzSW2w8pzz3437WjaKa2Q5oimiCO7KNVB/7qWZR9aBWqlRttlQGsIpNHdf7HfF/eg13XS8LV7UZgGiGUzhtZqVw9Micyjkn8C9+rnwqTTQhLWMupPYYB0pqJ2JkmkCu2UvQfwG1tx4XvxiqIrn9QZWq+N45Xh4FzwzbnkQUiGoDW1VxDKAsgPuJU4W5m2JvmYPudM+ICEeBDUcCtDqsldqPiDJ3aQ82tvtLrc+LlvqKROQaGM/O8FjAnJKH9NEsnP6hisIq8pO+mjWByOpFiI554RNuGwEKteTLvOmRRtbB/z8bFTvq1ddF2f75/Xt7tHRfENSTg9ir5bUmKuY1nsdNsJZX5V77XGJqEa0Y3w6MYSaY17X3zthi1xgW/lTNa5rdP//uye5JyWY4UKUS2QocB9vJ0Z91+46r1FQ6bEKkBW2giI3XmNZDLoohE7Drkk6v3672kWyoWWuEKGymReYfZd7J8cxopfgHI4cWSFN536MT248AyxNmY16ktPdFCco7Y4uOOefahdqiMwOVSQSVKgimSh1R3B8T3b7Tq6oqm5oI4F//ws/fP1GpMjNVmM/K1mBleEFa2IPYa6WmVUnGw+u13XvNRBQqMmTYEBXfawydc0ZsVSNFbE6EUETkdeF5tikKcgKIK+Z1ATlsCp9frzE0wiWy6zZp4zQ4MlMIFZXeCkC8oXrVGL/6QrMzU3SIUsSzRGSoytrxWWlpuxB9u47XX2K+nq4UPj3PbDX/P0hwPWiuhjJEsRlRqHj+Eczz6ba1yS5zaCVN0Xd4j5vHxByKgao/9LSWYzZV6MA8K741NoDkuvHyfT8rKuSbpcef1QMis7iGnrzKDAO7KUZGJeMrH1B+NnsHwsrN8iDxQF9rRz91fyrgcg+vvD1evu/K8jBkea5mTuUJP+yD+cyzVOEOEQENTBXaeFW1tnFcL21qC/AGwG4ERfobzBIzUYoXsmQYkVECj5N4BUJV1+MeqMrw9SdaUGw9uwNytm5wDD3fYUGEYkb3FLXMR7X7CqMOKzfjHG0vkYJId0QFj6ooG0qxHjp4IT9Tw4M+771QzzwS7HSFWDK51lITdxCuJig+63EVUCN2v6KkVXlFrr131HL8/H76nRWdZvI8DlIFVYAgKyuxPToure3oRy7Oszj/k0gZGHop40++cqwMxEBmxf7tXn//PKbI2FWuOg75L+Oa130gHb2oq4h1P47yMUfszhrbVX9VafPlm1LxSd/oG8b/aROfQ9uevx0neucTJnQN7alJdiXx2U2hvGDKcmC2qt+0x8Rt0Wxj8XfjwUYyo/MwqR0ryzNLUqS2N6BUkA4qcnU22PczMgUFHd3efKtCss2fqDihFW4KFXYWd5WqRsM5PqURVOVELyq2I4r/mvCQMTTkmwFsbX/5p1pO1ZjVgoj+qXq67wGVe+dEk3aYe+0xj/+44sk8Y+ztCTx7owkxpohSQ+O6nioXIRLK/GRmVQSojDPuoNqo9EInQ1tmtfsh0+ZlPVc1xUpUJU/eoqBc1VTFd+tDUFHtI93eIup9XVelP+u5hvXa6MSve631PPfvHrB4YFSQEpl6+h9ExAFHJ6qaEKHtaEH11ln72Gp2OYV//zyvy5Yn73PxNic83KPGs+N57hoXJYAsfKx8xXq8q3zgBMT77uBxMNCOkeV5/5zc0vBob0kEpm81fe4iW27MBCPiyTKFS3/mqFIRz7rwJe/yT+DBNfQsHBiRPLYbCjU9oDw0N1GbswF4Vnkrh7m7Ur+Dk6NuKO2bxcR6/PdhUfwje/7LMFSYaeRQio6ro5ZEgmQUhtkxHIv8yfuGjmndDH1U/tfeTx/Aey9UZM0Cfu6tKg1NQEaUr5Xtp/0n2n9vJ9YuzQrtMNwmNVZkxvW6wlfbsUWFWKSKaIuahsk3Lq5/sWHWfK/PodvVFz7DqIhkhrRI61JRFS+YuoMAxzgX15g8Nxg7YO+EFarKZfY88nq9RVglc9jrhes1v2XY86zrunq60FGNIiD4CYGPbsBIVJYpRa2qVPDNq8viWebQTHS7Z+Wc0i6Iv97Xdv+OufrDUamezLQ56ffPmfp/A33NhinUNBNm5uUAtLSJmnQlq8f8NsyiM4N7LGHT9hiMaMIFtIHPCDUdyjC75sx8QFFCEBRt1/x3rgpYA96Gyf7pY1o6dHRMA7Ddx/zVwfQnv2vOs6gRBU0EFVWdzZEGiIlIa7v7+8468eikglSba2eUEybKCJDsP0sp3p4GgCLfLGskWxVYVWZ0PxXhdx0Wa8sgKSUYAmRQidona0Yw56zY/z9V77YkSY5c2W69ADCPrOIcmf//yGlWZbgB0Mt5UJhHNkUoQiGblVkR7maA6t5rRUStjYiaKiqaMFoHsHaYoRKCCa4lrtA4n54oA6Fklq0WZd0zt9FThMzhGRFu+17Leue1IpsKS5Ut56zBayYev6xC+6WWxKRcF5isNz0Itndxw/fO9H0n1SR+7+oPrKZZe5VTQNvwQgRQAphruuk//3zv9Xqc2KdQX0+Hc86EezYWaY1Vxusah6G7dyGcEuRRL8ZjqC/zse25s5aVYCSRFIC6fjhVLZ9z/s9fY66p2kQAFhIFeeudpbivKhodXVR+ThEVV+HsmgHNtIizA3nYHOZBNUYLyD2L3YBTOvX1nu7u/DXu+90azWmAMTVzwJdQ85K+5Ll2720RQaSVMrK9RL4y7oyrCKd7zSJ2ffoJJQZ2qyuQgoUIzAdjdbhA6eWiOprvuf3ITI1LMF8Sm8rZVRnUk91uwDN7RjATWIF53C2Zn9oUgPv9rz72cA+vpbvt70zJtNytLspIW8RrvjNNlYiw5q6h00pxs+uChx+XsG8PLyq1me8Cb6R4HA8AcaiIWVam4wF6lsIvM2XvdPf7tqoF3vfbwx++QBb3CnnsZq3p9/tdhWtg1mGUGBGy93L3OZdIDUmrOjPrWGy23QWYFV2ud8zeWV3hOmZo0+I5VzV2NNlmSlQ7nQpsFvGtQnTuft/vNd9PHtPRin+iH89IvWoQ1cBGhJsriFQDWQ16zGmteKDuFbX3xF7uVyhbRu5te1cIdM97rj17Rc2A1qnSBB+wnx1iGq89//rrVPn3To8l6OHelV1EWEWFjVV4QF6vlzZuvWvTZqaqo/e3buJgAePYn0pFVGV5IazkI9ILP1eRpwf7DFFMBalaj+Ozw2YR8sK0MBNwigVqacJiczHlNjPzdHHfZgJ4hfXf79stjSYwzAywe9r39/KBSNrzG8C839qOT7NK9I+Eyytr5OVUTXM/GgthAgwh4Ubk55gU6lnfH98upZAwry4fIs3NmVupqao97RkSDBwXnAqIpR4btRLKSKQDlEmqImYgGSQqGG14Uuv9uq5qPCUgInHABNQ6Rh9uC0Bd05WxLYFoChVlGrdyGdpOUJkI5K0Rcf+cr85ZK601ReIsg2vAx3X6LfcZl2ioXhHmGL1+kBpp1xjf92799YoQ1fuuiFt7as0GXPd9C8s+BGZFmmfUU0wILN2Teq8YhfQmQo0pklKIa9bnCRH03gG7b9U+Xkm6VNWJr/Ddh9qGREbSr5eaJVMHQFyt/PqjK8AiLHKNRkyNmAi98/sdxMLEbm5/BNT2Ti1a7vJ0V23E8BM62pNaZERS8fqJYy9Wwe+3FbPnE7Koy4k/Q0XmZNYfQ5pAhEVVa1pc08Yfo8SJoyhYhFxTi4FeEFVV6k2E+BqaLuPq15CbXtfr71p0NzSh1D5EaxSNNf01+J1eYR5mQRqRI0obUxd5J0qzGs/da9ZcXwr80luvbHBGsrLDVbFXCmUws4RE/2RXQedLH0SdslrhxFEXkgj1ZGaKR6eHPwof3+/fwo0oW1PbqwTldcM7g7Z4A5Ch21L4x5JWm8HI3prubRE0xnkc1/Zwb+vsNY8fowvPcQ0AS5UYv3591YWhYFUHyt0HgOu65CjANLfdc+1t6/79vifzcrdMNH0IKnSKcj/eA2U8LLS66CFdiNLLrtOZaWV8rCl1lBXiCE/fJJSRCLN9E6GQWBGero8v7M8BKIjOakgFlicyxBQrSVIAFyEhdOX6TxKTKp72c8lyeHQpqEr1bFhASUBXARG/LllSnxwjHhmzF/r7IEG7yK6PmQiHy2fmK9X1oYBq1dm1mhFIjyh75rlw1By3KTNrVARTe6wZxydpYI00kl7/dOYfpCEzbzPtY9cqRKqkfK7XoGIalhoW1QcXlhQD6EygXb6+Xvd91zlYRD5tsnJDELlZQ5pnc7NgSjfPEGJPSl8ecr76xPW5P/rPdKQzdmmq6nIvREQVGrGmxAyPMh9qJJiUmRA/N5lTtMsg4hPVlOKrAvC9S7o8Ixx5PpHuzy72/Cuwh7uZZ93Z+X5PUUN6/biqazvnOmEhFiJg5VqTWdfaU+l9rwIsh3vvg5jqoYZPNQRgCiHank2pWhmoz83zpxx1lbuW9g8MavzHtr6snUB8ngWH6RR+gsqkYpUOrjUZkXQhfu+j0wRSWISzNcqsD256hrJkntoTkXuyqLSm0i7VpU2L2MUiTEHlGSqNKokwIlOYtPX7jvJPPnXWM2x0R/tjbBMRaD0TINz3PZqYs7qDPSI8E09C8xR207cnqeK+7dcv3tvcQWTmtndeV3y+9xkVr58RCXqGrAiQFHAqKQONmCitkk21Oigw5Rml5fn5CuHPX8B/TV1VHVsEZx3XSBV2vKNKSSpopOECkiY0t4/RKyYJQPso1BwJt3Yin4fQlOxelydirorS2XhWNRc4JoTP4CtBiUgE4NvgsUR61KQnKNP2BggZG40+k3WitKRILmm7kJt5VyFyt4MMq2/s2q7PAMTNtDUATUlEmGz0XifMSrgQE5Ef5y4d/WhE8B/DrZyVWYZZrP99q+o/v+/W25z2nt5u2/PdVM323qoN5mDPEg2ZVabtLPK1UYmqCqCv2sj2eUM6aqciKgUL/9jR9z6ghwDt5Soyl1c27v1emW+PNd++r9ecFjlL76cCjySmA1ZK8SoHp1uQnCLHSR9qU8SqDJj5Sc1kWoRk5JyLmZ05I7fnS0Nbb6NxRD+GSj/t/evSvaxrEtFoQoje+fZljhITPMmqErdoqVTre6aqpY8tAUHBcnvnRQx0UUUY5OdkXDfUtVUoWmOWDtx9fCV4AHOukEZCIlDFXppABkDpOz0sfRe7D8CeTtJLyfG/by9ixf/8z99mNuc971lh7xIDE63pYJY+Cp3gtdMhZvddEXmm/ggKAiTV9GJKZPV9oKrEurfhDzO7CMhOjwd8omaRwdKb0DYrb5wqGNBA4GxAI7VgaPUIUEGkZILYE0winF20Jbhfvy5zkuZeUgt4ZrXNZpxJP+B7MbCJCbSu16hsyz31YfHa6D3TVK7RRLirSgGchdCbMAVJHeRk7rIiZGauDeIwM8IWugxWe1nRAnbAs0UEq7pvIponJuqZh6rPIln9D1WhVG2vr/b+bVAu4UDRhM5ZjjITTa2SyNWaN4uMPHDcQsMSi3RhMG8AkhijmzFCW2977cqZF7QcLGDVh5T9py2LGgug2r60XwBIsjdi72a4XhjXJaqiI8GVtyZpTfOcdh6gKZHsfdftIiLmjkJPNnMPj7R6o5U0oKlWvJ4nv0a8p4Hv9/t+3qFPpxEpgk/oXFRZzjS6EUcoq4lee21miOB1XcRxXVpUDtWGNOZrVzdKwNLd/L4NwLIgQd43ScswoiphLHdn+Acz9gjeKmGTQKz9X7lRkBRh8hP7K0PJ/Z71oWNpratH1Ze9WORFRqxnR13DhHb5CGuFCXZA9l7hnunvt/5+T9U6eQZzD6fayotwBcgOalM1fZeNdFxf26qnKk5E0oiZSEXLupdgTfdQ8jzJP5FuBmKuz1mm9Xb5Y6DfRtVBP527oHREgUQjkVYD8eKs5fNjqWcoCxrTaGzmY9RNpTFlle/MIJRFuYzn51Mbnmr8ZWTFltxs7lZ7azMbTd73EsFeLiqF6fekvYzYVfW+DWksXRkayZ+A+LPZzszZhOZ9K0dNYzK/bE3b0zaEMJdpW+/f73ve8XqxdN/Tw+85awQZGSxv3xNASMvIR3Lx02ACsAxVsAKlmxGTm0zmYhiVCmGv/bxwsqApzwMyPCxCPomrGh8JzqhUyJxDdRTdX2usntI1kYSVABWDsVpvvY3eu9sSYTBnUmc5KGzKa/R7yQXKlFS7Rv++Zw3CWcTWvddW6ZlCHAh/UDn9EydBGpJ2MJNncKYRXQGm2qb3sc20XWuteua247dbFJSRNX9uqjWG6r1f1zVay6zQGgGBR9TpXgEIE0ExdsDy6+uLmBPsHto7AKadUTAY6o0zK3jyc4VA+jEcN/4MuOpXKECJQkhI9fXX371AaXtlJ7TejiWA2Myu62X2VlFzU9He+68AETP26+tXhM/7bo2ru9O7AsA4/00yvr9/t/4SYVsT0HENDZjZnCTC+utv1XY/zxpVeV21/3Jm7k2e27lf11XWDXMjCiDKKUkgFe021/OvrZosAmKViGTpTRDnJUisUU5b1ZadpRdLtQykTcjD3fc11PY5TwehnvGnD0WaYVUKqb9ZE81AeIJOqkm5+hafbBzcUUTOs+RTNcfovFeFQOvbq+UpKwjZudGYzO177dZbBh7HHhqXhdMZQljEUTnWE7dOJ0ohtbRyKdI50XpGeQtJDlwuWdD6+XAIZHtW5U/pGPgiqHydIPUihSX8vlV1r/3rS81nBGzfyETQvJeZiXyh/rhwTSXRXBOwvTZRvL/f1o8A/bpqXx2jYa4yluYTTKjlp/++5/W61tyZNtMiq9Soa9/hME336hUISDLPI//P8DlIuipY5LngMpkQF7D63AGSqCh6aUBfaxGWWeGyLdOMNCP2mpUKC7wB2F6el20zUsDe96FCRJLK8r1XOjNlWuUS7mkRvteqQwSu116byFn67/eac4lIRoJ+ekvmBzuylxGBhc1S3Wwl1QCkmuZndRxiVnTlmNtHQa1qqzXNzbnvGoaEr0xCeiYxhadquyKZpVfOFAAoVKUahoAwU+SQww1uEQIW0Vdvxel+sG2kKsWv8ghhtoJUl61MtRSlNZCRT3MqgqJ8uhmPoRUnLF7EXGA02fObqJVTtqgcbrfwL2YQw52QFWk7CQhQts5rKmAkAGoYcXr0niTEzKJU3k+sVAGYYUmqFJG/fr3Kg7a3VGviySefCcGQJGnVhiOPyPXEbKmxHstbnO6lEIiDKYNSlUUVBBCLdk0V3rVPeHJHrn1UrJWlIanUkXc0EpJo24xIIqxkDr3Xfp0yTUiDPkeDc2vy8L1PiMizwVeZ7j/p/9rnEAWyjEIHelVrrWNTQ2euvm/1dWptuk3GQSucNTDXC+fMSASBs8aODJDkkXp5tSTKsP0gjM76VSjzUfEReSmRnFXbeL1Ubd+RfJ2nJxUCWwQqyCj00oeH7kJq5PU7q8Pf72/zWCBxS2DvtT3WnBq+6gwQvswoHuoAESKUCZGEk0lUM6sftApleqYzs3mICnOLiETL5Mo8V9xalEvKUpczPiEUQUoT8tZdVm9dBNtRh/6a+YTv+vBGkjkknxk6OXGnJ2wTSXN7urEgXCPIHSJ6olDLPKSKdjVw6IS1Z/re62zEPjnhpnrfNzE9fmILXxW83ctaJzOzNG0Uvudt2rRIw3GQiR7B7PswV4DM1GoDCbtbutm2csOko3IBp0hVFKa5Mo0hqnS/jYXNKlJVebA0c6SbUfopOu6d5wpKXpXeetDEqZhyjQQOmP5JpzFbODJHkTDr/12o2kVaz5THvu718y8if4FyI4no6LCYUrSkli+miOw1Ss7k1hjpolfvfS1IXaa5KAo8+hmD1lciQlRpDGUKZIC0dYh2ZWitXerUAMoPS+cgCqkB00vj+rPxOJ85FWxibaSi23B1eof1dhX1ZHTdS4pu9BkeV1qhag/JhlJPCz6I4JJR84PgRe3/D6zL3FAczGd2FER8flhcM2b3Bxrl4YCs7dXHd3fhHuFN1cLdoUIs/OM8jLI2nd2Wh3c5W5gzbs+f2LugbEX0CBdSiM0sMzzL6OVM2XrLyEi27cuit171UbMC1+XHgPbMeXEbhaNYotheuk5mcQ8WLslSBpZRRkbhLlIAOscqx/b87D4jCQSmHI1/fyNAto1Zngy8nJJuTUUoSUjb6xqaEUgSHiSNwrX/ku0JCNd3D6pwyyyGELIcw3XZIaamPI+m7tz8iLQ1itDemahim4+Fm/jT5yro8xglWTIVZmYhZ7nMLbM0DiflAZLX1US49+EZmb2mjrSv9H2GEKQs8FRgR2RTNZtmZXggpZppJoU/F81ze6uZl3sykRKrZ2SaCJEQXAAFgdg8tBol9Z0hoTU3cBTnwhJlQJL6RQJSzAjd9oGUeL0rqxCTKZ62pJnXuLOUBXnPbQ7VMhCuvV516Cyf3MfguXeabY++14oM1XYMsLYZHhmF3JhzAV1kVd1ZWMqAS9z+CLUDEMCJOPIRtnrR9DUT5YhsXdc0QIgochCcpbmtcBdhCyUiZh5dmKHK5hijbQpiJWJ09MZrB9J66yJ9rT2uS5U8lWEBRZqqiA4RlcIdCt7yq/qEa04VbprblIS60AwrlYaZCWMFItfJrmmHrUox1uUKaUSVGwsGeaxw9RQzc9q9EuD7LmbRY5g9gLV6nKlSbbucNsrLZpEp98q1PSPNZ8GtKsigAtsJbHOMJm/P8PXvP14YQ/Qx1ywIwKchQOyfCHAdrfeqK/583xNh799vURXy5WT7zhQiI1G7DcBoXFnrCkeo6mEyZMbjpQGohe+CSajowq7/U5y8ihWRhp5QY0TMeQsND7X9doftvdYhSHdvXuCQdPOQfZ7u9e7bz9In0RP1dYo6xDIzkq6h96Nbq3DBS9oY5yvuASJB7pppVDCuYOu1r72G3tNqlVgEzM8DpnQMvXVVH338/rZaQJpZ600KeWyuqtdrVKiBmFVbfZdEeE5qvVlkb+ccaNJLa8Egzza6roW1o7UG0OiDmNyrgMFzu1C8HV0IiL2dqYe7h4k2rzeIzd/vjdwi8NhEFBHqNpcTwcxGH/d9a9MMWTv7yKc2pQBai4phd6pQUwir2RZiB0dyzS6lNJ4sH9HvH2bl4rQ1Esptnq0wEPQMiDw8k5AmpOl//G8Akcq3W+/9Ew74bKa1KXBkpFibpI4ZEEFky0hV2iZ96JpHw7p35kHuHSxKnazWRh9RjW3zCjmcbybSQLRWZGRRqQt8pIpwqVMJEavbqq0kUdaCyW0X7MAdjB04gF/Psyj9+JWYQrWxoDdd3F6Xfr+7qtaGXEVBel16vw3A6H3/noc7bQIS20ZMmU5MNf2I8OvV7tuYMlHRKKtP/6fztrd9vXqNAmoFNtc8EMKi8FlD2r+mSHvvNNuPUDVbI5DWvsZ9ulOA6t58VoaRAQcVCtsQepKYdXMRKjTiAWR4eGxOiqS9LDwiU7UKe1WDMaZBOLaldHZxWK65gOFmBRgNt0hJRCa7h+1NVIhFIQqVFrEKgEFyRdi4mpl5uGi9W6iSGkfO5Dsiw42YG9P0THci8agPSpy0T5md0vzAGx93W0kNQGuFuwulmWbSmvvBY6JY56BCiqA6jWfcQMqPcZOZVYDebd+iB29htl9XA2nlDNrQ1+tvtwkW92ilqwk01RqwlWeI2eqb4NQ+XSikwF2kX5e+Xq/395uZGVWHVRKUEHth1UoSVKUiRQXeCHPdWl+FTDH3EkMUqopKWoWmdXSRJsSJpoquGagDOxhO1D1JpAWaqoO0dUZ47110qai2a/QkGX/9rXOuMfqc6xM++4TLWZiZRPqniXngcMT1IHHzH69yFoehkfDnpVb3mc//V2aorgh9Xd2i11aYmSNXEw0nZqns0K/HDq1aN9dYFpWLLp5FJsBiFp9g6elQUE1RAiAWCXOmmqqnKEeAuDIznmjuAXNm2RbEe+0ZGa/rMkN4mlkmMdI8emP3DFvuJsWGYKytrQtIzOrUrpGG5Ag+RU4kwZs0QyJJhYnBFE07Ma8dTMlIT2GyqgqcXDRlkAu1f6e13kAtq8JEJddKA2o7W2u+QoiWbrAS8kTkYcLifhNREQYLb4rnQcbMhVkXMoDXvjPJHKPxex433AbK1gVgQJipoEkZ+tzCa03OB4Qc6b7WCpUSwMFdPexQFtN7K4+boYgNYWZXxiRST45kPaCYRmSHefiJQKmqELP0REd+9iM1CckAifY2wAwRnhOiEcm9aeZxHb9eF1DQmyDbmSHCwhijE4KoV54s8xkhBy7EI5oVs5Vxm1213jMzZhNp4SkEcxYyszRzptxx21HGM8ItQ4RB6r49uR57KpVK0O1ZQbfqnh5GTW7bDVS4MM7Ie5rt1Xo39zmNuFAlMNue9XkyWyChEgepgEUyKROqFKK9NR9ZTEhzeJiwJuh19QiM0e/3v/d7qWq4R8R2dt8ul607IAkW1Zghpb2ILRzhLuyqatuAToiM5V5kS9BBWRXpTOKGJ0tkhmVGoFWAvlofmTLXfDI2tcqVmh7uff8Bnjn/Q7XTPrpBZInr4J+9WRa2UfbaZi4kIpXXd2QwAcye6P3K91I9Df0Tw3kiTNWCaG1gn1VjDdLqJCIhdShgvsxvQHu3IyEM96yr45FxBUq3zp8ipVAmUyaEyg+g/eh3uM5brS5JRGLuPT18ha8IrxaVu+gXrSPVWoWSrvuKG9zS6K5D2/d7fdDQSBM6c+hvW0U1/PQY6vu6bNWSwfa9Z+ILFd3qPSq6RBzlQRpd54ZIgLg+iFWGIFYzA1m4VaayqGZCMfcibHf0JkE/5klPnafNvd/T/9b205hmUiWiziytfPdMdXxicTNEeHmOGQl4EzI3wOofSKRm/r63VdUz+96GdGjYtpto7zVGH31kyq+vsXYrpg2DSBrBI7ld7fX6lXmUHCTjunivOhICpJW28iQVZenhC8TmGE3lIP7RNQFIsFkwsrLFAK5LzSAy1BYA1q8y9gnXKpwL2BEglp7JB1CXUgus0eV2y8Dcrqnm2NvW9q4M2DaYLeaXJ7sZCyKUufZFemjrpMRGhewTIIlJqwWq2lpTsy3ygwM6PwffTRnQvaYWy9CTOj8hRZjVWK9AaRnJgys10z0+32ABd3PTKnnUcCPCqn6RkcJewdN81lI1as00hnaFO+y5lQvl7bXjoEJzqrpQQB/sZNbz4xzpzPDZ5gJY+wYd3mC9cEkaUaiASV5D55HkMJEmyBOV5fKs9DzV8KqpOraqLq8Lg1b2gZgLDbQ/AMOfvzmr6iNbJ+JDaTYOETkjV1IzUrVEJ15ExPC6O9b8u/A7AMyk9eOTZFQKshaRAEWtjUBiZqLy/f3OyNerVdjTLMK30NhmeLSqv5epnvIHMxWYumb86ZqR8/72du35Vn3VP7/qQdUcAqs7AsRIM9s7V6s3RMwAO7v5PnCa0KYHt2+2dnwW6ukUEXtXOqU69elJGv4BcXbNOpnrOvHQayjPJsJEYdYSIGLzuK6W7iLX51pcB9q9DZlN8/2+a0qSOe77Lg5KgU8eopQXUvJRj8HDyVum2LZEfN5L5riZ5z0BNDumeCQisjciBFPq+bw2NbvrKllR7wLw1gFuLl9recb7vZHbQ49EzJc50CWn7bVchOEZL4+qfs06NtSkPNPe96pgqHAWFH+J/5QwgL2WD81IYKdLJEesEkPYPvQXAGtxhMklAM25MjLIK7sbjmIUV5X2jPPd9o66znoQM0V83uxRw9mIIy0s9KTsVFEiFhbtXSg9VYVLOTFeTNLiwCQh1VVgJiaRrNsICclDro2IitwGRROKRr3z6DSG7p1Iq0fBDgeihhUzQNjpG7iInM7pjpA1hdRzDiEVSjuiNN1rqwqmFdWZfJl7et5m5r72ppvKPVr1y9IwVjotPetWUFbMCnR9spLVACb2kx5nqYNT/egCZPsWGqfJ4GmOvbaManNbpgQCaWaKOlZEUWLzg3wjcnPHaXh+iegP2vG4RgtWKyIM9NgGQo3jVVCN+9553glpTKnNW+cm158QQXlaDfWM+enP81na/ckQh+cxbSU4k1VA3Iucatb2EhJXgbb27FlldPVs7+93H21tv67rKYYrXvKZiHX0Sm6s9U732suyiDYt3miFQ/dat/SjXP6z2QCs/SBHKa3iYszB53n5+XwogZG985oypz2rzc+f+QdFlOlI3iJsvxe3XvY41GI170VEHi7zfjf5u0SfkVmZ0IzIMDcN30zD3TPPClBEwCqSzORZQwzRNlof2DXqrtWbesJDtYkICCD5wXVVjyRP5s+3V+HTErJ3qtr7vT3s9ezUMpPBTZkYFS/L4FLAf36YzBLw8tE9i5oaIUhrupZUmyc8mclAysrM2B9CMIBsfYjo9VIR9klXR69ENUp0ifTT/AzP+uyeSU5a5bIAqyLDk31QovB9n8WL+cPFkJOP0J+McO9dBa2/tpW24ZXtYZuyCiNUmPzJtBOJ1t/nYJ+1D7Co8KLgM9k4GiJiEunA6q13BYGtkYcWYxAwVcfOQpEJnc4lCSnQehPpf/2lvfFcFhEkrWDf9Y2/41a9VIHs1J2o8POzt750w9FHA0BoZXg9H3oLhmvBf0qBZncSg5rZvm+qXVh1bYUFmR4I0H2fUFRxhp8AqX8KjUdxxUfQq/rTiqqrSwRUkSkgIeme9TjmiP0MpRiQYlMnMhxVjkJuEXHbe++67SGxt2XmWgbU7o/DiRDF4I0wIuyVGXCzWusC58qxjaq2aw5lqZOnNh2R7zvP6iacCO4tnObKpvhE2o4w69lqPZvgH7kJszB5HUEf8aNH1utFWflt0bGDOX1DFeHv71lVinBbDjOMxkXccD8g/yqUETUzNC1Gdzdfqg2JTI41K14qKr2p6PhouD652mcXGfnwtyMKbWEIL1KPJ8EsKUnYLPa+v17dHNvOzbD33huLiGfov//8RtpNWgrVTCG29A2BsBGCkfW8OWe2tHRRDUvLFFEQmco44Y60UhuZmXustdLp93tmJFPWz+KM22NuYpKevgLCWKAWGd/vNadFBt2Eh0V0CBZPsImYlLQPTU/mwUxEure23sJ3H23ebyGp0EE17uo64WZIF1H3HUnMIqosMUZ/v28QESEzCeYZ5M+7MhPwBIvI3lP4ZAcjUsQBNjcPn2sBuN9vAl4q3+9Vcty9l7kyn8SOZ6pqbks3I8t0gDARnvO+RXXOVXZHD0P6PS0jHPL8AlC0e2bwUGYiwujCVQZpCRKRQginS5JI3cGakm0850jaq5boVM4iFmHqnxh9U/3333/e00cn4K+5nCnf9/0aUrEikdd6v+dcTUumB0Cw3cyFEiSVfK2ixU8/k6lcrnX8aMp7c62NifhTaKTqD237fPp777WCrM7WZ3gIALnNgkjqaqQuGXdJPoTlWe9EVr3Bd1HSGOJGq+LNIK0yjpyflMynKmputfli8noU4b9Kln4epeGi2lT/+E94TcpFcA2NyGuoO44LNSId0sZp0Akye+tjr/n16kK5zfrQzPoBHUcMpAQF5A/HSpW2KXGLCOJQVXvsL6esLVQ56mJSLIshZxlO2G6wPcPt9+9j/qvgJLGqWP3C9k7ARXByzyVhDtY2Inck4VSo6epqbiXSFeHWJNybkJuISESqdgBhRiTaAGjvWrZDAGM0IEYbAEXUmS1ThQgpTOQJtchqrhKhfjPMPaKqQbq2q1Lveh8TYVb96lE38FHTCgBtj0oxI/vVW2+qxyeSatpHG05iwnJdWnYC4uittz6Qdl3DkypoWLDOB6qQT/YW6UT9qqhBwQoS4lktJp7vdfapPve23tntlEJVHVChOEXqEiilu9WEBnF/13h0r7O0JYrfv9+t92vATJitgvTCYr4yj2W2vAwBaKPKTZ3LUO1WavX1KAxApJVwyhQRWTvosAnIk913BbA6H3eYB7ljoGor4kcwg0hee/3R9a4tYPha56+4zXNFkpnPZf/+viOjHLTp2ygAvN+7NbLK95GC1AzSOMJrRZ+R6RJulsZM2q6nR7Zab+RY+cb+7Pk10zwjQJmWofvxZ1HF7XeWE23txcRz7Srwmy0zWXvedwPg2zwxJ/7957tSQ9/fa4z+66vcA2eVRvAqgHq4dNbGtk2OV0VAmuewW182MVuMYi5EBBeargoPBdnO4JrJZsJ9EfEy3tsBfP9+b7OmaRZNK0LhALqKaqu3Rx+6VrSmCK8UyUtbvSeDoEpNIiOFhfjhYacB4g5su+euTv3aK26/RitmsOcsDuy45L4DALY/XHErajc92JUTclElGb1zb5wvrpzv16sD6H10m0D/vq1gbwDmMrcFulQ1MyrkBzSRfl2Hs0/8jB/aBYAlq0S/YxNTnbJ+bKkFkifivXbtMEl01MXLQ7TboVVCKLIWw8RgrtTnKJqbB9DG6OqhvYev3rvqS2gScyHGR2OwSgUk8WVmrY0qUpTlASzXdam211eY2XUVnROj9xoTRSTcC1yvCq6qyHOCX75OU4y0sg/1o4+IbUEUIOmt15KlPC9HecZPnzGzHmB1zWI2EaqjJ0X1Qn7uzg/mzYj6GG2vVffL11X+n5Mn3S4lD4+zK/qZ/bklKNd2bFdBrr5tv6c9zyqpo2CltlVbRA4lEqgIs3iApYhXx3lz0unVgQTGQOv9jLlJSRT5r4jWCLUJfRQVQinEngwiZgOUpRPfTElkQmIAUVZ3r9ZUTxy6uD0EF2arDeAxdjEXcrxCKB5QooxM3w9MARarxlbv75lD55r1Cf7+Nm0qIu+50nPte+/BzLVTMjPhNLOvS4z8TAT8QAmAKENuJAnvuidk+seN6/91h94aviOkNSWmj/Sq4tru8Hb+XYp+zufwBkL4s1Ak4jH0Ux1yr0sb12cRpBHJYsScwDbzpNLHlsXSzMLt+M0RvdXba9eEqv7c508tNXTxrToJd0Z61pzEP2JJ4XrAAFZtxk+7r6xyTlGT04ol207PVQcbECI8KxGdEFXmd8U8iXi0xvxXRADX1+uLBbYXiLty6Qe5hccxVhCTQK5ON6TuvqqwbVWI+BEVH9QceucpaEJN9J7QPug95SnaF25kmQ85A9Dz2RVeCwXj+Cw3DmAnzZ99S+QpPbdwZjkQOMvQBOnaq0IFQvh9z9ElM2u9WNfKjwS7+jEMf25lLTKK/1A3sUimOvg9+ZTn4yTM3IY2Pb9NklC5zEHM11Dt455GfPw0hb4R4pkh0kBcKwW2bJpRej+HmXjHYQHR+085EFOSkG0TlsAfje20o7MXInJ1B3K6+X2/VRtyA1/1YGU2z1YOIrP3s9mBmZJEHXvmcpZ08zpE2jahnu573t7q+jhrSPwdnfnE2SMi0iJX71wi+NOZCAd6panqb/ncQ06Q0NMiqN6zBTr+5GZF5FT9wwtRWjHzxzOOSKq3BxDX0Lm8NeqaGSTZWRrSavMVkXvvSueHK1Ex3DVwLpF7raWqgUwmIMAkIpQWVvYrYahgu7lrbZGYOT0reSWolhO1ohm7EPl907I4/vA0P8TmyCBirjhn0yZEID0DKF9zxappdPict2pjeE3oq/ZZkrnRxQxduaZYZxidBkgtZOrPZeaMg3k9Fe2KEDuINcL2RsLf09uI9H00xg6VopiVLjJHPzzTE/RKIrII2tvqWWLBQhmwzyZLwwqKGpSN5cHIR3mt67wkdPqDhKjp5/YEFNgfpRLAdd8jcttUPMwuJCx3Tk4TvqqLu1aYQz1chcoy2xoRtV7w9UjmJsTGZ/3E0mq8QNJ64yW75p6i+qDOAKi0bnFfX79ENSIS3BlmZ2V446qnQvrWPghxvf5a800H1/rsd6CqYgE8b+f6WYNUW6tss5mpvh7uWt9r1vTXIK0f+oWxMYVQeckOVS4CCC/zUvFImEmE90rUfC2XGXqr2JmAwCJVfpGHeSZszH0bEP5+z9bknuaB3l9N6D//7z91Sq5P1fv9FpHeK8W+f//7rp92jTJ7l3BH2v/9//6Ph5tNFVkrIuZr/KITwa+V064CF/LA/gn+119/772RJq9fIqgeo8qYa/7111/f328Ar69f7+/frfdMVJfXPULaGfYDKsdjoqrMzlzqE4k4GX0+U2H6umRPGU1m2undflBZGZ/O3XlrMZ5nUFYN0h0kcA8HPSndiMiKtDzyC/DxTmrpQf7gzfDHc28eTUgomAnHbwQzjwiPJcQlLyQmJn2/99obaAnPOKvDvZb23pHehN4ZzL2pgqXK6SAGFywYr2t4UMFuakjXRytAdGsDmAA8kBkV85hPv76kpnVortpodWEBomeaW1KW3qSsLR8nl3Ls51/7hKLTgMYUgAklcpuZKuasial5Yu+agdB1abnpS7VN2BbRkiIqbLwArCUVcDJf6VaZc7PYy9LRBiGtDEzCPNdKXwD++f0GtT7ODpuYznkkj5BH2mDmHTlGV8Zacg0VVWUgCdkKR947R8l8Ujxck8yR8WG81pyNmWmbt3Kmn3FzIY4RkQ3JlCxa5qWIjEDr5ZmzU28KW9uFUpsLeZVdmJLo1CRYOvkSQQiINNHqXcH8iEiE3TltEwmJPMSeIsI/F0qpEvnngoSIaEKQQvTVVFAC2GtfQwNojTzDzUyaO65BO7P69ZmZEXtbxhaWhKegcCEgfar6RDVrSY5SIGbLSOF+XiyqxCTaVTYwhHBdWoT9vbZq05qwkpwD9/Z8dX2+c0moEMjam+urbPsGLol7zX3gTVynf0N44Zq9Tt5HBuoOqjjnNjtsiDKlyMl4RRJzwc25tauPVbEw1S5qqtp6e3+/Wxt769fXrycHsrUdCRIz257aCoYR9zREyBmEFhkC4SgT1me3BTh8ZWTkEqmku+khFAXAGemRKuKBEofVA+9/DuoV4Vl3J4Kq0DYQnUpkPdTdSJqkLzNo0+qzm+3i1tdHuSmSnR9tY2Rk8KqYyXIRCKQOhYRUhQqITPS1bzBhWYTDPetdUS3bg+XBz0wPgLRBzNo6HZhAiPRxQARZ88oqn54mflP3n59hRIV8Dz3Ww5lF8aR0hIhU9ZB5PLzUciRAalHcRaWCSa2RJ7mZB/4QzMKT3BFpSFu78peRjgkHoKlmlil1zatrcY0iRw8mfrSTxU/067oqrd2U8fXrfk+RA9XqmkK6BWpmBaqvl3sTsjXnmp+/UN3i60LtewZT5Lo6lXexCq9NqD79ZqZNqy9Sl+BK8zElWOJpmiP5MUXHIXulHytN5pobJGbrGnFPGwNz2by/Rfu///wmijr9Z3ILu6cxe83ve60skBkTKZ5c5/5zFYsxJI7Q8tnWjZ/zHmXaJQNIwpUZRClCZEJEgNd5b81N0s8C36MCdvW5Kb5vupLQwYU7sFMY5tATG6aIJBFmATGgxKZN7xtMqaoRvbf60EP1L+HU1olo3pXVfXDqKqq9tZonih9hbN2MC6GAD5ZL2Aor63tSI9ulcD2qm3uamT1A3zjx3rSMLKELSJ2PpUsoAc5gT4rnl1h/pQiv8nE+dKnRdNuW1gwQaaIlXRUmD8SZXBl9nCThdelCH9eabyIR4tHk9l2/pgogtmMGwrJjaamBYRVXVAv7MzNFFbaxPTVi3t/HFhyGtIBujwjXwyBhqbdG3Y4zRdWrVG95oH/b83HSB5FmHmAtSRNhQjS0vXZvvWSM2ocwRASkFhi9+sfsuWqI+7PMe9BR4Z7ZIonh4R6ee1nVn/fae+fac62x1uq9M4No15a+glsnmkbl//gwXNd9g5l9T/MfGGMloueqe1sFnrY2AcH9AGCIDbFFr/BwDiKoNtCxAIkIUZLHBxdQeaoaqFdjiZhab9f1ao1EeqaJDHewtMrMqeB0gNIyg5mnTdFKlYUHKchrYUFZu1Iid8+9ppsxn3s5M2VxS1mMpupYOz+pJ8847a3ENUT4OLGBVqkePeZTa70xJT+PUiYFyYetsnxlesQtdEV6ppkT4EonwjgdZpukZSDSAfIsXIrVqbU+srUhfkC0lr5t13mvHSQ1OZM7q2cU5Vybnq4ji3KtQaP2ZTUqrGNn+duVRVW7wltfO6T1cWFvYwqAQVqNH6ToQSjbIvLM3C7wXHt5iFB6uLmnr8lfZkdQlSkgePg94bFUx2hS74o6nNzTPLx7ltERwLzvvSutrvmgEHpnofQ8YHRAqX7B2JFV4iQifyxDpYAdTYiHiqp79N5tq2ifcxG5ajsTLipiiIoGxaiPWsZsTKNJXUyZ2exYB+vu6I5xtfRYRoST1t41XiKokqquVdl6XJciy3EmniZRlS5xt9ZbTXvM0dj22msvM36//0McGfy+76+vXo+VjDT/NpsAZJ8DkprWhE1ERCDcWbSPBlBvDIDBLLyeTkVmuAszavD36aaUXeKkvgXQVhlpMEAJItvGZRwOK5x15mf0ijG62xJVt5JWkXBnaaK99VYmadFQhYqa14O5l/G71OXVd+nN3ZhYm7LocDeVnWAzIwqRU9bTpio6ri8i1hqhOlTj6foFQCARcjOQ0FrxGpHpgZKze7hDj5Zlr/kGSufM2Lan7wym3gTp5aNwh/beF5Yw3T5VRCiExZWJIUJ1fkoRrcOTAaSjiUhaEVNrh0AxiAE1q0hnSuI19I8RvjIFCUaXe1oTEkEcsy9E4E6e50LzLFmWpxIlwhhZexbi8EOSWR9Uwcl51UmXhShgZ1ZzxyGnCnkenb0RzLbVVxH/7T5Lz6jqc1hJhNb2weqRkmX4MWLay82gQgBlusjx11ZoUbUBbNuevEZ9iJ+1hhJyN2UieSY2gjy5MxXYPmoJpqzDFbNlRhnpFmjNuxalQN2Da0PvRFqR5h37uSj/QPdPjiul5LAlYwa0oDLE/GkGR5Rq2NwoImHr5IUpp1lNpbeF24oocmI5rLJ6vbbN9GW2q5ooopEydzlHozaBVfhWVff182XzqMSUCLbZWivDMtnMxugnoe2baLR+1nFjXGZWQfc+jttRpM/7u/ahNdHRNj45NCIRlSedAWVU0P5QhN7vrZr33AcAje/a9u29K20i4sBg5zln0U/r5uBSx0dz14wZDs9WH02po2H6z2+CD8LEw4VlWzIjfENbotV5cQPVQhZVtyBS0Za5Rbi+h8wm7cI9f4xUWTCZg1XKWuGli7Dnif7Wk76IrRBU/vbZoJWjDB3IpEu7ngmvKKeqgpvZdo/mGKNlZMLr/QAkMYhQrNI6irzte1wvYk53Ej/4Ok9ztCTRdvIXr4oEe0bu3P/8fv+CMLHZBhLZ9vYMtwABXYQIkX3t3GsbAix7beZg4iWn3/euo71pRprbXPR+r7///qoH81ym7frg78vH8bEfqCgRkbTzQ9Yu4cdMldT7l6oR8bi+5v3tpGf0GR7+CAFy10et3LD5PGJqqmP2NnvmDWu3ZvXJyTTgqibT50sy7+/CmuuBR5FnwFnC5g4RDV/3NBHea3N9+j+ET8A9audtPj8cFzcHaSQjlxKRqhO3riyqBe5Ye52AHwtaxcTpmPOA61JG+mYpjzOzKhdvcO0tlF438eQ6vRADFNoGEWtj3k7ELExgqV9YrZ8jAGVKc2gL5uM2qhhW0wSz8QmTjNHdtRaQY/Q6Sp7eIOlodRCS0iSOrhEBDIRrH+/v3wmJDFUNs0j2vVs7T7vjDAdHTPdwjzXD3c0LM7/OD9Z3OHlEAdWA+hoYANunFvfsiSwgmSdXo3Iuskd9R1I/cyTGa8xFfwOvrwHAvGXm6D2Avbc+C+9MMHlrmtFECKSjH7tC5er2yj5auVwBtEZy/Ja59nutvp8hxymasYmIKsIzojRWlr6tAjwPAjGSzcz3PeesbE+meYSmEJVcw/dGBOqLDdhe9zUus7Q9kYqmsP1k6VWEjSmSq2gWken1SFV3fF4OZltVK0EhKrZNlN+rpu23ezz/5YVsYma3JDamDHcwUWrNLeoSKywkSKedosSqMraHqLI0LonnGE+FvFq2HAmmeIBwui1qz3UmDawII6FcVHCYjEQ4oj4BinS3AMAQc4BM5LGNh1cUoqkKWYQXvADpGYx0dyNgmzE70tZ8u9nev2sV/37vyNv3XBZHCcHse4KU5H2/74x0fwGwfe+dr6S1C++Rt5kK3MSKh5UeqTCfdfOGd5LwtaI2fN67vt9ygjy1Yw8TkbVc6FglPClj3+Vcc6ztfbRwp+6AyvPqO1dM5vDDRXM7g8VAVeEiD/7+OCqql8PSyqyTKIRZEmVmMntdnIRlUz4OB5U2mEL7uK6iybo53CEq854qcNJi6Kane1nn8J7xfc/eRg2IaydNdTYyN9tMTOxCyGDbSWJ1fCT2Wj8J5d5pVh7B3DszEwRVqxswYau+agCYkX94HbNrhuPR8KJ1+SyVm5AHvl7jHw+hbMqIH3gvkY82aj+oMmrsXiefszZ8XvXu6UksTTOizN17+fn01FHMfv4KzBy+a6dFNVHwgy0J3xEhjOUMBEiFBXpWIZ5YK5psN0Mbbi4MpNk2Vex1Ngl1YtlmIlqB0wB9IE3p89A0DznC63xDTAWoOSBo90LpV0o2chL/NZeb7e6IjJqX7KXuYEqo9ibh60M4Le4SywM5CzShDH5CssVoOCsEcxRGiQRNk3gULKQxReRrtPQkup41k2TK1Ws6rsAqiHTBG/8QILC7n9cN4LERyKwRvaFp/bhaU+bGkhtsTmXkJm6cOwL1EwZG+W8JC1BCEJMwWpfe+GZi5mfgQ5EsDBJqjfYWYn8N/rpG680c16U1mD6O3t668hh66hZ6Zqb0h9MnI50DuSKx1y6vAjGRkRnmnOd3YVTxjTlXZIVQbO1I+Pv7vbYLi+31nv73L15GwtJEI3kb9tp3+F9lG6mbrmqmlXma6OS9SZpKq+kIkUcyS6sCzdHbmHn4mhF22vFSEMLI+EUXYHMdtZZ7PSkjEc9I0VTg6av3+nwyZblAzBLkl5SHWFnuT8ahmscV03dPUcnwIAewNtF7vu9VeAySivLqJ8yUkSRN2DLBoiLcelPVYg09QAFdazWhcY1v1fANkt55r7teX3WfViVhWpEiMA6kZUIUQHZlIhdKEpBRJhAOFaJAMYIe3HREqlCQCpN5MYWYOap0V/7TEsJd46Bsi2o4OvIHJeJMEeRMFEws0nqLCJhbZAEEzRLTAFwjt0WNczKJyYQv9xt/5MCOujRSVDW+6onGzOUCq3dLzaaqog34961uVlvCTFmGZUdZed9Fv1q1hc1Xj7oxyjnaExOLZBhrzeOrCC6ZouKjK4bORaOPw9BlDl+dUvQ6tDJUhfIMl5m5jJ1IQzZMJyZJOf1yc7NdccBMdj8Fm3rt1JAdad/v5XuSVHPf7vs7H19U/QTOqvioh0SY+gM0ptYpfdWxlSlV4J4sQuTMvXe+o7WHaCtA7z0cmSEyPhlPAK/Xr73tGloXeVtUTvkHUlnTclf1ChJeV2+tiXyfARzpB8RX6/rlS88cVlSVSJiyklJMeTinMDcnOG2Kan4RRPpCMEXZL0/1WYi9TEQita6v7GxmI1iW5Rss8iwW6NM9cPPeDkMxypxoQuQsYo7IZKa1V9u0IssM0MYrIurpHpFEOEYmEm2UaZHMjDqOmzG0M1trwoSmWeKw1ltk2dizabMzmKbqHBYb+AD7zb7fK3xnmhvWeldUocj99c4MoAkOA5Vlw+oFd7Ds5J9pfbHJmM2TufwuTGdnTCCKyiWXgls/9vmsvNrRjXFSaaPcJMMKoZkp4au3Xl9o3/UX8IhoIiYYI4gSRBXwfH29euM1pamOrgVgFIq5EMlX06Z8T1PVBbxel3sIhcjfOBgLmftwyi9RFeKnJYKiqnvMDA58oKTxhOZjuSuQrsIPtTTrZ5e+DZH147N9woBCvrabXbbvgsd76D2n+2Ti8+/vlV5cANxe1yv+93//81HI3DMSBw1dzrpKMoOodG9re+S6Ll3bgfeRygOJfvZTaeGYk8NXAIXZr7NEjcwjspb22rSoyAUDFZpCeV7tGQSXwzeW1vxoD4iKUP2w49GEdrlJFV25NwnQ2iV9wZreGpm1ogxVWq7oyj+ZbXgmA8EUQUQo8Wttkd3cPOBhICURCgWLtquOr5VPMi8Dsosw0Kq3d2IXvVdUW+msuuqugvBtVjgP5LZ9mDzuSF/LoisHhOER72La1dPa3buy+a5DJrDMkdpUAEpkQg4jsdaXqOOHgIhUKHqruM4YHRhEzHxAgJX3BEtGilCBXzOZqIDPzRMVMRRhAkR7bCNic8u40wfS3Vd6QqXKZRGpKmeiGuFJWvBnTyJyEWEmTTlPBEZFrErrCFKhYyuqWcRDjpe9t+fJ8dbT3ZOk/jmk9efVhU+bYlov+2EwSUtObfW0sOvVetPX9RrXiAjR3nXXlu22KThHScCFxcxUr5/G8GMDj0M4BMBF8zsxcVJmVtHs/OmeVh/qKYOXuCXTdzyOZbOs2A6zZBbq3cvIxKQe3hs/FY9aihHSKtFGXKX4AI7Bs/WBcOJZ71I3aU3TcyXZTpAT+V5+86wpiohGjLrm1kc8kzPve2pGna2NZTIKjo3qgUYGU76/37W7ZHhTdYcqpWVv8pu0vgZMydJUvY0vks1yQGbj+vo7spUbnPT1/Foj4jXO2/ukSm1F8vWle80Kv5SiPbIOXVKe1mDpIk2odFU2F0M+0z+m/PCpwi2dfM+iT7r52gvoJZUr7WVm3Petgr3133//rWl1jaoWwBS208w8ljuQ1sbxx9T50EtcQAHw/z8AjUqcuLAmytkAAAAASUVORK5CYII=)"><table width=100% height=100%><tr><td width=100% height=100% align=center valign=middle><img src="data:image/png;base64,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"/></td></tr></table></body>');
		}
		, loadAPI: function (api) {
			var script_tag = document.createElement('script');
			script_tag.setAttribute("type", "text/javascript");
			script_tag.setAttribute("src", api);
			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
		}
		, readFile: function (file, cb) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var text = reader.result;
				cb(text, e);
			};
			reader.readAsDataURL(file);
		}
		, origin: function () {
			return window.location.protocol + "//" + window.location.host;
		}
		, get: function (x, z) {
			if (!z) {
				if (Ext.ComponentQuery.query(x).length > 0) return Ext.ComponentQuery.query(x)[0];
				else return null;
			} else {
				if (typeof x === 'object') {
					if (x.query(z).length > 0) return x.query(z)[0];
				} else return null;
			}
		}
		, getData: function (obj) {
			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			var data = {};
			var missingfields = [];
			if (obj instanceof Ext.Component) {
				var all = getAllChildren(obj);
				var witness = 0;

				for (var i = 0; i < all.length; i++) {
					if (all[i].bindTo) {
						if (all[i].getValue) {
							/*if (!all[i].allowBlank) {
								if ((all[i].getValue()=="") || (!all[i].getValue())) {
									witness=1;
									if (all[i].fieldLabel) missingfields.push(all[i].fieldLabel); else missingfields.push(all[i].bind);
								}
							};*/
							data[all[i].bindTo] = all[i].getValue();
						}
					} else {
						if (all[i].getValue) {
							/*if (!all[i].allowBlank) {
								if ((all[i].getValue()=="") || (!all[i].getValue())) {
									witness=1;
									if (all[i].fieldLabel) missingfields.push(all[i].fieldLabel); else missingfields.push(all[i].bind);
								}
							};*/
							if (all[i].itemId) data[all[i].xtype + '#' + all[i].itemId] = all[i].getValue();
						}
					}
				};
				return data;
				/*if (witness==0) return data; else {
					var response={
						result: {
							message: "MISSING_FIELDS",
							success: false,
							data: missingfields
						}
					};
					return response;
				};*/
			} else return {
				result: {
					message: "MISMATCHED_TYPE"
					, success: false
						/*,
											data: missingfields*/
				}
			};
		}
		, getAll: function (x, z) {
			if (!z)
				return Ext.ComponentQuery.query(x);
			else {
				if (typeof x === 'object') return x.query(z);
			}
		}
		, notify: function (label, conf) {
			Ext.create('widget.uxNotification', {
				position: 'tr'
				, cls: 'ux-notification-light'
				, closable: true
				, title: window.title
				, width: 250
				, height: 115
				, iconCls: 'ux-notification-icon-information'
				, html: label
			}).show();
		}
		, using: function (namespace) {
			var _p = this;

			this.namespace = APP_NAMESPACE;
			var url = Settings.REMOTE_API + "/api/" + namespace + "?javascript";
			if (Settings.DEBUG) {
				App.libs[App.libs.length] = url;
			}
		}
		, create: function () {

		}
		, STOREMODELS: {
			'tree': {
				name: "treestore",
				model: "Ext.data.TreeModel",
				store: "Ext.data.TreeStore"
			},
			'events': {
				name: "eventstore",
				model: "Ext.ux.Scheduler.model.Event",
				store: "Ext.ux.Scheduler.data.EventStore"
			},
			'resources': {
				name: "resourcestore",
				model: "Ext.ux.Scheduler.model.Resource",
				store: "Ext.ux.Scheduler.data.ResourceStore"
			}
		}
		, blur: function () {
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
		}
		, unblur: function (fx) {
			$('.omneedia-overlay').hide();
			if (App._vague) {
				App._vague.unblur();
				delete App._vague;
			}
		}
		, model: {
			get: function (name) {
				eval('var _p=' + APP_NAMESPACE + ".model." + name);
				return _p;
			}
			, create: function (cfg) {
				return Ext.define('MODEL_' + Math.uuid(), cfg);
			}
			, define: function (name, o, z) {
				if (!z) o.extend = "Ext.data.Model";
				else o.extend = z;
				//console.log('=='+z);
				//alert(o.extend);
				if (o.config) {
					if (o.config.api) {
						if (o.config.api instanceof Object) {
							var api = {};
							if (o.config.api.create) api.create = o.config.api.create;
							if (o.config.api.read) api.read = o.config.api.read;
							if (o.config.api.update) api.update = o.config.api.update;
							if (o.config.api.destroy) api.destroy = o.config.api.destroy;
							var pudid = false;
							if (Auth.User) pudid = Auth.User.pudid;
							if (o.config.extraParams) {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
										, __SQL__: o.config.extraParams.__SQL__
									}
									, api: api
								};
							} else {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
									}
									, api: api
								};
							}
						} else {
							if (o.config.extraParams) {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
										, __SQL__: o.config.extraParams.__SQL__
									}
									, directFn: o.config.api
								}
							} else {
								var proxy = {
									type: "direct"
									, extraParams: {
										pudid: pudid
									}
									, directFn: o.config.api
								}
							}
						}
						if (proxy) o.config.proxy = proxy;
						o.config.api = null;
					};
					if (o.config.db) {
						if (o.config.db.schema) {
							if (Settings.REMOTE_API) my_url = Settings.REMOTE_API + "/db/" + o.config.db.schema + ":model";
							o.config.proxy = {
								type: 'rest'
								, extraParams: {
									fields: Ext.encode(o.config.db.fields)
									, where: Ext.encode(o.config.db.where)
								}
								, url: my_url
							};
							o.config.db = null;
						}
					};
				} else {
					if (o.api) {
						if (o.api instanceof Object) {
							var api = {};
							if (o.api.create) api.create = o.api.create;
							if (o.api.read) api.read = o.api.read;
							if (o.api.update) api.update = o.api.update;
							if (o.api.destroy) api.destroy = o.api.destroy;
							var pudid = false;
							if (Auth.User) pudid = Auth.User.pudid;
							var proxy = {
								type: "direct"
								, extraParams: {
									pudid: pudid
								}
								, api: api
							};
						} else {
							var proxy = {
								type: "direct"
								, extraParams: {
									pudid: pudid
								}
								, directFn: o.api
							};
						};
						if (proxy) o.proxy = proxy;
						o.api = null;
					};
					if (o.db) {
						if (o.db.schema) {
							if (Settings.REMOTE_API) my_url = Settings.REMOTE_API + "/db/" + o.db.schema + ":model";
							o.proxy = {
								type: 'rest'
								, extraParams: {
									fields: Ext.encode(o.db.fields)
									, where: Ext.encode(o.db.where)
								}
								, url: my_url
							};
							o.db = null;
						}
					};
				};
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
					}
				};
				return Ext.define(APP_NAMESPACE + ".model." + name, o);
			}
		}
		, override: function (name, o) {
			return Ext.define(APP_NAMESPACE + '.overrides.' + name, o);
		}
		, store: {
			createColumns: function (grid, cb) {
				var store = grid.getStore();
				store.on('load', function (data) {
					var model = data.model.getFields();
					var tabs = [];
					for (var i = 0; i < model.length; i++) {
						tabs.push({
							text: model[i].name
							, width: 150
							, dataIndex: model[i].name
						});
					};
					grid.reconfigure(store, tabs);
					cb();
				});
			}
			, createEditorColumns: function (grid) {
				var store = grid.getStore();
				store.on('load', function (data) {
					var model = data.model.getFields();
					var tabs = [];
					for (var i = 0; i < model.length; i++) {
						console.log(model[i].type.type);
						var o = {
							text: model[i].name
							, width: 150
							, dataIndex: model[i].name
							, editor: {
								allowBlank: true
							}
							, field: field
						};
						var field = {};
						if (model[i].type.type == "int") {
							o.editor = {
								xtype: 'numberfield'
								, allowBlank: true
							};
							o.xtype = "numbercolumn";
							o.format = "0";
						};
						if (model[i].type.type == "date") {
							delete o.editor;
							o.xtype = "datecolumn";
							o.field = {
								xtype: 'datefield'
								, allowBlank: true
								, format: 'm/d/Y'
							};
						};
						tabs.push(o);
					};
					grid.reconfigure(store, tabs);
				});
			}
			, define: function (name, o) {
				o.extend = "Ext.data.Store";
				if (Settings.TYPE == "mobile") {
					if (o.config.model) o.config.model = APP_NAMESPACE + ".model." + o.config.model;
					if (o.requires) {
						for (var i = 0; i < o.requires.length; i++) {
							o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
							o.config.model = o.requires[i];
						}
					}
				} else {
					if (o.model) {
						if (!o.requires) o.requires = [];
						o.requires[0] = o.model;
						o.model = APP_NAMESPACE + ".model." + o.model;
					};
					if (o.requires) {
						for (var i = 0; i < o.requires.length; i++) {
							o.requires[i] = APP_NAMESPACE + ".model." + o.requires[i];
							o.model = o.requires[i];
						}
					}
				}
				return Ext.define(APP_NAMESPACE + ".store." + name, o);
			}
			, get: function (name) {
				eval('var _p=' + APP_NAMESPACE + ".store." + name);
				return _p;
			}
			, create: function (name, cfg) {
				// generate uniqueid for temp model class
				function _guid() {
					return ("M" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
				};
				var guid = _guid();

				if (name instanceof Object == true) {
					cfg = name;
					if (cfg.type) var xtd=App.STOREMODELS[cfg.type]; else var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
				} else {
					if (cfg) {
						if (cfg.type) var xtd=App.STOREMODELS[cfg.type]; else var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
					} else {
						var xtd={name:"store",model:"Ext.data.Model",store:"Ext.data.Store"};
						var cfg={};
					};

                    // *** UQL string
					if (name.indexOf('://') > -1) {
						if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5))
							App.model.define(guid, {
								config: {
									api: {
										read: "App.__QUERY__.exec"
									}
									, extraParams: {
										__SQL__: name
									}
								}
							},xtd.model);
						else
							App.model.define(guid, {
								api: {
									read: "App.__QUERY__.exec"
								}
								, extraParams: {
									__SQL__: name
								}
							},xtd.model);
						if (typeof cfg=='string') cfg={};
						cfg.model = APP_NAMESPACE + ".model." + guid;
						cfg.require = [];
						cfg.require[0] = APP_NAMESPACE + ".model." + guid;
					} else {
                        // *** WebService
						if (name.indexOf('.') > -1) {

							if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5))
							App.model.define(guid,{config: {
								api: {
									read: name
								}
							}},xtd.model);
							else
							App.model.define(guid,{
								api: {
									read: name
								}
							},xtd.model);

							cfg.model = APP_NAMESPACE + ".model." + guid;
							cfg.require = [];
							cfg.require.push(APP_NAMESPACE + ".model." + guid);
						} else {
							if (typeof cfg=='string') cfg={};
							cfg.model = APP_NAMESPACE + ".model." + name;
							cfg.require = [];
							cfg.require[0] = APP_NAMESPACE + ".model." + name;
						}
					}
				};
				try {
					/*console.log(xtd.store);
					console.log(cfg);*/
					var myStore = Ext.create(xtd.store, cfg);
					if (!myStore.getProxy().extraParams) myStore.getProxy().extraParams = {};
					myStore.getProxy().extraParams.__SQL__ = name;
				} catch (e) {
					console.log(e);
				};
				return myStore;
			}
		}
		, require: function (n, cb) {
			var list = [];
			for (var j = 0; j < n.length; j++) {
				for (var el in Settings.PATHS) {
					if (el == n[j].substr(0, el.length)) {
						list.push(Settings.PATHS[el] + n[j].substr(el.length, 255).replace(/\./g, '/') + '.js');
					};
				};
			};
			if (list.length > 0) require(list, cb);
			else cb();
		}
		, controller: {
			define: function (name, o) {
				o.extend = "Ext.app.Controller";
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".controller." + o.requires[i];
					}
				}
				return Ext.define(APP_NAMESPACE + ".controller." + name, o);
			}
			, create: function (name) {
				return Ext.create(APP_NAMESPACE + ".controller." + name);
			}
		}
		, view: {
			define: function (name, o) {
				if (o.requires) {
					for (var i = 0; i < o.requires.length; i++) {
						o.requires[i] = APP_NAMESPACE + ".view." + o.requires[i];
					}
				};
				return Ext.define(APP_NAMESPACE + ".view." + name, o);
			}
			, create: function (name, o) {
				if (o)
					return Ext.create(APP_NAMESPACE + ".view." + name, o);
				else
					return Ext.create(APP_NAMESPACE + ".view." + name);
			}
			, show: function (name, o) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var viewport = Ext.Viewport;
					viewport.add(App.view.create(name));
					viewport.getLayout().setAnimation(o);
					viewport.setActiveItem(viewport.items.items.length - 1);
					return viewport.items.items.length - 1;
				} else {
					alert('not yet implemented');
				}
			}
			, hide: function (name, o) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var viewport = Ext.Viewport;
					viewport.getLayout().setAnimation(o);
					viewport.setActiveItem(0);
				} else {
					alert('not yet implemented');
				}
			}
			, back: function (type, direction) {
				if ((Settings.TYPE == "mobile") && (Ext.getVersion().major < 5)) {
					var items
						, current
						, previous;

					items = Ext.Viewport.getItems();

					current = items.get(items.length - 1);
					previous = items.get(items.length - 2);

					Ext.Viewport.on({
						activeitemchange: function (itemToDestroy) {
							itemToDestroy.destroy();
						}
						, scope: this
						, single: true
						, order: 'after'
						, args: [current]
					});

					Ext.Viewport.animateActiveItem(previous, {
						type: type
						, direction: direction
					});
				} else {
					alert('not yet implemented');
				}
			}
		}
		, _kickstart: function (o, fn) {
			var _p = this;
			//document.getElementsByTagName('body')[0].style.background = "#FFFFFF";

			$('#appLoadingIcon').removeClass('slideInDown').addClass('slideOutUp');

			$('#bootstrap').fadeOut('slow', function () {
				if (Settings.TYPE == "mobile") {
					_p.FORMS = Ext.Viewport;
				} else {
					_p.FORMS = Ext.create('Ext.container.Viewport', {
						id: "OAContainer"
						, layout: "card"
						, border: false
						, items: []
					});

				};
				Ext.require(APP_NAMESPACE + '.view.' + o);
				Ext.onReady(function() {

					var kickstarter = Ext.create(APP_NAMESPACE + '.view.' + o);

					kickstarter.on('render', function (me) {
						if (fn) fn(me);
					});
					_p.FORMS.add(kickstarter);
				});
			});

		}
		, init: function (o, fn) {

			App.__INIT__ = o;
			App.uid = Math.uuid();
			App.__key__ = new Persist.Store(Settings.NAMESPACE.replace(/\./g, ''));
			App.key = {
				set: function (key, value) {
					if (!key) return false;
					if (!value) return false;
					if (value !== null && typeof value === 'object') value = JSON.stringify(value);
					App.__key__.set(key, value);
				}
				, remove: function (key) {
					App.__key__.remove(key);
				}
				, get: function (key) {
					var response = App.__key__.get(key);
					try {
						return JSON.parse(response);
					} catch (e) {
						return response;
					}

				}
			};

			if (!App.key.get('app.udid')) App.key.set('app.udid', Base64.encode(Math.uuid() + '|' + navigator.userAgent));
			App.udid = App.key.get('app.udid');

			User = {};
			App._kickstart(o, fn);
		}
		, _loadingfailed: function () {
			var o = document.getElementById('appLoadingFailed');
			document.getElementById('appLoadingIcon').style.opacity = "0.3";
			o.className = "appLoadingFailed";
			document.getElementById('appLoadingIndicator').style.display = "none";
		}
		, _loadCulture: function (fn) {
			// Culture
			try {
				Culture.init();
				Culture.update(function () {
					fn();
				});
			} catch (e) {
				// no culture
				fn();
			};
		}
		, __LOAD__: function (fn) {
			if (!fn) fn = Manifest;

			try {
				if (App.libs.length == 0)
					App._loadCulture(fn);
				else {
					try {
						Require(App.libs, function () {
							App._loadCulture(fn);
						});
					} catch(e) {
						require(App.libs, function () {
							App._loadCulture(fn);
						});
					}
				}
			} catch (e) {
				App._loadCulture(fn);
			};
		}
		, load: function (fn) {

			// API
			if (Settings.TYPE == "mobile") {
				if (!window.device) {
					if (!Settings.DEBUG) {
						Ext.define("omneedia.IO", {
							statics: {
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
							}
						});
						App.IO = omneedia.IO;

						if (Settings.REMOTE_API.indexOf('https')>-1)
						document.socket = io.connect(Settings.REMOTE_API, {secure: false});
						else
						document.socket = io.connect(Settings.REMOTE_API);
						document.socket.on('connect', function () {
							
						});
						document.socket.on('disconnect', function () {});
					};
					App.__LOAD__(fn);
				} else {

				document.addEventListener("deviceready", function () {
					if (!Settings.DEBUG) {
						Ext.define("omneedia.IO", {
							statics: {
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
							}
						});
						App.IO = omneedia.IO;

						if (Settings.REMOTE_API.indexOf('https')>-1)
						document.socket = io.connect(Settings.REMOTE_API, {secure: false});
						else
						document.socket = io.connect(Settings.REMOTE_API);
						document.socket.on('connect', function () {
						});
						document.socket.on('disconnect', function () {});

					};

					if (parseFloat(window.device.version) >= 7) {
						StatusBar.overlaysWebView(false);
						StatusBar.backgroundColorByHexString("#f8f9f9");
						StatusBar.styleDefault();
					};
					App.__LOAD__(fn);
				}, false);
				};
			} else App.__LOAD__(fn);
		}
		, add: function (name, fx) {
			var _p = this;

			if (fx) {
				fx = fx.split(':');
				var direction = fx[1];
				fx = fx[0];
			}
			try {
				Culture.update(function () {
					var form = Ext.create(APP_NAMESPACE + '.view.' + name);
					_p.FORMS.add(form);
				});
			} catch (e) {
				var form = Ext.create(APP_NAMESPACE + '.view.' + name);
				_p.FORMS.add(form);
			};
		}
		, items: function () {
			return this.FORMS.items.items;
		}
		, show: function (ndx) {
			FORMS.layout.setActiveItem(ndx);
		}
	}
});

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


	/*var link=document.createElement('link');
	link.rel="stylesheet";
	link.type="text/css";
	if (Settings.TYPE=="mobile")
	link.href="Contents/Resources/mobi.css";
	else
	link.href="Contents/Resources/webapp.css";
	document.getElementsByTagName('head')[0].appendChild(link);*/

};

/*
 * jQuery pageSlide
 * Version 2.0
 * http://srobbin.com/jquery-pageslide/
 *
 * jQuery Javascript plugin which slides a webpage over to reveal an additional interaction pane.
 *
 * Copyright (c) 2011 Scott Robbin (srobbin.com)
 * Dual licensed under the MIT and GPL licenses.
 */
;
(function (b) {
	function j(e, a) {
		if (0 === e.indexOf("#")) b(e).clone(!0).appendTo(c.empty()).show();
		else {
			if (a) {
				var d = b("<iframe />").attr({
					src: e
					, frameborder: 0
					, hspace: 0
					, scrolling: "no"
				}).css({
					width: "100%"
					, height: "100%"
					, overflow: 'hidden'
				});
				c.html(d)
			} else c.load(e);
			c.data("localEl", !1)
		}
	}

	function k(b, a) {
		var d = c.outerWidth(!0)
			, f = {}
			, g = {};

		if (!c.is(":visible") && !h) {

			h = !0;
			switch (b) {
			case "left":
				c.css({
					left: "auto"
					, right: "-" + d + "px"
				});
				f["margin-left"] = "-=" + d;
				g.right = "+=" + d;
				break;
			default:
				c.css({
					left: "-" + d + "px"
					, right: "auto"
				}), f["margin-left"] = "+=" + d, g.left = "+=" + d
			}
			l.animate(f, a);
			c.show().animate(g, a, function () {
				h = !1
			})
		}
	}
	var l = b("body")
		, c = b("#pageslide")
		, h = !1
		, m;
	0 == c.length && (c = b("<div />").attr("id", "pageslide").css("display", "none").appendTo(b("body")));
	b.fn.pageslide = function (e) {
		this.click(function (a) {
			var d = b(this)
				, f = b.extend({
					href: d.attr("href")
				}, e);
			a.preventDefault();
			a.stopPropagation();
			c.is(":visible") && d[0] == m ? b.pageslide.close() : (b.pageslide(f), m = d[0])
		})
	};
	b.fn.pageslide.defaults = {
		speed: 200
		, direction: "right"
		, modal: !1
		, iframe: !0
		, href: null
	};
	b.pageslide = function (e) {
		var a = b.extend({}, b.fn.pageslide.defaults, e);
		c.is(":visible") && c.data("direction") != a.direction ? b.pageslide.close(function () {
			j(a.href, a.iframe);
			k(a.direction, a.speed)
		}) : (j(a.href, a.iframe), c.is(":hidden") && k(a.direction, a.speed));
		c.data(a);
		document.getElementById('pageslide').style.position = 'absolute';
		document.getElementById('pageslide').style.top = '0px';
		document.getElementById('pageslide').style.overflow = 'hidden';
		document.getElementById('pageslide').style.height = '100%';
	};
	b.pageslide.close = function (c) {

		var a = b("#pageslide")
			, d = a.outerWidth(!0)
			, f = a.data("speed")
			, g = {}
			, i = {};
		if (!a.is(":hidden") && !h) {
			h = !0;
			switch (a.data("direction")) {
			case "left":
				g["margin-left"] = 0;
				i.right = "-=" + d;
				break;
			default:
				g["margin-left"] = "-=" + d, i.left = "-=" + d
			};
			a.animate(i, f);
			l.animate(g, f, function () {
				a.hide();
				h = !1;
				"undefined" != typeof c && c()
			})
		}
	};
	c.click(function (b) {
		b.stopPropagation()
	});
	b(document).bind("click keyup", function (e) {
		"keyup" == e.type && 27 != e.keyCode || c.is(":visible") && !c.data("modal") && b.pageslide.close()
	})
})(jQuery);

// extend $.ajax

(function ($, window, undefined) {
	//is onprogress supported by browser?
	var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

	//If not supported, do nothing
	if (!hasOnProgress) {
		return;
	}

	//patch ajax settings to call a progress callback
	var oldXHR = $.ajaxSettings.xhr;
	$.ajaxSettings.xhr = function () {
		var xhr = oldXHR();
		if (xhr instanceof window.XMLHttpRequest) {
			xhr.addEventListener('progress', this.progress, false);
		}

		if (xhr.upload) {
			xhr.upload.addEventListener('progress', this.progress, false);
		}

		return xhr;
	};
})(jQuery, window);

function ParsedQueryString() {
	this._init();
}

ParsedQueryString.version = '1.0';

ParsedQueryString.prototype = {
	_init: function () {
		this._parameters = {};

		if (location.search.length <= 1)
			return;
		var pairs = location.search.substr(1).split(/[&;]/);
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split(/=/);
			var name = this._decodeURL(pair[0]);
			if (Boolean(pair[1])) {
				var value = this._decodeURL(pair[1]);
				if (Boolean(this._parameters[name]))
					this._parameters[name].push(value);
				else
					this._parameters[name] = [value];
			}
		}
	},

	_decodeURL: function (url) {
		return decodeURIComponent(url.replace(/\+/g, " "));
	},

	param: function (name) {
		if (Boolean(this._parameters[name]))
			return this._parameters[name][0];
		else
			return "";
	},

	params: function (name) {
		if (Boolean(name)) {
			if (Boolean(this._parameters[name])) {
				var values = [];
				for (var i = 0; i < this._parameters[name].length; i++)
					values.push(this._parameters[name][i]);
				return values;
			} else
				return [];
		} else {
			var names = [];
			for (var name in this._parameters)
				names.push(name);
			return names;
		}
	}
};

/*
 DB
 */

Ext.define("omneedia.DB", {
	statics: {
		remote: ""
		, namespace: ""
		, DB: ""
		, get: function (uri, cb, cb2) {
			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			if (cb instanceof Ext.Component) {
				App.__QUERY__.exec({
					__SQL__: uri
				}, function (o) {
					var oo = o;
					if (o.data.length >= 1) o = o.data[0];
					var all = getAllChildren(cb);
					for (var i = 0; i < all.length; i++) {
						if (all[i].bindTo) {

							if ((all[i].setValue) && (o[all[i].bindTo])) {
								if (all[i].xtype.indexOf('date') > -1) o[all[i].bindTo] = o[all[i].bindTo].toDate();
								all[i].setValue(o[all[i].bindTo]);
							}
						};
					};
					if (cb2) cb2(oo);
				});
			} else App.__QUERY__.exec({
				__SQL__: uri
			}, cb);
		}
		, del: function (uri, obj, cb) {
			var db = uri.split('://');
			if (!Array.isArray(obj)) {
				cb = obj;
				var obj = [];
				if (db[1].split('?').length >= 1) {
					var sp = db[1].split('?')[1];
					if (sp.indexOf('=') > -1) {
						sp = sp.split('=')[1];
					};
					console.log(sp);
					obj = sp.split(',');
				}
			};
			var table = db[1].split('?')[0];
			var field = db[1].split('?')[1];
			var db = db[0];
			console.log(db);
			console.log(table);
			console.log(obj);
			App.__QUERY__.del(db, table, obj, cb);
		}
		, post: function (uri, obj, cb) {
			var data = [];

			function getAllChildren(panel) {
				var children = panel.items ? panel.items.items : [];
				Ext.each(children, function (child) {
					children = children.concat(getAllChildren(child));
				})
				return children;
			};
			var db = uri.split('://');
			var table = db[1];
			var db = db[0];
			var data = {};
			var missingfields = [];
			if (obj instanceof Ext.Component) {
				var all = getAllChildren(obj);
				console.log(all);
				var witness = 0;
				for (var i = 0; i < all.length; i++) {
					if (all[i].bindTo) {
						if (all[i].getValue) {
							/*if (!all[i].allowBlank) {
								if ((all[i].getValue()=="") || (!all[i].getValue())) {
									witness=1;
									if (all[i].fieldLabel) missingfields.push(all[i].fieldLabel); else missingfields.push(all[i].bind);
								}
							};*/
							data[all[i].bindTo] = all[i].getValue();
						}
					};
				};
				if (witness == 0) App.__QUERY__.post(db, table, data, cb);
				else {
					var response = {
						result: {
							message: "MISSING_FIELDS"
							, success: false
							, data: missingfields
						}
					};
					cb(response);
				};
			} else App.__QUERY__.post(db, table, obj, cb);
		}
	}
});

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


/*
Init
*/

App = omneedia.App;
App.UUID=App.shortid();
App.IOKey=App.md5(new Date().toMySQL().split(' ')[0]);
App.DB = omneedia.DB;

var windowWidth = window.screen.width < window.outerWidth ?
	window.screen.width : window.outerWidth;
var mobile = windowWidth < 768;

App.isPhone = mobile;
App.isTablet = !mobile;

/*
MODAL BLUR
*/

if (Settings.blur == "1") {
	Ext.define('patches.ExtZIndexManager', {
		override: 'Ext.ZIndexManager'
		, _hideModalMask: function (comp) {
			this.callParent(arguments);
			if (App._modal) {
				App._modal.unblur();
				delete App._modal;
			};
			try {
				this.mask.removeCls(this.customMaskCls);
			} catch (e) {};
		}
		, _showModalMask: function (comp) {
			this.callParent(arguments);
			App._modal = $('.x-panel').Vague().blur({
				intensity: 3
				, forceSVGUrl: false
				, animationOptions: {
					duration: 1000
					, easing: 'linear'
				}
			});
			// mask is a reusable element, so each time it needs to accept only the relevant style
			this.mask.removeCls(this.customMaskCls);
			this.customMaskCls = 'modal-mask-' + comp.ui;
			this.mask.addCls(this.customMaskCls);
		}
	});
};

var sort_by;
(function () {
	// utility functions
	var default_cmp = function (a, b) {
			if (a == b) return 0;
			return a < b ? -1 : 1;
		}
		, getCmpFunc = function (primer, reverse) {
			var cmp = default_cmp;
			if (primer) {
				cmp = function (a, b) {
					return default_cmp(primer(a), primer(b));
				};
			}
			if (reverse) {
				return function (a, b) {
					return -1 * cmp(a, b);
				};
			}
			return cmp;
		};

	// actual implementation
	sort_by = function () {
		var fields = []
			, n_fields = arguments.length
			, field, name, reverse, cmp;

		// preprocess sorting options
		for (var i = 0; i < n_fields; i++) {
			field = arguments[i];
			if (typeof field === 'string') {
				name = field;
				cmp = default_cmp;
			} else {
				name = field.name;
				cmp = getCmpFunc(field.primer, field.reverse);
			}
			fields.push({
				name: name
				, cmp: cmp
			});
		}

		return function (A, B) {
			var a, b, name, cmp, result;
			for (var i = 0, l = n_fields; i < l; i++) {
				result = 0;
				field = fields[i];
				name = field.name;
				cmp = field.cmp;

				result = cmp(A[name], B[name]);
				if (result !== 0) break;
			}
			return result;
		}
	}
}());


/*!
 * Ext.ux.Router
 * http://github.com/brunotavares/Ext.ux.Router
 *
 * Copyright 2012 Bruno Tavares
 * Released under the MIT license
 * Check MIT-LICENSE.txt
 */
/*
 * @class Ext.ux.Router
 * @extend Ext.app.Controller
 *
 * Enables routing engine for Ext JS 4 MVC architecture. Responsible for parsing URI Token and fire a dispatch action
 * process. Uses Ext.History internally to detect URI Token changes, providing browser history navigation capabilities.
 *
 *      Ext.application({
 *          name: 'MyApp',
 *          ...
 *          paths: {
 *              'Ext.ux': 'app/ux'
 *          },
 *          routes: {
 *              '/': 'home#index',
 *              'users': 'users#list',
 *              'users/:id/edit': 'users#edit'
 *          }
 *      });
 *
 * Given the routing example above, we would develop controllers specifying their correspondents actions.
 *
 *      Ext.define('AM.controller.Users', {
 *          extend: 'Ext.app.Controller',
 *          views: ['user.List', 'user.Edit'],
 *          stores: ['Users'],
 *          models: ['User'],
 *
 *      //actions
 *          list: function()
 *          {
 *              //TODO: show users list
 *          },
 *
 *          edit: function(params)
 *          {
 *              //TODO: show user form
 *          }
 *      });
 *
 * @docauthor Bruno Tavares
 */

if (Ext.getVersion().major >= 5) {
	Ext.define('Ext.overrides.layout.container.Container', {
	  override: 'Ext.layout.container.Container',

	  notifyOwner: function() {
		this.owner.afterLayout(this);
	  }
	});
};

if ((Ext.getVersion().major < 5) && (Ext.getVersion().major > 2)) {
	Ext.define('Ext.ux.Router', {
			singleton: true
			, alternateClassName: 'Ext.Router'
			, mixins: {
				observable: 'Ext.util.Observable'
			}
			, requires: [
			'Ext.util.History'

				, 'Ext.app.Application'
		],

			// @private
			constructor: function () {
				var me = this;
				me.ready = false;
				me.routes = [];
				me.mixins.observable.constructor.call(me);
			},

			/**
			 * Initializes Ext.History and processes the first token (generaly home, main, index, etc).
			 * @private
			 */
			init: function (app) {
				var me = this
					, history = Ext.History;

				if (me.ready) {
					return;
				}

				me.addEvents(
					/**
					 * @event routemissed
					 * Fires when no route is found for a given URI Token
					 * @param {String} uri The URI Token
					 */
					'routemissed',

					/**
					 * @event beforedispatch
					 * Fires before loading controller and calling its action.  Handlers can return false to cancel the dispatch
					 * process.
					 * @param {String} uri URI Token.
					 * @param {Object} match Route that matched the URI Token.
					 * @param {Object} params The params appended to the URI Token.
					 */
					'beforedispatch',

					/**
					 * @event dispatch
					 * Fires after loading controller and calling its action.
					 * @param {String} uri URI Token.
					 * @param {Object} match Route that matched the URI Token.
					 * @param {Object} params The params appended to the URI Token.
					 * @param {Object} controller The controller handling the action.
					 */
					'dispatch'
				);

				me.app = app;
				me.ready = true;
				me.processRoutes();

				history.init();
				history.on('change', me.parse, me);

				Ext.onReady(function () {
					me.parse(history.getToken());
				});
			},

			/**
			 * Convert routes string definied in Ext.Application into structures objects.
			 * @private
			 */
			processRoutes: function () {
				var key
					, appRoutes = this.app.routes;

				//<debug warn>
				if (!appRoutes && Ext.isDefined(Ext.global.console)) {
					Ext.global.console.warn("[Ext.ux.Router] No routes were found. Consider defining routes object in your Ext.application definition.");
				}
				//</debug>

				for (key in appRoutes) {
					if (appRoutes.hasOwnProperty(key)) {
						this.routeMatcher(key, appRoutes[key]);
					}
				}
			},

			/**
			 * Creates a matcher for a route config, based on
			 * {@link https://github.com/cowboy/javascript-route-matcher javascript-route-matcher}
			 * @private
			 */
			routeMatcher: function (route, rules) {
				var routeObj, action
					, me = this
					, routes = me.routes
					, reRoute = route
					, reParam = /([:*])(\w+)/g
					, reEscape = /([-.+?\^${}()|\[\]\/\\])/g
					, names = [];

				if (rules.regex) {
					routeObj = {
						route: route
						, regex: rules.regex
						, controller: Ext.String.capitalize(rules.controller)
						, action: rules.action
					};

					delete rules.controller;
					delete rules.action;
					routeObj.rules = rules;
				} else {

					reRoute = reRoute.replace(reEscape, "\\$1").replace(reParam, function (_, mode, name) {
						names.push(name);
						return mode === ":" ? "([^/]*)" : "(.*)";
					});

					routeObj = {
						route: route
						, names: names
						, matcher: new RegExp("^" + reRoute + "$")
					};

					if (Ext.isString(rules)) {
						action = rules.split('#');

						routeObj.controller = Ext.String.capitalize(action[0]);
						routeObj.action = action[1];
						routeObj.rules = undefined;
					} else {

						routeObj.controller = Ext.String.capitalize(rules.controller);
						routeObj.action = rules.action;

						delete rules.controller;
						delete rules.action;
						routeObj.rules = rules;
					}
				}

				//<debug error>
				if (!routeObj.controller && Ext.isDefined(Ext.global.console)) {
					Ext.global.console.error("[Ext.ux.Router] Config 'controller' can't be undefined", route, rules);
				}

				if (!routeObj.action && Ext.isDefined(Ext.global.console)) {
					Ext.global.console.error("[Ext.ux.Router] Config 'action' can't be undefined", route, rules);
				}
				//</debug>

				routes.push(routeObj);
			},

			/**
			 * Receives a url token and goes trough each of of the defined route objects searching
			 * for a match.
			 * @private
			 */
			parse: function (token) {
				var route, matches, params, names, j, param, value, rules
					, me = this
					, routes = me.routes
					, i = 0
					, len = routes.length;

				token = token || "";

				for (; i < len; i++) {
					route = routes[i];

					if (route.regex) {
						matches = token.match(route.regex);

						if (matches) {
							matches = matches.slice(1);

							if (me.dispatch(token, route, matches)) {
								return {
									captures: matches
								};
							}
						}
					} else {
						matches = token.match(route.matcher);

						if (token === '' && route.route === '/') {
							matches = [];
						}

						if (matches) {
							params = {};
							names = route.names;
							rules = route.rules;
							j = 0;

							while (j < names.length) {
								param = names[j++];
								value = matches[j];

								if (rules && param in rules && !this.validateRule(rules[param], value)) {
									matches = false;
									break;
								}

								params[param] = value;
							}

							if (matches && me.dispatch(token, route, params)) {
								return params;
							}
						}
					}
				}

				me.fireEvent('routemissed', token);
				return false;
			},

			/**
			 * Each route can have rules, and this function ensures these rules. They could be Functions,
			 * Regular Expressions or simple string strong comparisson.
			 * @private
			 */
			validateRule: function (rule, value) {
				if (Ext.isFunction(rule)) {
					return rule(value);
				} else if (Ext.isFunction(rule.test)) {
					return rule.test(value);
				}

				return rule === value;
			},

			/**
			 * Tries to dispatch a route to the controller action. Fires the 'beforedispatch' and
			 * 'dispatch' events.
			 * @private
			 */
			dispatch: function (token, route, params) {
				var controller
					, me = this;

				if (me.fireEvent('beforedispatch', token, route, params) === false) {
					return false;
				}

				//<debug error>
				controller = me.app.getModuleClassName(route.controller, 'controller');
				controller = Ext.ClassManager.get(controller);

				if (!controller && Ext.isDefined(Ext.global.console)) {
					Ext.global.console.error("[Ext.ux.Router] Controller not found ", route.controller);
				}
				//</debug>

				controller = me.app.getController(route.controller);

				//<debug error>
				if (!controller[route.action] && Ext.isDefined(Ext.global.console)) {
					Ext.global.console.error("[Ext.ux.Router] Controller action not found ", route.controller, route.action);
				}
				//</debug>

				controller[route.action].call(controller, params, token, route);
				me.fireEvent('dispatch', token, route, params, controller);

				return true;
			},

			/**
			 * Redirects the page to other URI.
			 * @param {String} uri URI Token
			 * @param {Boolean} [preventDuplicates=true] When true, if the passed token matches the current token
			 * it will not save a new history step. Set to false if the same state can be saved more than once
			 * at the same history stack location.
			 */
			redirect: function (token, preventDup) {
				var history = Ext.History;

				if (preventDup !== true && history.getToken() === token) {
					this.parse(token);
				} else {
					history.add(token);
				}
			}
		}
		, function () {
			/*
			 * Patch Ext.Application to auto-initialize Router
			 */
			Ext.override(Ext.app.Application, {
				enableRouter: true
				, onBeforeLaunch: function () {
					this.callOverridden();

					if (this.enableRouter) {
						Ext.ux.Router.init(this);
					}
				}
			});
		});

}

if (!Settings.DEBUG) {
	if (Settings.TYPE != "mobile") {
		// PROD // DESKTOP
		//require(['io'], function (io) {

			if (Settings.REMOTE_API.indexOf('https')>-1)
			document.socket = io.connect(Settings.REMOTE_API, {secure: false});
			else
			document.socket = io.connect(Settings.REMOTE_API);
			document.socket.on('connect', function () {
				console.log('connected.')
			});
			document.socket.on('disconnect', function () {
				console.log('disconnected.')
			});
			Ext.define("omneedia.IO", {
				statics: {
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
				}
			});
			App.IO = omneedia.IO;
		//});
	};
};


if (Settings.DEBUG) {
	window.onerror = function (msg, uri, line, col, obj) {
		console.error("ERROR " + msg);
		/*var getStackTrace = function() {
			var obj = {};
			Error.captureStackTrace(obj, getStackTrace);
			return obj.stack;
		};
        $('.omneedia-overlay').show();
        $('#appLoadingFailed').show();
        var html = [
			"<b>GURU Meditation"
			, "An unhandled exception has occurred</b>"
			, "&nbsp;"
			, uri
			, "&nbsp;"
			, msg
			, "<small>Line: " + line + " - Col: " + col + '</small>'
			, "&nbsp;<br>"
			, getStackTrace()
		];
        if (obj) html.push(JSON.stringify(obj.stack, null, 4).replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;"));
        var div = document.createElement('div');
        div.style.fontSize = "20px";
        div.style.color = "white";
        div.style.fontFamily = "Tahoma";
        div.style.position = "absolute";
        div.style.left = "20px";
        div.style.top = "20px";
        div.innerHTML = html.join('<br>');
        $("#appLoadingFailed").append(div);*/
	};
} else {
	//console.log = function () {};
}
