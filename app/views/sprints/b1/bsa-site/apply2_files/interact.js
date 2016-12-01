var interact = {};
// ACCORDION
interact.accordion = function (options) {
    'use strict';
    var self = this;
    self.Opt = new interact.accordion.opt(options);
    var Animate = function(obj) {
        if (self.Opt.State == 'open') {
            obj.slideDown(self.Opt.Speed, function () {
                if (self.Opt.OpenCallBack != '') {
                    self.Opt.OpenCallBack(opt);
                }
            });
        }
        else {
            obj.slideUp(self.Opt.Speed, function () {
                if (self.Opt.CloseCallBack != '') {
                    self.Opt.CloseCallBack(opt);
                }
            });
        }
    };
    var Init = (function () {
        self.Opt.InitialSelector = self.Opt.Selector;
        for (var i = 0; i < self.Opt.Wrap.length; i++) {
            // add an id to each accordion section if it doesn't already have one
            if (self.Opt.Wrap.eq(i).attr("id")) {
                var id = self.Opt.Wrap.eq(i).attr("id");
            }
            else {
               var id = "accordion_" + i;
               jQuery(self.Opt.Wrap).eq(i).attr("id", id);
            }
            self.Opt.Selector = "#" + id + ' ' + self.Opt.InitialSelector;
            switch (self.Opt.Start) {
                case 'closed':
                    jQuery(self.Opt.Selector).each(function () {
                        if (!jQuery(this).hasClass('open')) {
                            // explicitly set the height on the element to allow the calculation below to work (as element is hidden)
                            jQuery(this).next().height(jQuery(this).next().height());
                            jQuery(this).next().hide();
                        }
                    });
                    break;
                case 'open':
                    jQuery(self.Opt.Selector).addClass('open');
            }
            jQuery(self.Opt.Selector).bind('click', function () {
                self.Opt.Speed = jQuery(this).next().height() * self.Opt.SpeedMod;
                var obj = jQuery(this).next();

                if (jQuery(this).hasClass('open')) {
                    jQuery(this).removeClass('open');
                    self.Opt.State = 'closed';
                    Animate(obj);
                }
                else {
                    if (!self.Opt.MultiOpen) {
                        // find the open drawer, remove the class, move to the next element following it and hide it
                        if (self.Opt.Parent != '') {
                            var prevObj = jQuery(self.Opt.Parent).find('.open');
                        }
                        else {
                            var prevObj = jQuery(this).parent().find('.open');
                        }
                        if (prevObj.length > 0) {
                            jQuery(prevObj).removeClass('open');
                            prevObj = prevObj.next();
                            self.Opt.State = 'closed';
                            Animate(prevObj);
                        }
                    }
                    // add the open class to this A, move to the next element (i.e UL) and show it
                    jQuery(this).addClass('open');
                    self.Opt.State = 'open';
                    Animate(obj);
                }
                return false;
            });
            if (self.Opt.BuildCallBack) {
                self.Opt.BuildCallBack(self.Opt);
            }
        }
    })();
    var openAll = function() {
        self.Opt.State = 'open';
        jQuery(self.Opt.Selector).addClass('open');
        animate(self.Opt.Selector);
    };
    this.OpenAll = openAll;
    var closeAll = function () {
        self.Opt.State = 'closed';
        jQuery(self.Opt.Selector).removeClass('open');
        animate(self.Opt.Selector);
    };
    this.CloseAll = closeAll;
};
interact.accordion.opt = function (options) {
    'use strict';
    options && options.wrapper ? this.Wrap = jQuery(options.wrapper) : this.Wrap = jQuery(".accordionWrapper");
    options && options.selector ? this.Selector = options.selector : this.Selector = ".accordion";
    options && options.start ? this.Start = options.start : this.Start = "closed";
    options && options.speedMod ? this.SpeedMod = options.speedMod : this.SpeedMod = 1;
    options && options.parent ? this.Parent = options.parent : this.Parent = "";
    options && options.buildCallBack ? this.BuildCallBack = options.buildCallBack : this.BuildCallBack = "";
    options && options.openCallBack ? this.OpenCallBack = options.openCallBack : this.OpenCallBack = "";
    options && options.closeCallBack ? this.CloseCallBack = options.closeCallBack : this.CloseCallBack = "";
    options && options.multiOpen ? this.MultiOpen = options.multiOpen : this.MultiOpen = false;
};
// TABS
interact.tabs = function (options) {
    var instance = this;
    instance.Options = new interact.tabs.opt();
    function animate(obj, opt, tab) {
        opt.obj = obj;
        switch (opt.transition) {
            case 'none':
                jQuery(obj).hide(0, function () {
                    bindTabEvents();
                    jQuery(this).removeClass(opt.currentTabClass);
                    tab.addClass(opt.currentTabClass).show(0);
                    if (opt.changeCallBack != '') {
                        opt.changeCallBack(opt);
                    }
                });
                break;
            case 'fade':
                jQuery(obj).fadeOut(opt.transitionSpeed, function () {
                    bindTabEvents();
                    jQuery(this).removeClass(opt.currentTabClass);
                    jQuery(opt.tabContentContainer + '>:nth-child(' + tab + ')').addClass(opt.currentTabClass).fadeIn(opt.transitionSpeed);
                    if (opt.changeCallBack != '') {
                        opt.changeCallBack(opt);
                    }
                });
                break;
            case 'slide':
                jQuery(obj).slideUp(opt.transitionSpeed, function () {
                    bindTabEvents();
                    jQuery(this).removeClass(opt.currentTabClass);
                    jQuery(opt.tabContentContainer + '>:nth-child(' + tab + ')').addClass(opt.currentTabClass).slideDown(opt.transitionSpeed);
                    if (opt.changeCallBack != '') {
                        opt.changeCallBack(opt);
                    }
                });
        }
        if (instance.Options.addHashValue) {
            if (jQuery(opt.tabsContainer + '>:nth-child(' + tab + ')').attr('id')) {
                window.location.hash = "tab-" + jQuery(opt.tabsContainer + '>:nth-child(' + tab + ')').attr('id');
            }
        }
    };
    function bindTabEvents() {
        jQuery(instance.Options.tabsContainer).children().unbind('click.tab').unbind('click.blank').bind('click.tab', function () {
            jQuery(instance.Options.tabsContainer).children().unbind('click.tab');
            jQuery(instance.Options.tabsContainer).children().bind('click.blank', function () {
                return false;
            });
            jQuery(this).siblings().removeClass(instance.Options.selectedTabClass);
            jQuery(this).addClass(instance.Options.selectedTabClass);
            var tab = jQuery(instance.Options.tabsContainer).children().index(jQuery(this)) + 1;
            var test = jQuery(instance.Options.tabContentContainer + '>:nth-child(' + tab + ')');
            animate(jQuery(instance.Options.tabContentContainer).children(' .' + instance.Options.currentTabClass), instance.Options, test);
            // var currentElement = jQuery(instance.Options.wrapper).find('.currentTab');
            // var difference = boxHeight - currentElement.height();
            // console.log(difference + ' ' + currentElement.height() + ' ' + boxHeight);
            // currentElement.css('height', (boxHeight - difference));
            return false;
        });
    }
    function setTabState(reset) {
        // hide all tab's content and only show the selected tab
        jQuery(instance.Options.tabContentContainer).children().hide();
        if (reset) {
            jQuery(instance.Options.tabsContainer).children().removeClass(instance.Options.selectedTabClass);
        }
        // if no tab has been set as selected in the markup, look to see if a hash value has been set in the URL and use this, otherwise assume it is the first tab
        if (!jQuery(instance.Options.tabsContainer).children().hasClass(instance.Options.selectedTabClass)) {
            jQuery(instance.Options.tabsContainer + '>:first-child').addClass(instance.Options.selectedTabClass);
            if (instance.Options.addHashValue && window.location.hash) {
                var tabToSelect = window.location.hash.split('-');
                jQuery.each(jQuery(instance.Options.tabsContainer).children(), function () {
                    if (jQuery(this).attr('id') == tabToSelect[1]) {
                        jQuery(this).siblings().removeClass(instance.Options.selectedTabClass);
                        jQuery(this).addClass(instance.Options.selectedTabClass);
                    }
                });
            }
        }
        var selected = jQuery(instance.Options.tabsContainer + ' .' + instance.Options.selectedTabClass).index() + 1;
        jQuery(instance.Options.tabContentContainer + '>:nth-child(' + selected + ')').addClass(instance.Options.currentTabClass).show();
        var boxHeight = jQuery(instance.Options.wrapper).outerHeight();
        jQuery(instance.Options.tabContentContainer).children().css('min-height', boxHeight);
    }
    this.SetTabState = setTabState;
    function init() {
        //instance.Options.initialTabsContainer = instance.Options.tabsContainer;
        //instance.Options.initialTabContentContainer = instance.Options.tabContentContainer;
        //for (var i = 0; i < jQuery(instance.Options.wrapper).length; i++) {
        //    if (jQuery(instance.Options.wrapper).eq(i).attr("id")) {
        //        var id = jQuery(instance.Options.wrapper).eq(i).attr("id");
        //    }
        //    else {
        //        var id = "tabs_" + i;
        //        jQuery(instance.Options.wrapper).eq(i).attr("id", id);
        //    }
        //    instance.Options.tabsContainer = "#" + id + ' ' + instance.Options.initialTabsContainer;
        //    instance.Options.tabContentContainer = "#" + id + ' ' + instance.Options.initialTabContentContainer;

        //    console.log(instance.Options.tabsContainer);
        //    console.log(instance.Options.tabContentContainer);

            setTabState();
            // change the displayed content when a tab is clicked on
            bindTabEvents();
            if (instance.Options.buildCallBack) {
                instance.Options.buildCallBack(opt);
            }
        //}
    };
    this.Init = init;
};
interact.tabs.opt = function () {
    this.wrapper = '.tabsWrapper';
    this.tabsContainer = '.tabs';
    this.tabContentContainer = '.tabContent';
    this.selectedTabClass = 'selectedTab';
    this.currentTabClass = 'currentTab';
    this.transition = 'none';
    this.transitionSpeed = 500;
    this.addHashValue = false;
    this.buildCallBack = '';
    this.changeCallBack = '';
}
// QUICKBOX
interact.quickbox = function (options) {
    var instance = this;
    instance.Options = new interact.quickbox.opt();
    function closeBox(opt) {
        jQuery(opt.quickboxContainer).fadeOut(opt.fadeSpeed, function () {
            jQuery(this).empty();
            jQuery(this).css('margin-top', '');
            jQuery('#' + opt.backgroundContainerID).remove();
            if (instance.Options.closeCallBack) {
                instance.Options.closeCallBack(opt);
            }
        });
    };
    function init() {
        jQuery(instance.Options.quickboxActivator).bind('click', function () {
            if (!jQuery('#' + instance.Options.backgroundContainerID).length) {
                jQuery(instance.Options.quickboxContainer).before("<div id='" + instance.Options.backgroundContainerID + "'></div>");
            }
            if (jQuery(this).is('img')) {
                // if the images links off to a larger version show this in the popup, otherwise just show the original image
                if (jQuery(this).parent('a').length > 0) {
                    var imageLarge = jQuery(this).parent().attr('href');
                }
                else {
                    var imageLarge = jQuery(this).attr('src');
                }
                // generate the popup window content
                jQuery(instance.Options.quickboxContainer).append("<div class='popUpContent'><a id='" + instance.Options.closeLinkID + "' href='#'>Close</a><img src='" + imageLarge + "' alt='" + jQuery(this).attr('alt') + "'/></div>");
                jQuery('.popUpContent img').load(function () {
                    jQuery('#' + instance.Options.backgroundContainerID).fadeIn(instance.Options.fadeSpeed);
                    jQuery(instance.Options.quickboxContainer).fadeIn(instance.Options.fadeSpeed, function () {
                        if (instance.Options.openCallBack) {
                            instance.Options.openCallBack(instance.Options);
                        }
                    });
                    // set width of popup box to that of the loaded image
                    jQuery('.popUpContent').css('width', jQuery(this).innerWidth());
                    if (instance.Options.topIndent == 'middle') {
                        // vertically center the popup, if the popup is too high for the window fix it 20px from the top
                        if ((jQuery(this).innerHeight() + 20) <= jQuery(window).height()) {
                            var centeredIndent = (jQuery(window).height() / 2) - (jQuery(this).innerHeight() / 2);
                        }
                        else {
                            var centeredIndent = 20;
                        }
                        jQuery(instance.Options.quickboxContainer).css('margin-top', centeredIndent + jQuery(window).scrollTop());
                    }
                    else {
                        jQuery(instance.Options.quickboxContainer).css('margin-top', instance.Options.topIndent + jQuery(window).scrollTop());
                    }
                });
                jQuery('#' + instance.Options.closeLinkID).bind('click.close', function () {
                    closeBox(instance.Options);
                    return false;
                });
                jQuery('#' + instance.Options.backgroundContainerID).bind('click.close', function () {
                    closeBox(instance.Options);
                    return false;
                });
            }
            else {
                jQuery(instance.Options.quickboxContainer).load(jQuery(this).attr('href'), function () {
                    jQuery('.' + instance.Options.backgroundContainerID).fadeIn(instance.Options.fadeSpeed);
                    jQuery(instance.Options.quickboxContainer).fadeIn(instance.Options.fadeSpeed, function () {
                        if (instance.Options.openCallBack) {
                            instance.Options.openCallBack(instance.Options);
                        }
                    });
                    if (instance.Options.topIndent == 'middle') {
                        // vertically center the popup, if the popup is too high for the window fix it 20px from the top
                        var popUpHeight = jQuery(instance.Options.quickboxContainer + ' .popUpContent').innerHeight();
                        if ((popUpHeight + 20) <= jQuery(window).height()) {
                            var centeredIndent = (jQuery(window).height() / 2) - (popUpHeight / 2);
                        }
                        else {
                            var centeredIndent = 20;
                        }
                        jQuery(instance.Options.quickboxContainer).css('margin-top', centeredIndent + jQuery(window).scrollTop());
                    }
                    else {
                        jQuery(instance.Options.quickboxContainer).css('margin-top', instance.Options.topIndent + jQuery(window).scrollTop());
                    }
                });
            }
            return false;
        });
    };
    this.Init = init;
    function close() {
        if (instance.Options.closeLinkClass != '') {
            var closeObj =  jQuery(instance.Options.quickboxContainer).find('.' + instance.Options.closeLinkID);
        }
        else{
            var closeObj =  jQuery(instance.Options.quickboxContainer).find('#' + instance.Options.closeLinkID);
        };
        closeObj.bind('click.close', function () {
            closeBox(instance.Options);
            return false;
        });
        if(!instance.Options.disableBackgroundClose) {
            jQuery('#' + instance.Options.backgroundContainerID).bind('click.close', function () {
                closeBox(instance.Options);
                return false;
            });
        }
    }
    this.Close = close;
};
interact.quickbox.opt = function () {
    this.quickboxContainer = '#quickbox';
    this.quickboxActivator = '.quickbox';
    this.backgroundContainerID = 'background';
    this.closeLinkID = 'close';
    this.fadeSpeed = 500;
    this.topIndent = 'middle';
    this.openCallBack = '';
    this.closeCallBack = '';
    this.disableBackgroundClose = '';
    this.closeLinkClass = '';
}
