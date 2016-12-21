/* phantomjs pdf.js http://google.com/ test.pdf 1120px*800px */

var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    console.log('  image (png/jpg output) examples: "1920px" entire page, window width 1920px');
    console.log('                                   "800px*600px" window, clipped to 800x600');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    page.viewportSize = { width: 600, height: 600 };
    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'landscape', margin: '0.1cm' };
    } else if (system.args.length > 3 && system.args[3].substr(-2) === "px") {
        size = system.args[3].split('*');
        if (size.length === 2) {
            pageWidth = parseInt(size[0], 10);
            pageHeight = parseInt(size[1], 10);
            page.viewportSize = { width: pageWidth, height: pageHeight };
            page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
        } else {
            console.log("size:", system.args[3]);
            pageWidth = parseInt(system.args[3], 10);
            pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any
            console.log ("pageHeight:",pageHeight);
            page.viewportSize = { width: pageWidth, height: pageHeight };
        }
    }
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }

    page.settings.resourceTimeout = 1000 * 30;

    var requested = [];
    var received = [];

    page.onResourceRequested = function(requestData, networkRequest) {
        requested.push(requestData.id);
        //console.log('new request:', requestData.id);
    };

    page.onResourceReceived = function(response) {
        if (response.stage === 'end') {
            received.push(response.id);
        }

        //console.log('new response: stage ' + response.stage, response.id);
    };

    page.onResourceTimeout = function(response) {
        received.push(response.id);
        console.log('Timeout Response (#' + request.id + '): ' + JSON.stringify(request));
    };

    page.onResourceError = function(resourceError) {
        received.push(resourceError.id);
        console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
        console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!:', address);
            phantom.exit(1);
        } else {
            window.setInterval(function () {
                console.log('interval: req ' + requested.length + ', resp ' + received.length);
                if (requested.length === received.length) {
                    page.render(output);
                    phantom.exit();
                }
            }, 200);

            // if too much time has passed, just give up and return whatever we've got
            window.setTimeout(function () {
                page.render(output);
                phantom.exit(0);
            }, 1000 * 60 * 3);
        }
    });
}
