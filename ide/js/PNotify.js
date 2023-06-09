"use strict";
var _extends = Object.assign || function(t) { for (var e = 1; e < arguments.length; e++) { var i = arguments[e]; for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]) } return t },
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) { return typeof t } : function(t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t },
    PNotify = function() { var t = void 0,
            e = void 0,
            i = function() { t.defaultStack.context = document.body, window.addEventListener("resize", function() { e && clearTimeout(e), e = setTimeout(function() { t.positionAll() }, 10) }) },
            n = function(t) { t.overlay.parentNode && t.overlay.parentNode.removeChild(t.overlay) },
            o = function(t, e) { return "object" !== (void 0 === t ? "undefined" : _typeof(t)) && (t = { text: t }), e && (t.type = e), { target: document.body, data: t } }; var s = { runModules: function(e) { if ("init" === e) { for (var i in t.modules)
                        if (t.modules.hasOwnProperty(i) && "function" == typeof t.modules[i].init) { var n = t.modules[i].init(this);
                            this.initModule(n) } } else { var o = this.get("_modules"); for (var s in o)
                        if (o.hasOwnProperty(s)) { var r = _extends({ _notice: this, _options: this.get() }, this.get("modules")[s]);
                            o[s].set(r), "function" == typeof o[s][e] && o[s][e]() } } }, initModule: function(t) { var e = this.get("modules");
                e.hasOwnProperty(t.constructor.key) || (e[t.constructor.key] = {}); var i = _extends({ _notice: this, _options: this.get() }, e[t.constructor.key]);
                t.initModule(i), this.get("_modules")[t.constructor.key] = t }, update: function(t) { var e = this.get("hide"),
                    i = this.get("icon");
                this.set(t), this.runModules("update"), this.get("hide") ? e || this.queueClose() : this.cancelClose(), this.queuePosition(); var n = this.get("icon"); return n !== i && (!0 === n && "fontawesome5" === this.get("icons") || "string" == typeof n && n.match(/(^| )fa[srlb]($| )/)) && (this.set({ icon: !1 }), this.set({ icon: n })), this }, open: function() { var e = this; if ("opening" !== this.get("_state")) { if ("open" !== this.get("_state")) { this.set({ _state: "opening", _animatingClass: "ui-pnotify-initial-hidden" }), this.runModules("beforeOpen"); var i = this.get("stack"); if (!this.refs.elem.parentNode || i && i.context && i.context !== this.refs.elem.parentNode)
                            if (i && i.context) i.context.appendChild(this.refs.elem);
                            else { if (!document.body) throw new Error("No context to open this notice in.");
                                document.body.appendChild(this.refs.elem) }
                        return setTimeout(function() { i && (i.animation = !1, t.positionAll(), i.animation = !0), e.animateIn(function() { e.get("hide") && e.queueClose(), e.set({ _state: "open" }), e.runModules("afterOpen") }) }, 0), this }
                    this.get("hide") && this.queueClose() } }, remove: function(t) { return this.close(t) }, close: function(e) { var i = this; if ("closing" !== this.get("_state") && "closed" !== this.get("_state")) return this.set({ _state: "closing", _timerHide: !!e }), this.runModules("beforeClose"), this.get("_timer") && clearTimeout && (clearTimeout(this.get("_timer")), this.set({ _timer: null })), this.animateOut(function() { if (i.set({ _state: "closed" }), i.runModules("afterClose"), i.queuePosition(), i.get("remove") && i.refs.elem.parentNode.removeChild(i.refs.elem), i.runModules("beforeDestroy"), i.get("destroy") && null !== t.notices) { var e = t.notices.indexOf(i); - 1 !== e && t.notices.splice(e, 1) }
                    i.runModules("afterDestroy") }), this }, animateIn: function(t) { var e = this;
                this.set({ _animating: "in" }); var i = function i() { if (e.refs.elem.removeEventListener("transitionend", i), e.get("_animTimer") && clearTimeout(e.get("_animTimer")), "in" === e.get("_animating")) { var n = e.get("_moduleIsNoticeOpen"); if (!n) { var o = e.refs.elem.getBoundingClientRect(); for (var s in o)
                                if (o[s] > 0) { n = !0; break } }
                        n ? (t && t.call(), e.set({ _animating: !1 })) : e.set({ _animTimer: setTimeout(i, 40) }) } }; "fade" === this.get("animation") ? (this.refs.elem.addEventListener("transitionend", i), this.set({ _animatingClass: "ui-pnotify-in" }), this.refs.elem.style.opacity, this.set({ _animatingClass: "ui-pnotify-in ui-pnotify-fade-in" }), this.set({ _animTimer: setTimeout(i, 650) })) : (this.set({ _animatingClass: "ui-pnotify-in" }), i()) }, animateOut: function(e) { var i = this;
                this.set({ _animating: "out" }); var o = function o() { if (i.refs.elem.removeEventListener("transitionend", o), i.get("_animTimer") && clearTimeout(i.get("_animTimer")), "out" === i.get("_animating")) { var s = i.get("_moduleIsNoticeOpen"); if (!s) { var r = i.refs.elem.getBoundingClientRect(); for (var a in r)
                                if (r[a] > 0) { s = !0; break } } if (i.refs.elem.style.opacity && "0" != i.refs.elem.style.opacity && s) i.set({ _animTimer: setTimeout(o, 40) });
                        else { i.set({ _animatingClass: "" }); var c = i.get("stack"); if (c && c.overlay) { for (var l = !1, f = 0; f < t.notices.length; f++) { var u = t.notices[f]; if (u != i && u.get("stack") === c && "closed" !== u.get("_state")) { l = !0; break } }
                                l || n(c) }
                            e && e.call(), i.set({ _animating: !1 }) } } }; "fade" === this.get("animation") ? (this.refs.elem.addEventListener("transitionend", o), this.set({ _animatingClass: "ui-pnotify-in" }), this.set({ _animTimer: setTimeout(o, 650) })) : (this.set({ _animatingClass: "" }), o()) }, position: function() { var e = this.get("stack"),
                    i = this.refs.elem; if (e) { if (e.context || (e.context = document.body), "number" != typeof e.nextpos1 && (e.nextpos1 = e.firstpos1), "number" != typeof e.nextpos2 && (e.nextpos2 = e.firstpos2), "number" != typeof e.addpos2 && (e.addpos2 = 0), !i.classList.contains("ui-pnotify-in") && !i.classList.contains("ui-pnotify-initial-hidden")) return this; var n, o, s;
                    e.modal && (e.overlay || (o = e, (s = document.createElement("div")).classList.add("ui-pnotify-modal-overlay"), o.context !== document.body && (s.style.height = o.context.scrollHeight + "px", s.style.width = o.context.scrollWidth + "px"), s.addEventListener("click", function() { o.overlayClose && t.closeStack(o) }), o.overlay = s), (n = e).overlay.parentNode !== n.context && (n.overlay = n.context.insertBefore(n.overlay, n.context.firstChild)));
                    i.getBoundingClientRect();
                    e.animation && this.set({ _moveClass: "ui-pnotify-move" }); var r = e.context === document.body ? window.innerHeight : e.context.scrollHeight,
                        a = e.context === document.body ? window.innerWidth : e.context.scrollWidth,
                        c = void 0; if (e.dir1) { c = { down: "top", up: "bottom", left: "right", right: "left" }[e.dir1]; var l = void 0; switch (e.dir1) {
                            case "down":
                                l = i.offsetTop; break;
                            case "up":
                                l = r - i.scrollHeight - i.offsetTop; break;
                            case "left":
                                l = a - i.scrollWidth - i.offsetLeft; break;
                            case "right":
                                l = i.offsetLeft }
                        void 0 === e.firstpos1 && (e.firstpos1 = l, e.nextpos1 = e.firstpos1) } if (e.dir1 && e.dir2) { var f = { down: "top", up: "bottom", left: "right", right: "left" }[e.dir2],
                            u = void 0; switch (e.dir2) {
                            case "down":
                                u = i.offsetTop; break;
                            case "up":
                                u = r - i.scrollHeight - i.offsetTop; break;
                            case "left":
                                u = a - i.scrollWidth - i.offsetLeft; break;
                            case "right":
                                u = i.offsetLeft }
                        void 0 === e.firstpos2 && (e.firstpos2 = u, e.nextpos2 = e.firstpos2); var d = e.nextpos1 + i.offsetHeight + (void 0 === e.spacing1 ? 25 : e.spacing1),
                            p = e.nextpos1 + i.offsetWidth + (void 0 === e.spacing1 ? 25 : e.spacing1); switch ((("down" === e.dir1 || "up" === e.dir1) && d > r || ("left" === e.dir1 || "right" === e.dir1) && p > a) && (e.nextpos1 = e.firstpos1, e.nextpos2 += e.addpos2 + (void 0 === e.spacing2 ? 25 : e.spacing2), e.addpos2 = 0), "number" == typeof e.nextpos2 && (i.style[f] = e.nextpos2 + "px", e.animation || i.style[f]), e.dir2) {
                            case "down":
                            case "up":
                                i.offsetHeight + (parseFloat(i.style.marginTop, 10) || 0) + (parseFloat(i.style.marginBottom, 10) || 0) > e.addpos2 && (e.addpos2 = i.offsetHeight); break;
                            case "left":
                            case "right":
                                i.offsetWidth + (parseFloat(i.style.marginLeft, 10) || 0) + (parseFloat(i.style.marginRight, 10) || 0) > e.addpos2 && (e.addpos2 = i.offsetWidth) } } else if (e.dir1) { var h = void 0,
                            m = void 0; switch (e.dir1) {
                            case "down":
                            case "up":
                                m = ["left", "right"], h = e.context.scrollWidth / 2 - i.offsetWidth / 2; break;
                            case "left":
                            case "right":
                                m = ["top", "bottom"], h = r / 2 - i.offsetHeight / 2 }
                        i.style[m[0]] = h + "px", i.style[m[1]] = "auto", e.animation || i.style[m[0]] } if (e.dir1) switch ("number" == typeof e.nextpos1 && (i.style[c] = e.nextpos1 + "px", e.animation || i.style[c]), e.dir1) {
                        case "down":
                        case "up":
                            e.nextpos1 += i.offsetHeight + (void 0 === e.spacing1 ? 25 : e.spacing1); break;
                        case "left":
                        case "right":
                            e.nextpos1 += i.offsetWidth + (void 0 === e.spacing1 ? 25 : e.spacing1) } else { var y = a / 2 - i.offsetWidth / 2,
                            g = r / 2 - i.offsetHeight / 2;
                        i.style.left = y + "px", i.style.top = g + "px", e.animation || i.style.left }
                    return this } }, queuePosition: function(i) { return e && clearTimeout(e), i || (i = 10), e = setTimeout(function() { t.positionAll() }, i), this }, cancelRemove: function() { return this.cancelClose() }, cancelClose: function() { return this.get("_timer") && clearTimeout(this.get("_timer")), this.get("_animTimer") && clearTimeout(this.get("_animTimer")), "closing" === this.get("_state") && this.set({ _state: "open", _animating: !1, _animatingClass: "fade" === this.get("animation") ? "ui-pnotify-in ui-pnotify-fade-in" : "ui-pnotify-in" }), this }, queueRemove: function() { return this.queueClose() }, queueClose: function() { var t = this; return this.cancelClose(), this.set({ _timer: setTimeout(function() { return t.close(!0) }, isNaN(this.get("delay")) ? 0 : this.get("delay")) }), this }, addModuleClass: function() { for (var t = this.get("_moduleClasses"), e = arguments.length, i = Array(e), n = 0; n < e; n++) i[n] = arguments[n]; for (var o = 0; o < i.length; o++) { var s = i[o]; - 1 === t.indexOf(s) && t.push(s) }
                this.set({ _moduleClasses: t }) }, removeModuleClass: function() { for (var t = this.get("_moduleClasses"), e = arguments.length, i = Array(e), n = 0; n < e; n++) i[n] = arguments[n]; for (var o = 0; o < i.length; o++) { var s = i[o],
                        r = t.indexOf(s); - 1 !== r && t.splice(r, 1) }
                this.set({ _moduleClasses: t }) }, hasModuleClass: function() { for (var t = this.get("_moduleClasses"), e = arguments.length, i = Array(e), n = 0; n < e; n++) i[n] = arguments[n]; for (var o = 0; o < i.length; o++) { var s = i[o]; if (-1 === t.indexOf(s)) return !1 } return !0 } };

        function r(t, e, i, n, o) { var s; if (i) var r = new i({ root: o.root }); return r && r.on("init", function(t) { o.initModule(t.module) }), { c: function() { s = N(), r && r._fragment.c() }, m: function(t, e) { C(s, t, e), r && r._mount(t, e) }, u: function() { w(s), r && r._unmount() }, d: function() { r && r.destroy(!1) } } }

        function a(t, e) { var i, n, o, s; return { c: function() { i = y("div"), n = y("span"), this.h() }, h: function() { n.className = o = !0 === t.icon ? t._icons[t.type] ? t._icons[t.type] : "" : t.icon, i.className = s = "ui-pnotify-icon " + (t._styles.icon ? t._styles.icon : "") }, m: function(t, e) { C(i, t, e), g(n, i) }, p: function(t, e) {
                    (t.icon || t._icons || t.type) && o !== (o = !0 === e.icon ? e._icons[e.type] ? e._icons[e.type] : "" : e.icon) && (n.className = o), t._styles && s !== (s = "ui-pnotify-icon " + (e._styles.icon ? e._styles.icon : "")) && (i.className = s) }, u: function() { w(i) }, d: H } }

        function c(t, e) { var i, n; return { c: function() { i = y("noscript"), n = y("noscript") }, m: function(e, o) { C(i, e, o), i.insertAdjacentHTML("afterend", t.title), C(n, e, o) }, p: function(t, e) { t.title && (A(i, n), i.insertAdjacentHTML("afterend", e.title)) }, u: function() { A(i, n), w(i), w(n) }, d: H } }

        function l(t, e) { var i; return { c: function() { i = _(t.title) }, m: function(t, e) { C(i, t, e) }, p: function(t, e) { t.title && (i.data = e.title) }, u: function() { w(i) }, d: H } }

        function f(t, e) { var i, n; return { c: function() { i = y("noscript"), n = y("noscript") }, m: function(e, o) { C(i, e, o), i.insertAdjacentHTML("afterend", t.text), C(n, e, o) }, p: function(t, e) { t.text && (A(i, n), i.insertAdjacentHTML("afterend", e.text)) }, u: function() { A(i, n), w(i), w(n) }, d: H } }

        function u(t, e) { var i; return { c: function() { i = _(t.text) }, m: function(t, e) { C(i, t, e) }, p: function(t, e) { t.text && (i.data = e.text) }, u: function() { w(i) }, d: H } }

        function d(t, e, i, n, o) { var s; if (i) var r = new i({ root: o.root }); return r && r.on("init", function(t) { o.initModule(t.module) }), { c: function() { s = N(), r && r._fragment.c() }, m: function(t, e) { C(s, t, e), r && r._mount(t, e) }, u: function() { w(s), r && r._unmount() }, d: function() { r && r.destroy(!1) } } }

        function p(t) { return t.titleTrusted ? c : l }

        function h(t) { return t.textTrusted ? f : u }

        function m(e) { var i, n, o, s;
            n = e, (i = this)._observers = { pre: S(), post: S() }, i._handlers = S(), i._bind = n._bind, i.options = n, i.root = n.root || i, i.store = i.root.store || n.store, this.refs = {}, this._state = L(((o = _extends({ _state: "initializing", _timer: null, _animTimer: null, _animating: !1, _animatingClass: "", _moveClass: "", _timerHide: !1, _moduleClasses: [], _moduleIsNoticeOpen: !1, _modules: {}, _modulesPrependContainer: t.modulesPrependContainer, _modulesAppendContainer: t.modulesAppendContainer }, t.defaults)).modules = _extends({}, t.defaults.modules), o), e.data), this._recompute({ styling: 1, icons: 1 }, this._state), document.getElementById("svelte-3059224252-style") || ((s = y("style")).id = "svelte-3059224252-style", s.textContent = 'body > .ui-pnotify{position:fixed;z-index:100040}body > .ui-pnotify.ui-pnotify-modal{z-index:100042}.ui-pnotify{position:absolute;height:auto;z-index:1;display:none}.ui-pnotify.ui-pnotify-modal{z-index:3}.ui-pnotify.ui-pnotify-in{display:block}.ui-pnotify.ui-pnotify-initial-hidden{display:block;visibility:hidden}.ui-pnotify.ui-pnotify-move{transition:left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-slow{transition:opacity .4s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-slow.ui-pnotify.ui-pnotify-move{transition:opacity .4s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-normal{transition:opacity .25s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-normal.ui-pnotify.ui-pnotify-move{transition:opacity .25s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-fast{transition:opacity .1s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-fast.ui-pnotify.ui-pnotify-move{transition:opacity .1s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-in{opacity:1}.ui-pnotify .ui-pnotify-shadow{-webkit-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);-moz-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1)}.ui-pnotify-container{background-position:0 0;padding:.8em;height:100%;margin:0}.ui-pnotify-container:after{content:" ";visibility:hidden;display:block;height:0;clear:both}.ui-pnotify-container.ui-pnotify-sharp{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0}.ui-pnotify-title{display:block;white-space:pre-line;margin-bottom:.4em;margin-top:0}.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-title,.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-text{margin-left:24px}[dir=rtl] .ui-pnotify.ui-pnotify-with-icon .ui-pnotify-title,[dir=rtl] .ui-pnotify.ui-pnotify-with-icon .ui-pnotify-text{margin-right:24px;margin-left:0}.ui-pnotify-title-bs4{font-size:1.2rem}.ui-pnotify-text{display:block;white-space:pre-line}.ui-pnotify-icon,.ui-pnotify-icon span{display:block;float:left}[dir=rtl] .ui-pnotify-icon,[dir=rtl] .ui-pnotify-icon span{float:right}.ui-pnotify-icon-bs3 > span{position:relative;top:2px}.ui-pnotify-icon-bs4 > span{position:relative;top:4px}.ui-pnotify-modal-overlay{background-color:rgba(0, 0, 0, .4);top:0;left:0;position:absolute;height:100%;width:100%;z-index:2}body > .ui-pnotify-modal-overlay{position:fixed;z-index:100041}', g(s, document.head)); var c = function() { var e = this;
                this.on("mouseenter", function(t) { if (e.get("mouseReset") && "out" === e.get("_animating")) { if (!e.get("_timerHide")) return;
                        e.cancelClose() }
                    e.get("hide") && e.get("mouseReset") && e.cancelClose() }), this.on("mouseleave", function(i) { e.get("hide") && e.get("mouseReset") && "out" !== e.get("_animating") && e.queueClose(), t.positionAll() }); var i = this.get("stack");
                i && "top" === i.push ? t.notices.splice(0, 0, this) : t.notices.push(this), this.runModules("init"), this.set({ _state: "closed" }), this.get("autoDisplay") && this.open() }.bind(this);
            e.root || (this._oncreate = [], this._beforecreate = [], this._aftercreate = []), this._fragment = function(t, e) { for (var i, n, o, s, c, l, f, u, m, N, H, A, L, M = t._modulesPrependContainer, O = [], S = 0; S < M.length; S += 1) O[S] = r(0, 0, M[S], 0, e); var P = !1 !== t.icon && a(t),
                    E = p(t),
                    j = E(t, e),
                    W = h(t),
                    z = W(t, e),
                    R = t._modulesAppendContainer,
                    q = []; for (S = 0; S < R.length; S += 1) q[S] = d(0, 0, R[S], 0, e);

                function B(t) { e.fire("mouseover", t) }

                function I(t) { e.fire("mouseout", t) }

                function D(t) { e.fire("mouseenter", t) }

                function F(t) { e.fire("mouseleave", t) }

                function V(t) { e.fire("mousemove", t) }

                function $(t) { e.fire("mousedown", t) }

                function G(t) { e.fire("mouseup", t) }

                function J(t) { e.fire("click", t) }

                function K(t) { e.fire("dblclick", t) }

                function Q(t) { e.fire("focus", t) }

                function U(t) { e.fire("blur", t) }

                function X(t) { e.fire("touchstart", t) }

                function Y(t) { e.fire("touchmove", t) }

                function Z(t) { e.fire("touchend", t) }

                function tt(t) { e.fire("touchcancel", t) } return { c: function() { i = y("div"), n = y("div"); for (var t = 0; t < O.length; t += 1) O[t].c(); for (o = _("\n    "), P && P.c(), s = _("\n    "), c = y("h4"), j.c(), f = _("\n    "), u = y("div"), z.c(), N = _("\n    "), t = 0; t < q.length; t += 1) q[t].c();
                        this.h() }, h: function() { c.className = l = "ui-pnotify-title " + (t._styles.title ? t._styles.title : ""), v(c, "display", !1 === t.title ? "none" : "block"), u.className = m = "ui-pnotify-text " + (t._styles.text ? t._styles.text : ""), v(u, "display", !1 === t.text ? "none" : "block"), b(u, "role", "alert"), n.className = H = "\n        ui-pnotify-container\n        " + (t._styles.container ? t._styles.container : "") + "\n        " + (t._styles[t.type] ? t._styles[t.type] : "") + "\n        " + t.cornerClass + "\n        " + (t.shadow ? "ui-pnotify-shadow" : "") + "\n      ", n.style.cssText = A = "\n        " + ("string" == typeof t.width ? "width: " + t.width + ";" : "") + "\n        " + ("string" == typeof t.minHeight ? "min-height: " + t.minHeight + ";" : "") + "\n      ", b(n, "role", "alert"), i.className = L = "\n      ui-pnotify\n      " + (!1 !== t.icon ? "ui-pnotify-with-icon" : "") + "\n      " + (t._styles.element ? t._styles.element : "") + "\n      " + t.addClass + "\n      " + t._animatingClass + "\n      " + t._moveClass + "\n      " + ("fade" === t.animation ? "ui-pnotify-fade-" + t.animateSpeed : "") + "\n      " + (t.stack && t.stack.modal ? "ui-pnotify-modal" : "") + "\n      " + t._moduleClasses.join(" ") + "\n    ", b(i, "aria-live", "assertive"), b(i, "role", "alertdialog"), b(i, "ui-pnotify", !0), x(i, "mouseover", B), x(i, "mouseout", I), x(i, "mouseenter", D), x(i, "mouseleave", F), x(i, "mousemove", V), x(i, "mousedown", $), x(i, "mouseup", G), x(i, "click", J), x(i, "dblclick", K), x(i, "focus", Q), x(i, "blur", U), x(i, "touchstart", X), x(i, "touchmove", Y), x(i, "touchend", Z), x(i, "touchcancel", tt) }, m: function(t, r) { C(i, t, r), g(n, i); for (var a = 0; a < O.length; a += 1) O[a].m(n, null); for (g(o, n), P && P.m(n, null), g(s, n), g(c, n), j.m(c, null), e.refs.titleContainer = c, g(f, n), g(u, n), z.m(u, null), e.refs.textContainer = u, g(N, n), a = 0; a < q.length; a += 1) q[a].m(n, null);
                        e.refs.container = n, e.refs.elem = i }, p: function(t, f) { var y = f._modulesPrependContainer; if (t._modulesPrependContainer) { for (var g = O.length; g < y.length; g += 1) O[g] = r(0, 0, y[g], 0, e), O[g].c(), O[g].m(n, o); for (; g < O.length; g += 1) O[g].u(), O[g].d();
                            O.length = y.length }!1 !== f.icon ? P ? P.p(t, f) : ((P = a(f)).c(), P.m(n, s)) : P && (P.u(), P.d(), P = null), E === (E = p(f)) && j ? j.p(t, f) : (j.u(), j.d(), (j = E(f, e)).c(), j.m(c, null)), t._styles && l !== (l = "ui-pnotify-title " + (f._styles.title ? f._styles.title : "")) && (c.className = l), t.title && v(c, "display", !1 === f.title ? "none" : "block"), W === (W = h(f)) && z ? z.p(t, f) : (z.u(), z.d(), (z = W(f, e)).c(), z.m(u, null)), t._styles && m !== (m = "ui-pnotify-text " + (f._styles.text ? f._styles.text : "")) && (u.className = m), t.text && v(u, "display", !1 === f.text ? "none" : "block"); var _ = f._modulesAppendContainer; if (t._modulesAppendContainer) { for (g = q.length; g < _.length; g += 1) q[g] = d(0, 0, _[g], 0, e), q[g].c(), q[g].m(n, null); for (; g < q.length; g += 1) q[g].u(), q[g].d();
                            q.length = _.length }(t._styles || t.type || t.cornerClass || t.shadow) && H !== (H = "\n        ui-pnotify-container\n        " + (f._styles.container ? f._styles.container : "") + "\n        " + (f._styles[f.type] ? f._styles[f.type] : "") + "\n        " + f.cornerClass + "\n        " + (f.shadow ? "ui-pnotify-shadow" : "") + "\n      ") && (n.className = H), (t.width || t.minHeight) && A !== (A = "\n        " + ("string" == typeof f.width ? "width: " + f.width + ";" : "") + "\n        " + ("string" == typeof f.minHeight ? "min-height: " + f.minHeight + ";" : "") + "\n      ") && (n.style.cssText = A), (t.icon || t._styles || t.addClass || t._animatingClass || t._moveClass || t.animation || t.animateSpeed || t.stack || t._moduleClasses) && L !== (L = "\n      ui-pnotify\n      " + (!1 !== f.icon ? "ui-pnotify-with-icon" : "") + "\n      " + (f._styles.element ? f._styles.element : "") + "\n      " + f.addClass + "\n      " + f._animatingClass + "\n      " + f._moveClass + "\n      " + ("fade" === f.animation ? "ui-pnotify-fade-" + f.animateSpeed : "") + "\n      " + (f.stack && f.stack.modal ? "ui-pnotify-modal" : "") + "\n      " + f._moduleClasses.join(" ") + "\n    ") && (i.className = L) }, u: function() { w(i); for (var t = 0; t < O.length; t += 1) O[t].u(); for (P && P.u(), j.u(), z.u(), t = 0; t < q.length; t += 1) q[t].u() }, d: function() { k(O), P && P.d(), j.d(), e.refs.titleContainer === c && (e.refs.titleContainer = null), z.d(), e.refs.textContainer === u && (e.refs.textContainer = null), k(q), e.refs.container === n && (e.refs.container = null), T(i, "mouseover", B), T(i, "mouseout", I), T(i, "mouseenter", D), T(i, "mouseleave", F), T(i, "mousemove", V), T(i, "mousedown", $), T(i, "mouseup", G), T(i, "click", J), T(i, "dblclick", K), T(i, "focus", Q), T(i, "blur", U), T(i, "touchstart", X), T(i, "touchmove", Y), T(i, "touchend", Z), T(i, "touchcancel", tt), e.refs.elem === i && (e.refs.elem = null) } } }(this._state, this), this.root._oncreate.push(c), e.target && (this._fragment.c(), this._fragment.m(e.target, e.anchor || null), this._lock = !0, M(this._beforecreate), M(this._oncreate), M(this._aftercreate), this._lock = !1) }

        function y(t) { return document.createElement(t) }

        function g(t, e) { e.appendChild(t) }

        function _(t) { return document.createTextNode(t) }

        function v(t, e, i) { t.style.setProperty(e, i) }

        function b(t, e, i) { t.setAttribute(e, i) }

        function x(t, e, i) { t.addEventListener(e, i, !1) }

        function C(t, e, i) { e.insertBefore(t, i) }

        function w(t) { t.parentNode.removeChild(t) }

        function k(t) { for (var e = 0; e < t.length; e += 1) t[e] && t[e].d() }

        function T(t, e, i) { t.removeEventListener(e, i, !1) }

        function N() { return document.createComment("") }

        function H() {}

        function A(t, e) { for (; t.nextSibling && t.nextSibling !== e;) t.parentNode.removeChild(t.nextSibling) }

        function L(t) { for (var e, i, n = 1, o = arguments.length; n < o; n++)
                for (e in i = arguments[n]) t[e] = i[e]; return t }

        function M(t) { for (; t && t.length;) t.shift()() }

        function O(t) { this.destroy = H, this.fire("destroy"), this.set = this.get = H, !1 !== t && this._fragment.u(), this._fragment.d(), this._fragment = this._state = null }

        function S() { return Object.create(null) }

        function P(t, e, i, n, o) { for (var s in e)
                if (i[s]) { var r = n[s],
                        a = o[s],
                        c = e[s]; if (c)
                        for (var l = 0; l < c.length; l += 1) { var f = c[l];
                            f.__calling || (f.__calling = !0, f.call(t, r, a), f.__calling = !1) } } } return L(m.prototype, s, { destroy: O, get: function(t) { return t ? this._state[t] : this._state }, fire: function(t, e) { var i = t in this._handlers && this._handlers[t].slice(); if (!i) return; for (var n = 0; n < i.length; n += 1) i[n].call(this, e) }, observe: function(t, e, i) { var n = i && i.defer ? this._observers.post : this._observers.pre;
                (n[t] || (n[t] = [])).push(e), i && !1 === i.init || (e.__calling = !0, e.call(this, this._state[t]), e.__calling = !1); return { cancel: function() { var i = n[t].indexOf(e);~i && n[t].splice(i, 1) } } }, on: function(t, e) { if ("teardown" === t) return this.on("destroy", e); var i = this._handlers[t] || (this._handlers[t] = []); return i.push(e), { cancel: function() { var t = i.indexOf(e);~t && i.splice(t, 1) } } }, set: function(t) { if (this._set(L({}, t)), this.root._lock) return;
                this.root._lock = !0, M(this.root._beforecreate), M(this.root._oncreate), M(this.root._aftercreate), this.root._lock = !1 }, teardown: O, _set: function(t) { var e = this._state,
                    i = {},
                    n = !1; for (var o in t) this._differs(t[o], e[o]) && (i[o] = n = !0); if (!n) return;
                this._state = L({}, e, t), this._recompute(i, this._state), this._bind && this._bind(i, this._state);
                this._fragment && (P(this, this._observers.pre, i, this._state, e), this._fragment.p(i, this._state), P(this, this._observers.post, i, this._state, e)) }, _mount: function(t, e) { this._fragment.m(t, e) }, _unmount: function() { this._fragment && this._fragment.u() }, _differs: function(t, e) { return t != t ? e == e : t !== e || t && "object" === (void 0 === t ? "undefined" : _typeof(t)) || "function" == typeof t } }), m.prototype._recompute = function(e, i) { var n, o;
            e.styling && this._differs(i._styles, i._styles = "object" === (void 0 === (n = i.styling) ? "undefined" : _typeof(n)) ? n : t.styling[n]) && (e._styles = !0), e.icons && this._differs(i._icons, i._icons = "object" === (void 0 === (o = i.icons) ? "undefined" : _typeof(o)) ? o : t.icons[o]) && (e._icons = !0) }, (t = m).VERSION = "4.0.0-alpha.2", t.defaultStack = { dir1: "down", dir2: "left", firstpos1: 25, firstpos2: 25, spacing1: 36, spacing2: 36, push: "bottom", context: window && document.body }, t.defaults = { title: !1, titleTrusted: !1, text: !1, textTrusted: !1, styling: "brighttheme", icons: "brighttheme", addClass: "", cornerClass: "", autoDisplay: !0, width: "360px", minHeight: "16px", type: "notice", icon: !0, animation: "fade", animateSpeed: "normal", shadow: !0, hide: !0, delay: 8e3, mouseReset: !0, remove: !0, destroy: !0, stack: t.defaultStack, modules: {} }, t.notices = [], t.modules = {}, t.modulesPrependContainer = [], t.modulesAppendContainer = [], t.alert = function(e) { return new t(o(e)) }, t.notice = function(e) { return new t(o(e, "notice")) }, t.info = function(e) { return new t(o(e, "info")) }, t.success = function(e) { return new t(o(e, "success")) }, t.error = function(e) { return new t(o(e, "error")) }, t.removeAll = function() { t.closeAll() }, t.closeAll = function() { for (var e = 0; e < t.notices.length; e++) t.notices[e].close && t.notices[e].close(!1) }, t.removeStack = function(e) { t.closeStack(e) }, t.closeStack = function(e) { if (!1 !== e)
                for (var i = 0; i < t.notices.length; i++) t.notices[i].close && t.notices[i].get("stack") === e && t.notices[i].close(!1) }, t.positionAll = function() { if (e && clearTimeout(e), e = null, t.notices.length > 0) { for (var i = 0; i < t.notices.length; i++) { var o = t.notices[i].get("stack");
                    o && (o.overlay && n(o), o.nextpos1 = o.firstpos1, o.nextpos2 = o.firstpos2, o.addpos2 = 0) } for (var s = 0; s < t.notices.length; s++) t.notices[s].position() } else delete t.defaultStack.nextpos1, delete t.defaultStack.nextpos2 }, t.styling = { brighttheme: { container: "brighttheme", notice: "brighttheme-notice", info: "brighttheme-info", success: "brighttheme-success", error: "brighttheme-error" }, bootstrap3: { container: "alert", notice: "alert-warning", info: "alert-info", success: "alert-success", error: "alert-danger", icon: "ui-pnotify-icon-bs3" }, bootstrap4: { container: "alert", notice: "alert-warning", info: "alert-info", success: "alert-success", error: "alert-danger", icon: "ui-pnotify-icon-bs4", title: "ui-pnotify-title-bs4" } }, t.icons = { brighttheme: { notice: "brighttheme-icon-notice", info: "brighttheme-icon-info", success: "brighttheme-icon-success", error: "brighttheme-icon-error" }, bootstrap3: { notice: "glyphicon glyphicon-exclamation-sign", info: "glyphicon glyphicon-info-sign", success: "glyphicon glyphicon-ok-sign", error: "glyphicon glyphicon-warning-sign" }, fontawesome4: { notice: "fa fa-exclamation-circle", info: "fa fa-info-circle", success: "fa fa-check-circle", error: "fa fa-exclamation-triangle" }, fontawesome5: { notice: "fas fa-exclamation-circle", info: "fas fa-info-circle", success: "fas fa-check-circle", error: "fas fa-exclamation-triangle" } }, window && document.body ? i() : document.addEventListener("DOMContentLoaded", i), m }();
//# sourceMappingURL=PNotify.js.map