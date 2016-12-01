/*--------------------------------------------------
Script name: 	   Core
Author:			   Luke Guppy
Version:		   1.0
Created:	       17/04/2013
Notes:             Core functionality library - no dependencies permitted
------------------------------------------------*/
var Core = (function () {
    'use strict';
    var core = {};
    core.shuffle = function (v) {
        /// <summary>
        /// Shuffle an array of items and returns an array
        /// </summary>
        /// <param name="v" type="array"></param>
        /// <returns type="array"></returns>
        for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
        return v;
    }
    core.randomInt = function (min, max) {
        /// <summary>
        /// Returns a random number based on given max and min range
        /// </summary>
        /// <param name="min" type="number"></param>
        /// <param name="max" type="number"></param>
        /// <returns type="number"></returns>
        var item = Math.floor(Math.random() * (max - min + 1)) + min;
        return item;
    }
    core.toggleAttr = function (el, currAtt, newAtt) {
        /// <summary>
        /// Switches an attribute with another from currAtt and newAtt
        /// </summary>
        /// <param name="el" type="HTMLElement"></param>
        /// <param name="currAtt" type="string"></param>
        /// <param name="newAtt" type="string"></param>
        $(el).attr(newAtt, $(el).attr(currAtt));
    }
    core.bindEvent = function (el, eventName, eventHandler) {
        /// <summary>
        /// Binds a given event to a given element
        /// </summary>
        /// <param name="el" type="HTMLElement"></param>
        /// <param name="eventName" type="function"></param>
        /// <param name="eventHandler" type="event"></param>
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    }
    core.unbindEvent = function (el, eventName, eventHandler) {
        /// <summary>
        /// Unbinds a given event from a given element
        /// </summary>
        /// <param name="el" type="HTMLElement"></param>
        /// <param name="eventName" type="function"></param>
        /// <param name="eventHandler" type="event"></param>
        if (el.removeEventListener) {
            el.removeEventListener(eventName, eventHandler, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + eventName, eventHandler);
        }
    }
    core.equalHeights = function (els) {
        /// <summary>
        /// Equalise the height of an array of elements
        /// </summary>
        /// <param name="els" type="array">Array of HTML Elements</param>
        var height = 0;
        for (i = 0; i < els.length; i++) {
            var elHeight = $($(els)[i]).height();
            if (elHeight > height) {
                height = elHeight;
            }
        }
        $(els).height(height);
    }
    core.getParam = function (name) {
        /// <summary>
        /// Returns the value of a given parameter from window.location
        /// </summary>
        /// <param name="name"></param>
        /// <returns type="string"></returns>
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    core.setStorage = function (name, data, expiry, useCookie) {
        /// <summary>
        /// Set given data in storage with either cookies or localStorage
        /// </summary>
        /// <param name="name" type="name"></param>
        /// <param name="data" type="string"></param>
        /// <param name="expiry" type="number">Number of days before expiry</param>
        /// <param name="useCookie" type="boolean"></param>
        if (useCookie) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiry);
            var c_value = escape(data) + ((expiry == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = name + "=" + c_value + ";path=/";
        }
        else {
            if ('localStorage' in window && window['localStorage'] !== null) {
                window['localStorage'].setItem(name, data);
            }
            else {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiry);
                var c_value = escape(data) + ((expiry == null) ? "" : "; expires=" + exdate.toUTCString());
                document.cookie = name + "=" + c_value + ";path=/";
            }
        }
    }
    core.getStorage = function (name, useCookie) {
        /// <summary>
        /// Gets requested data from either cookies or localStorage
        /// </summary>
        /// <param name="name" type="name"></param>
        /// <param name="useCookie" type="boolean"></param>
        /// <returns type="string"></returns>
        if (useCookie) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == name) {
                    return unescape(y);
                }
            }
        }
        else {
            if ('localStorage' in window && window['localStorage'] !== null) {
                return window['localStorage'].getItem(name);
            }
            else {
                var i, x, y, ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == name) {
                        return unescape(y);
                    }
                }
            }
        }
    }
    core.clearStorage = function (name, useCookie) {
        /// <summary>
        /// Removes requested data from  either cookies or localStorage
        /// </summary>
        /// <param name="name" type="name"></param>
        /// <param name="useCookie" type="boolean"></param>
        if (useCookie) {
            document.cookie = encodeURIComponent(name) + "=deleted; expires=" + new Date(0).toUTCString();
        }
        else {
            if ('localStorage' in window && window['localStorage'] !== null) {
                window['localStorage'].removeItem(name);
            }
            else {
                document.cookie = encodeURIComponent(name) + "=deleted; expires=" + new Date(0).toUTCString();
            }
        }
    }
    core.getIEVersion = function () {
        /// <summary>
        /// Checks current version of Internet Explorer, if not IE returns -1
        /// </summary>
        /// <returns type="number"></returns>
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }
    core.elementSupportAttribute = function (element, attribute) {
        /// <summary>
        /// Checks support for a given attribute on an element
        /// </summary>
        /// <param name="element" type="HTMLElement"></param>
        /// <param name="attribute" type="string"></param>
        /// <returns type="boolean"></returns>
        var test = document.createElement(element);
        if (attribute in test) {
            return true;
        }
        return false;
    }
    core.chunk = function (array, chunkSize) {
        /// <summary>
        /// Splits a given array into separate arrays of the given chunkSize
        /// </summary>
        /// <param name="array" type="array"></param>
        /// <param name="chunkSize" type="number"></param>
        /// <returns type="array"></returns>
        var count = 1;
        var newArray = [];
        var limit = chunkSize;
        var tempArray = [];
        for (var i = 0; i < array.length ; i++) {
            if (i < limit) {
                tempArray.push(array[i]);
                if (i == array.length - 1) {
                    newArray.push(tempArray);
                    tempArray = [];
                }
            }
            else {
                newArray.push(tempArray);
                tempArray = [];
                tempArray.push(array[i]);
                count = count + 1;
                limit = chunkSize * (count);
            }
        }
        return newArray;
    }
    core.onTouch = function (element, event, touchHandler, eventName) {
        /// <summary>
        /// Binds an event to an element using the TouchEnd or Click handler - relies on jQuery 'on/off' methods
        /// </summary>
        /// <param name="element" type="HTMLElement">Target element to bind to</param>
        /// <param name="event" type"function">Event to call from handler</param>
        /// <param name="touchHandler" type"string">Handler event for touch interaction - touchstart / touchend / touchmove</param>
        /// <param name="eventName" type"string">Namespace given for event -can then be referenced for unbinding</param>
        touchHandler = touchHandler + '.' + eventName;
        var clickHandler = 'click.' + eventName;
        if ('ontouchstart' in window || 'createTouch' in document) {
            $(element).off(touchHandler).on(touchHandler, function (e) {
                event();
                e.preventDefault();
            });
        }
        else {
            $(element).off(clickHandler).on(clickHandler, function (e) {
                event();
                e.preventDefault();
            });
        }
    }
    core.offTouch = function (element, touchHandler, eventName) {
        /// <summary>
        /// Unbinds an event from an element using the TouchEnd or Click handler - relies on jQuery 'on/off' methods
        /// </summary>
        /// <param name="element" type="HTMLElement">Target element to bind to</param>
        /// <param name="touchHandler" type"string">Handler event for touch interaction - touchstart / touchend / touchmove</param>
        /// <param name="eventName" type"string">Namespace given for event -can then be referenced for unbinding</param>
        touchHandler = touchHandler + '.' + eventName;
        var clickHandler = 'click.' + eventName;
        if ('ontouchstart' in window || 'createTouch' in document) {
            $(element).off(touchHandler);
        }
        else {
            $(element).off(clickHandler);
        }
    }
    core.log = function (message, useAlert) {
        /// <summary>
        /// Run safe console logging for debugging
        /// </summary>
        /// <param name="message" type="string/element">message you want to appear in console log</param>
        /// <param name="useAlert" type="boolean">True if you want to run alert if console is unavailable</param>
        if (typeof console == "object") {
            console.log(message);
        } else if (useAlert) {
            alert(message);
        }
    }
    return core;
})();
