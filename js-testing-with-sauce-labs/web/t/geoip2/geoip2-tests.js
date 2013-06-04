(function() {
    window.HOSTNAME = 'example.com';

    var isOldIE = navigator.appName === 'Microsoft Internet Explorer' && window.XDomainRequest && navigator.appVersion.indexOf("MSIE 1") == -1;

    var isIE8 = navigator.appName === 'Microsoft Internet Explorer' && window.XDomainRequest && navigator.appVersion.indexOf("MSIE 8") !== -1;

    var responses = {
        country: {}
    };
    responses.country["173.11.48.49"] = {
        "country": {
            "iso_code": "US",
            "names": {
                "zh-CN": "美国",
                "en": "United States",
                "ja": "アメリカ合衆国",
                "ru": "США"
            },
            "geoname_id": 6252001
        },
        "continent": {
            "names": {
                "zh-CN": "北美洲",
                "en": "North America",
                "ja": "北アメリカ",
                "ru": "Северная Америка"
            },
            "code": "NA",
            "geoname_id": 6255149
        },
        "registered_country": {
            "iso_code": "US",
            "names": {
                "zh-CN": "美国",
                "en": "United States",
                "ja": "アメリカ合衆国",
                "ru": "США"
            },
            "geoname_id": 6252001
        },
        "represented_country": {
            "names": {}
        },
        "traits": {
            "ip_address": "173.11.48.49"
        }
    };

    responses.country["1.2.3.4"] = {
        "country": {
            "iso_code": "US",
            "geoname_id": 6252001
        },
        "continent": {
            "names": {
                "en": "North America"
            },
            "code": "NA",
            "geoname_id": 6255149
        },
        "traits": {
            "ip_address": "173.11.48.49"
        }
    };

    responses.country["1.2.3.5"] = {
        "country": {
            "iso_code": "US",
            "geoname_id": 6252001
        },
        "continent": {
            "names": {
                "en": "North America"
            },
            "continent_code": "NA",
            "geoname_id": 6255149
        },
        "traits": {
            "ip_address": "173.11.48.49"
        }
    };

    if (isIE8) {
        for (var ip in responses.country) {
            if (responses.country.hasOwnProperty(ip)) {
                var continent = responses.country[ip].continent;
                if (continent && continent.code) {
                    continent.continent_code = continent.code;
                }
            }
        }
    }

    var clone = function(object) {
        /* This is a fast way to clone an object */
        return JSON.parse(JSON.stringify(object));
    };

    /* This is what the Selenium-using code will look at. */
    document.results = {
        assertions: [],
        done: false
    };

    QUnit.log(

    function(result) {
        document.results.assertions.push(result);
    });

    QUnit.done(

    function(results) {
        document.results.done = true;
    });

    test(
        "basics",

    function() {
        strictEqual(typeof geoip2, "object", "typeof geoip2");

        var endpoints = ["country", "city", "cityISPOrg", "omni"];
        for (var i = 0; i < endpoints.length; i++) {
            var endpoint = endpoints[i];
            strictEqual(
            typeof geoip2[endpoint],
                "function",
                "geoip2 object has public " + endpoint + " method");
        };
    });

    var testSuccessfulResponse = function(endpoint, mockResponse, expect, message) {
        var server = new MockHttpServer();
        server.handle = function(request) {
            request.setResponseHeader(
                "Content-Type",
                "application/vnd.maxmind.com-" + endpoint + "+json; charset=UTF-8; version=2.0");

            request.receive(200, JSON.stringify(mockResponse));
        };

        var success = function(response) {
            deepEqual(response, expect, message + " - response as seen by success callback");
            equal(response.continent.code, response.continent.continent_code, "continent.code == continent.continent_code");
            server.stop();
            start();
        };

        var error = function(error) {
            equal(error, undefined, message + " - error callback was not called");
            server.stop();
            start();
        };
        server.start();
        geoip2[endpoint](success, error, {
            timeout: 2000
        });
    };

    /* Each invocation of the geoip2 API needs to be done in a separate asyncTest block */
    asyncTest(
        "successful response",
    2,

    function() {
        testSuccessfulResponse(
            "country",
        responses.country["173.11.48.49"],
        responses.country["173.11.48.49"],
            "country() with successful response");
    });

    asyncTest(
        "successful empty country response",
    2,

    function() {
        testSuccessfulResponse(
            "country", {}, {
            continent: {
                names: {}
            },
            country: {
                names: {}
            },
            registered_country: {
                names: {}
            },
            represented_country: {
                names: {}
            },
            traits: {}
        },
            "country() with empty response is filled in");
    });


    asyncTest(
        "successful empty city response",
    2,

    function() {
        testSuccessfulResponse(
            "city", {}, {
            city: {
                names: {}
            },
            continent: {
                names: {}
            },
            country: {
                names: {}
            },
            location: {},
            postal: {},
            registered_country: {
                names: {}
            },
            represented_country: {
                names: {}
            },
            subdivisions: [{
                names: {}
            }],
            traits: {}
        },
            "city() with empty response is filled in");
    });

    asyncTest(
        "successful country response with partial fill-in",
    2,

    function() {
        var expect = clone(responses.country["1.2.3.4"]);
        expect.country.names = {};
        expect.registered_country = {
            names: {}
        };
        expect.represented_country = {
            names: {}
        };

        testSuccessfulResponse(
            "country",
        responses.country["1.2.3.4"],
        expect,
            "country() response is filled in where needed");
    });

    asyncTest(
        "successful country response with partial fillin - continent.continent_code in response object",
    2,

    function() {
        var expect = clone(responses.country["1.2.3.4"]);
        expect.country.names = {};
        expect.registered_country = {
            names: {}
        };
        expect.represented_country = {
            names: {}
        };

        testSuccessfulResponse(
            "country",
        responses.country["1.2.3.5"],
        expect,
            "country() response is filled in where needed");
    });

    var testRequest = function(testCallback, options) {
        var server = new MockHttpServer();
        server.handle = function(request) {
            testCallback(request);

            request.setResponseHeader(
                "Content-Type",
                "application/vnd.maxmind.com-country+json; charset=UTF-8; version=2.0");

            request.receive(200, JSON.stringify({}));
        };

        var success = function(response) {
            ok(1, "got a successful response");
            server.stop();
            start();
        };

        var error = function(error) {
            ok(0, "got a successful response");
            server.stop();
            start();
        };

        server.start();

        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.timeout === "undefined") {
            options.timeout = 2000;
        }

        geoip2.country(success, error, options);
    };

    var testUrlParts = function(request, expect, message) {
        if (isOldIE) {
            expect.referrer = encodeURIComponent(document.URL);
        }

        deepEqual(
        request.urlParts.queryKey,
        expect,
        message);
    };


    asyncTest(
        "disable geolocation",
    2,

    function() {
        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "DISABLED"
            },
                "disabling geolocation sets appropriate query param");
        }, {
            w3c_geolocation_disabled: true
        });
    });

    asyncTest(
        "permission denied",
    2,

    function() {
        var geolocation = {
            getCurrentPosition: function(success, error) {
                error({
                    code: 1
                });
            }
        };

        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "PERMISSION_DENIED"
            },
                "geolocation_status is PERMISSION_DENIED");
        }, {
            geolocation: geolocation
        });
    });

    asyncTest(
        "position unavailable",
    2,

    function() {
        var geolocation = {
            getCurrentPosition: function(success, error) {
                error({
                    code: 2
                });
            }
        };

        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "POSITION_UNAVAILABLE"
            },
                "geolocation_status is POSITION_UNAVAILABLE");
        }, {
            geolocation: geolocation
        });
    });

    asyncTest(
        "geolocation timeout",
    2,

    function() {
        var geolocation = {
            getCurrentPosition: function(success, error) {
                error({
                    code: 3
                });
            }
        };

        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "TIMEOUT"
            },
                "geolocation_status is TIMEOUT");
        }, {
            geolocation: geolocation
        });
    });


    asyncTest(
        "geolocation not supported",
    2,

    function() {
        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "UNSUPPORTED"
            },
                "geolocation_status is UNSUPPORTED");
        }, {
            geolocation: undefined
        });
    });


    asyncTest(
        "user permission timeout",
    2,

    function() {
        var geolocation = {
            getCurrentPosition: function(success, error) {
                setTimeout(function() {
                    error({
                        code: 1
                    });
                }, 3000);
            }
        };

        testRequest(

        function(request) {
            testUrlParts(
            request, {
                geolocation_status: "API_TIMEOUT"
            },
                "geolocation_status is API_TIMEOUT");
        }, {
            geolocation: geolocation,
            timeout: 2000
        });
    });

    var testError = function(handler, expect, options) {
        var server = new MockHttpServer();
        server.handle = handler;

        var success = function(response) {
            ok(0, "got an error response");
            server.stop();
            start();
        };

        var error = function(error) {
            ok(1, "got an error response");
            deepEqual(error, expect, "error contains expected values");
            server.stop();
            start();
        };

        server.start();

        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.timeout === "undefined") {
            options.timeout = 2000;
        }

        geoip2.country(success, error, options);
    };

    asyncTest(
        "server timeout",
    2,

    function() {
        testError(

        function(request) {
            request.ontimeout();
        }, {
            "code": "HTTP_TIMEOUT",
            "error": "The request to the GeoIP2 web service timed out."
        }, {
            timeout: 2000
        });
    });

    asyncTest(
        "server returns 404",
    2,

    function() {
        var error = {
            code: "IP_ADDRESS_NOT_FOUND",
            error: "The supplied IP address is not in the database."
        };

        testError(

        function(request) {
            request.setResponseHeader(
                "Content-Type",
                "application/vnd.maxmind.com-error+json; charset=UTF-8; version=2.0");

            request.receive(404, JSON.stringify(error));
        },
        error);
    });

    asyncTest(
        "server returns 500",
    2,

    function() {
        testError(

        function(request) {
            request.onerror();
        }, {
            "code": "HTTP_ERROR",
            "error": "There was an error making the request to the GeoIP2 web service."
        });
    });

    /* Old IE using XDomainRequest wipes out the error body */
    asyncTest(
        "blank error body",
    2,

    function() {
        testError(

        function(request) {
            request.setResponseHeader(
                "Content-Type",
                "application/vnd.maxmind.com-error+json; charset=UTF-8; version=2.0");

            request.receive(404, "");
        }, {
            "code": "HTTP_ERROR",
            "error": "The server returned a 404 status but either the server did not return a body or this browser is a version of Internet Explorer that hides error bodies."
        });
    });

    asyncTest(
        "invalid JSON error body",
    2,

    function() {
        testError(

        function(request) {
            request.setResponseHeader(
                "Content-Type",
                "application/vnd.maxmind.com-error+json; charset=UTF-8; version=2.0");

            request.receive(404, "{ invalid: ");
        }, {
            "code": "HTTP_ERROR",
            "error": "The server returned a 404 status with an invalid JSON body."
        });
    });

    asyncTest(
        "non-JSON error body",
    2,

    function() {
        testError(

        function(request) {
            request.setResponseHeader(
                "Content-Type",
                "text/plain");

            request.receive(406, "I don't like your Charset, young man");
        }, {
            "code": "HTTP_ERROR",
            "error": "The server returned a 406 status with the following body: I don't like your Charset, young man"
        });
    });

    asyncTest(
        "request protocol",
    2,

    function() {
        if (isOldIE) {
            testRequest(

            function(request) {
                /* old IE has a colon at the end of the protocol, e.g. "http:" */
                equal(request.urlParts.protocol,
                document.location.protocol.replace(/:$/, ""),
                    "request protocol matches source document protocol with IE < 10");
            });
        }
        else {
            testRequest(

            function(request) {
                equal(request.urlParts.protocol,
                    "https",
                    "request protocol is https for modern browsers");
            });
        }
    });
})();
