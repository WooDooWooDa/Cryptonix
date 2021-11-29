//import {drawChartNoAxisNoLegend, say} from "./chartHelper.js";
var data = [86,783,221,106,450,600,133,221,800,850];

$(document).ready(function() {
    if (window.location.href.endsWith("wallets")) {
        $("[data-chart]").each(function () {
            let coin = this.dataset.chart;
            let canvas = this;
            $.ajax({
                url: "http://10.10.4.37:3000/wallets/" + coin + "/history",
                type: "GET",
                data: {},
                error: function () {
                    console.log("Error loading wallet history chart");
                }
            }).done(function(data) {
                drawChartNoAxisNoLegend(canvas, data);
            });
        });
    } else {
        let coin = $("[data-chart]")[0].dataset.chart;
        $.ajax({
            url: "http://10.10.4.37:3000/wallets/" + coin + "/history",
            type: "GET",
            data: {},
            error: function () {
                console.log("Error loading wallet history chart");
            }
        }).done(function(data) {
            drawChart($("[data-chart]")[0], data);
        });
    }
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
