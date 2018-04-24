App.apply(App, {
    notify: function(_subject, _object, options) {
        if (!window.APP_NOTIFIER) APP_NOTIFIER = [];

        function add_notif() {
            if (APP_NOTIFIER.length > 0) {
                var myTOP = APP_NOTIFIER[APP_NOTIFIER.length - 1];
                myTOP = myTOP.css('top').split('px')[0] * 1 + myTOP.css('height').split('px')[0] * 1 + 20 + '.px';
            } else myTOP = "35px";
            var div = App.$({
                type: "div",
                className: "OACard",
                style: {
                    position: "absolute",
                    right: "40px",
                    top: myTOP,
                    width: "400px",
                    height: "100px"
                }
            }).appendTo('body').addClass('animated').addClass('fadeInRightBig');
            var h = App.$({
                type: "div",
                className: "OACardHeader"
            }).appendTo(div);
            App.$({
                type: "div",
                className: "OACardIcon"
            }).appendTo(h);
            App.$({
                type: "div",
                className: "OACardTitle",
                innerHTML: Settings.TITLE.toUpperCase()
            }).appendTo(h);
            var closer = App.$({
                type: "div",
                className: "OACardClose"
            }).appendTo(h);
            closer.hide();
            var c = App.$({
                type: "div",
                className: "OACardContent"
            }).appendTo(div);
            var object = App.$({
                type: "span",
                className: "OACardObject",
                innerHTML: _subject
            }).appendTo(c);
            var subject = App.$({
                type: "div",
                className: "OACardSubject",
                innerHTML: _object
            }).appendTo(c);
            closer.on('click', function() {
                for (var i = 0; i < APP_NOTIFIER.length; i++) {
                    if (APP_NOTIFIER[i].id == closer.up('.OACard').id) APP_NOTIFIER.splice(i, 1);
                };
                closer.up('.OACard').remove();
            });
            h.on('mouseover', function() {
                h.get('.OACardClose').show();
            });
            h.on('mouseleave', function() {
                h.get('.OACardClose').hide();
            })
            APP_NOTIFIER.push(div);
            setTimeout(function() {
                div.removeClass('fadeInRightBig').addClass('fadeOutUpBig');
                APP_NOTIFIER.shift();
            }, 5000);
        };
        var title = Settings.TITLE;
        var ns = Settings.NAMESPACE;
        add_notif();
    }
});