(function() {
    var fonts = [
         "Abadi MT Condensed Light",
         "Adobe Fangsong Std",
         "Adobe Hebrew",
         "Adobe Ming Std",
         "Agency FB",
         "Arab",
         "Arabic Typesetting",
         "Arial Black",
         "Batang",
         "Bauhaus 93",
         "Bell MT",
         "Bitstream Vera Serif",
         "Bodoni MT",
         "Bookman Old Style",
         "Braggadocio",
         "Broadway",
         "Calibri",
         "Californian FB",
         "Castellar",
         "Casual",
         "Centaur",
         "Century Gothic",
         "Chalkduster",
         "Colonna MT",
         "Copperplate Gothic Light",
         "DejaVu LGC Sans Mono",
         "Desdemona",
         "DFKai-SB",
         "Dotum",
         "Engravers MT",
         "Eras Bold ITC",
         "Eurostile",
         "FangSong",
         "Forte",
         "Franklin Gothic Heavy",
         "French Script MT",
         "Gabriola",
         "Gigi",
         "Gisha",
         "Goudy Old Style",
         "Gulim",
         "GungSeo",
         "Haettenschweiler",
         "Harrington",
         "Hiragino Sans GB",
         "Impact",
         "Informal Roman",
         "KacstOne",
         "Kino MT",
         "Kozuka Gothic Pr6N",
         "Lohit Gujarati",
         "Loma",
         "Lucida Bright",
         "Lucida Fax",
         "Magneto",
         "Malgun Gothic",
         "Matura MT Script Capitals",
         "Menlo",
         "MingLiU-ExtB",
         "MoolBoran",
         "MS PMincho",
         "MS Reference Sans Serif",
         "News Gothic MT",
         "Niagara Solid",
         "Nyala",
         "Palace Script MT",
         "Papyrus",
         "Perpetua",
         "Playbill",
         "PMingLiU",
         "Rachana",
         "Rockwell",
         "Sawasdee",
         "Script MT Bold",
         "Segoe Print",
         "Showcard Gothic",
         "SimHei",
         "Snap ITC",
         "TlwgMono",
         "Tw Cen MT Condensed Extra Bold",
         "Ubuntu",
         "Umpush",
         "Univers",
         "Utopia",
         "Vladimir Script",
         "Wide Latin"
     ];


    /*!
     * Detector function (v.0.3) from:
     * Author : Lalit Patel
     * Website: http://www.lalit.org/lab/javascript-css-font-detect/
     * License: Apache Software License 2.0
     *          http://www.apache.org/licenses/LICENSE-2.0
     */
    var Detector = function() {
        var baseFonts = ['monospace', 'sans-serif', 'serif'];
        var testString = "mmmmmmmmmmlli";
        var testSize = '72px';
        var h = document.body;

        var s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        var defaultWidth = {};
        var defaultHeight = {};
        for (var index in baseFonts) {
            s.style.fontFamily = baseFonts[index];
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth;
            defaultHeight[baseFonts[index]] = s.offsetHeight;
            h.removeChild(s);
        }

        function detect(font) {
            var detected = false;
            for (var index in baseFonts) {
                s.style.fontFamily = font + ',' + baseFonts[index];
                h.appendChild(s);
                var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
                h.removeChild(s);
                detected = detected || matched;
            }
            return detected;
        }

        this.detect = detect;
    };

    var run_device = function() {
        var JSON = window.JSON || {};

        JSON.stringify = JSON.stringify || function(obj) {
            var t = typeof(obj);

            if (t == "undefined" || obj === null) {
                return "null";
            }
            else if (t == "number" || t == "boolean") {
                return String(obj);
            }
            else if (t == "object" && obj && obj.constructor == Array) {
                var json = [];
                for (var i = 0; i < obj.length; i++) {
                    json.push(JSON.stringify(obj[i]));
                }
                return "[" + String(json) + "]";
            }
            else if (t == "object") {
                var n, json = [];
                for (n in obj) {
                    if (obj.hasOwnProperty(n)) {
                        json.push('"' + n + '":' + JSON.stringify(obj[n]));
                    }
                }
                return "{" + String(json) + "}";
            }
            else {
                // Stringify everything else
                var str = String(obj);
                str = str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
                return '"' + str + '"';
            }
        };

        var date = new Date();

        var device = {
            "screen": {},
            "navigator": {},
            "documentMode": document.documentMode,
            "timezoneOffset": date.getTimezoneOffset(),
            "device_time": date.getTime() / 1000,
            "user_id": maxmind_user_id,
            "document_url": document.URL
        };

        var screenProperties = [
             "availHeight",
             "availWidth",
             "colorDepth",
             "deviceXPI",
             "height",
             "width"
         ];

        for (var i = 0; i < screenProperties.length; i++) {
            var prop = screenProperties[i];

            if (typeof screen[prop] != "undefined") {
                device.screen[prop] = screen[prop];
            }
        }

        var navigatorProperties = [
             "appName",
             "userAgent",
             "language",
             "platform",
             "oscpu",
             "cpuClass",
             "vendor",
             "vendorSub",
             "product",
             "productSub",
             "userLanguage",
             "browserLanguage",
             "systemLanguage"
         ];

        for (var i = 0; i < navigatorProperties.length; i++) {
            var prop = navigatorProperties[i];

            if (typeof navigator[prop] != "undefined") {
                device.navigator[prop] = navigator[prop];
            }
        }

        device.navigator.java = navigator.javaEnabled();
        try {
            device.navigator.taint = navigator.taintEnabled();
        }
        catch (e) {}

        device.fonts = [];

        var font_detector = new Detector();

        for (var i = 0; i < fonts.length; i++) {
            var font = fonts[i];

            if (font_detector.detect(font)) {
                device.fonts.push(font);
            }
        }

        device.plugins = [];

        if (window.ActiveXObject) {
            var plugins = [
                 'AcroPDF.PDF',
                 'Adodb.Stream',
                 'AgControl.AgControl',
                 'DevalVRXCtrl.DevalVRXCtrl.1',
                 'MacromediaFlashPaper.MacromediaFlashPaper',
                 'Msxml2.DOMDocument',
                 'Msxml2.XMLHTTP',
                 'PDF.PdfCtrl',
                 'QuickTime.QuickTime',
                 'QuickTimeCheckObject.QuickTimeCheck.1',
                 'RealPlayer',
                 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                 'rmocx.RealPlayer G2 Control',
                 'Scripting.Dictionary',
                 'Shell.UIHelper',
                 'ShockwaveFlash.ShockwaveFlash',
                 'SWCtl.SWCtl',
                 'TDCCtl.TDCCtl',
                 'WMPlayer.OCX'
             ];

            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];

                try {
                    var obj = new ActiveXObject(plugin);
                    var p = {
                        "name": plugin
                    };
                    try {
                        p.version = obj.GetVariable('$version');
                    }
                    catch (e) {}

                    device.plugins.push(p);
                }
                catch (e) {}
            }
        }
        else {
            for (var i = 0; i < navigator.plugins.length; i++) {
                var plugin = navigator.plugins[i];

                var p = {
                    "name": plugin.name,
                    "filename": plugin.filename.toLowerCase(),
                    "description": plugin.description
                };

                if (typeof plugin.version != "undefined") {
                    p.version = plugin.version;
                }

                p.mimeTypes = [];
                for (var j = 0; j < plugin.length; j++) {
                    var mime = plugin[j];

                    p.mimeTypes.push({
                        "description": mime.description,
                        "mimeType": mime.type
                    });
                }

                device.plugins.push(p);
            }
        }

        var uri = document.location.protocol + "//" + (HOSTNAME ? HOSTNAME : "device.maxmind.com") + "/minfraud/device";

        var stringified = JSON.stringify(device);

        if (navigator.appName == 'Microsoft Internet Explorer' && window.XDomainRequest) {
            var xdr = new XDomainRequest();
            xdr.open("POST", uri);
            xdr.send(stringified);
        }
        else {
            var xhr;
            try {
                xhr = new window.XMLHttpRequest();
            }
            catch (e) {}

            if (!xhr) {
                try {
                    xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {}
            }

            xhr.open("POST", uri, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(stringified);
        }
    };

    var ready = function() {
        if (typeof(document.body) !== "undefined" && document.body) {
            run_device();
        }
        else {
            setTimeout(ready, 500);
        }
    };

    ready();

})();
