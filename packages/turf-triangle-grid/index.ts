import {
  BBox,
  Feature,
  Polygon,
  FeatureCollection,
  GeoJsonProperties,
} from "geojson";
import { distance } from "@turf/distance";
import { intersect } from "@turf/intersect";
import { polygon, featureCollection, Units } from "@turf/helpers";

/**
 * Creates a grid of triangular polygons.
 *
 * @function
 * @param {BBox} bbox extent of grid in [minX, minY, maxX, maxY] order
 * @param {number} cellSide dimension of each grid cell.  Two triangles are created in each cell.
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] used in calculating cellSide.  Supports all valid Turf {@link https://github.com/Turfjs/turf/blob/master/packages/turf-helpers/README_UNITS.md Units}
 * @param {Feature<Polygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var triangleGrid = turf.triangleGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [triangleGrid];
 */
function triangleGrid<P extends GeoJsonProperties = GeoJsonProperties>(
  bbox: BBox,
  cellSide: number,
  options: {
    units?: Units;
    properties?: P;
    mask?: Feature<Polygon>;
  } = {}
): FeatureCollection<Polygon, P> {
  // Containers
  var results: Feature<Polygon, P>[] = [];

  // Input Validation is being handled by Typescript

  // if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
  // if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
  // if (!bbox) throw new Error('bbox is required');
  // if (!Array.isArray(bbox)) throw new Error('bbox must be array');
  // if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
  // if (mask && ['Polygon', 'MultiPolygon'].indexOf(getType(mask)) === -1) throw new Error('options.mask must be a (Multi)Polygon');

  // Main
  var xFraction =
    cellSide / distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], options);
  var cellWidth = xFraction * (bbox[2] - bbox[0]);
  var yFraction =
    cellSide / distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], options);
  var cellHeight = yFraction * (bbox[3] - bbox[1]);

  var xi = 0;
  var currentX = bbox[0];
  while (currentX <= bbox[2]) {
    var yi = 0;
    var currentY = bbox[1];
    while (currentY <= bbox[3]) {
      var cellTriangle1 = null;
      var cellTriangle2 = null;

      if (xi % 2 === 0 && yi % 2 === 0) {
        cellTriangle1 = polygon(
          [
            [
              [currentX, currentY],
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
        cellTriangle2 = polygon(
          [
            [
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY + cellHeight],
            ],
          ],
          options.properties
        );
      } else if (xi % 2 === 0 && yi % 2 === 1) {
        cellTriangle1 = polygon(
          [
            [
              [currentX, currentY],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
        cellTriangle2 = polygon(
          [
            [
              [currentX, currentY],
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
      } else if (yi % 2 === 0 && xi % 2 === 1) {
        cellTriangle1 = polygon(
          [
            [
              [currentX, currentY],
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
        cellTriangle2 = polygon(
          [
            [
              [currentX, currentY],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
      } else if (yi % 2 === 1 && xi % 2 === 1) {
        cellTriangle1 = polygon(
          [
            [
              [currentX, currentY],
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY],
            ],
          ],
          options.properties
        );
        cellTriangle2 = polygon(
          [
            [
              [currentX, currentY + cellHeight],
              [currentX + cellWidth, currentY + cellHeight],
              [currentX + cellWidth, currentY],
              [currentX, currentY + cellHeight],
            ],
          ],
          options.properties
        );
      }
      if (options.mask) {
        if (intersect(featureCollection([options.mask, cellTriangle1!])))
          results.push(cellTriangle1!);
        if (intersect(featureCollection([options.mask, cellTriangle2!])))
          results.push(cellTriangle2!);
      } else {
        results.push(cellTriangle1!);
        results.push(cellTriangle2!);
      }

      currentY += cellHeight;
      yi++;
    }
    xi++;
    currentX += cellWidth;
  }
  return featureCollection(results);
}

export { triangleGrid };
export default triangleGrid;
