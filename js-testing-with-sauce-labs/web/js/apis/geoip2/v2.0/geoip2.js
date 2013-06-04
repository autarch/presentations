var geoip2 = (function() {
    'use strict';
    var exports = {};

    function Lookup(successCallback, errorCallback, options, type) {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.timeout = (!options || typeof options.timeout === "undefined") ? 10000 : options.timeout < 2000 ? 2000 : options.timeout;
        this.w3c_geolocation_disabled = options ? options.w3c_geolocation_disabled : false;
        /* We allow this to be set so we can unit test geolocation failures */
        this.geolocation = options && options.hasOwnProperty("geolocation") ? options.geolocation : navigator.geolocation;
        this.type = type;
    }

    Lookup.prototype.returnSuccess = function(location) {
        if (this.successCallback && typeof this.successCallback === "function") {
            this.successCallback(this.fillInObject(this.objectFromJSON(location)));
        }
    };

    Lookup.prototype.returnError = function(error) {
        if (this.errorCallback && typeof this.errorCallback === "function") {
            if (!error) {
                error = {
                    "error": "Unknown error"
                };
            }
            this.errorCallback(error);
        }
    };

    Lookup.prototype.objectFromJSON = function(json) {
        if (typeof window.JSON !== "undefined" && typeof window.JSON.parse === "function") {
            return window.JSON.parse(json);
        }
        else {
            return eval("(" + json + ")");
        }
    };

    var fillIns = {
        "country": [
            ["continent", "Object", "names", "Object"],
            ["country", "Object", "names", "Object"],
            ["registered_country", "Object", "names", "Object"],
            ["represented_country", "Object", "names", "Object"],
            ["traits", "Object"]
        ],
        "city": [
            ["city", "Object", "names", "Object"],
            ["continent", "Object", "names", "Object"],
            ["country", "Object", "names", "Object"],
            ["location", "Object"],
            ["postal", "Object"],
            ["registered_country", "Object", "names", "Object"],
            ["represented_country", "Object", "names", "Object"],
            ["subdivisions", "Array", 0, "Object", "names", "Object"],
            ["traits", "Object"]
        ]
    };
    Lookup.prototype.fillInObject = function(obj) {
        var fill = this.type == "country" ? fillIns.country : fillIns.city;

        for (var i = 0; i < fill.length; i++) {
            var path = fill[i];
            var o = obj;

            for (var j = 0; j < path.length; j += 2) {
                var key = path[j];
                if (!o[key]) {
                    o[key] = path[j + 1] == "Object" ? {} : [];
                }
                o = o[key];
            }
        }

        /* REST API hasn't been updated yet */
        if (typeof obj.continent.continent_code !== "undefined") {
            obj.continent.code = obj.continent.continent_code;
            delete obj.continent.continent_code;
        }

        try {
            Object.defineProperty(
                obj.continent,
                "continent_code", {
                    enumerable: false,
                    get: function() {
                        return this.code;
                    },
                    set: function(value) {
                        this.code = value;
                    }
                });
        }
        catch (e) {
            if (obj.continent.code) {
                obj.continent.continent_code = obj.continent.code;
            }
        }

        return obj;
    };

    Lookup.prototype.geoipLookup = function(http_params) {
        var that = this,
            param,
            request,
            uri = "//" + (HOSTNAME || 'geoip.maxmind.com') + "/geoip/v2.0/" + this.type + "/me?";

        if (this.alreadyRan) {
            return;
        }
        this.alreadyRan = 1;

        if (navigator.appName === 'Microsoft Internet Explorer' && window.XDomainRequest && navigator.appVersion.indexOf("MSIE 1") == -1) {
            request = new XDomainRequest();
            http_params.referrer = document.URL;
            uri = window.location.protocol + uri;
        }
        else {
            request = new window.XMLHttpRequest();
            uri = 'https:' + uri;
        }

        for (param in http_params) {
            if (http_params.hasOwnProperty(param) && http_params[param]) {
                uri += param + "=" + encodeURIComponent(http_params[param]) + "&";
            }
        }
        uri = uri.substring(0, uri.length - 1);

        request.open("GET", uri, true);
        request.onload = function() {
            if (typeof request.status === "undefined" || request.status === 200) {
                that.returnSuccess(request.responseText);
            }
            else {
                var contentType = request.hasOwnProperty("contentType") ? request.contentType : request.getResponseHeader("Content-Type");

                var error;
                if (/json/.test(contentType) && request.responseText.length) {
                    try {
                        error = that.objectFromJSON(request.responseText);
                    }
                    catch (e) {
                        error = {
                            "code": "HTTP_ERROR",
                            "error": "The server returned a " + request.status + " status with an invalid JSON body."
                        };
                    };
                }
                else if (request.responseText.length) {
                    error = {
                        "code": "HTTP_ERROR",
                        "error": "The server returned a " + request.status + " status with the following body: " + request.responseText
                    };
                }
                else {
                    error = {
                        "code": "HTTP_ERROR",
                        "error": "The server returned a " + request.status + " status but either the server did not return a body" + " or this browser is a version of Internet Explorer that hides error bodies."
                    };
                }

                that.returnError(error);
            }
        };
        request.ontimeout = function() {
            that.returnError({
                "code": "HTTP_TIMEOUT",
                "error": "The request to the GeoIP2 web service timed out."
            });
        };
        request.onerror = function() {
            that.returnError({
                "code": "HTTP_ERROR",
                "error": "There was an error making the request to the GeoIP2 web service."
            });
        };
        request.send(null);
    };


    Lookup.prototype.getGeoIPResult = function() {
        var that = this,
            w3c_options = {
                "enableHighAccuracy": true
            };
        w3c_options.timeout = this.timeout - 1000;

        if (this.w3c_geolocation_disabled) {
            that.geoipLookup({
                "geolocation_status": 'DISABLED'
            });
            return;
        }

        if (this.geolocation) {
            // Bypass W3C Geolocation if we hit timeout
            setTimeout(function() {
                that.geoipLookup({
                    "geolocation_status": 'API_TIMEOUT'
                });
            }, this.timeout);

            this.geolocation.getCurrentPosition(

            function(position) {
                that.geoipLookup(position.coords);
            },

            function(error) {
                var error_strs = ['PERMISSION_DENIED', 'POSITION_UNAVAILABLE',
                                           'TIMEOUT'];
                that.geoipLookup({
                    "geolocation_status": error_strs[error.code - 1]
                });
            },
            w3c_options);
        }
        else {
            that.geoipLookup({
                "geolocation_status": 'UNSUPPORTED'
            });
        }

    };

    exports.country = function(successCallback, errorCallback, options) {
        var l = new Lookup(successCallback, errorCallback, options, 'country');
        l.getGeoIPResult();
        return;
    };

    exports.city = function(successCallback, errorCallback, options) {
        var l = new Lookup(successCallback, errorCallback, options, 'city');
        l.getGeoIPResult();
        return;
    };

    exports.cityISPOrg = function(successCallback, errorCallback, options) {
        var l = new Lookup(successCallback, errorCallback, options,
            'city_isp_org');
        l.getGeoIPResult();
        return;
    };

    exports.omni = function(successCallback, errorCallback, options) {
        var l = new Lookup(successCallback, errorCallback, options, 'omni');
        l.getGeoIPResult();
        return;
    };

    return exports;
}());
