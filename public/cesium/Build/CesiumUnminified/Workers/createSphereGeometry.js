/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.125
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  EllipsoidGeometry_default
} from "./chunk-ZWSWJYJP.js";
import "./chunk-EHGQQA7C.js";
import {
  VertexFormat_default
} from "./chunk-THDHWSEJ.js";
import "./chunk-BMFWWTD7.js";
import "./chunk-KO232FLP.js";
import "./chunk-CBE4HRBH.js";
import "./chunk-B6IJY6AN.js";
import "./chunk-2ONAV62A.js";
import "./chunk-B34JXFHF.js";
import {
  Cartesian3_default
} from "./chunk-KRVALCCI.js";
import "./chunk-TOHDFUJM.js";
import "./chunk-AXYZUG4N.js";
import "./chunk-SAKQO5NX.js";
import {
  defaultValue_default
} from "./chunk-UBAHTE4Q.js";
import {
  Check_default
} from "./chunk-FNCXBBCF.js";
import {
  defined_default
} from "./chunk-OGRXNUR2.js";

// packages/engine/Source/Core/SphereGeometry.js
function SphereGeometry(options) {
  const radius = defaultValue_default(options.radius, 1);
  const radii = new Cartesian3_default(radius, radius, radius);
  const ellipsoidOptions = {
    radii,
    stackPartitions: options.stackPartitions,
    slicePartitions: options.slicePartitions,
    vertexFormat: options.vertexFormat
  };
  this._ellipsoidGeometry = new EllipsoidGeometry_default(ellipsoidOptions);
  this._workerName = "createSphereGeometry";
}
SphereGeometry.packedLength = EllipsoidGeometry_default.packedLength;
SphereGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  return EllipsoidGeometry_default.pack(value._ellipsoidGeometry, array, startingIndex);
};
var scratchEllipsoidGeometry = new EllipsoidGeometry_default();
var scratchOptions = {
  radius: void 0,
  radii: new Cartesian3_default(),
  vertexFormat: new VertexFormat_default(),
  stackPartitions: void 0,
  slicePartitions: void 0
};
SphereGeometry.unpack = function(array, startingIndex, result) {
  const ellipsoidGeometry = EllipsoidGeometry_default.unpack(
    array,
    startingIndex,
    scratchEllipsoidGeometry
  );
  scratchOptions.vertexFormat = VertexFormat_default.clone(
    ellipsoidGeometry._vertexFormat,
    scratchOptions.vertexFormat
  );
  scratchOptions.stackPartitions = ellipsoidGeometry._stackPartitions;
  scratchOptions.slicePartitions = ellipsoidGeometry._slicePartitions;
  if (!defined_default(result)) {
    scratchOptions.radius = ellipsoidGeometry._radii.x;
    return new SphereGeometry(scratchOptions);
  }
  Cartesian3_default.clone(ellipsoidGeometry._radii, scratchOptions.radii);
  result._ellipsoidGeometry = new EllipsoidGeometry_default(scratchOptions);
  return result;
};
SphereGeometry.createGeometry = function(sphereGeometry) {
  return EllipsoidGeometry_default.createGeometry(sphereGeometry._ellipsoidGeometry);
};
var SphereGeometry_default = SphereGeometry;

// packages/engine/Source/Workers/createSphereGeometry.js
function createSphereGeometry(sphereGeometry, offset) {
  if (defined_default(offset)) {
    sphereGeometry = SphereGeometry_default.unpack(sphereGeometry, offset);
  }
  return SphereGeometry_default.createGeometry(sphereGeometry);
}
var createSphereGeometry_default = createSphereGeometry;
export {
  createSphereGeometry_default as default
};