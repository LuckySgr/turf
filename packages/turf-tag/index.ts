import { Point, FeatureCollection, Polygon, MultiPolygon } from "geojson";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { clone } from "@turf/clone";
import { featureEach } from "@turf/meta";

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and/or {@link MultiPolygon|multipolygons} and performs a spatial join.
 *
 * @function
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon|MultiPolygon>} polygons input (multi)polygons
 * @param {string} field property in `polygons` to add to joined {<Point>} features
 * @param {string} outField property in `points` in which to store joined property from `polygons`
 * @returns {FeatureCollection<Point>} points with `containingPolyId` property containing values from `polyId`
 * @example
 * var pt1 = turf.point([-77, 44]);
 * var pt2 = turf.point([-77, 38]);
 * var poly1 = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]], {pop: 3000});
 * var poly2 = turf.polygon([[
 *   [-81, 35],
 *   [-81, 41],
 *   [-72, 41],
 *   [-72, 35],
 *   [-81, 35]
 * ]], {pop: 1000});
 *
 * var points = turf.featureCollection([pt1, pt2]);
 * var polygons = turf.featureCollection([poly1, poly2]);
 *
 * var tagged = turf.tag(points, polygons, 'pop', 'population');
 *
 * //addToMap
 * var addToMap = [tagged, polygons]
 */
function tag(
  points: FeatureCollection<Point>,
  polygons: FeatureCollection<Polygon | MultiPolygon>,
  field: string,
  outField: string
): FeatureCollection<Point> {
  // prevent mutations
  points = clone(points);
  polygons = clone(polygons);
  featureEach(points, function (pt) {
    if (!pt.properties) pt.properties = {};
    featureEach(polygons, function (poly) {
      if (pt.properties && poly.properties) {
        if (pt.properties[outField] === undefined) {
          if (booleanPointInPolygon(pt, poly))
            pt.properties[outField] = poly.properties[field];
        }
      }
    });
  });
  return points;
}

export { tag };
export default tag;
