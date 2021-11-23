
$(document).ready(function() {
    $('[data-chart]').each(function () {
        let data = getRandomValue();
        drawChartNoAxisNoLegend(this, data);
        setPercentage(data, $("[data-percentage=" + this.dataset.chart + "]"));
    });
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

function setPercentage(data, elem) {
    let percentage = (data.at(-2) / data.at(-1)).toPrecision(2);
    let op;
    if (data.at(-1) > data.at(-2)) {
        $(elem).addClass("received");
        op = "+ ";
    } else {
        $(elem).addClass("sent");
        op = "- ";
    }
    $(elem).html(op + percentage + " %")
}

function getRandomValue() {
    return Array.from({length: 20}, () => Math.floor(Math.random() * 40));
}

function getColorOfChart(data) {
    if (data.at(-1) > data.at(-2)) {
        return "#78BD38"
    } else {
        return "#e02817"
    }
}