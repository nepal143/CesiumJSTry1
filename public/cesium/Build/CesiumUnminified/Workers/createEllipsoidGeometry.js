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
import "./chunk-THDHWSEJ.js";
import "./chunk-BMFWWTD7.js";
import "./chunk-KO232FLP.js";
import "./chunk-CBE4HRBH.js";
import "./chunk-B6IJY6AN.js";
import "./chunk-2ONAV62A.js";
import "./chunk-B34JXFHF.js";
import "./chunk-KRVALCCI.js";
import "./chunk-TOHDFUJM.js";
import "./chunk-AXYZUG4N.js";
import "./chunk-SAKQO5NX.js";
import "./chunk-UBAHTE4Q.js";
import "./chunk-FNCXBBCF.js";
import {
  defined_default
} from "./chunk-OGRXNUR2.js";

// packages/engine/Source/Workers/createEllipsoidGeometry.js
function createEllipsoidGeometry(ellipsoidGeometry, offset) {
  if (defined_default(offset)) {
    ellipsoidGeometry = EllipsoidGeometry_default.unpack(ellipsoidGeometry, offset);
  }
  return EllipsoidGeometry_default.createGeometry(ellipsoidGeometry);
}
var createEllipsoidGeometry_default = createEllipsoidGeometry;
export {
  createEllipsoidGeometry_default as default
};