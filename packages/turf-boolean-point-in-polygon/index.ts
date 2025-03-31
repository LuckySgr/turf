import pip from "point-in-polygon-hao";
import {
  BBox,
  Feature,
  MultiPolygon,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import { Coord } from "@turf/helpers";
import { getCoord, getGeom } from "@turf/invariant";

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
/**
 * 判断点是否在多边形内
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point
 * resides inside the polygon. The polygon can be convex or concave. The function accounts for holes.
 *
 * @function
 * @param {Coord} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreBoundary=false] True if polygon boundary should be ignored when determining if
 * the point is inside the polygon otherwise false. 是否需要忽略多边形边界
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.booleanPointInPolygon(pt, poly);
 * //= true
 */
function booleanPointInPolygon<
  G extends Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  point: Coord,
  polygon: Feature<G, P> | G,
  options: {
    ignoreBoundary?: boolean;
  } = {}
) {
  // validation
  if (!point) {
    throw new Error("point is required");
  }
  if (!polygon) {
    throw new Error("polygon is required");
  }

  const pt = getCoord(point); // 点坐标
  const geom = getGeom(polygon); // 从 GeoJSON 中获取 Geometry
  const type = geom.type; // 从 Geometry 中获取几何体类型
  const bbox = polygon.bbox; // 获取面的包围盒
  let polys: any[] = geom.coordinates; // 从 Geometry 中获取坐标

  // 如果点不在 bbox 内，则快速判断其不在多边形内
  if (bbox && !inBBox(pt, bbox)) {
    return false;
  }

  if (type === "Polygon") {
    polys = [polys];
  }
  let result = false;
  for (var i = 0; i < polys.length; ++i) {
    const polyResult = pip(pt, polys[i]);
    if (polyResult === 0) return !options.ignoreBoundary;
    else if (polyResult) result = true;
  }

  return result;
}

/**
 * 判断点是不是在包围盒内部
 * inBBox
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt: number[], bbox: BBox) {
  return (
    bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]
  );
}

export { booleanPointInPolygon };
export default booleanPointInPolygon;
