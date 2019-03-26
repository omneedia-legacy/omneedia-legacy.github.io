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

try {
    if (!AppMobile) AppMobile = {};
} catch (e) {
    AppMobile = {};
}

if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.host;

var io_start = function(io) {
    document.socket = io.connect(document.location.origin);
    document.socket.on('connect', function() {
        var sessionid = document.socket.io.engine.id;
        AppMobile.unblur();
    });
    document.socket.on('disconnect', function() {
        AppMobile.blur();
    });
    document.socket.on('log', function(data) {
        console.log('%c ' + 'LOG: SERVER', 'color: #00F; font-size:12px', data);
    });
    document.socket.on('info', function(data) {
        console.info('%c' + 'INFO: SERVER \n', 'color: green; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
    });
    document.socket.on('warn', function(data) {
        console.warn('%c' + 'WARN: SERVER \n', 'color: orange; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
    });
    document.socket.on('debug', function(data) {
        console.debug('%c' + 'DEBUG: SERVER \n', 'color: black; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
    });
    document.socket.on('error', function(data) {
        console.error('%c' + 'ERROR: SERVER \n', 'color: red; font-family:"Arial", Helevetica; font-size:10px;font-weight:bold', data);
    });
    document.socket.on('session', function(data) {
        var data = JSON.parse(data);
        if (!localStorage.getItem("session")) localStorage.setItem('session', data.pid);
        else {
            if (localStorage.getItem("session") != data.pid) {
                localStorage.setItem('session', data.pid);
                try {
                    AppMobile.blur();
                } catch (e) {};
                location.reload();
            }
        };
    });
    /*AppMobile.IO = {
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
    };	*/
};

io_start(io);



AppMobile.blur = function() {
    //$('.omneedia-overlay').show();
    var _createSvgElement = function(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
    };
    var svgUrl = document.location.protocol + '//' + document.location.host + document.location.pathname + document.location.search;
    var svg = _createSvgElement('svg');
    var filter = _createSvgElement('filter');
    filter.id = "blurme";
    var _svgGaussianFilter = _createSvgElement('feGaussianBlur');
    _svgGaussianFilter.setAttribute('stdDeviation', '5');
    svg.setAttribute('style', 'position:absolute');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    filter.appendChild(_svgGaussianFilter);
    svg.appendChild(filter);
    document.getElementsByTagName('body')[0].appendChild(svg);
    var cssFilterValue = 'url(' + svgUrl + '#blurme' + ')';
    document.getElementsByTagName('body')[0].style['filter'] = cssFilterValue;
};

AppMobile.unblur = function(fx) {
    //$('.omneedia-overlay').hide();
    document.getElementsByTagName('body')[0].style['filter'] = '';
}

for (var i = 0; i < Settings.RESOURCES.length; i++) {
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = Settings.RESOURCES[i];
    console.log(Settings.RESOURCES[i]);
    document.getElementsByTagName('head')[0].appendChild(link);
};

AppMobile.blur();