$(document).ready(function() {
    $('#addressBtn').click(function (e) {
        var inp =document.createElement('input');
        document.body.appendChild(inp);
        let addressValue = $('#address').html();
        inp.value = addressValue;
        inp.select();
        document.execCommand('copy',false);
        $('#addressToolTip').html("Copied : " + addressValue.substr(0, 20) + "... to clipboard");
        $('#addressToolTip').show();
        inp.remove();
    });

    $('#addressBtn').mouseout(function (e) {
        $('#addressToolTip').hide();
    })
});