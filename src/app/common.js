/**
 * Common
 * --------------------------------------------------------
 *
 * A place to put global helper functions which may be of use
 * across the application.
 *
 */

var Promise = require('bluebird');
var _ = require("lodash");

module.exports = {

    /**
     * AJAX GET request method for JSON data. Resolves with parsed JSON data.
     *
     * @param url {string} - Directory to request JSON data
     * @param params {object} - parameters to pass in request
     * @returns {Promise} - Promise which handles request success or fail
     */
    getJSON: function (url, params) {
        params = params || "";

        if (typeof params === 'object') {
            params = toQueryString(params)
        }

        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest;
            xhr.addEventListener("error", reject);
            xhr.addEventListener("load", function (e) {
                var data = JSON.parse(xhr.response);
                resolve(data);
            });
            xhr.open("GET", url + "?" + params, true);
            xhr.send(null);
        });

        function toQueryString (obj) {
            return _.map(obj,function(v,k){
                return encodeURIComponent(k) + '=' + encodeURIComponent(v);
            }).join('&');
        }
    },

    convertURL: function (url) {
        var REGEX_GIST_URL = /^(https?):\/\/gist\.github\.com\/(.+?)\/([^\/]+)/i;
        var REGEX_RAW_URL  = /^(https?):\/\/(?:gist|raw)\.github(?:usercontent)?\.com\/([^\/]+\/[^\/]+\/[^\/]+|[0-9A-Za-z-]+\/[0-9a-f]+\/raw)\/(.+)/i;
        var REGEX_REPO_URL = /^(https?):\/\/github\.com\/(.+?)\/(.+?)\/(?:(?:blob|raw)\/)?(.+?\/.+)/i;
        var devDomain = "rawgit.com";
        var cdnDomain = "cdn.rawgit.com";
        var value = {};

        if (REGEX_RAW_URL.test(url)) {
            value.dev  = encodeURI(url.replace(REGEX_RAW_URL, '$1://' + devDomain + '/$2/$3'));
            value.prod = encodeURI(url.replace(REGEX_RAW_URL, '$1://' + cdnDomain + '/$2/$3'));
        } else if (REGEX_REPO_URL.test(url)) {
            value.dev  = encodeURI(url.replace(REGEX_REPO_URL, '$1://' + devDomain + '/$2/$3/$4'));
            value.prod = encodeURI(url.replace(REGEX_REPO_URL, '$1://' + cdnDomain + '/$2/$3/$4'));
        } else if (REGEX_GIST_URL.test(url)) {
            value.dev  = encodeURI(url.replace(REGEX_GIST_URL, '$1://' + devDomain + '/$2/$3/raw/'));
            value.prod = encodeURI(url.replace(REGEX_GIST_URL, '$1://' + cdnDomain + '/$2/$3/raw/'));
        } else {
            value = null;
        }

        return value;
    }
};

