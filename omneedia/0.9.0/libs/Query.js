App.apply(App, {
    $: function(obj, Obj) {
        if (App.isArray(obj)) {
            var elem = [];
            for (var i = 0; i < obj.length; i++) elem.push(obj[i]);
        } else {
            if (App.isElement(obj)) var elem = obj;
            else {
                if (typeof obj === "object") {
                    var appendTo = "-1";
                    var div = document.createElement(obj.type);
                    div.id = 'cmp-' + App.uuid();
                    var arr = App.getObjectProperties(obj);
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] != "type") {
                            App.setObjectProperty(div, arr[i], App.getObjectProperty(obj, arr[i]));
                        };
                    };
                    var elem = div;

                    if (Obj) {
                        console.log(App.$(elem));
                        console.log(App.$(Obj));
                        App.$(elem).appendTo(App.$(Obj));
                    }
                } else {
                    if (Obj) var doc = Obj;
                    else var doc = document;
                    if (App.isElement(obj)) var elem = obj;
                    else {
                        if (obj.indexOf('#') > -1) var elem = doc.getElementById(obj.split('#')[1]);
                        else {
                            try {
                                var elem = doc.querySelectorAll(obj);
                                if (App.isNodeList(elem)) elem = Array.prototype.slice.call(elem);
                            } catch (e) {
                                var elem = [];
                                var span = document.createElement('span');
                                span.innerHTML = obj;
                                elem.push(span);
                            }
                        }
                    };
                };
            };
        };
        if (!App.isArray(elem)) {
            var tab = [];
            tab.push(elem);
            elem = tab;
        };
        return {
            id: elem[0].id,
            on: function(property, fn) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        elem[i].addEventListener(property, fn);
                    }
                };
            },
            up: function(p) {
                if (!p) return App.$(elem[0].parentNode);
                var obz = elem[0];
                while (obz) {
                    if (obz.parentNode.querySelectorAll(p).length > 0) {
                        return App.$(obz);
                    } else obz = obz.parentNode;
                };
                return false;
            },
            down: function(p) {
                if (!p) return App.$(elem[0].ChildNode);
                var obz = elem[0];
                while (obz) {
                    if (obz.ChildNode.querySelectorAll(p).length > 0) {
                        return App.$(obz);
                    } else obz = obz.ChildNode;
                };
                return false;
            },
            get: function(obj) {
                return App.$(obj, elem[0]);
            },
            dom: function() {
                if (elem.length == 1) return elem[0];
                else return elem;
            },
            css: function(key, value) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (!value) return elem[i].style[key];
                        else {
                            elem[i].style[key] = value;
                        }
                    }
                };
                return App.$(elem);
            },
            html: function(xhtml) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (!xhtml) return elem[i].innerHTML;
                        else elem[i].innerHTML = xhtml;
                    }
                };
                return App.$(elem);
            },
            remove: function() {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].parentNode.removeChild(elem[i]);
                };
                return App.$(elem);
            },
            click: function(fn) {
                for (var i = 0; i < elem.length; i++) {
                    elem[i].addEventListener('click', fn, true);
                };
                return App.$(elem);
            },
            appendTo: function(div) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (div.dom) div = div.dom();
                        if (App.isString(div)) div = document.querySelector(div);
                        if (div) div.appendChild(elem[i]);
                    };
                };
                return App.$(elem);
            },
            addClass: function(cl) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].classList.add(cl);
                };
                return App.$(elem[0]);
            },
            removeClass: function(cl) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].classList.remove(cl);
                };
                return App.$(elem);
            },
            show: function() {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].style.display = "";
                };
                return App.$(elem);
            },
            hide: function() {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].style.display = "none";
                };
                return App.$(elem);
            }
        }
    }
})