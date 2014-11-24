$(document).ready(function () {
    $('#oneModalBtn').click(function () {
        openFirstModal().done(function (val) {
            alert(val);
        });
    });

    $('#twoModalsBtn').click(function () {
        openFirstModal().done(function (val) {
            openSecondModal().done(function (val2) {
                alert(val + " sent from first window, " + val2 + " sent from second window");
            });
        });
    });
});

function myOpenWindowFn(param) {
    var deferred = $.Deferred();

    var hostIframe = "<iframe id=\"" + param.iframeId + "\" src=\"" + param.url + "\" frameborder=\"0\" class=\"iframeClass\"></iframe>";
    var dialogDiv = $("<div id=\"dialog\" title=\"Basic dialog\">" + hostIframe + "</div >").dialog({ modal: true });

    window.addEventListener("message", msgReceived, false);

    function msgReceived(event) {
        if (event && event.data) {
            var dataObject = JSON.parse(event.data);

            if ((dataObject) && (dataObject.iframeId === param.iframeId)) {
                window.removeEventListener("message", msgReceived, false);
                dialogDiv.dialog('close');

                deferred.resolve(dataObject.result); //send response from dialog
            }
        }
    }

    return deferred.promise();
}

function openFirstModal() {
    var popupRes = myOpenWindowFn({ url: 'popup.html', iframeId: 'someIframeId' });

    return popupRes.then(function (value) {
        return ("First value : " + value);
    });
}

function openSecondModal() {
    var popupRes = myOpenWindowFn({ url: "popup2.html", iframeId: 'someIframeId2' });

    return popupRes.then(function (value) {
        return (" , second value : " + value);
    });
}