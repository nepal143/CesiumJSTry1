Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNGViNjNiNi0xY2YzLTRmNTItODE0ZS01MDY4Y2FhNTFiYjgiLCJpZCI6MjY3OTE3LCJpYXQiOjE3MzY0MjQxOTV9.NGSi4KSrtbJOUBy-nzB_2MZx9HghKPWK5Rb5QL2FhS0"; // Replace with your Cesium Ion API key

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1),
  }),
});

let startPosition = null;
let selectedRectangle = null;
let isSelecting = false;

function enableDragSelection() {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  // Start selection (LEFT_DOWN)
  handler.setInputAction((movement) => {
    if (isSelecting) {
      startPosition = movement.position;
      console.log("Selection started at:", startPosition); // Log the start position
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  // Update rectangle while dragging (MOUSE_MOVE)
  handler.setInputAction((movement) => {
    if (isSelecting && startPosition) {
      const endPosition = movement.endPosition;
      console.log("Mouse moved to:", endPosition); // Log mouse movement

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
            rectangle: {
              coordinates: rectangle,
              material: Cesium.Color.YELLOW.withAlpha(0.5),
              outline: true,
              outlineColor: Cesium.Color.YELLOW,
            },
          });
          console.log("Rectangle created:", rectangle); // Log when the rectangle is created
        } else {
          selectedRectangle.rectangle.coordinates = rectangle;
          console.log("Rectangle updated:", rectangle); // Log when the rectangle is updated
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // End selection (LEFT_UP)
  handler.setInputAction(() => {
    if (isSelecting) {
      console.log("Selection ended.");
      startPosition = null; // Reset start position
    }
  }, Cesium.ScreenSpaceEventType.LEFT_UP);
}

// Function to export terrain as OBJ for the provided coordinates and heights
function exportTerrainAsOBJ() {
  if (!selectedRectangle) {
    alert("Please select an area first.");
    return;
  }

  const rectangle = selectedRectangle.rectangle.coordinates.getValue(
    Cesium.JulianDate.now()
  );
  const lonMin = Cesium.Math.toDegrees(rectangle.west);
  const latMin = Cesium.Math.toDegrees(rectangle.south);
  const lonMax = Cesium.Math.toDegrees(rectangle.east);
  const latMax = Cesium.Math.toDegrees(rectangle.north);

  console.log(`Selected area: lonMin: ${lonMin}, latMin: ${latMin}, lonMax: ${lonMax}, latMax: ${latMax}`);

  const gridSizeX = 50; // Try experimenting with smaller or larger grid size
  const gridSizeY = 50;

  // Create the grid of positions
  const positions = [];
  for (let y = 0; y < gridSizeY; y++) {
    for (let x = 0; x < gridSizeX; x++) {
      const lon = lonMin + (lonMax - lonMin) * (x / (gridSizeX - 1));
      const lat = latMin + (latMax - latMin) * (y / (gridSizeY - 1));
      positions.push(Cesium.Cartographic.fromDegrees(lon, lat));
    }
  }

  // Sample terrain heights for each point
  Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions)
    .then((sampledPositions) => {
      const vertices = sampledPositions.map((pos) => ({
        lon: Cesium.Math.toDegrees(pos.longitude),
        lat: Cesium.Math.toDegrees(pos.latitude),
        height: pos.height,
      }));

      // Log sampled terrain heights for debugging
      console.log("Sampled terrain heights:", vertices);

      // Check if terrain heights vary or if they are mostly the same (if they are too uniform, there might be a problem)
      vertices.forEach((v, index) => {
        console.log(`Vertex ${index}: lon=${v.lon}, lat=${v.lat}, height=${v.height}`);
      });

      // Generate the OBJ data
      const objData = generateOBJ(vertices, gridSizeX, gridSizeY);

      // Ensure the OBJ file name is unique by adding a timestamp
      const timestamp = new Date().toISOString();
      downloadFile(`terrain_${timestamp}.obj`, objData);
    })
    .catch((error) => console.error("Error sampling terrain:", error));
}

function generateOBJ(vertices, gridSizeX, gridSizeY) {
  let obj = "g terrain\n"; // Begin group

  // Add vertices to the OBJ file
  vertices.forEach((v) => {
    obj += `v ${v.lon} ${v.height} ${v.lat}\n`; // Add vertex coordinates
  });

  // Generate faces (triangles) based on a grid of vertices
  let faceIndex = 1; // OBJ indexing starts at 1 (not 0)
  for (let row = 0; row < gridSizeY - 1; row++) {
    for (let col = 0; col < gridSizeX - 1; col++) {
      // Get indices of the 4 neighboring vertices
      const i1 = row * gridSizeX + col + 1;
      const i2 = row * gridSizeX + col + 2;
      const i3 = (row + 1) * gridSizeX + col + 1;
      const i4 = (row + 1) * gridSizeX + col + 2;

      // Add faces (two triangles per rectangle)
      obj += `f ${i1} ${i2} ${i3}\n`; // Triangle 1
      obj += `f ${i2} ${i3} ${i4}\n`; // Triangle 2
    }
  }

  return obj;
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

enableDragSelection();

// Keyboard controls for enabling/disabling selection mode and exporting terrain
document.addEventListener("keydown", (event) => {
  console.log(`Key pressed: ${event.key}`); // Log key presses
  if (event.key === "y") {
    isSelecting = !isSelecting;
    console.log(isSelecting ? "Selection mode ON" : "Selection mode OFF"); // Log selection mode toggle
  } else if (event.key === "p") {
    exportTerrainAsOBJ();
  }
});
