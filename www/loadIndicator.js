"use strict";


function _CordovaLoadingIndicator() {
    this.clear = function () {
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
    };
    this.updateLoadingProgress = function () { };
    this.init = function () { };
}

function _BrowserLoadingIndicator() {

    var loadIndicatorDiv = null,
        loadIndicatorProgressDiv = null,
        progress = 0,
        increment = 0;

    this.init = function (count) {
        progress = 0;
        increment = 100 / count;
        loadIndicatorDiv = document.getElementById("xet-load-indicator");
        loadIndicatorProgressDiv = document.getElementById("xet-load-indicator-progress");
        if (loadIndicatorDiv) {
            loadIndicatorDiv.style.display = "block";
        }
    };
    this.clear = function () {
        progress = 0;
        if (loadIndicatorDiv && loadIndicatorProgressDiv) {
            loadIndicatorDiv.style.display = "none";
            loadIndicatorProgressDiv.style.width = "auto";
        }
    };
    this.updateLoadingProgress = function () {
        if (loadIndicatorDiv && loadIndicatorProgressDiv) {
            progress += increment;
            loadIndicatorProgressDiv.style.width = progress * 0.9 + "%";
        }
    };
}

function createLoadingIndicator() {
    return window.cordova ? new _CordovaLoadingIndicator() : new _BrowserLoadingIndicator();
}


window.loadingIndicator = createLoadingIndicator();
loadingIndicator.init(Object.keys(System.bundles).length);
exports.translate = function (load) {
    loadingIndicator.updateLoadingProgress();
    return load.source;
}


