let startPosition = null;
let selectedRectangle = null;
let isSelecting = false; // Flag to track if selection mode is active

function enableDragSelection(viewer) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Mouse down to start the selection
    handler.setInputAction((movement) => {
        if (isSelecting && !startPosition) {
            startPosition = movement.position;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // Mouse move to update the selection rectangle
    handler.setInputAction((movement) => {
        if (isSelecting && startPosition) {
            const endPosition = movement.endPosition;
            const startCartesian = viewer.camera.pickEllipsoid(startPosition);
            const endCartesian = viewer.camera.pickEllipsoid(endPosition);

            if (startCartesian && endCartesian) {
                const startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
                const endCartographic = Cesium.Cartographic.fromCartesian(endCartesian);

                const rectangle = Cesium.Rectangle.fromCartographicArray([
                    startCartographic,
                    endCartographic,
                ]);

                if (!selectedRectangle) {
                    selectedRectangle = viewer.entities.add({
                        name: 'Selection Rectangle',
                        rectangle: {
                            coordinates: rectangle,
                            material: Cesium.Color.YELLOW.withAlpha(0.5),
                            outline: true,
                            outlineColor: Cesium.Color.YELLOW,
                        },
                    });
                } else {
                    selectedRectangle.rectangle.coordinates = rectangle;
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Mouse up to finalize the selection
    handler.setInputAction(() => {
        if (isSelecting) {
            startPosition = null; // Reset start position
        }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
}

function saveSelection(viewer) {
    if (selectedRectangle) {
        const rect = selectedRectangle.rectangle.coordinates.getValue(Cesium.JulianDate.now());
        const lonMin = Cesium.Math.toDegrees(rect.west);
        const latMin = Cesium.Math.toDegrees(rect.south);
        const lonMax = Cesium.Math.toDegrees(rect.east);
        const latMax = Cesium.Math.toDegrees(rect.north);

        // Sample terrain for detailed heights
        const terrainProvider = viewer.terrainProvider;
        const positions = [
            Cesium.Cartographic.fromDegrees(lonMin, latMin),
            Cesium.Cartographic.fromDegrees(lonMin, latMax),
            Cesium.Cartographic.fromDegrees(lonMax, latMin),
            Cesium.Cartographic.fromDegrees(lonMax, latMax),
        ];

        Cesium.sampleTerrainMostDetailed(terrainProvider, positions)
            .then((updatedPositions) => {
                const heights = updatedPositions.map((p) => p.height);

                const data = {
                    lonMin,
                    latMin,
                    lonMax,
                    latMax,
                    heights,
                    timestamp: new Date().toISOString(),
                };

                const dataStr = JSON.stringify(data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'selected_area.json';
                link.click();

                console.log('Selected area saved:', data);
            })
            .catch((error) => {
                console.error('Error sampling terrain:', error);
            });
    }
}

fetch('/cesium-token')
    .then((response) => response.json())
    .then((data) => {
        if (data.token) {
            Cesium.Ion.defaultAccessToken = data.token;

            const viewer = new Cesium.Viewer('cesiumContainer', {
                terrainProvider: new Cesium.CesiumTerrainProvider({
                    url: Cesium.IonResource.fromAssetId(1),
                }),
            });

            enableDragSelection(viewer);

            // Toggle selection mode with the Y key
            document.addEventListener('keydown', (event) => {
                if (event.key === 'y') {
                    isSelecting = !isSelecting;

                    if (!isSelecting) {
                        console.log('Selection finalized. Saving the selected area.');
                        saveSelection(viewer);
                    } else {
                        console.log('Selection mode activated. Click and drag to select an area.');
                    }
                }
            });
        } else {
            console.error('Error: Token not found in response.');
        }
    })
    .catch((error) => {
        console.error('Error fetching Cesium Ion API token:', error);
    });
