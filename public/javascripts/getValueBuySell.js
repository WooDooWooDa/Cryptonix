$(document).ready(function() {
    $('#amountBuy').on('input', function () {
        let coin = this.dataset.coin;
        $.ajax({
            url: "http://10.10.4.37:3000/market/" + coin + "/value?amount=" + $(this).val() + "&from=FIAT",
            type: "GET",
            error: function () {
                console.log("Error");
            }
        }).done(function(data) {
            console.log(data);
            $("#obtainedBuy").html(data.value)
        });
    });
    $('#amountSell').on('input', function () {
        let coin = this.dataset.coin;
        $.ajax({
            //url: "https://api.nomics.com/v1/currencies/ticker?key=42019047560755796b82a1e4b526309c1be84a5e&ids=" + coin,
            url: "http://10.10.4.37:3000/market/FIAT/value?amount=" + $(this).val() + "&from=" + coin,
            type: "GET",
            header: {
                "Access-Control-Allow-Origin": "*"
            },
            error: function () {
                console.log("Error");
            }
        }).done(function(data) {
            console.log(data);
            $("#obtainedSell").html(data.value)
        });
    });
});