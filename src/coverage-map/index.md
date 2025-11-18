---
layout: layouts/page.html
title: Coverage Map
description: Interactive coverage map showing Austin Mesh network range test results.
eleventyNavigation:
  key: Coverage Map
  parent: Learn
---

<h2>Coverage Map</h2>

<div id="map" style="height: 600px; width: 100%; margin-bottom: 20px;"></div>

<link rel="stylesheet" href="/assets/css/leaflet.css">
<script src="/assets/js/leaflet.js"></script>
<script src="/assets/js/leaflet-heat.js"></script>
<script>
(function() {
    function initMap() {
        var map = L.map('map').setView([30.2672, -97.7431], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        fetch('/assets/data/austin-mesh-rangetests.csv').then(response => response.text()).then(csv => {
            var heatmapData = [];
            var lines = csv.split('\n');
            lines.forEach(function(line, i) {
                if (i != 0) {
                    var columns = line.split(',');
                    if (columns.length >= 1) {
                        var lat = parseFloat(columns[0]);
                        var lng = parseFloat(columns[1]);
                        var intensity = parseFloat(columns[2]);
                        heatmapData.push([lat, lng, intensity]);
                    }
                }
            });
            var heat = L.heatLayer(heatmapData, {
                radius: 25,
                blur: 30,
                max: 200,
                maxZoom: 13,
                minOpacity: .3,
            }).addTo(map);
        }).catch(err => console.error('Error loading the CSV file:', err));
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }
})();
</script>
