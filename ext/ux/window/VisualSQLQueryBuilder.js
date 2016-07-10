/*
 *
 *  SyntaxHighlighter
 *
 */

var XRegExp;
if (XRegExp) throw Error("can't load XRegExp twice in the same frame");
(function() {
    function r(f, e) {
        if (!XRegExp.isRegExp(f)) throw TypeError("type RegExp expected");
        var a = f._xregexp;
        f = XRegExp(f.source, t(f) + (e || ""));
        if (a) f._xregexp = {
            source: a.source,
            captureNames: a.captureNames ? a.captureNames.slice(0) : null
        };
        return f
    }

    function t(f) {
        return (f.global ? "g" : "") + (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.extended ? "x" : "") + (f.sticky ? "y" : "")
    }

    function B(f, e, a, b) {
        var c = u.length,
            d, h, g;
        v = true;
        try {
            for (; c--;) {
                g = u[c];
                if (a & g.scope && (!g.trigger || g.trigger.call(b))) {
                    g.pattern.lastIndex = e;
                    if ((h = g.pattern.exec(f)) && h.index === e) {
                        d = {
                            output: g.handler.call(b, h, a),
                            match: h
                        };
                        break
                    }
                }
            }
        } catch (i) {
            throw i
        } finally {
            v = false
        }
        return d
    }

    function p(f, e, a) {
        if (Array.prototype.indexOf) return f.indexOf(e, a);
        for (a = a || 0; a < f.length; a++)
            if (f[a] === e) return a;
        return -1
    }
    XRegExp = function(f, e) {
        var a = [],
            b = XRegExp.OUTSIDE_CLASS,
            c = 0,
            d, h;
        if (XRegExp.isRegExp(f)) {
            if (e !== undefined) throw TypeError("can't supply flags when constructing one RegExp from another");
            return r(f)
        }
        if (v) throw Error("can't call the XRegExp constructor within token definition functions");
        e = e || "";
        for (d = {
                hasNamedCapture: false,
                captureNames: [],
                hasFlag: function(g) {
                    return e.indexOf(g) > -1
                },
                setFlag: function(g) {
                    e += g
                }
            }; c < f.length;)
            if (h = B(f, c, b, d)) {
                a.push(h.output);
                c += h.match[0].length || 1
            } else if (h = n.exec.call(z[b], f.slice(c))) {
            a.push(h[0]);
            c += h[0].length
        } else {
            h = f.charAt(c);
            if (h === "[") b = XRegExp.INSIDE_CLASS;
            else if (h === "]") b = XRegExp.OUTSIDE_CLASS;
            a.push(h);
            c++
        }
        a = RegExp(a.join(""), n.replace.call(e, w, ""));
        a._xregexp = {
            source: f,
            captureNames: d.hasNamedCapture ? d.captureNames : null
        };
        return a
    };
    XRegExp.version = "1.5.0";
    XRegExp.INSIDE_CLASS = 1;
    XRegExp.OUTSIDE_CLASS = 2;
    var C = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g,
        w = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g,
        A = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,
        v = false,
        u = [],
        n = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        x = n.exec.call(/()??/, "")[1] === undefined,
        D = function() {
            var f = /^/g;
            n.test.call(f, "");
            return !f.lastIndex
        }(),
        y = function() {
            var f = /x/g;
            n.replace.call("x", f, "");
            return !f.lastIndex
        }(),
        E = RegExp.prototype.sticky !== undefined,
        z = {};
    z[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/;
    z[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/;
    XRegExp.addToken = function(f, e, a, b) {
        u.push({
            pattern: r(f, "g" + (E ? "y" : "")),
            handler: e,
            scope: a || XRegExp.OUTSIDE_CLASS,
            trigger: b || null
        })
    };
    XRegExp.cache = function(f, e) {
        var a = f + "/" + (e || "");
        return XRegExp.cache[a] || (XRegExp.cache[a] = XRegExp(f, e))
    };
    XRegExp.copyAsGlobal = function(f) {
        return r(f, "g")
    };
    XRegExp.escape = function(f) {
        return f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    };
    XRegExp.execAt = function(f, e, a, b) {
        e = r(e, "g" + (b && E ? "y" : ""));
        e.lastIndex = a = a || 0;
        f = e.exec(f);
        return b ? f && f.index === a ? f : null : f
    };
    XRegExp.freezeTokens = function() {
        XRegExp.addToken = function() {
            throw Error("can't run addToken after freezeTokens")
        }
    };
    XRegExp.isRegExp = function(f) {
        return Object.prototype.toString.call(f) === "[object RegExp]"
    };
    XRegExp.iterate = function(f, e, a, b) {
        for (var c = r(e, "g"), d = -1, h; h = c.exec(f);) {
            a.call(b, h, ++d, f, c);
            c.lastIndex === h.index && c.lastIndex++
        }
        if (e.global) e.lastIndex = 0
    };
    XRegExp.matchChain = function(f, e) {
        return function a(b, c) {
            var d = e[c].regex ? e[c] : {
                    regex: e[c]
                },
                h = r(d.regex, "g"),
                g = [],
                i;
            for (i = 0; i < b.length; i++) XRegExp.iterate(b[i], h, function(k) {
                g.push(d.backref ? k[d.backref] || "" : k[0])
            });
            return c === e.length - 1 || !g.length ? g : a(g, c + 1)
        }([f], 0)
    };
    RegExp.prototype.apply = function(f, e) {
        return this.exec(e[0])
    };
    RegExp.prototype.call = function(f, e) {
        return this.exec(e)
    };
    RegExp.prototype.exec = function(f) {
        var e = n.exec.apply(this, arguments),
            a;
        if (e) {
            if (!x && e.length > 1 && p(e, "") > -1) {
                a = RegExp(this.source, n.replace.call(t(this), "g", ""));
                n.replace.call(f.slice(e.index), a, function() {
                    for (var c = 1; c < arguments.length - 2; c++)
                        if (arguments[c] === undefined) e[c] = undefined
                })
            }
            if (this._xregexp && this._xregexp.captureNames)
                for (var b = 1; b < e.length; b++)
                    if (a = this._xregexp.captureNames[b - 1]) e[a] = e[b];
                    !D && this.global && !e[0].length && this.lastIndex > e.index && this.lastIndex--
        }
        return e
    };
    if (!D) RegExp.prototype.test = function(f) {
        (f = n.exec.call(this, f)) && this.global && !f[0].length && this.lastIndex > f.index && this.lastIndex--;
        return !!f
    };
    String.prototype.match = function(f) {
        XRegExp.isRegExp(f) || (f = RegExp(f));
        if (f.global) {
            var e = n.match.apply(this, arguments);
            f.lastIndex = 0;
            return e
        }
        return f.exec(this)
    };
    String.prototype.replace = function(f, e) {
        var a = XRegExp.isRegExp(f),
            b, c;
        if (a && typeof e.valueOf() === "string" && e.indexOf("${") === -1 && y) return n.replace.apply(this, arguments);
        if (a) {
            if (f._xregexp) b = f._xregexp.captureNames
        } else f += "";
        if (typeof e === "function") c = n.replace.call(this, f, function() {
            if (b) {
                arguments[0] = new String(arguments[0]);
                for (var d = 0; d < b.length; d++)
                    if (b[d]) arguments[0][b[d]] = arguments[d + 1]
            }
            if (a && f.global) f.lastIndex = arguments[arguments.length - 2] + arguments[0].length;
            return e.apply(null, arguments)
        });
        else {
            c = this + "";
            c = n.replace.call(c, f, function() {
                var d = arguments;
                return n.replace.call(e, C, function(h, g, i) {
                    if (g) switch (g) {
                        case "$":
                            return "$";
                        case "&":
                            return d[0];
                        case "`":
                            return d[d.length - 1].slice(0, d[d.length - 2]);
                        case "'":
                            return d[d.length - 1].slice(d[d.length - 2] + d[0].length);
                        default:
                            i = "";
                            g = +g;
                            if (!g) return h;
                            for (; g > d.length - 3;) {
                                i = String.prototype.slice.call(g, -1) + i;
                                g = Math.floor(g / 10)
                            }
                            return (g ? d[g] || "" : "$") + i
                    } else {
                        g = +i;
                        if (g <= d.length - 3) return d[g];
                        g = b ? p(b, i) : -1;
                        return g > -1 ? d[g + 1] : h
                    }
                })
            })
        }
        if (a && f.global) f.lastIndex = 0;
        return c
    };
    String.prototype.split = function(f, e) {
        if (!XRegExp.isRegExp(f)) return n.split.apply(this, arguments);
        var a = this + "",
            b = [],
            c = 0,
            d, h;
        if (e === undefined || +e < 0) e = Infinity;
        else {
            e = Math.floor(+e);
            if (!e) return []
        }
        for (f = XRegExp.copyAsGlobal(f); d = f.exec(a);) {
            if (f.lastIndex > c) {
                b.push(a.slice(c, d.index));
                d.length > 1 && d.index < a.length && Array.prototype.push.apply(b, d.slice(1));
                h = d[0].length;
                c = f.lastIndex;
                if (b.length >= e) break
            }
            f.lastIndex === d.index && f.lastIndex++
        }
        if (c === a.length) {
            if (!n.test.call(f, "") || h) b.push("")
        } else b.push(a.slice(c));
        return b.length > e ? b.slice(0, e) : b
    };
    XRegExp.addToken(/\(\?#[^)]*\)/, function(f) {
        return n.test.call(A, f.input.slice(f.index + f[0].length)) ? "" : "(?:)"
    });
    XRegExp.addToken(/\((?!\?)/, function() {
        this.captureNames.push(null);
        return "("
    });
    XRegExp.addToken(/\(\?<([$\w]+)>/, function(f) {
        this.captureNames.push(f[1]);
        this.hasNamedCapture = true;
        return "("
    });
    XRegExp.addToken(/\\k<([\w$]+)>/, function(f) {
        var e = p(this.captureNames, f[1]);
        return e > -1 ? "\\" + (e + 1) + (isNaN(f.input.charAt(f.index + f[0].length)) ? "" : "(?:)") : f[0]
    });
    XRegExp.addToken(/\[\^?]/, function(f) {
        return f[0] === "[]" ? "\\b\\B" : "[\\s\\S]"
    });
    XRegExp.addToken(/^\(\?([imsx]+)\)/, function(f) {
        this.setFlag(f[1]);
        return ""
    });
    XRegExp.addToken(/(?:\s+|#.*)+/, function(f) {
        return n.test.call(A, f.input.slice(f.index + f[0].length)) ? "" : "(?:)"
    }, XRegExp.OUTSIDE_CLASS, function() {
        return this.hasFlag("x")
    });
    XRegExp.addToken(/\./, function() {
        return "[\\s\\S]"
    }, XRegExp.OUTSIDE_CLASS, function() {
        return this.hasFlag("s")
    })
})();
typeof exports != "undefined" && (exports.XRegExp = XRegExp);
var SyntaxHighlighter = function() {
    function r(a, b) {
        a.className.indexOf(b) != -1 || (a.className += " " + b)
    }

    function t(a) {
        return a.indexOf("highlighter_") == 0 ? a : "highlighter_" + a
    }

    function B(a) {
        return e.vars.highlighters[t(a)]
    }

    function p(a, b, c) {
        if (a == null) return null;
        var d = c != true ? a.childNodes : [a.parentNode],
            h = {
                "#": "id",
                ".": "className"
            }[b.substr(0, 1)] || "nodeName",
            g, i;
        g = h != "nodeName" ? b.substr(1) : b.toUpperCase();
        if ((a[h] || "").indexOf(g) != -1) return a;
        for (a = 0; d && a < d.length && i == null; a++) i = p(d[a], b, c);
        return i
    }

    function C(a, b) {
        var c = {},
            d;
        for (d in a) c[d] = a[d];
        for (d in b) c[d] = b[d];
        return c
    }

    function w(a, b, c, d) {
        function h(g) {
            g = g || window.event;
            if (!g.target) {
                g.target = g.srcElement;
                g.preventDefault = function() {
                    this.returnValue = false
                }
            }
            c.call(d || window, g)
        }
        a.attachEvent ? a.attachEvent("on" + b, h) : a.addEventListener(b, h, false)
    }

    function A(a, b) {
        var c = e.vars.discoveredBrushes,
            d = null;
        if (c == null) {
            c = {};
            for (var h in e.brushes) {
                var g = e.brushes[h];
                d = g.aliases;
                if (d != null) {
                    g.brushName = h.toLowerCase();
                    for (g = 0; g < d.length; g++) c[d[g]] = h
                }
            }
            e.vars.discoveredBrushes = c
        }
        d = e.brushes[c[a]];
        d == null && b != false && window.alert(e.config.strings.alert + (e.config.strings.noBrush + a));
        return d
    }

    function v(a, b) {
        for (var c = a.split("\n"), d = 0; d < c.length; d++) c[d] = b(c[d], d);
        return c.join("\n")
    }

    function u(a, b) {
        if (a == null || a.length == 0 || a == "\n") return a;
        a = a.replace(/</g, "&lt;");
        a = a.replace(/ {2,}/g, function(c) {
            for (var d = "", h = 0; h < c.length - 1; h++) d += e.config.space;
            return d + " "
        });
        if (b != null) a = v(a, function(c) {
            if (c.length == 0) return "";
            var d = "";
            c = c.replace(/^(&nbsp;| )+/, function(h) {
                d = h;
                return ""
            });
            if (c.length == 0) return d;
            return d + '<code class="' + b + '">' + c + "</code>"
        });
        return a
    }

    function n(a, b) {
        a.split("\n");
        for (var c = "", d = 0; d < 50; d++) c += "                    ";
        return a = v(a, function(h) {
            if (h.indexOf("\t") == -1) return h;
            for (var g = 0;
                (g = h.indexOf("\t")) != -1;) h = h.substr(0, g) + c.substr(0, b - g % b) + h.substr(g + 1, h.length);
            return h
        })
    }

    function x(a) {
        return a.replace(/^\s+|\s+$/g, "")
    }

    function D(a, b) {
        if (a.index < b.index) return -1;
        else if (a.index > b.index) return 1;
        else if (a.length < b.length) return -1;
        else if (a.length > b.length) return 1;
        return 0
    }

    function y(a, b) {
        function c(k) {
            return k[0]
        }
        for (var d = null, h = [], g = b.func ? b.func : c;
            (d = b.regex.exec(a)) != null;) {
            var i = g(d, b);
            if (typeof i == "string") i = [new e.Match(i, d.index, b.css)];
            h = h.concat(i)
        }
        return h
    }

    function E(a) {
        var b = /(.*)((&gt;|&lt;).*)/;
        return a.replace(e.regexLib.url, function(c) {
            var d = "",
                h = null;
            if (h = b.exec(c)) {
                c = h[1];
                d = h[2]
            }
            return '<a href="' + c + '">' + c + "</a>" + d
        })
    }

    function z() {
        for (var a = document.getElementsByTagName("script"), b = [], c = 0; c < a.length; c++) a[c].type == "syntaxhighlighter" && b.push(a[c]);
        return b
    }

    function f(a) {
        a = a.target;
        var b = p(a, ".syntaxhighlighter", true);
        a = p(a, ".container", true);
        var c = document.createElement("textarea");
        if (!(!a || !b || p(a, "textarea"))) {
            B(b.id);
            r(b, "source");
            for (var d = a.childNodes, h = [], g = 0; g < d.length; g++) h.push(d[g].innerText || d[g].textContent);
            h = h.join("\r");
            c.appendChild(document.createTextNode(h));
            a.appendChild(c);
            c.focus();
            c.select();
            w(c, "blur", function() {
                c.parentNode.removeChild(c);
                b.className = b.className.replace("source", "")
            })
        }
    }
    if (typeof require != "undefined" && typeof XRegExp == "undefined") XRegExp = require("XRegExp").XRegExp;
    var e = {
        defaults: {
            "class-name": "",
            "first-line": 1,
            "pad-line-numbers": false,
            highlight: null,
            title: null,
            "smart-tabs": true,
            "tab-size": 4,
            gutter: true,
            toolbar: true,
            "quick-code": true,
            collapse: false,
            "auto-links": true,
            light: false,
            "html-script": false
        },
        config: {
            space: "&nbsp;",
            useScriptTags: true,
            bloggerMode: false,
            stripBrs: false,
            tagName: "pre",
            strings: {
                expandSource: "expand source",
                help: "?",
                alert: "SyntaxHighlighter\n\n",
                noBrush: "Can't find brush for: ",
                brushNotHtmlScript: "Brush wasn't configured for html-script option: ",
                aboutDialog: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>About SyntaxHighlighter</title></head><body style="font-family:Geneva,Arial,Helvetica,sans-serif;background-color:#fff;color:#000;font-size:1em;text-align:center;"><div style="text-align:center;margin-top:1.5em;"><div style="font-size:xx-large;">SyntaxHighlighter</div><div style="font-size:.75em;margin-bottom:3em;"><div>version 3.0.83 (July 02 2010)</div><div><a href="http://alexgorbatchev.com/SyntaxHighlighter" target="_blank" style="color:#005896">http://alexgorbatchev.com/SyntaxHighlighter</a></div><div>JavaScript code syntax highlighter.</div><div>Copyright 2004-2010 Alex Gorbatchev.</div></div><div>If you like this script, please <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2930402" style="color:#005896">donate</a> to <br/>keep development active!</div></div></body></html>'
            }
        },
        vars: {
            discoveredBrushes: null,
            highlighters: {}
        },
        brushes: {},
        regexLib: {
            multiLineCComments: /\/\*[\s\S]*?\*\//gm,
            singleLineCComments: /\/\/.*$/gm,
            singleLinePerlComments: /#.*$/gm,
            doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
            singleQuotedString: /'([^\\'\n]|\\.)*'/g,
            multiLineDoubleQuotedString: new XRegExp('"([^\\\\"]|\\\\.)*"', "gs"),
            multiLineSingleQuotedString: new XRegExp("'([^\\\\']|\\\\.)*'", "gs"),
            xmlComments: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
            url: /\w+:\/\/[\w-.\/?%&=:@;]*/g,
            phpScriptTags: {
                left: /(&lt;|<)\?=?/g,
                right: /\?(&gt;|>)/g
            },
            aspScriptTags: {
                left: /(&lt;|<)%=?/g,
                right: /%(&gt;|>)/g
            },
            scriptScriptTags: {
                left: /(&lt;|<)\s*script.*?(&gt;|>)/gi,
                right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi
            }
        },
        toolbar: {
            getHtml: function(a) {
                function b(i, k) {
                    return e.toolbar.getButtonHtml(i, k, e.config.strings[k])
                }
                for (var c = '<div class="toolbar">', d = e.toolbar.items, h = d.list, g = 0; g < h.length; g++) c += (d[h[g]].getHtml || b)(a, h[g]);
                c += "</div>";
                return c
            },
            getButtonHtml: function(a, b, c) {
                return '<span><a href="#" class="toolbar_item command_' + b + " " + b + '">' + c + "</a></span>"
            },
            handler: function(a) {
                var b = a.target,
                    c = b.className || "";
                b = B(p(b, ".syntaxhighlighter", true).id);
                var d = function(h) {
                    return (h = RegExp(h + "_(\\w+)").exec(c)) ? h[1] : null
                }("command");
                b && d && e.toolbar.items[d].execute(b);
                a.preventDefault()
            },
            items: {
                list: ["expandSource", "help"],
                expandSource: {
                    getHtml: function(a) {
                        if (a.getParam("collapse") != true) return "";
                        var b = a.getParam("title");
                        return e.toolbar.getButtonHtml(a, "expandSource", b ? b : e.config.strings.expandSource)
                    },
                    execute: function(a) {
                        a = document.getElementById(t(a.id));
                        a.className = a.className.replace("collapsed", "")
                    }
                },
                help: {
                    execute: function() {
                        var a = "scrollbars=0";
                        a += ", left=" + (screen.width - 500) / 2 + ", top=" + (screen.height - 250) / 2 + ", width=500, height=250";
                        a = a.replace(/^,/, "");
                        a = window.open("", "_blank", a);
                        a.focus();
                        var b = a.document;
                        b.write(e.config.strings.aboutDialog);
                        b.close();
                        a.focus()
                    }
                }
            }
        },
        findElements: function(a, b) {
            var c;
            if (b) c = [b];
            else {
                c = document.getElementsByTagName(e.config.tagName);
                for (var d = [], h = 0; h < c.length; h++) d.push(c[h]);
                c = d
            }
            c = c;
            d = [];
            if (e.config.useScriptTags) c = c.concat(z());
            if (c.length === 0) return d;
            for (h = 0; h < c.length; h++) {
                for (var g = c[h], i = a, k = c[h].className, j = void 0, l = {}, m = new XRegExp("^\\[(?<values>(.*?))\\]$"), s = new XRegExp("(?<name>[\\w-]+)\\s*:\\s*(?<value>[\\w-%#]+|\\[.*?\\]|\".*?\"|'.*?')\\s*;?", "g");
                    (j = s.exec(k)) != null;) {
                    var o = j.value.replace(/^['"]|['"]$/g, "");
                    if (o != null && m.test(o)) {
                        o = m.exec(o);
                        o = o.values.length > 0 ? o.values.split(/\s*,\s*/) : []
                    }
                    l[j.name] = o
                }
                g = {
                    target: g,
                    params: C(i, l)
                };
                g.params.brush != null && d.push(g)
            }
            return d
        },
        highlight: function(a, b) {
            var c = this.findElements(a, b),
                d = null,
                h = e.config;
            if (c.length !== 0)
                for (var g = 0; g < c.length; g++) {
                    b = c[g];
                    var i = b.target,
                        k = b.params,
                        j = k.brush,
                        l;
                    if (j != null) {
                        if (k["html-script"] == "true" || e.defaults["html-script"] == true) {
                            d = new e.HtmlScript(j);
                            j = "htmlscript"
                        } else if (d = A(j)) d = new d;
                        else continue;
                        l = i.innerHTML;
                        if (h.useScriptTags) {
                            l = l;
                            var m = x(l),
                                s = false;
                            if (m.indexOf("<![CDATA[") == 0) {
                                m = m.substring(9);
                                s = true
                            }
                            var o = m.length;
                            if (m.indexOf("]]\>") == o - 3) {
                                m = m.substring(0, o - 3);
                                s = true
                            }
                            l = s ? m : l
                        }
                        if ((i.title || "") != "") k.title = i.title;
                        k.brush = j;
                        d.init(k);
                        b = d.getDiv(l);
                        if ((i.id || "") != "") b.id = i.id;
                        i.parentNode.replaceChild(b, i)
                    }
                }
        },
        all: function(a) {
            w(window, "load", function() {
                e.highlight(a)
            })
        }
    };
    e.all = e.all;
    e.highlight = e.highlight;
    e.Match = function(a, b, c) {
        this.value = a;
        this.index = b;
        this.length = a.length;
        this.css = c;
        this.brushName = null
    };
    e.Match.prototype.toString = function() {
        return this.value
    };
    e.HtmlScript = function(a) {
        function b(j, l) {
            for (var m = 0; m < j.length; m++) j[m].index += l
        }
        var c = A(a),
            d, h = new e.brushes.Xml,
            g = this,
            i = "getDiv getHtml init".split(" ");
        if (c != null) {
            d = new c;
            for (var k = 0; k < i.length; k++)(function() {
                var j = i[k];
                g[j] = function() {
                    return h[j].apply(h, arguments)
                }
            })();
            d.htmlScript == null ? window.alert(e.config.strings.alert + (e.config.strings.brushNotHtmlScript + a)) : h.regexList.push({
                regex: d.htmlScript.code,
                func: function(j) {
                    for (var l = j.code, m = [], s = d.regexList, o = j.index + j.left.length, F = d.htmlScript, q, G = 0; G < s.length; G++) {
                        q = y(l, s[G]);
                        b(q, o);
                        m = m.concat(q)
                    }
                    if (F.left != null && j.left != null) {
                        q = y(j.left, F.left);
                        b(q, j.index);
                        m = m.concat(q)
                    }
                    if (F.right != null && j.right != null) {
                        q = y(j.right, F.right);
                        b(q, j.index + j[0].lastIndexOf(j.right));
                        m = m.concat(q)
                    }
                    for (j = 0; j < m.length; j++) m[j].brushName = c.brushName;
                    return m
                }
            })
        }
    };
    e.Highlighter = function() {};
    e.Highlighter.prototype = {
        getParam: function(a, b) {
            var c = this.params[a];
            c = c == null ? b : c;
            var d = {
                "true": true,
                "false": false
            }[c];
            return d == null ? c : d
        },
        create: function(a) {
            return document.createElement(a)
        },
        findMatches: function(a, b) {
            var c = [];
            if (a != null)
                for (var d = 0; d < a.length; d++)
                    if (typeof a[d] == "object") c = c.concat(y(b, a[d]));
            return this.removeNestedMatches(c.sort(D))
        },
        removeNestedMatches: function(a) {
            for (var b = 0; b < a.length; b++)
                if (a[b] !== null)
                    for (var c = a[b], d = c.index + c.length, h = b + 1; h < a.length && a[b] !== null; h++) {
                        var g = a[h];
                        if (g !== null)
                            if (g.index > d) break;
                            else if (g.index == c.index && g.length > c.length) a[b] = null;
                        else if (g.index >= c.index && g.index < d) a[h] = null
                    }
                return a
        },
        figureOutLineNumbers: function(a) {
            var b = [],
                c = parseInt(this.getParam("first-line"));
            v(a, function(d, h) {
                b.push(h + c)
            });
            return b
        },
        isLineHighlighted: function(a) {
            var b = this.getParam("highlight", []);
            if (typeof b != "object" && b.push == null) b = [b];
            a: {
                a = a.toString();
                var c = void 0;
                for (c = c = Math.max(c || 0, 0); c < b.length; c++)
                    if (b[c] == a) {
                        b = c;
                        break a
                    }
                b = -1
            }
            return b != -1
        },
        getLineHtml: function(a, b, c) {
            a = ["line", "number" + b, "index" + a, "alt" + (b % 2 == 0 ? 1 : 2).toString()];
            this.isLineHighlighted(b) && a.push("highlighted");
            b == 0 && a.push("break");
            return '<div class="' + a.join(" ") + '">' + c + "</div>"
        },
        getLineNumbersHtml: function(a, b) {
            var c = "",
                d = a.split("\n").length,
                h = parseInt(this.getParam("first-line")),
                g = this.getParam("pad-line-numbers");
            if (g == true) g = (h + d - 1).toString().length;
            else if (isNaN(g) == true) g = 0;
            for (var i = 0; i < d; i++) {
                var k = b ? b[i] : h + i,
                    j;
                if (k == 0) j = e.config.space;
                else {
                    j = g;
                    for (var l = k.toString(); l.length < j;) l = "0" + l;
                    j = l
                }
                a = j;
                c += this.getLineHtml(i, k, a)
            }
            return c
        },
        getCodeLinesHtml: function(a, b) {
            a = x(a);
            var c = a.split("\n");
            this.getParam("pad-line-numbers");
            var d = parseInt(this.getParam("first-line"));
            a = "";
            for (var h = this.getParam("brush"), g = 0; g < c.length; g++) {
                var i = c[g],
                    k = /^(&nbsp;|\s)+/.exec(i),
                    j = null,
                    l = b ? b[g] : d + g;
                if (k != null) {
                    j = k[0].toString();
                    i = i.substr(j.length);
                    j = j.replace(" ", e.config.space)
                }
                i = x(i);
                if (i.length == 0) i = e.config.space;
                a += this.getLineHtml(g, l, (j != null ? '<code class="' + h + ' spaces">' + j + "</code>" : "") + i)
            }
            return a
        },
        getTitleHtml: function(a) {
            return a ? "<caption>" + a + "</caption>" : ""
        },
        getMatchesHtml: function(a, b) {
            function c(l) {
                return (l = l ? l.brushName || g : g) ? l + " " : ""
            }
            for (var d = 0, h = "", g = this.getParam("brush", ""), i = 0; i < b.length; i++) {
                var k = b[i],
                    j;
                if (!(k === null || k.length === 0)) {
                    j = c(k);
                    h += u(a.substr(d, k.index - d), j + "plain") + u(k.value, j + k.css);
                    d = k.index + k.length + (k.offset || 0)
                }
            }
            h += u(a.substr(d), c() + "plain");
            return h
        },
        getHtml: function(a) {
            var b = "",
                c = ["syntaxhighlighter"],
                d;
            if (this.getParam("light") == true) this.params.toolbar = this.params.gutter = false;
            className = "syntaxhighlighter";
            this.getParam("collapse") == true && c.push("collapsed");
            if ((gutter = this.getParam("gutter")) == false) c.push("nogutter");
            c.push(this.getParam("class-name"));
            c.push(this.getParam("brush"));
            a = a.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, "").replace(/\r/g, " ");
            b = this.getParam("tab-size");
            if (this.getParam("smart-tabs") == true) a = n(a, b);
            else {
                for (var h = "", g = 0; g < b; g++) h += " ";
                a = a.replace(/\t/g, h)
            }
            a = a;
            a: {
                b = a = a;
                h = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
                if (e.config.bloggerMode == true) b = b.replace(h, "\n");
                if (e.config.stripBrs == true) b = b.replace(h, "");
                b = b.split("\n");
                h = /^\s*/;
                g = 1E3;
                for (var i = 0; i < b.length && g > 0; i++) {
                    var k = b[i];
                    if (x(k).length != 0) {
                        k = h.exec(k);
                        if (k == null) {
                            a = a;
                            break a
                        }
                        g = Math.min(k[0].length, g)
                    }
                }
                if (g > 0)
                    for (i = 0; i < b.length; i++) b[i] = b[i].substr(g);
                a = b.join("\n")
            }
            if (gutter) d = this.figureOutLineNumbers(a);
            b = this.findMatches(this.regexList, a);
            b = this.getMatchesHtml(a, b);
            b = this.getCodeLinesHtml(b, d);
            if (this.getParam("auto-links")) b = E(b);
            typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.match(/MSIE/) && c.push("ie");
            return b = '<div id="' + t(this.id) + '" class="' + c.join(" ") + '">' + (this.getParam("toolbar") ? e.toolbar.getHtml(this) : "") + '<table border="0" cellpadding="0" cellspacing="0">' + this.getTitleHtml(this.getParam("title")) + "<tbody><tr>" + (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(a) + "</td>" : "") + '<td class="code"><div class="container">' + b + "</div></td></tr></tbody></table></div>"
        },
        getDiv: function(a) {
            if (a === null) a = "";
            this.code = a;
            var b = this.create("div");
            b.innerHTML = this.getHtml(a);
            this.getParam("toolbar") && w(p(b, ".toolbar"), "click", e.toolbar.handler);
            this.getParam("quick-code") && w(p(b, ".code"), "dblclick", f);
            return b
        },
        init: function(a) {
            this.id = "" + Math.round(Math.random() * 1E6).toString();
            e.vars.highlighters[t(this.id)] = this;
            this.params = C(e.defaults, a || {});
            if (this.getParam("light") == true) this.params.toolbar = this.params.gutter = false
        },
        getKeywords: function(a) {
            a = a.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "|");
            return "\\b(?:" + a + ")\\b"
        },
        forHtmlScript: function(a) {
            this.htmlScript = {
                left: {
                    regex: a.left,
                    css: "script"
                },
                right: {
                    regex: a.right,
                    css: "script"
                },
                code: new XRegExp("(?<left>" + a.left.source + ")(?<code>.*?)(?<right>" + a.right.source + ")", "sgi")
            }
        }
    };
    return e
}();
typeof exports != "undefined" && (exports.SyntaxHighlighter = SyntaxHighlighter);


/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	//typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var funcs	=	'abs avg case cast coalesce convert count current_timestamp ' +
						'current_user day isnull left lower month nullif replace right ' +
						'session_user space substring sum system_user upper user year';

		var keywords =	'absolute action add after alter as asc at authorization begin bigint ' +
						'binary bit by cascade char character check checkpoint close collate ' +
						'column commit committed connect connection constraint contains continue ' +
						'create cube current current_date current_time cursor database date ' +
						'deallocate dec decimal declare default delete desc distinct double drop ' +
						'dynamic else end end-exec escape except exec execute false fetch first ' +
						'float for force foreign forward free from full function global goto grant ' +
						'group grouping having hour ignore index inner insensitive insert instead ' +
						'int integer intersect into is isolation key last level load local max min ' +
						'minute modify move name national nchar next no numeric of off on only ' +
						'open option order out output partial password precision prepare primary ' +
						'prior privileges procedure public read real references relative repeatable ' +
						'restrict return returns revoke rollback rollup rows rule schema scroll ' +
						'second section select sequence serializable set size smallint static ' +
						'statistics table temp temporary then time timestamp to top transaction ' +
						'translation trigger true truncate uncommitted union unique update values ' +
						'varchar varying view when where with work';

		var operators =	'all and any between cross in join like not null or outer some';

		this.regexList = [
			{ regex: /--(.*)$/gm,												css: 'comments' },			// one line and multiline comments
			{ regex: SyntaxHighlighter.regexLib.multiLineDoubleQuotedString,	css: 'string' },			// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.multiLineSingleQuotedString,	css: 'string' },			// single quoted strings
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),				css: 'color2' },			// functions
			{ regex: new RegExp(this.getKeywords(operators), 'gmi'),			css: 'color1' },			// operators and such
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),				css: 'keyword' }			// keyword
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['sql'];

	SyntaxHighlighter.brushes.Sql = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

