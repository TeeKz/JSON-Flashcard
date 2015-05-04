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
            xhr.open("GET", url + "?" + params);
            xhr.send(null);
        });

        function toQueryString (obj) {
            return _.map(obj,function(v,k){
                return encodeURIComponent(k) + '=' + encodeURIComponent(v);
            }).join('&');
        }
    }
};

