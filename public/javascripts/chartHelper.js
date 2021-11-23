export function drawChartNoAxisNoLegend(canvas, data) {
    console.log(canvas);
    console.log(data);
    new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: data,
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

export function say(value) {
    alert(value);
}

function getColorOfChart(data) {
    if (data.at(-1) > data.at(-2)) {
        return "#78BD38"
    } else {
        return "#e02817"
    }
}