/*
 *
 *  SQL Query Builder
 *
 */

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTableSprite', {
    extend: 'Ext.draw.Sprite',
    alias: ['widget.sqltablesprite'],
    bConnections: false,
    startDrag: function(id){
        var me = this, win, sqlTablePanel, xyParentPos, xyChildPos;
        
        // get a reference to a sqltable
        win = Ext.getCmp(id);
        
        // get the main sqlTablePanel
        sqlTablePanel = Ext.getCmp('SQLTablePanel');
        
        // get the main sqlTablePanel position
        xyParentPos = sqlTablePanel.el.getXY();
        
        // get the size of the previously added sqltable
        xyChildPos = win.el.getXY();
        
        me.prev = me.surface.transformToViewBox(xyChildPos[0] - xyParentPos[0] + 2, xyChildPos[1] - xyParentPos[1] + 2);
    },
    
    onDrag: function(relPosMovement){
        var xy, me = this, attr = this.attr, newX, newY;
        // move the sprite
        // calculate new x and y position
        newX = me.prev[0] + relPosMovement[0];
        newY = me.prev[1] + relPosMovement[1];
        // set new x and y position and redraw sprite
        me.setAttributes({
            x: newX,
            y: newY
        
        }, true);
    }
}); 

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTableModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'tableName',
        type: 'string'
    }, {
        name: 'tableAlias',
        type: 'string'
    }]
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTableStore', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.window.visualsqlquerybuilder.SQLTableModel',
    proxy: {
        type: 'memory'
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLJoin', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'leftTableId',
        type: 'string'
    }, {
        name: 'rightTableId',
        type: 'string'
    }, {
        name: 'leftTableField',
        type: 'string'
    }, {
        name: 'rightTableField',
        type: 'string'
    }, {
        name: 'joinCondition',
        type: 'string'
    }, {
        name: 'joinType',
        type: 'string'
    }],
    createUUID: function(){
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        
        var uuid = s.join("");
        return uuid;
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.JoinStore', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.window.visualsqlquerybuilder.SQLJoin',
    proxy: {
        type: 'memory'
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLFieldsModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'tableName',
        type: 'string'
    }, {
        name: 'tableId',
        type: 'string'
    }, {
        name: 'extCmpId',
        type: 'string'
    }, {
        name: 'tableAlias',
        type: 'string'
    }, {
        name: 'field',
        type: 'string'
    }, {
        name: 'output',
        type: 'boolean'
    }, {
        name: 'expression',
        type: 'string'
    }, {
        name: 'aggregate',
        type: 'string'
    }, {
        name: 'alias',
        type: 'string'
    }, {
        name: 'sortType',
        type: 'string'
    }, {
        name: 'sortOrder',
        type: 'int'
    }, {
        name: 'grouping',
        type: 'boolean'
    }, {
        name: 'criteria',
        type: 'string'
    }]
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLFieldsStore', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.window.visualsqlquerybuilder.SQLFieldsModel',
    proxy: {
        type: 'memory'
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLSelect', {
    config: {
        tables: '',
        fields: '',
        joins: ''
    },
    constructor: function(){
    
        this.tables = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLTableStore', {
            storeId: 'SQLTableStore'
        });
        
        // handle all updates on sql tables
        this.tables.on('update', this.handleSQLTableUpdate, this);
        this.tables.on('add', this.handleSQLTableAdd, this);
        this.tables.on('remove', this.handleSQLTableRemove, this);
        
        this.fields = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLFieldsStore', {
            storeId: 'SQLFieldsStore'
        });
        
        this.fields.on('update', this.handleSQLFieldChanges, this);
        this.fields.on('remove', this.handleSQLFieldRemove, this);
        
        this.joins = Ext.create('Ext.ux.window.visualsqlquerybuilder.JoinStore', {
            storeId: 'JoinStore'
        });
        
        // this.joins.on('update', this.handleSQLJoinChanges, this);
        this.joins.on('add', this.handleSQLJoinChanges, this);
        this.joins.on('remove', this.handleSQLJoinChanges, this);
        
        this.callParent(arguments);
    },
    handleSQLTableUpdate: function(tableStore, table, operation){
        if (operation == 'commit') {
            this.updateFieldTableData(table);
            this.updateJoinTableData(table);
            this.updateSQLOutput();
        }
    },
    handleSQLTableAdd: function(tableStore, table, index){
        this.updateSQLOutput();
    },
    handleSQLTableRemove: function(tableStore, table, index){
        var aJoins = [];
        // get table joins and remove them
        aJoins = this.getJoinsByTableId(table.get('id'));
        // loop over the joins array
        for (var i = 0, l = aJoins.length; i < l; i++) {
            // remove join from store
            this.removeJoinById(aJoins[i].get('id'));
        }
        this.updateSQLOutput();
    },
    handleSQLJoinChanges: function(joinStore, join){
        this.updateSQLOutput();
    },
    updateFieldTableData: function(table){
        var tableId, expression, tableAlias, tableName;
        tableId = table.get('id');
        tableAlias = table.get('tableAlias');
        tableName = table.get('tableName');
        // loop over all fields of the fields store
        this.fields.each(function(field){
            // check if current field belongs to sql table
            if (field.get('tableId') == tableId) {
                if (tableAlias != '') {
                    // we have a table alias
                    expression = tableAlias + '.' + field.get('field');
                }
                else {
                    // no table alias
                    expression = tableName + '.' + field.get('field');
                };
                field.beginEdit();
                // update the field table alias
                field.set('tableAlias', tableAlias);
                // update the field expression
                field.set('expression', expression);
                field.commit(true);
                field.endEdit();
            }
        });
        return;
    },
    updateJoinTableData: function(table){
        var joins, tableId;
        tableId = table.get('id');
        joins = this.getJoinsByTableId(tableId);
        for (var i = 0, rightTable, leftTable, joinCondition = '',l = joins.length; i < l; i++) {
            leftTable = this.getTableById(joins[i].get('leftTableId'));
            rightTable = this.getTableById(joins[i].get('rightTableId'));
            
            if (leftTable.get('tableAlias') != '') {
                joinCondition = joinCondition + leftTable.get('tableAlias') + '.' + joins[i].get('leftTableField') + '=';
            }
            else {
                joinCondition = joinCondition + leftTable.get('tableName') + '.' + joins[i].get('leftTableField') + '=';
            }
            
            if (rightTable.get('tableAlias') != '') {
                joinCondition = joinCondition + rightTable.get('tableAlias') + '.' + joins[i].get('rightTableField');
            }
            else {
                joinCondition = joinCondition + rightTable.get('tableName') + '.' + joins[i].get('rightTableField');
            }
            joins[i].beginEdit();
            joins[i].set('joinCondition', joinCondition);
            joins[i].commit(true);
            joins[i].endEdit();
        }
    },
    handleSQLFieldChanges: function(fieldStore, model, operation){
        if (operation == 'commit') {
            this.updateSQLOutput();
        }
    },
    handleSQLFieldRemove: function(fieldStore){
        this.updateSQLOutput();
    },
    updateSQLOutput: function(){
        var sqlOutput, sqlHTML, sqlQutputPanel;
        sqlOutput = this.toString();
        sqlHTML = '<pre class="brush: sql">' + sqlOutput + '</pre>';
        sqlQutputPanel = Ext.getCmp('SQLOutputPanel');
        
        sqlQutputPanel.update(sqlHTML);
    },
    sortTablesByJoins: function(tables, oUsedTables){
        var aTables = [], aJoins = [], oUsedTables = oUsedTables ||
        {};
        // loop over tables
        for (var i = 0, aCondition = [], aJoin, l = tables.length; i < l; i++) {
            // check if current table is a new one
            if (!oUsedTables.hasOwnProperty(tables[i].get('id'))) {
                // it is a new one
                aTables.push(tables[i]);
                // mark table as used
                oUsedTables[tables[i].get('id')] = true;
                // get any joins for the current table
                aJoin = this.getJoinsByTableId(tables[i].get('id'));
                // loop over the join tables
                for (var j = 0, joinTable, len = aJoin.length; j < len; j++) {
                    // check if it is a new join
                    if (!oUsedTables.hasOwnProperty(aJoin[j].get('id'))) {
                        // mark join as used
                        oUsedTables[aJoin[j].get('id')] = true;
                        if (tables[i].get('id') != aJoin[j].get('leftTableId')) {
                            joinTable = this.getTableById(aJoin[j].get('leftTableId'));
                            this.changeLeftRightOnJoin(aJoin[j]);
                        }
                        else {
                            joinTable = this.getTableById(aJoin[j].get('rightTableId'));
                        }
                        oTemp = this.sortTablesByJoins([joinTable], oUsedTables);
                        oUsedTables = oTemp.oUsedTables;
                        aTables = aTables.concat(oTemp.aTables);
                    }
                }
            }
        }
        
        return {
            aTables: aTables,
            oUsedTables: oUsedTables
        };
    },
    changeLeftRightOnJoin: function(join){
        var leftTable, leftTableField, rightTable, rightTableField, joinCondition = '';
        // prepare new data
        leftTable = this.getTableById(join.get('rightTableId'));
        leftTableField = join.get('rightTableField');
        rightTable = this.getTableById(join.get('leftTableId'));
        rightTableField = join.get('leftTableField');
        
        // construct new joinCondition
        if (leftTable.get('tableAlias') != '') {
            joinCondition = joinCondition + leftTable.get('tableAlias') + '.' + join.get('rightTableField') + '=';
        }
        else {
            joinCondition = joinCondition + leftTable.get('tableName') + '.' + join.get('rightTableField') + '=';
        }
        
        if (rightTable.get('tableAlias') != '') {
            joinCondition = joinCondition + rightTable.get('tableAlias') + '.' + join.get('leftTableField');
        }
        else {
            joinCondition = joinCondition + rightTable.get('tableName') + '.' + join.get('leftTableField');
        }
        
        // start transaction
        join.beginEdit();
        // change left and right join table data
        join.set('leftTableId', leftTable.get('id'));
        join.set('leftTableField', leftTableField);
        join.set('rightTableId', rightTable.get('id'));
        join.set('rightTableField', rightTableField);
        join.set('joinCondition', joinCondition);
        // silent commit without firing store events
        // this prevents endless loop
        join.commit(true);
        join.endEdit();
        // end transaction
        return;
    },
    
	/*toString: function(){
        var sqlOutput = 'SELECT ', aJoins = [], aOutputFields = [], oJoinTables = {}, aTables = [], aJoinTables = [], aCriteriaFields = [], aGroupFields = [], aOrderFields = [], selectFieldsSQL = '', fromSQL = '', aFromSQL = [], criteriaSQL = '', orderBySQL = '', groupBySQL = '', fieldSeperator = ', ', joinSQL = '', bFirst = true, bPartOfJoin = false;
        this.fields.each(function(field){
            // should the field be a part of the output
            if (field.get('output')) {
                aOutputFields.push(field);
            }
            // any criteria
            if (field.get('criteria') != '') {
                aCriteriaFields.push(field);
            }
            // check for grouping
            if (field.get('grouping')) {
                aGroupFields.push(field);
            }
            // check for sorting
            if (field.get('sortType') != '') {
                aOrderFields.push(field);
            }
        });
        
        // tables
        // sorting of tables
        this.tables.each(function(table){
            aTables.push(table);
        });
        
        aTables = this.sortTablesByJoins(aTables).aTables;
        
        
        this.joins.each(function(join){
            aJoins.push(join);
        });
        
        //create fromSQL
        for (var k = 0, aJoin = [], oJoinTables = {}, joinCondition = '', joinType, leftTable, rightTable, l = aTables.length; k < l; k++) {
            if (k == aTables.length - 1) {
                fieldSeperator = '';
            }
            else {
                fieldSeperator = ', ';
            };
            
            // is the current table the first one
            if (bFirst) {
                // yes it is the first
                
                // table id merken
                oJoinTables[aTables[k].get('id')] = true;
                
                bFirst = false;
                
                // check if current table is not the last one in the loop 
                if ((k + 1) < aTables.length) {
                    // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                    for (var h = 0, len = aJoins.length; h < len; h++) {
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                            aJoin.push(aJoins[h]);
                        }
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                            this.changeLeftRightOnJoin(aJoins[h]);
                            aJoin.push(aJoins[h]);
                        }
                    }
                    
                    // check if we have a join
                    if (aJoin.length > 0) {
                        // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
                        
                        leftTable = aTables[k];
                        rightTable = aTables[k + 1];
                        
                        // table id merken
                        oJoinTables[rightTable.get('id')] = true;
                        
                        for (var j = 0, fieldSeperator = '', ln = aJoin.length; j < ln; j++) {
                            if (j == aJoin.length - 1) {
                                fieldSeperator = '';
                            }
                            else {
                                fieldSeperator = '\nAND ';
                            };
                            joinType = aJoin[j].get('joinType');
                            joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeperator;
                        }
                        
                        // reset the join array 
                        aJoin = [];
                        
                        if (joinSQL != '') {
                            joinSQL = joinSQL + ',\n';
                        }
                        
                        if (leftTable.get('tableAlias') != '') {
                            // we have an leftTable alias
                            joinSQL = joinSQL + leftTable.get('tableName') + ' ' + leftTable.get('tableAlias') + ' ' + joinType + ' JOIN ';
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + leftTable.get('tableName') + ' ' + joinType + ' JOIN ';
                        }
                        
                        if (rightTable.get('tableAlias') != '') {
                            // we have an rightTable alias
                            joinSQL = joinSQL + rightTable.get('tableName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + rightTable.get('tableName') + ' ON ' + joinCondition;
                        }
                        
                        // clear joinCondition
                        joinCondition = '';
                        
                    }
                    else {
                        // no join between aTables[i+1] and the one before
                        bFirst = true;
                        oJoinTables = {};
                        // check for tableAlias
                        if (aTables[k].get('tableAlias') != '') {
                            fromSQL = aTables[k].get('tableName') + ' ' + aTables[k].get('tableAlias');
                        }
                        else {
                            fromSQL = aTables[k].get('tableName');
                        }
                        aFromSQL.push(fromSQL);
                    }
                }
                else {
                    // its the last and only one in the loop
                    // check for tableAlias
                    if (aTables[k].get('tableAlias') != '') {
                        fromSQL = aTables[k].get('tableName') + ' ' + aTables[k].get('tableAlias');
                    }
                    else {
                        fromSQL = aTables[k].get('tableName');
                    }
                    aFromSQL.push(fromSQL);
                }
            }
            else {
                // no, it is not the first table
                
                bFirst = true;
                
                // check if current table is not the last one in the loop 
                if ((k + 1) < aTables.length) {
                    // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                    for (var h = 0, len = aJoins.length; h < len; h++) {
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                            aJoin.push(aJoins[h]);
                        }
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                            this.changeLeftRightOnJoin(aJoins[h]);
                            aJoin.push(aJoins[h]);
                        }
                    }
                    
                    // check if we have a join
                    if (aJoin.length > 0) {
                        // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
                        
                        rightTable = aTables[k + 1];
                        
                        // table id merken
                        oJoinTables[rightTable.get('id')] = true;
                        
                        for (var j = 0, fieldSeperator = '', ln = aJoin.length; j < ln; j++) {
                            if (j == aJoin.length - 1) {
                                fieldSeperator = '';
                            }
                            else {
                                fieldSeperator = '\nAND ';
                            };
                            joinType = aJoin[j].get('joinType');
                            joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeperator;
                        }
                        
                        // reset the join array 
                        aJoin = [];
                        
                        bFirst = false;
                        
                        if (rightTable.get('tableAlias') != '') {
                            // we have an rightTable alias
                            joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('tableName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('tableName') + ' ON ' + joinCondition;
                        }
                        
                        // clear joinCondition
                        joinCondition = '';
                    }
                    else {
                        bFirst = true;
                        oJoinTables = {};
                    }
                }
                else {
                    // its the last and only one
                    // check for tableAlias
                    oJoinTables = {};
                }
            }
        }
        
        fromSQL = aFromSQL.join(', ');
        
        if (joinSQL != '' && fromSQL != '') {
            joinSQL = joinSQL + ', ';
        }
        
        fromSQL = '\nFROM ' + joinSQL + fromSQL;
        
        // output fields
        for (var i = 0, l = aOutputFields.length; i < l; i++) {
            // check if it is the last array member
            if (i == aOutputFields.length - 1) {
                fieldSeperator = '';
            }
            else {
                fieldSeperator = ', ';
            };
            // yes, output
            // check alias
            if (aOutputFields[i].get('alias') != '') {
                // yes, we have an field alias
                selectFieldsSQL = selectFieldsSQL + aOutputFields[i].get('expression') + ' AS ' + aOutputFields[i].get('alias') + fieldSeperator;
            }
            else {
                // no field alias
                selectFieldsSQL = selectFieldsSQL + aOutputFields[i].get('expression') + fieldSeperator;
            }
        }
        
        // criteria
        for (var i = 0, l = aCriteriaFields.length; i < l; i++) {
            if (i == 0) {
                criteriaSQL = criteriaSQL + '\nWHERE ';
            }
            else {
                criteriaSQL = criteriaSQL + 'AND ';
            }
            if (i == aCriteriaFields.length - 1) {
                fieldSeperator = '';
            }
            else {
                fieldSeperator = '\n';
            }
            criteriaSQL = criteriaSQL + aCriteriaFields[i].get('expression') + ' ' + aCriteriaFields[i].get('criteria') + fieldSeperator;
        }
        
        // group by
        for (var i = 0, l = aGroupFields.length; i < l; i++) {
            // check if it is the last array member
            if (i == aGroupFields.length - 1) {
                fieldSeperator = '';
            }
            else {
                fieldSeperator = ', ';
            }
            if (i == 0) {
                groupBySQL = '\nGROUP BY ';
            }
            groupBySQL = groupBySQL + aGroupFields[i].get('expression') + fieldSeperator;
        }
        
        // order by
        for (var i = 0, l = aOrderFields.length; i < l; i++) {
            // check if it is the last array member
            if (i == aOrderFields.length - 1) {
                fieldSeperator = '';
            }
            else {
                fieldSeperator = ', ';
            }
        }
        
        return sqlOutput + selectFieldsSQL + fromSQL + criteriaSQL + groupBySQL + orderBySQL;
    },
		*/
	toString: function(){},
    
	getJoinsByTableId: function(tableId){
        var aReturn = [];
        this.joins.each(function(join){
            if (join.get('leftTableId') == tableId || join.get('rightTableId') == tableId) {
                aReturn.push(join);
            }
        });
        return aReturn;
    },
    removeTableById: function(tableID){
        var table;
        table = this.tables.getById(tableID);
        this.tables.remove(table);
    },
    getTableById: function(tableID){
        return this.tables.getById(tableID);
    },
    removeFieldById: function(id){
        var field;
        field = this.fields.getById(id);
        this.fields.remove(field);
    },
    removeFieldsByTableId: function(tableId){
        var aRecords = [];
        this.fields.each(function(model){
            if (model.get('tableId') == tableId) {
                aRecords.push(model);
            }
        });
        this.fields.remove(aRecords);
    },
    addTable: function(table){
        this.tables.add(table);
    },
    addFieldRecord: function(record, bOutput){
        var tableAlias, model, expression;
        // get the tableAlias
        tableAlias = this.getTableById(record.get('tableId')).get('tableAlias');
        // build the expression
        // check if the tableAlias is not an empty string
        if (tableAlias != '') {
            // alias is not an empty string
            expression = tableAlias + '.' + record.get('field');
        }
        else {
            // alias is an empty string
            expression = record.get('tableName') + '.' + record.get('field');
        };
        // get a new field instance
        model = this.getNewField();
        // set the expression
        model.set('expression', expression);
        // set output to false per default
        model.set('output', bOutput);
        // set an id, so it is possible to remove rows if the associated table is removed
        model.set('id', record.get('id'));
        // set the field
        model.set('field', record.get('field'));
        // copy tableId to the new model instance
        model.set('tableId', record.get('tableId'));
        // copy cmp id of origin sqltable to the new model instance
        model.set('extCmpId', record.get('extCmpId'));
        this.addField(model);
    },
    addField: function(field){
        this.fields.add(field);
    },
    getNewField: function(){
        return Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLFieldsModel');
    },
    removeJoinById: function(joinID){
        var join;
        join = this.joins.getById(joinID);
        this.joins.remove(join);
    },
    addJoin: function(join){
        this.joins.add(join);
    },
    arrayRemove: function(array, filterProperty, filterValue){
        var aReturn;
        aReturn = Ext.Array.filter(array, function(item){
            var bRemove = true;
            if (item[filterProperty] == filtervalue) {
                bRemove = false;
            }
            return bRemove;
        });
        return aReturn
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTablePanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.sqltablepanel'],
    id: 'SQLTablePanel',
    items: [{
        xtype: 'draw',
        listeners: {
            afterrender: function(){
                this.initDropTarget();
            }
        },
        initDropTarget: function(){
            // init draw component inside qbwindow as a DropTarget
            this.dropTarget = Ext.create('Ext.dd.DropTarget', this.el, {
                ddGroup: 'sqlDDGroup',
                notifyDrop: function(source, event, data){
                    var sqlTablePanel;
                    // add a sqltable to the sqlTablePanel component
                    sqlTablePanel = Ext.getCmp('SQLTablePanel');
                    sqlTablePanel.add({
                        xtype: 'sqltable',
                        constrain: true,
                        title: data.records[0].get('text')
                    }).show();
                    return true;
                }
            });
        }
    }]
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLOutputPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.sqloutputpanel'],
    id: 'SQLOutputPanel',
    listeners: {
        afterlayout: function(){
            SyntaxHighlighter.highlight();
        }
    },
    initComponent: function(){
        this.callParent(arguments);
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLFieldsGrid', {
	requires: ['Ext.ux.CheckColumn'],
    extend: 'Ext.grid.Panel',
    alias: ['widget.sqlfieldsgrid'],
    id: 'SQLFieldsGrid',
    store: 'SQLFieldsStore',
    columnLines: true,
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    })],
    viewConfig: {
        listeners: {
            render: function(view){
                this.dd = {};
                this.dd.dropZone = new Ext.grid.ViewDropZone({
                    view: view,
                    ddGroup: 'SQLTableGridDDGroup',
                    handleNodeDrop: function(data, record, position){
                        // Was soll nach dem Drop passieren?
                    }
                });
            },
            drop: function(node, data, dropRec, dropPosition){
                // add new rows to the SQLFieldsGrid after a drop
                for (var i = 0, l = data.records.length; i < l; i++) {
                    ux.vqbuilder.sqlSelect.addFieldRecord(data.records[i], false);
                }
            }
        }
    },
    columns: [{
        xtype: 'actioncolumn',
		menuDisabled: true,
        text: 'Action',
        width: 60,
        moveGridRow: function(grid, record, index, direction){
            var store = grid.getStore();
            if (direction < 0) {
                index--;
                if (index < 0) {
                    return;
                }
            }
            else {
                index++;
                if (index >= grid.getStore().getCount()) {
                    return;
                }
            }
            // prepare manual syncing
            store.suspendAutoSync();
            // disable firing store events
            store.suspendEvents();
            // remove record and insert record at new index
            store.remove(record);
            store.insert(index, record);
            // enable firing store events
            store.resumeEvents();
            store.resumeAutoSync();
            // manual sync the store
            store.sync();
        },
        items: [{
            icon: 'resources/images/up_arrow.gif',
            tooltip: 'Move Column Up',
            getClass: function(value, metadata, record){
                var store, index;
                store = record.store;
                index = store.indexOf(record);
                if (index == 0) {
                    return 'x-action-icon-disabled';
                }
                else {
                    return 'x-grid-center-icon';
                }
            },
            handler: function(grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex);
                this.moveGridRow(grid, rec, rowIndex, -1);
            }
        }, {
            icon: 'resources/images/down_arrow.gif',
            getClass: function(value, metadata, record){
                var store, index;
                store = record.store;
                index = store.indexOf(record);
                if ((index + 1) == store.getCount()) {
                    return 'x-action-icon-disabled';
                }
                else {
                    return 'x-grid-center-icon';
                }
            },
            tooltip: 'Move Column Down',
            handler: function(grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex);
                this.moveGridRow(grid, rec, rowIndex, 1);
            }
        }, {
            icon: 'resources/images/remove.gif',
            iconCls: 'x-grid-center-icon',
            tooltip: 'Delete Column',
            handler: function(grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex), store, tableId, tableGrid, selectionModel, bDel = true;
                // rec contains column grid model, the one to remove
                // get tableId of original sqltable
                tableId = rec.get('extCmpId');
                // get the sql tables grid and its selection
                tableGrid = Ext.getCmp(tableId).down('gridpanel');
                selectionModel = tableGrid.getSelectionModel();
                Ext.Array.each(selectionModel.getSelection(), function(selection){
                    // deselect the selection wich corresponds to the column 
                    // we want to remove from the column grid
                    if (rec.get('id') == selection.get('id')) {
                        // deselect current selection
                        // deselection will lead to removal, look for method deselect at the SQLTableGrid
                        selectionModel.deselect(selection);
                        bDel = false;
                    }
                });
                if (bDel) {
                    store = grid.getStore();
                    store.remove(rec);
                }
            }
        }]
    }, {
        xtype: 'checkcolumn',
		sortable: false,
        text: 'Output',
        flex: 0.075,
        menuDisabled: true,
        dataIndex: 'output',
		align: 'center'
    }, {
        xtype: 'gridcolumn',
        text: 'Expression',
		sortable: false,
		menuDisabled: true,
        flex: 0.225,
        dataIndex: 'expression',
        editor: 'textfield'
    }, {
        xtype: 'gridcolumn',
        text: 'Aggregate',
        flex: 0.125,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'aggregate',
        editor: 'textfield'
    }, {
        xtype: 'gridcolumn',
        text: 'Alias',
        flex: 0.125,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'alias',
        editor: 'textfield'
    }, {
        xtype: 'gridcolumn',
        text: 'Sort Type',
        flex: 0.125,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'sorttype'
    }, {
        xtype: 'gridcolumn',
        text: 'Sort Order',
        flex: 0.125,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'sortorder'
    }, {
        xtype: 'checkcolumn',
        text: 'Grouping',
        flex: 0.075,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'grouping',
		align: 'center'
    }, {
        xtype: 'gridcolumn',
        text: 'Criteria',
        flex: 0.125,
		sortable: false,
        menuDisabled: true,
        dataIndex: 'criteria',
        editor: 'textfield'
    }],
    initComponent: function(){
        this.callParent(arguments);
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTableTree', {
    extend: 'Ext.tree.Panel',
    alias: ['widget.sqltabletree'],
    id: 'SQLTableTree',
    listeners: {
        afterrender: function(){
            this.initTreeDragZone();
        },
        itemdblclick: function(view, record, el, index, event){
            var sqlTablePanel;
            // add a sqltable to the sqlTablePanel component
            sqlTablePanel = Ext.getCmp('SQLTablePanel');
            sqlTablePanel.add({
                xtype: 'sqltable',
                constrain: true,
                title: record.get('text')
            }).show();
            
        }
    },
    initTreeDragZone: function(){
        // init tree view as a ViewDragZone
        this.view.dragZone = new Ext.tree.ViewDragZone({
            view: this.view,
            ddGroup: 'sqlDDGroup',
            dragText: '{0} ausgewählte Tabelle{1}',
            repairHighlightColor: 'c3daf9',
            repairHighlight: Ext.enableFx
        });
    },
    initComponent: function(){
    
        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                text: 'Tables',
                expanded: true
            },
            proxy: {
                type: 'ajax',
                url: 'data/database.cfc?method=getTables'
            }
        });
        
        this.callParent(arguments);
    }
});


Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTableGrid', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.sqltablegrid'],
    border: false,
    hideHeaders: true,
    viewConfig: {
        listeners: {
            bodyscroll: function(){
                var scrollOffset, sqlTable;
                // the bodyscroll event of the view was fired
                // get scroll information
                scrollOffset = this.el.getScroll();
                // get the parent sqltable
                sqlTable = this.up('sqltable');
                // change shadowSprites scrollTop property
                sqlTable.shadowSprite.scrollTop = scrollOffset.top;
                // redraw all connections to reflect scroll action
                for (var i = ux.vqbuilder.connections.length; i--;) {
                    sqlTable.connection(ux.vqbuilder.connections[i]);
                }
            },
            render: function(view){
                this.dd = {};
                // init the view as a DragZone
                this.dd.dragZone = new Ext.view.DragZone({
                    view: view,
                    ddGroup: 'SQLTableGridDDGroup',
                    dragText: '{0} selected table column{1}',
                    onInitDrag: function(x, y){
                        var me = this, data = me.dragData, view = data.view, selectionModel = view.getSelectionModel(), record = view.getRecord(data.item), e = data.event;
                        data.records = [record];
                        me.ddel.update(me.getDragText());
                        me.proxy.update(me.ddel.dom);
                        me.onStartDrag(x, y);
                        return true;
                    }
                });
                // init the view as a DropZone
                this.dd.dropZone = new Ext.grid.ViewDropZone({
                    view: view,
                    ddGroup: 'SQLTableGridDDGroup',
                    handleNodeDrop: function(data, record, position){
                        // Was soll nach dem Drop passieren?
                    },
                    onNodeOver: function(node, dragZone, e, data){
                        var me = this, view = me.view, pos = me.getPosition(e, node), overRecord = view.getRecord(node), draggingRecords = data.records;
                        
                        if (!Ext.Array.contains(data.records, me.view.getRecord(node))) {
                            if (!Ext.Array.contains(draggingRecords, overRecord) && data.records[0].get('field') != '*') {
                                me.valid = true;
                                // valid drop target
                                // todo show drop invitation
                            }
                            else {
                                // invalid drop target
                                me.valid = false;
                            }
                        }
                        return me.valid ? me.dropAllowed : me.dropNotAllowed;
                    },
                    onContainerOver: function(dd, e, data){
                        var me = this;
                        // invalid drop target
                        me.valid = false;
                        return me.dropNotAllowed;
                    }
                });
            },
            drop: function(node, data, dropRec, dropPosition){
                var sqlTable1, sqlTable2, showJoinCM, connection, aBBPos, join, joinCondition = '', dropTable, targetTable;
                
                showJoinCM = function(event, el){
                    var cm;
                    // stop the browsers event bubbling
                    event.stopEvent();
                    // create context menu
                    cm = Ext.create('Ext.menu.Menu', {
                        items: [{
                            text: 'Edit Join',
                            icon: 'resources/images/document_edit16x16.gif',
                            handler: Ext.Function.bind(function(){
                            
                            }, this)
                        }, {
                            text: 'Remove Join',
                            icon: 'resources/images/remove.gif',
                            handler: Ext.Function.bind(function(){
                                // remove any connection lines from surface and from array ux.vqbuilder.connections
                                ux.vqbuilder.connections = Ext.Array.filter(ux.vqbuilder.connections, function(connection){
                                    var bRemove = true;
                                    if (this.uuid == connection.uuid) {
                                        this.line.remove();
                                        this.bgLine.remove();
                                        this.miniLine1.remove();
                                        this.miniLine2.remove();
                                        bRemove = false;
                                    }
                                    return bRemove;
                                }, this);
                                ux.vqbuilder.sqlSelect.removeJoinById(this.uuid);
                            }, this)
                        }, {
                            text: 'Close Menu',
                            icon: 'resources/images/cross.gif',
                            handler: Ext.emptyFn
                        }]
                    });
                    // show the contextmenu next to current mouse position
                    cm.showAt(event.getXY());
                };
                
                if (node.boundView) {
                    sqlTable1 = data.view.up('window');
                    sqlTable1.shadowSprite.bConnections = true;
                    
                    sqlTable2 = Ext.getCmp(node.boundView).up('window');
                    sqlTable2.shadowSprite.bConnections = true;
                    
                    dropTable = ux.vqbuilder.sqlSelect.getTableById(sqlTable1.tableId);
                    targetTable = ux.vqbuilder.sqlSelect.getTableById(sqlTable2.tableId);
                    
                    aBBPos = [data.item.viewIndex, node.viewIndex];
                    
                    connection = sqlTable2.connection(sqlTable1.shadowSprite, sqlTable2.shadowSprite, "#000", aBBPos);
                    
                    sqlTable1.connectionUUIDs.push(connection.uuid);
                    sqlTable2.connectionUUIDs.push(connection.uuid);
                    
                    ux.vqbuilder.connections.push(connection);
                    
                    // bgLine is white(invisble) and its stroke-width is 10
                    // so it is easier to capture the dblclick event
                    connection.bgLine.el.on('contextmenu', showJoinCM, connection);
                    
                    // line is black and its stroke-width is 1
                    connection.line.el.on('contextmenu', showJoinCM, connection);
                    
                    // create an instance of the join model
                    join = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLJoin');
                    // set join id
                    join.set('id', connection.uuid);
                    // sqlTable1 is the left table
                    join.set('leftTableId', sqlTable1.tableId);
                    // data.records[0] represents the model of the dragged node
                    join.set('leftTableField', data.records[0].get('field'));
                    // sqlTable1 is the left table
                    join.set('rightTableId', sqlTable2.tableId);
                    // node.viewIndex is the index of the target node
                    join.set('rightTableField', sqlTable2.down('grid').store.getAt(node.viewIndex).get('field'));
                    // set the defaul join type to INNER
                    join.set('joinType', 'INNER');
                    
                    if (dropTable.get('tableAlias') != '') {
                        joinCondition = joinCondition + dropTable.get('tableAlias') + '.' + join.get('leftTableField') + '=';
                    }
                    else {
                        joinCondition = joinCondition + dropTable.get('tableName') + '.' + join.get('leftTableField') + '=';
                    }
                    
                    if (targetTable.get('tableAlias') != '') {
                        joinCondition = joinCondition + targetTable.get('tableAlias') + '.' + join.get('rightTableField');
                    }
                    else {
                        joinCondition = joinCondition + targetTable.get('tableName') + '.' + join.get('rightTableField');
                    }
                    
                    join.set('joinCondition', joinCondition);
                    ux.vqbuilder.sqlSelect.addJoin(join);
                }
                
            }
        }
    },
    initComponent: function(){
    
        this.columns = [{
            xtype: 'gridcolumn',
            width: 16,
            dataIndex: 'key',
            renderer: function(val, meta, model){
                if (val == 'PRI') {
                    meta.style = 'background-image:url(resources/images/key.gif) !important;background-position:2px 3px;background-repeat:no-repeat;';
                }
                return '&nbsp;';
            }
        }, {
            xtype: 'gridcolumn',
            flex: 1,
            dataIndex: 'field',
            renderer: function(val, meta, model){
                if (model.get('key') == 'PRI') {
                    return '<span style="font-weight: bold;">' + val + '</span>&nbsp;&nbsp;<span style="color:#aaa;">' + model.get('type') + '</span>';
                }
                return val + '&nbsp;&nbsp;<span style="color:#999;">' + model.get('type') + '</span>';
                
            }
        }];
        
        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: 'SIMPLE',
            checkOnly: true,
            listeners: {
                select: function(selModel, data){
                    // add new rows to the SQLFieldsGrid after a selection change
                    ux.vqbuilder.sqlSelect.addFieldRecord(data, true);
                },
                deselect: function(selModel, data){
                    var store, model;
                    // remove row from SQLFieldsGrid after deselection
                    ux.vqbuilder.sqlSelect.removeFieldById(data.get('id'));
                }
            }
        });
        
        this.callParent(arguments);
    }
});

