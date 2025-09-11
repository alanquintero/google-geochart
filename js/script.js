// Default Map colors
const DEFAULT_MAP_COLORS = {
    BACKGROUND: '#E3F2FD',
    STATE_REGION: '#C8E6C9',
    HIGHLIGHT: '#F57C00'
};

const MapType = {
    REGION: 'region',
    STATE: 'state',

};

// Global variable to store highlighted regions/states
let globalHighlightedAreas = [];

/**
 * Redraws the US map with highlights.
 * @param {string|null} selectedMapType - 'region' or 'state'; if null, use selected radio button.
 * @param {boolean} shouldResetMap - whether to reset all highlights.
 */
function redrawRegionsMap(selectedMapType = null, shouldResetMap = false) {
    const chartContainer = document.getElementById('map_div');
    const chart = new google.visualization.GeoChart(chartContainer);

    // If no option is provided, get the selected radio button
    if (!selectedMapType) {
        selectedMapType = document.querySelector('input[name="mapSelection"]:checked').value;
    }

    const stateRegionColor = document.getElementById("stateRegionColor").value;
    const highlightColor = document.getElementById("highlightColor").value;
    const backgroundColor = document.getElementById("backgroundColor").value;

    // Ensure globalHighlightedAreas is always an array of objects
    if (!Array.isArray(globalHighlightedAreas)) {
        globalHighlightedAreas = [];
    }
    let highlightedAreas = [...globalHighlightedAreas]; // clone for local manipulation

    // Configure map options
    let mapOptions = {
        region: 'US',
        displayMode: 'regions',
        legend: 'none',
        backgroundColor: backgroundColor,
        datalessRegionColor: stateRegionColor,
        defaultColor: highlightColor,
        tooltip: {trigger: 'none'},
    };

    if (selectedMapType === MapType.REGION) {
        mapOptions.resolution = 'metros';
    } else if (selectedMapType === MapType.STATE) {
        mapOptions.resolution = 'provinces';
    }

    // Reset highlighted areas if requested
    if (shouldResetMap) {
        highlightedAreas = [];
    }

    // Helper: convert highlightedAreas to DataTable
    const buildDataTable = () => {
        const dataArray = [[selectedMapType === MapType.REGION ? 'City' : 'State', 'Color']];
        highlightedAreas.forEach(a => dataArray.push([a.region, a.color]));
        return google.visualization.arrayToDataTable(dataArray);
    };

    // Event listener for clicking on regions/states
    google.visualization.events.addListener(chart, 'regionClick', function (eventData) {
        const code = eventData.region;
        const idx = highlightedAreas.findIndex(a => a.region === code);

        if (idx === -1) {
            // When a region/state is clicked, add it to highlighted areas
            highlightedAreas.push({region: code, color: highlightColor});
        } else {
            // If already highlighted, remove it to revert color
            highlightedAreas.splice(idx, 1);
        }

        chart.draw(buildDataTable(), mapOptions);
    });

    // Draw the chart initially
    chart.draw(buildDataTable(), mapOptions);

    // Save back to global state
    globalHighlightedAreas = highlightedAreas;
}

/**
 * Opens the map in a new window and triggers the print dialog.
 * After printing or closing the dialog, the temporary window will close automatically.
 */
function printMap() {
    // Open a new temporary window
    const mapWindow = window.open('', 'PRINT', 'height=600,width=800');

    // Write the map's HTML content into the new window
    mapWindow.document.write(`
        <html lang="en">
            <head>
                <title>Print Map</title>
            </head>
            <body>
                ${document.getElementById('map_div').innerHTML}
            </body>
        </html>
    `);

    // Close the document to finish writing
    mapWindow.document.close();
    mapWindow.focus();

    // Trigger the print dialog
    mapWindow.print();

    // Close the window shortly after the print dialog
    mapWindow.onfocus = function () {
        setTimeout(() => mapWindow.close(), 500);
    };
}

/**
 * Resets all map colors to their default values.
 *
 * Sets the background color, state/region color, and highlight color
 * back to the values defined in DEFAULT_MAP_COLORS, then redraws the map
 * to reflect these default colors.
 */
function resetColors() {
    document.getElementById("backgroundColor").value = DEFAULT_MAP_COLORS.BACKGROUND;
    document.getElementById("stateRegionColor").value = DEFAULT_MAP_COLORS.STATE_REGION;
    document.getElementById("highlightColor").value = DEFAULT_MAP_COLORS.HIGHLIGHT;
    redrawRegionsMap();
}

/**
 * Resets the entire map to its default state.
 *
 * This function calls `redrawRegionsMap` with default parameters,
 * restoring all regions and colors to their initial values.
 */
function resetEntireMap() {
    redrawRegionsMap(null, true);
}

/**
 * Initializes the map when the page loads.
 *
 * Draws the map in "region" mode and resets it to its default state,
 * highlighting no areas initially.
 */
function initMap() {
    redrawRegionsMap(MapType.REGION, true);
}

google.charts.load('visualization', {
    'packages': ['geochart']
});
google.charts.setOnLoadCallback(initMap);

// Assign to color inputs when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backgroundColor').value = DEFAULT_MAP_COLORS.BACKGROUND;
    document.getElementById('stateRegionColor').value = DEFAULT_MAP_COLORS.STATE_REGION;
    document.getElementById('highlightColor').value = DEFAULT_MAP_COLORS.HIGHLIGHT;

    // Draw initial map
    initMap();
});

document.addEventListener('DOMContentLoaded', () => {
    const backgroundColor = document.getElementById('backgroundColor');
    const regionStateColor = document.getElementById('stateRegionColor');
    const highlightColor = document.getElementById('highlightColor');

    // When the user changes the background color, redraw the map
    backgroundColor.addEventListener('input', () => redrawRegionsMap());

    // When the user changes the region/state color, redraw the map
    regionStateColor.addEventListener('input', () => redrawRegionsMap());

    // When the user changes the highlighted region/state color, redraw the map
    highlightColor.addEventListener('input', () => redrawRegionsMap());
});


