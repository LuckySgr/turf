/**
 * 判断点是否在多边形内部的算法
 * @param p 点位坐标
 * @param polygon 多边形坐标
 * @return {number|boolean} true / false
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pointInPolygon(p, polygon) {
  let i = 0;
  let ii = 0;
  let k = 0;
  let f = 0;
  let u1 = 0;
  let v1 = 0;
  let u2 = 0;
  let v2 = 0;
  let currentP = null;
  let nextP = null;

  const x = p[0];
  const y = p[1];

  const numContours = polygon.length;
  for (i; i < numContours; i++) {
    ii = 0;
    const contourLen = polygon[i].length - 1;
    const contour = polygon[i];

    currentP = contour[0];
    if (
      currentP[0] !== contour[contourLen][0] &&
      currentP[1] !== contour[contourLen][1]
    ) {
      throw new Error("First and last coordinates in a ring must be the same");
    }

    u1 = currentP[0] - x;
    v1 = currentP[1] - y;

    for (ii; ii < contourLen; ii++) {
      nextP = contour[ii + 1];

      v2 = nextP[1] - y;

      if ((v1 < 0 && v2 < 0) || (v1 > 0 && v2 > 0)) {
        currentP = nextP;
        v1 = v2;
        u1 = currentP[0] - x;
        continue;
      }

      u2 = nextP[0] - p[0];

      if (v2 > 0 && v1 <= 0) {
        f = u1 * v2 - u2 * v1;
        if (f > 0) k = k + 1;
        else if (f === 0) return 0;
      } else if (v1 > 0 && v2 <= 0) {
        f = u1 * v2 - u2 * v1;
        if (f < 0) k = k + 1;
        else if (f === 0) return 0;
      } else if (v2 === 0 && v1 < 0) {
        f = u1 * v2 - u2 * v1;
        if (f === 0) return 0;
      } else if (v1 === 0 && v2 < 0) {
        f = u1 * v2 - u2 * v1;
        if (f === 0) return 0;
      } else if (v1 === 0 && v2 === 0) {
        if (u2 <= 0 && u1 >= 0) {
          return 0;
        } else if (u1 <= 0 && u2 >= 0) {
          return 0;
        }
      }
      currentP = nextP;
      v1 = v2;
      u1 = u2;
    }
  }

  return k % 2 !== 0;
}

/*

这段代码是一个用于判断点是否在多边形内部的 JavaScript 函数。它使用了奇偶规则（even-odd rule）来进行包含性测试。

以下是代码的工作原理：

1. 初始化多个变量（`i`、`ii`、`k`、`f`、`u1`、`v1`、`u2`、`v2`、`currentP` 和 `nextP`），用于在计算过程中存储中间值。

2. 将输入数组 `p` 的第一个和第二个元素分别赋值给变量 `x` 和 `y`，表示要测试的点的坐标。

3. 计算数组 `polygon` 中轮廓的数量，并将结果存储在变量 `numContours` 中。

4. 开始一个循环，遍历 `polygon` 数组中的每个轮廓。循环变量 `i` 被初始化为 0，并在每次迭代中递增 1，直到达到 `numContours`。

5. 在循环内部，初始化变量 `ii` 为 0。该变量将用于在当前轮廓中遍历点。

6. 获取当前轮廓的长度减 1（排除重复的闭合点），并将结果存储在变量 `contourLen` 中。同时，将当前轮廓数组赋值给变量 `contour`。

7. 将变量 `currentP` 设置为当前轮廓的第一个点（`contour[0]`）。

8. 检查 `currentP` 是否与轮廓的最后一个点不同（`contour[contourLen]`）。如果它们不同，意味着轮廓没有正确闭合，将抛出错误。

9. 计算 `x` 和 `y` 坐标与 `currentP` 坐标之间的差值，分别存储在变量 `u1` 和 `v1` 中。

10. 开始一个嵌套循环，遍历当前轮廓中的每个点。循环变量 `ii` 被初始化为 0，并在每次迭代中递增 1，直到达到 `contourLen`。

11. 在嵌套循环内部，将变量 `nextP` 设置为轮廓中的下一个点（`contour[ii + 1]`）。

12. 计算 `y` 坐标与 `nextP` 坐标之间的差值，存储在变量 `v2` 中。

13. 执行一系列检查来确定点的方向，并相应地更新 `currentP`、`v1` 和 `u1` 的值。这些检查基于 `v1` 和 `v2` 的符号，并处理不同的情况。

14. 使用叉积公式 `(u1 * v2) - (u2 * v1)` 计算 `f` 的值，其中 `u2` 是 `nextP` 的 `x` 坐标与 `p` 的 `x` 坐标之间的差值。

15. 根据 `f` 的值更新交叉计数器 `k` 的值。如果 `f` 大于 0，则将 `k` 增加 1。如果 `f` 等于 0，则返回 0（表示点在多边形的边界上）。

16. 更新 `currentP`、`v1` 和 `u1` 的值，以便进行嵌套循环的下一次迭代。

17. 在嵌套循环结束后，检查交叉数 `k` 是否为偶数。如果是偶数，则返回 `false`（表示点在多边形外部）。否则，返回 `true`（表示点在多边形内部）。

该代码假设输入 `p` 是一个包含要测试点的 `x` 和 `y` 坐标的数组，而 `polygon` 是一个轮廓数组，其中每个轮廓都由 `[非常抱歉，我的回答中的一部分被截断了。以下是完整的回答：

该代码假设输入 `p` 是一个包含要测试点的 `x` 和 `y` 坐标的数组，而 `polygon` 是一个轮廓数组，其中每个轮廓都由 `[x, y]` 数组表示的点组成。

请注意，你提供的代码片段是不完整的，可能需要额外的上下文或代码才能正常运行。如果你需要更多帮助，请提供完整的代码或更多的上下文信息。


 */
