$(document).ready(function () {
    $('#sendInput').click(function () {
        var hostIfrm = window.frameElement;

        if (hostIfrm) {
            var hostIfrmId = hostIfrm.id;

            window.parent.postMessage(JSON.stringify({ result: $('#textInput').val(), iframeId: hostIfrmId }), '*');

            console.log(hostIfrmId);
        }
    });
});