Ext.define('Ext.ux.window.visualsqlquerybuilder.SQLTable', {
    extend: 'Ext.window.Window',
    minWidth: 120,
    alias: ['widget.sqltable'],
    cascadeOnFirstShow: 20,
    height: 180,
    width: 140,
    shadowSprite: {},
    layout: {
        type: 'fit'
    },
    closable: true,
    listeners: {
        show: function(){
            this.initSQLTable();
        },
        beforeclose: function(){
            this.closeSQLTable();
        }
    },
    closeSQLTable: function(){
        // remove fields / columns from sqlFieldsStore
        ux.vqbuilder.sqlSelect.removeFieldsByTableId(this.tableId);
        
        // remove table from sqlTables store inside ux.vqbuilder.sqlSelect
        ux.vqbuilder.sqlSelect.removeTableById(this.tableId);
        
        // unregister mousedown event
        this.getHeader().el.un('mousedown', this.regStartDrag, this);
        // unregister mousemove event
        Ext.EventManager.un(document, 'mousemove', this.moveWindow, this);
        // remove sprite from surface
        Ext.getCmp('SQLTablePanel').down('draw').surface.remove(this.shadowSprite, false);
        // remove any connection lines from surface and from array ux.vqbuilder.connections
        ux.vqbuilder.connections = Ext.Array.filter(ux.vqbuilder.connections, function(connection){
            var bRemove = true;
            for (var j = 0, l = this.connectionUUIDs.length; j < l; j++) {
                if (connection.uuid == this.connectionUUIDs[j]) {
                    connection.line.remove();
                    connection.bgLine.remove();
                    connection.miniLine1.remove();
                    connection.miniLine2.remove();
                    bRemove = false;
                }
            }
            return bRemove;
        }, this);
        
    },
    initSQLTable: function(){
        var sqlTablePanel, xyParentPos, xyChildPos, childSize, sprite;
        
        // get the main sqlTablePanel
        sqlTablePanel = Ext.getCmp('SQLTablePanel');
        
        // get the main sqlTablePanel position
        xyParentPos = sqlTablePanel.el.getXY();
        
        // get position of the previously added sqltable
        xyChildPos = this.el.getXY();
        
        // get the size of the previously added sqltable
        childSize = this.el.getSize();
        
        // create a sprite of type rectangle and set its position and size 
        // to position and size of the the sqltable 
        sprite = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLTableSprite', {
            type: 'rect',
            stroke: '#fff',
            height: childSize.height - 4,
            width: childSize.width - 4,
            x: xyChildPos[0] - xyParentPos[0] + 2,
            y: xyChildPos[1] - xyParentPos[1] + 2,
            scrollTop: 0
        });
        
        // add the sprite to the surface of the sqlTablePanel
        this.shadowSprite = sqlTablePanel.down('draw').surface.add(sprite).show(true);
        
        // handle resizeing of sqltabel
        this.resizer.on('resize', function(resizer, width, height, event){
            this.shadowSprite.setAttributes({
                width: width - 6,
                height: height - 6
            }, true);
            // also move the associated connections 
            for (var i = ux.vqbuilder.connections.length; i--;) {
                this.connection(ux.vqbuilder.connections[i]);
            }
        }, this);
        
        // register a function for the mousedown event on the previously added sqltable and bind to this scope
        this.getHeader().el.on('mousedown', this.regStartDrag, this);
        
        this.getHeader().el.on('contextmenu', this.showSQLTableCM, this);
        
        this.getHeader().el.on('dblclick', this.showTableAliasEditForm, this);
        
        this.getHeader().origValue = '';
        
        // register method this.moveWindow for the mousemove event on the document and bind to this scope
        Ext.EventManager.on(document, 'mousemove', this.moveWindow, this);
        
        // register a function for the mouseup event on the document and add the this scope
        Ext.EventManager.on(document, 'mouseup', function(){
            // save the mousedown state
            this.bMouseDown = false;
        }, this);
        
        
    },
    showSQLTableCM: function(event, el){
        var cm;
        // stop the browsers event bubbling
        event.stopEvent();
        // create context menu
        cm = Ext.create('Ext.menu.Menu', {
            items: [{
                text: 'Add/Edit Alias',
                icon: 'resources/images/document_edit16x16.gif',
                handler: Ext.Function.bind(function(){
                    this.showTableAliasEditForm();
                }, this)
            }, {
                text: 'Remove Table',
                icon: 'resources/images/delete.gif',
                handler: Ext.Function.bind(function(){
                    // remove the sqltable
                    this.close();
                }, this)
            }, {
                text: 'Close Menu',
                icon: 'resources/images/cross.gif',
                handler: Ext.emptyFn
            }]
        });
        // show the contextmenu next to current mouse position
        cm.showAt(event.getXY());
    },
    showTableAliasEditForm: function(event, el){
        var table, header, title, titleId;
        table = ux.vqbuilder.sqlSelect.getTableById(this.tableId);
        header = this.getHeader();
        titleId = '#' + header.getId() + '_hd';
        title = this.down(titleId);
        header.remove(title);
        header.insert(0, [{
            xtype: 'textfield',
            flex: 0.95,
            parentCmp: header,
            parentTableModel: table,
            initComponent: function(){
            
                this.setValue(this.parentTableModel.get('tableAlias'));
                
                this.on('render', function(field, event){
                    // set focus to the textfield Benutzerkennung
                    field.focus(true, 200);
                }, this);
                
                this.on('specialkey', function(field, event){
                    if (event.getKey() == event.ENTER) {
                        if (field.getValue() != this.parentCmp.origValue) {
                            this.parentTableModel.set('tableAlias', field.getValue());
                            this.parentCmp.origValue = field.getValue();
                        }
                        this.removeTextField();
                        this.addTitle();
                    }
                }, this);
                
                this.on('blur', function(field, event){
                    if (field.getValue() != this.parentCmp.origValue) {
                        this.parentTableModel.set('tableAlias', field.getValue());
                        this.parentCmp.origValue = field.getValue();
                    }
                    this.removeTextField();
                    this.addTitle();
                }, this);
                
                this.callParent(arguments);
            },
            removeTextField: function(){
                var next;
                next = this.next();
                this.parentCmp.remove(next);
                this.parentCmp.remove(this);
            },
            addTitle: function(){
                var titleText;
                if (this.parentTableModel.get('tableAlias') != '') {
                    titleText = this.parentTableModel.get('tableAlias') + ' ( ' + this.parentTableModel.get('tableName') + ' )';
                }
                else {
                    titleText = this.parentTableModel.get('tableName');
                }
                this.parentCmp.insert(0, {
                    xtype: 'component',
                    ariaRole: 'heading',
                    focusable: false,
                    noWrap: true,
                    flex: 1,
                    id: this.parentCmp.id + '_hd',
                    style: 'text-align:' + this.parentCmp.titleAlign,
                    cls: this.parentCmp.baseCls + '-text-container',
                    renderTpl: this.parentCmp.getTpl('headingTpl'),
                    renderData: {
                        title: titleText,
                        cls: this.parentCmp.baseCls,
                        ui: this.parentCmp.ui
                    },
                    childEls: ['textEl']
                });
            }
        }, {
            xtype: 'component',
            flex: 0.05
        }]);
    },
    regStartDrag: function(){
        // save the mousedown state
        this.bMouseDown = true;
        // start the drag of the sprite
        this.shadowSprite.startDrag(this.getId());
    },
    moveWindow: function(event, domEl, opt){
        var relPosMovement;
        // check mousedown
        if (this.bMouseDown) {
            // get relative x and y values (offset)
            relPosMovement = this.getOffset('point');
            // move the sprite to the position of the window
            this.shadowSprite.onDrag(relPosMovement);
            // check if the sprite has any connections
            if (this.shadowSprite.bConnections) {
                // also move the associated connections 
                for (var i = ux.vqbuilder.connections.length; i--;) {
                    this.connection(ux.vqbuilder.connections[i]);
                }
            }
        }
    },
    getLeftRightCoordinates: function(obj1, obj2, aBBPos){
        var bb1, bb2, p = [], dx, leftBoxConnectionPoint, rightBoxConnectionPoint, dis, columHeight = 21, headerHeight = 46, LeftRightCoordinates = {};
        
        // BoundingBox Koordinaten für beide Sprites abrufen
        
        bb1 = obj1.getBBox();
        // y Wert für connection Points auf der linken und rechten Seite von bb1
        bb1.pY = bb1.y + headerHeight + ((aBBPos[0] - 1) * columHeight) + (columHeight / 2) - obj1.scrollTop;
        
        bb2 = obj2.getBBox();
        // y Wert für connection Points auf der linken und rechten Seite von bb2
        bb2.pY = bb2.y + headerHeight + ((aBBPos[1] - 1) * columHeight) + (columHeight / 2) - obj2.scrollTop;
        
        // code für linke boundingBox
        if (bb1.pY > (bb1.y + 4) && bb1.pY < (bb1.y + bb1.height - 4)) {
            p.push({
                x: bb1.x - 1, // Punkt auf linker Seite auf Höhe der verknüpften Spalte
                y: bb1.pY
            });
            p.push({
                x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite auf Höhe der verknüpften Spalte
                y: bb1.pY
            });
        }
        else {
            if (bb1.pY < (bb1.y + 4)) {
                p.push({
                    x: bb1.x - 1, // Punkt auf linker Seite max. obere Position
                    y: bb1.y + 4
                });
                p.push({
                    x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite max. obere Position
                    y: bb1.y + 4
                });
            }
            else {
                p.push({
                    x: bb1.x - 1, // Punkt auf linker Seite max. untere Position
                    y: bb1.y + bb1.height - 4
                });
                p.push({
                    x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite max. untere Position
                    y: bb1.y + bb1.height - 4
                });
            };
                    };
        
        //  code für rechte boundingBox
        if (bb2.pY > (bb2.y + 4) && bb2.pY < (bb2.y + bb2.height - 4)) {
            p.push({
                x: bb2.x - 1, // Punkt auf linker Seite auf Höhe der verknüpften Spalte
                y: bb2.pY
            });
            p.push({
                x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite auf Höhe der verknüpften Spalte
                y: bb2.pY
            });
        }
        else {
            if (bb2.pY < (bb2.y + 4)) {
                p.push({
                    x: bb2.x - 1, // Punkt auf linker Seite max. obere Position
                    y: bb2.y + 4
                });
                p.push({
                    x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite max. obere Position
                    y: bb2.y + 4
                });
            }
            else {
                p.push({
                    x: bb2.x - 1, // Punkt auf linker Seite max. untere Position
                    y: bb2.y + bb2.height - 4
                });
                
                p.push({
                    x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite max. untere Position
                    y: bb2.y + bb2.height - 4
                });
            }
        };
        
        // Schleife über die Punkte der ersten BoundingBox
        for (var i = 0; i < 2; i++) {
            // Schleife über die Punkte der zweiten BoundingBox
            for (var j = 2; j < 4; j++) {
                // Berechnung der Offsets zwischen den jeweils vier Punkten beider BoundingBoxes
                dx = Math.abs(p[i].x - p[j].x), dy = Math.abs(p[i].y - p[j].y);
                // bb1 links mit bb2 rechts
                if (((i == 0 && j == 3) && dx < Math.abs(p[1].x - p[2].x)) || ((i == 1 && j == 2) && dx < Math.abs(p[0].x - p[3].x))) {
                    leftBoxConnectionPoint = p[i];
                    rightBoxConnectionPoint = p[j];
                }
            }
        };
        
        return {
            leftBoxConnectionPoint: leftBoxConnectionPoint,
            rightBoxConnectionPoint: rightBoxConnectionPoint
        };
        
    },
    connection: function(obj1, obj2, line, aBBPos){
        var LeftRightCoordinates, line1, line2, miniLine1, miniLine2, path, surface, color = typeof line == "string" ? line : "#000";
        
        if (obj1.line && obj1.from && obj1.to && obj1.aBBPos) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
            aBBPos = line.aBBPos;
        }
        
        // set reference to the wright surface
        surface = obj1.surface;
        
        // get coordinates for the left and right box
        LeftRightCoordinates = this.getLeftRightCoordinates(obj1, obj2, aBBPos);
        
        // check if the LeftBox is still on the left side or not
        if (LeftRightCoordinates.leftBoxConnectionPoint.x - LeftRightCoordinates.rightBoxConnectionPoint.x < 0) {
            line1 = 12;
            line2 = 12;
        }
        else {
            line1 = -12;
            line2 = -12;
        }
        // define the path between the left and the right box
        path = ["M", LeftRightCoordinates.leftBoxConnectionPoint.x, LeftRightCoordinates.leftBoxConnectionPoint.y, "H", LeftRightCoordinates.leftBoxConnectionPoint.x + line1, "L", LeftRightCoordinates.rightBoxConnectionPoint.x - line2, LeftRightCoordinates.rightBoxConnectionPoint.y, "H", LeftRightCoordinates.rightBoxConnectionPoint.x].join(",");
        
        miniLine1 = ["M", LeftRightCoordinates.leftBoxConnectionPoint.x, LeftRightCoordinates.leftBoxConnectionPoint.y, "H", LeftRightCoordinates.leftBoxConnectionPoint.x + line1].join(",");
        
        miniLine2 = ["M", LeftRightCoordinates.rightBoxConnectionPoint.x - line2, LeftRightCoordinates.rightBoxConnectionPoint.y, "H", LeftRightCoordinates.rightBoxConnectionPoint.x].join(",");
        
        //check if it is a new connection or not
        if (line && line.line) {
            // old connection, only change path
            line.bgLine &&
            line.bgLine.setAttributes({
                path: path
            }, true);
            line.line.setAttributes({
                path: path
            }, true);
            line.miniLine1.setAttributes({
                path: miniLine1
            }, true);
            line.miniLine2.setAttributes({
                path: miniLine2
            }, true);
        }
        else {
            // new connction, return new connection object
            return {
                line: Ext.create('Ext.draw.Sprite', {
                    type: 'path',
                    path: path,
                    stroke: color,
                    fill: 'none',
                    'stroke-width': 1,
                    surface: surface
                }).show(true),
                miniLine1: Ext.create('Ext.draw.Sprite', {
                    type: 'path',
                    path: miniLine1,
                    stroke: color,
                    fill: 'none',
                    'stroke-width': 2,
                    surface: surface
                }).show(true),
                miniLine2: Ext.create('Ext.draw.Sprite', {
                    type: 'path',
                    path: miniLine2,
                    stroke: color,
                    fill: 'none',
                    'stroke-width': 2,
                    surface: surface
                }).show(true),
                bgLine: Ext.create('Ext.draw.Sprite', {
                    type: 'path',
                    path: path,
                    opacity: 0,
                    stroke: '#fff',
                    fill: 'none',
                    'stroke-width': 10,
                    surface: surface
                }).show(true),
                from: obj1,
                to: obj2,
                aBBPos: aBBPos,
                uuid: this.createUUID()
            };
        }
    },
    initComponent: function(){
        var store, tableModel;
        
        this.connectionUUIDs = [];
        this.bMouseDown = false;
        
        // asign a uuid to the window, this builds relationship with sqlTable
        this.tableId = this.createUUID();
        
        
        store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'id',
                type: 'string'
            }, {
                name: 'tableName',
                type: 'string'
            }, {
                name: 'tableId',
                type: 'string',
                defaultValue: this.tableId
            }, {
                name: 'field',
                type: 'string'
            }, {
                name: 'extCmpId',
                type: 'string',
                defaultValue: this.id
            }, {
                name: 'type',
                type: 'string'
            }, {
                name: 'null',
                type: 'string'
            }, {
                name: 'key',
                type: 'string'
            }, {
                name: 'default',
                type: 'string'
            }, {
                name: 'extra',
                type: 'string'
            }],
            proxy: {
                type: 'ajax',
                url: 'data/database.cfc?method=getTableInfo',
                extraParams: {
                    tablename: this.title
                },
                reader: {
                    type: 'json'
                }
            }
        });
        
        // add sql table to ux.vqbuilder.sqlSelect tables store
        // also asign same id as stores uuid
        tableModel = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLTableModel', {
            id: this.tableId,
            tableName: this.title,
            tableAlias: ''
        });
        ux.vqbuilder.sqlSelect.addTable(tableModel);
        
        this.items = [{
            xtype: 'sqltablegrid',
            store: store
        }];
        
        this.callParent(arguments);
    },
    getOffset: function(constrain){
        var xy = this.dd.getXY(constrain), s = this.dd.startXY;
        // return the the difference between the current and the drag&drop start position
        return [xy[0] - s[0], xy[1] - s[1]];
    },
    createUUID: function(){
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        
        var uuid = s.join("");
        return uuid;
    },
    beforeShow: function(){
        var aWin, prev, o;
        // cascading window positions
        if (this.cascadeOnFirstShow) {
            o = (typeof this.cascadeOnFirstShow == 'number') ? this.cascadeOnFirstShow : 20;
            // get all instances from xtype sqltable
            aWin = Ext.ComponentQuery.query('sqltable');
            // start position if there is only one table
            if (aWin.length == 1) {
                this.x = o;
                this.y = o;
            }
            else {
                // loop through all instances from xtype sqltable
                for (var i = 0, l = aWin.length; i < l; i++) {
                    if (aWin[i] == this) {
                        if (prev) {
                            this.x = prev.x + o;
                            this.y = prev.y + o;
                        }
                    }
                    if (aWin[i].isVisible()) {
                        prev = aWin[i];
                    }
                }
            }
            this.setPosition(this.x, this.y);
        }
    }
});

