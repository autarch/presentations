(

function() {
    var $ = jQuery;

    var GeoIP = (

    function() {
        var G = function(params) {
            this._ipAddress = params.ipAddress;
        };

        G.prototype.lookup = function(on_response, on_error) {
            var path = "/geoip/v2.0/city_isp_org/" + this._ipAddress;
            if (this._ipAddress !== 'me') {
                path += "?demo=1";
            }
            $.get(path)
                .done(on_response)
                .fail(on_error);
        };

        return G;
    })();

    var DemoResultsTable = (

    function() {
        var DRT = function(is_front_page) {
            this._resultsContainer = $("#geoip-demo-form-results");
            this._resultsTbody = $("#geoip-demo-results-tbody");
            this._error = $("#demo-error-modal");

            if (is_front_page) {
                this._resultsContainer.hide();
                this._isFrontPage = true;
            }
        };

        DRT.prototype.hideTable = function() {
            this._resultsContainer.hide();
        };


        DRT.prototype.displayRequestResults = function(ips) {
            if (this._isFrontPage) {
                this._resultsContainer.show();
            }

            this._errored = false;
            this._showSpinner(ips.length);

            for (var i = 0; i < ips.length; i++) {
                var self = this;

                /* How much does Javascript's scoping suck? A lot!
                 * You'd think you could just create the inner function
                 * and have it capture the "i" var but that won't work. */
                var successHandler = (

                function() {
                    var rowNum = i;

                    return function(response) {
                        self._showResults(response, rowNum);
                    };
                })();

                var errorHandler = function(response) {
                    self._handleError(response);
                };

                var geoip = new GeoIP({
                    ipAddress: ips[i]
                });
                geoip.lookup(successHandler, errorHandler);
            }
        };

        DRT.prototype._showSpinner = function(rows) {
            var spinner = this._isFrontPage ? "spinner-front-page.gif" : "spinner.gif";
            this._resultsTbody.html(
                '<tr id="geoip-demo-spinner"><td colspan="15">Loading results ... <img src="/img/' + spinner + '"></td></tr>');

            for (var i = 0; i < rows; i++) {
                var tr = '<tr style="display:none;"><td></td></tr>';
                this._resultsTbody.append(tr);
            }
        };

        /*
           FIXME - we need to clean out the old, invalid key names once the DB
           is updated
         */
        var ResultKeys = [
                    [['traits', 'ip_address']],
                    [['country', 'iso_code']],
                    [['city', 'names', 'en'],
                     ['subdivisions', 0, 'names', 'en'],
                     ['region', 'names', 'en'],
                     ['country', 'names', 'en'],
                     ['continent', 'names', 'en']],
                    [['postal', 'code'],
                     ['location', 'postal_code']],
                    [['location', 'latitude'], ['location', 'longitude']],
                    [['traits', 'isp']],
                    [['traits', 'organization']],
                    [['traits', 'domain']],
                    [['location', 'metro_code']]
                ];

        var getLanguageFromPath = function() {
            var matches = document.location.pathname.match(/^\/([\w\-]+)\//);
            if (!matches[1]) {
                return "en";
            }
            if (matches[1] == "zh") {
                return "zh-CN";
            }
            else if (matches[1] == "pt") {
                return "pt-BR";
            }
            else {
                return matches[1];
            }
        };

        DRT.prototype._showResults = function(geoip_result, row) {
            var html = "<tr>";
            if (typeof geoip_result.traits.is_anonymous_proxy !== "undefined" && geoip_result.traits.is_anonymous_proxy) {
                html = html + '<td>' + geoip_result.traits.ip_address + '</td>' + '<td colspan="8">Anonymous Proxy</td>';
            }
            else {
                // XXX - temporarily disabling localized demo
                var lang = 'en'; //getLanguageFromPath();

                for (var i = 0; i < ResultKeys.length; i++) {
                    var cellValues = $.map(
                    ResultKeys[i],

                    function(keys) {
                        var k = geoip_result;
                        for (var j = 0; j < keys.length; j++) {
                            if (!k) {
                                break;
                            }
                            if (keys[j] == 'en') {
                                k = k[lang] ? k[lang] : k['en'];
                            }
                            else {
                                k = k[keys[j]];
                            }
                        }
                        return k;
                    });

                    cellValues = $.grep(
                    cellValues,

                    function(val) {
                        return typeof val != "undefined" && (typeof val != "String" || val.length);
                    });

                    html = html + "<td>" + cellValues.join(", ") + "</td>";
                }
            }
            html = html + "</tr>";

            this._clearSpinner();

            var child = row + 1;
            $('#geoip-demo-results-tbody > tr:nth-child(' + child + ')').replaceWith(html).show();
        };

        DRT.prototype._handleError = function(response) { /* If there are multiple requests pending, we only want to show the first error we get. */
            if (this._errored) {
                return;
            }

            this._errored = true;

            if (this._isFrontPage) {
                this.hideTable();
            }

            var result = $.parseJSON(response.responseText);
            var message = result.error;
            if (!message) {
                message = "There was an error when processing your request.";
            }

            this._clearSpinner();

            this.displayError(message);
        };

        DRT.prototype._clearSpinner = function() {
            $("#geoip-demo-spinner").detach();
        };

        DRT.prototype.displayError = function(message) {
            $("#error-body").html("<p>" + message + "</p>");
            this._error.modal("show");
        };

        return DRT;
    })();

    var DemoForm = (

    function() {
        var DF = function() {
            this._form = $(".geoip-demo-form");
            this._results = new DemoResultsTable(true);
            this._results.hideTable();
        };

        DF.prototype.instrumentForm = function() {
            if (!this._form.length) {
                return;
            }

            var self = this;
            this._form.submit(

            function() {
                self.submit();
                return false;
            });
        };

        DF.prototype.submit = function() {
            var raw = $("#addresses").val();
            if (!(raw && raw.length)) {
                this._results.displayError("You must provide an IP address to look up.");
                return;
            }

            var ips = this._parseAddresses(raw);
            if (!ips) {
                this._results.displayError("You must provide an IP address to look up.");
                return;
            }

            this._results.displayRequestResults(ips);
        };

        var IPRegex = /([\w.:]+)/g;
        DF.prototype._parseAddresses = function(raw) {
            return raw.match(IPRegex);
        };

        return DF;
    })();

    var LocateMyIP = (

    function() {
        var LMI = function() {
            this._results = new DemoResultsTable();
        };

        LMI.prototype.showResults = function() {
            this._results.displayRequestResults(['me']);
        };

        return LMI;
    })();


    function corrections_page() {
        // For corrections page
        $('#redisplay-correction-question-1').hide();

        $('#location-correction').hide();
        $('#location-correction-button').click(function() {
            $('#correction-question-1').hide();
            $('#redisplay-correction-question-1').show();
            $('#location-correction').show();

        });
        $('#isp-org-correction').hide();
        $('#isp-org-correction-button').click(function() {
            $('#correction-question-1').hide();
            $('#redisplay-correction-question-1').show();
            $('#isp-org-correction').show();

        });

        $('#redisplay-correction-question-1').click(function() {
            $('#isp-org-correction').hide();
            $('#location-correction').hide();
            $('#redisplay-correction-question-1').hide();
            $('#correction-question-1').show();
            $('#correction-question-1 input:radio').attr('checked', false);
        });
    }


    $(document).ready(

    function() { /* We only want to hide this form on the front page */
        $("#demo-form-results.slide").hide();

        /* Firefox 15 has a bug where it does not show the caret in an input
         *  when the input defines a placeholder. See
         *  https://bugzilla.mozilla.org/show_bug.cgi?id=769405. It doesn't
         *  look like this will be fixed in 16 either, but I'll be optimistic
         *  and assume it'll be fixed in 17. */
        if ($.browser.mozilla && /^1[56]/.test($.browser.version)) {
            $('input[type="text"]').focus(

            function() {
                $(this).data("placeholder", $(this).attr("placeholder"));
                $(this).removeAttr("placeholder");
            }).blur(

            function() {
                $(this).attr("placeholder", $(this).data("placeholder"));
            });
        }

        $('.forgot-pass').click(

        function() {
            $('.lightbox').show();
        });

        $('.password-reset').click(

        function() {
            $('.lightbox').hide();
        });

        $('#billing-term-form-submit-button').on('click', function(e) {
            $('#selected-billing-term').html($('input:radio[name=term]:checked').val());
        });

        $('#billing-term-modal-confirm-button').on('click', function(e) {
            $('#billing-term-form').submit();
        });

        $('#sidebar-toggle-switch').click(function() {

            var toggle_text = ($('#sidebar-container').css('display') == 'none') ? 'Hide' : 'Show';

            $('#sidebar-container').toggle();
            $('#sidebar-chevron').toggleClass('icon-chevron-right icon-chevron-down');
            $('#content-container').toggleClass('span9 span12');
            $('#sidebar-action').html(toggle_text);
        });

        $('#sidebar-toggle-switch').click();


        if (/correction(?:_send)?$/.test(window.location.pathname)) {
            corrections_page();
        }

        $('.datepicker').datepicker();

        $('.dropdown-menu form').click(function(e) {
            e.stopPropagation();
        });

        (new DemoForm).instrumentForm();
        if ($('#my-ip-demo').length) {
            (new LocateMyIP).showResults();
        }
    });
})();
