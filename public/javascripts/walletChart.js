//import {drawChartNoAxisNoLegend, say} from "./chartHelper.js";
var data = [86,783,221,106,450,600,133,221,800,850];

let cryptoApiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

$(document).ready(function() {
    $("[data-chart]").each(function () {
        drawChartNoAxisNoLegend(this, data);
    });

    if ($("#walletHistory") !== null) {
        drawChart($("#walletHistory"), data);
    }

    // $.ajax({
    //     url: cryptoApiUrl,
    //     headers: {
    //         'X-CMC_PRO_API_KEY': '209a4243-3bbb-4aa0-8a16-405e8b353a3f'
    //     },
    //     type: "GET", /* or type:"GET" or type:"PUT" */
    //     dataType: "json",
    //     data: {
    //     },
    //     success: function (result) {
    //         console.log(result);
    //     },
    //     error: function () {
    //         console.log("error");
    //     }
    // });
});

function drawChartNoAxisNoLegend(canvas, data) {
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: data,
            datasets: [
                {
                    data: data,
                    borderColor: getColorOfChart(data),
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
}

function drawChart(canvas, data) {
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: data,
            datasets: [
                {
                    data: data,
                    borderColor: getColorOfChart(data),
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });
}

function getColorOfChart(data) {
    if (data.at(-1) > data.at(-2)) {
        return "#78BD38"
    } else {
        return "#e02817"
    }
}