Ext.define('Ext.ux.window.VisualSQLQueryBuilder', {
    extend: 'Ext.window.Window',
    alias: ['widget.qbwindow'],
    height: 620,
    width: 1000,
    layout: {
        type: 'border'
    },
    title: 'Visual SQL Query Builder',
    items: [{
        xtype: 'sqloutputpanel',
        border: false,
        region: 'center',
        autoScroll: true,
        html: '<pre class="brush: sql">SQL Output Window</pre>',
        margin: 5,
        height: 150,
        split: true
    }, {
        xtype: 'panel',
        border: false,
        height: 400,
        margin: 5,
        layout: {
            type: 'border'
        },
        region: 'north',
        split: true,
        items: [{
            xtype: 'sqltablepanel',
            border: false,
            region: 'center',
            height: 280,
            split: true,
            layout: 'fit'
        }, {
            xtype: 'sqlfieldsgrid',
            border: false,
            region: 'south',
            height: 120,
            split: true
        }, {
            xtype: 'sqltabletree',
            border: false,
            region: 'west',
            width: 200,
            height: 400,
            split: true
        }]
    }],
    initComponent: function(){
    
        // create user extension namespace ux.vqbuilder
        Ext.namespace('ux.vqbuilder');
        
        // disable gutter (linenumbers) and toolbar for SyntaxHighlighter
        SyntaxHighlighter.defaults['gutter'] = false;
        SyntaxHighlighter.defaults['toolbar'] = false;
        
        ux.vqbuilder.connections = [];
        
        ux.vqbuilder.sqlSelect = Ext.create('Ext.ux.window.visualsqlquerybuilder.SQLSelect');
        
        // add toolbar to the dockedItems
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbfill'
            }, {
                text: "Save",
                icon: "resources/images/icon-save.gif"
            }, {
                text: "Run",
                icon: "resources/images/run.png"
            }]
        }];
        
        this.callParent(arguments);
    }
});
