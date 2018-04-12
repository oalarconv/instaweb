"use strict";
var XafMobileLocalization;
function XafMobileLocalizationClientModule() {
    var self = this;

    this.downloadJsonFromModule = function (filename) {
        return System.import("modules/localization/" + filename + "!json");
    }

    function createModule(application) {
        applyClientLocalization(application.appConfig);
        applyXafLocalization(application.appConfig);
    }

    function getXafLocalizationDictionaryForCurrentLanguage(config) {
        var localizationSource;
        if (config.XafLocalization) {
            var language = getXafAvailableLocaleForCurrentLanguage(config)
            localizationSource = config.XafLocalization[language];
        }
        return localizationSource;
    }
    function getXafAvailableLocaleForCurrentLanguage(config) {
        var language = null;
        if (config && config.XafLocalization) {
            var browserLanguage = getCurrentLanguage(config);
            language = getAvailableLocale(config.XafLocalization, browserLanguage, xafGetValueByKey);
            if (language === 'en') {
                language = "";
            }

            if (!config.XafLocalization[language]) {
                var localizationKeys = Object.keys(config.XafLocalization);
                if (localizationKeys.length == 1) {
                    language = localizationKeys[0];
                } else {
                    language = null;
                    for (var i = 0; i < localizationKeys.length; i++) {
                        if (localizationKeys[i].indexOf(browserLanguage) > -1) {
                            language = localizationKeys[i];
                            break;
                        }
                    }
                    if (language == null) {
                        if (config.XafLocalization[""]) {
                            language = "";
                        } else {
                            language = localizationKeys[0];
                        }
                    }
                }
            }
        }
        if (language === 'en') {
            language = "";
        }
        return language;
    }
    function getAvailableLocale(availableLocales, language, predicate, useDefault) {
        if (availableLocales && predicate) {
            if (predicate(availableLocales, language)) {
                return language;
            }

            var keys = language.split(/[_-]/);
            if (keys.length > 1) {
                //Find the available locale
                //start from the end we remove one sub culture and check result
                for (var i = keys.length - 1; i >= 0; i--) {
                    var invariantCulture = keys[0];
                    for (var x = 1; x <= i; x++) {
                        invariantCulture += "-" + keys[x];
                    }
                    if (predicate(availableLocales, invariantCulture)) {
                        return invariantCulture;
                    }
                    invariantCulture = keys[0];
                    for (var x = 1; x <= i; x++) {
                        invariantCulture += "_" + keys[x];
                    }
                    if (predicate(availableLocales, invariantCulture)) {
                        return invariantCulture;
                    }
                }
            }
        }
        if (useDefault) {
            return 'en';
        } else {
            return null;
        }
    }
    function getCLDRAvailableLocale(availableLocales, config) {
        //get availabe locale from XAF localization list
        var locale = getXafAvailableLocaleForCurrentLanguage(config);
        if (!locale || locale == null || locale == "") {
            locale = 'en';
        }
        //get potential CLDR locale by XAF locale
        //var browserLanguage = getCurrentLanguage(config);
        //if (browserLanguage != locale) {
        //    var keys = browserLanguage.split(/[_-]/);
        //    if (keys[0] == locale) {
        //        locale = browserLanguage;
        //    }
        //}

        //get a list of CLDR locales for load
        var availableLocale = getAvailableLocale(availableLocales.modern, locale, cldrGetValueByKey, true);
        var keys = locale.split(/[_-]/);
        if (keys.length > 1) {
            var result = [];

            //Find all CLDR sub available locales
            //start from the end we remove one sub culture and check result
            for (var i = keys.length - 1; i >= 0; i--) {
                var invariantCulture = keys[0];
                for (var x = 1; x <= i; x++) {
                    invariantCulture += "-" + keys[x];
                }
                if (cldrGetValueByKey(availableLocales.modern, invariantCulture)) {
                    result.push(invariantCulture);
                    continue;
                }
                invariantCulture = keys[0];
                for (var x = 1; x <= i; x++) {
                    invariantCulture += "_" + keys[x];
                }
                if (cldrGetValueByKey(availableLocales.modern, invariantCulture)) {
                    result.push(invariantCulture);
                }
            }
            return result.reverse();
        } else {
            return [availableLocale];
        }
    }
    function getCurrentLanguage(config) {
        var locale = localStorage.getItem('CurrentLanguage');
        if (locale == null) {
            var preferredLanguage;
            localStorage.removeItem('CurrentLanguageByServer');
            if (config && config.XafLocalization && config.XafLocalization.ExtraParams && 
                (config.XafLocalization.ExtraParams["PreferredLanguage"] || config.XafLocalization.ExtraParams["PreferredLanguage"] === "")) {
                locale = config.XafLocalization.ExtraParams["PreferredLanguage"];
                localStorage.setItem('CurrentLanguageByServer', locale);
            }

            if (!locale || locale == null) {
                locale = navigator.language || navigator.browserLanguage || window.navigator.languages[0];
            }
        }

        if (locale === 'ru-RU') { locale = 'ru'; };
        if (locale === '') { locale = 'en'; };

        return locale;
    }

    function cldrGetValueByKey(items, key) {
        var result;
        for (var i = 0; i < items.length; i++) {
            if (items[i] === key) {
                result = items[i];
                break;
            }
        }
        return result;
    }
    function xafGetValueByKey(items, key) {
        return items[key];
    }

    function applyXafLocalization(config) {
        var localizationSource = getXafLocalizationDictionaryForCurrentLanguage(config);
        if (localizationSource && localizationSource != null) {
            var regexp = new RegExp(Object.keys(localizationSource).join("|"), "gi");
            propertyVisitor(config, regexp, localizationSource);
        }
    }
    function propertyVisitor(target, regexp, localizationSource) {
        Object.keys(target).forEach(function (name) {
            var value = target[name];
            if (Array.isArray(value) || $.isPlainObject(value)) {
                propertyVisitor(value, regexp, localizationSource);
            }
            else {
                if (typeof value === "string" && value.indexOf("##") > -1) {
                    target[name] = value.replace(regexp, function (matched) {
                        return localizationSource[matched];
                    });
                }
            }
        });
    }
    function applyClientLocalization(appConfig) {
        self.downloadJsonFromModule("cldr-core-base_availableLocales.json").then(function (availableLocalesModel) {
            return getCLDRAvailableLocale(availableLocalesModel.availableLocales, appConfig);
        }).then(function (targetLocales) {
            var supplementalUrls = ["cldr-core-supplemental_likelySubtags.json",
                "cldr-core-supplemental_timeData.json",
                "cldr-core-supplemental_weekData.json",
                "cldr-core-supplemental_currencyData.json",
                "cldr-core-supplemental_numberingSystems.json",
                "cldr-core-supplemental_plurals.json"];

            var langBaseUrls = [];
            for (var i = 0; i < targetLocales.length; i++) {
                langBaseUrls.push("cldr-dates-full_" + targetLocales[i] + "_ca-gregorian.json");
                langBaseUrls.push("cldr-dates-full_" + targetLocales[i] + "_timeZoneNames.json");
                langBaseUrls.push("cldr-numbers-full_" + targetLocales[i] + "_numbers.json");
                langBaseUrls.push("cldr-numbers-full_" + targetLocales[i] + "_currencies.json");
            }

            var urls = langBaseUrls.concat(supplementalUrls);
            loadResources(urls).then(loadCLRDResources).then(function () { return loadDevExtremeLocalization(targetLocales); });
        });
    }
    function loadCLRDResources(items) {
        Globalize.load(items);
    }
    function loadResources(urls) {
        var contents = [];
        var promise = urls.reduce(function (acc, url) {
            return acc ? acc.then(function (content) {
                contents.push(content);
                return self.downloadJsonFromModule(url);
            }) : self.downloadJsonFromModule(url);
        }, null);
        return promise.then(function (content) {
            contents.push(content);
            return contents;
        }, function (reason) {
            return contents;
        });
    }

    this.customLoadLocalization = function (dictionary, targetLocales) { }

    function loadDevExtremeLocalization(targetLocales) {
        var urls = [];
        for (var i = 0; i < targetLocales.length; i++) {
            urls.push("devextreme_" + targetLocales[i] + ".json");
        }
        loadResources(urls).then(
        function (dictionary) {
            devExtremeLocalizationLoaded(dictionary, targetLocales);
        },
        function () {
            devExtremeLocalizationDosNotLoaded(targetLocales);
        });
    }

    function devExtremeLocalizationLoaded(dictionary, targetLocales) {
        globalizeLoadMessages(dictionary);
        Globalize.locale(targetLocales[targetLocales.length - 1]);
        loadCustomLocalization(dictionary, targetLocales);
    }
    function devExtremeLocalizationDosNotLoaded(targetLocales) {
        loadCustomLocalization([], targetLocales);
        Globalize.locale(targetLocales[targetLocales.length - 1]);
    }

    function loadCustomLocalization(dictionary, targetLocales) {
        //For tests
        self.customLoadLocalization(dictionary, targetLocales);

        //var baseURL = window.location.href.slice(0, window.location.href.lastIndexOf('/Static/'));
        var urls = [];
        for (var i = 0; i < targetLocales.length; i++) {
            //urls.push('modules/Localization/' + targetLocales[i] + '.json');
            urls.push(targetLocales[i] + '.json');
        }
        loadResources(urls).then(globalizeLoadMessages, function (reason) { });
    }
    function globalizeLoadMessages(dictionary) {
        for (var i = 0; i < dictionary.length; i++) {
            Globalize.loadMessages(dictionary[i]);
        }
    }

    this.createModule = createModule;
    this.getXafLocalizationDictionaryForCurrentLanguage = getXafLocalizationDictionaryForCurrentLanguage;
    this.getCLDRAvailableLocale = getCLDRAvailableLocale;
}
XafMobileLocalization = new XafMobileLocalizationClientModule();