let globalDataArray;

google.charts.load('visualization', {
    'packages' : [ 'geochart' ]
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    redrawRegionsMap("region", false);
}

function redrawRegionsMap(option, isUpdate) {
    let chart = new google.visualization.GeoChart(document
        .getElementById('map_div'));
    if (option === '') {
        option = document
            .querySelector('input[name="mapSelection"]:checked').value;
    }
    if (option === "region") {
        if (isUpdate === false) {
            var dataArray = [ [ 'City' ] ];
        } else {
            var dataArray = globalDataArray;
        }
        var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
            displayMode : 'regions',
            region : 'US',
            legend : "none",
            resolution : 'metros',
            backgroundColor : document.getElementById("background").value,
            datalessRegionColor : document.getElementById("state-region").value,
            defaultColor : document.getElementById("on-click").value
        };

        google.visualization.events
            .addListener(chart, "regionClick",
                function(eventData) {
                    var countryISO2 = eventData["region"];
                    var position = arrayContainsCode(dataArray,
                        countryISO2);
                    if (position == -1) {
                        dataArray.push([ countryISO2 ]);
                    } else {
                        dataArray.splice(position, 1);
                    }
                    data = google.visualization
                        .arrayToDataTable(dataArray);
                    chart.draw(data, options);
                    wait(300);
                });
    } else {
        if (isUpdate == false) {
            var dataArray = [ [ 'State' ] ];
        } else {
            var dataArray = globalDataArray;
        }
        var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
            resolution : 'provinces',
            region : 'US',
            backgroundColor : document.getElementById("background").value,
            datalessRegionColor : document.getElementById("state-region").value,
            defaultColor : document.getElementById("on-click").value
        };

        google.visualization.events
            .addListener(chart, "regionClick",
                function(eventData) {
                    var countryISO2 = eventData["region"];
                    var position = arrayContainsCode(dataArray,
                        countryISO2);
                    if (position == -1) {
                        dataArray.push([ countryISO2 ]);
                    } else {
                        dataArray.splice(position, 1);
                    }
                    data = google.visualization
                        .arrayToDataTable(dataArray);
                    chart.draw(data, options);
                    wait(500);
                });
    }
    globalDataArray = dataArray;
    chart.draw(data, options);
}

function arrayContainsCode(dataArray, code) {
    let i = dataArray.length;
    while (i--) {
        if (dataArray[i] === code) {
            return i;
        }
    }
    return -1;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function printMap() {
    var mapWindow = window.open('', 'PRINT', 'height=400,width=600');
    mapWindow.document.write(document.getElementById('map_div').innerHTML);
    mapWindow.document.close();
    mapWindow.focus();
    mapWindow.print();
    mapWindow.onfocus = function () { setTimeout(function () { mapWindow.close(); }, 500); }
}

function resetColors() {
    document.getElementById("background").value = "#81d4fa";
    document.getElementById("state-region").value = "#FFFFFF";
    document.getElementById("on-click").value = "#228B22";
    redrawRegionsMap('', true);
}

function resetMap() {
    redrawRegionsMap('', false);
}
