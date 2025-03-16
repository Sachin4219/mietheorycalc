/*!
 * Copyright 2011, Lucien Saviot
 * License: GPL v3. See https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Date: Juin 2011
 */

function h00(t) {
  return (1 + 2 * t) * (1 - t) * (1 - t);
}

function h10(t) {
  return t * (1 - t) * (1 - t);
}

function h01(t) {
  return t * t * (3 - 2 * t);
}

function h11(t) {
  return t * t * (t - 1);
}

function mci(x, y, xmin, xmax, xstep) {
  //Monotone Cubic Interpolation
  // https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
  var d = new Array(),
    m = new Array(),
    nx = new Array(),
    ny = new Array();
  xmin = Math.max(x[0], xmin);
  xmax = Math.min(x[x.length - 1], xmax);
  for (var k = 0; k < x.length - 1; k++)
    d[k] = (y[k + 1] - y[k]) / (x[k + 1] - x[k]);
  for (var k = 1; k < x.length - 1; k++) m[k] = (d[k - 1] + d[k]) / 2;
  m[0] = d[1];
  m[x.length - 1] = d[x.length - 2];
  for (var k = 0; k < x.length - 1; k++) {
    if (d[k] == 0) {
      m[k] = 0;
      m[k + 1] = 0;
      k++;
    } else {
      var a = m[k] / d[k],
        b = m[k + 1] / d[k];
      if (a == 0 || b == 0) {
        m[k] = 0;
        m[k + 1] = 0;
        k++;
      } else if (a * a + b * b > 9) {
        var t = 3 / Math.sqrt(a * a + b * b);
        m[k] = t * a * d[k];
        m[k + 1] = t * b * d[k];
      }
    }
  }
  var i = 0,
    j = 0;
  for (var xx = xmin; xx <= xmax && j < x.length; xx += xstep) {
    while (x[j + 1] < xx && j < x.length - 1) j++;
    if (x[j] <= xx && j < x.length) {
      var h = x[j + 1] - x[j];
      var t = (xx - x[j]) / h;
      nx[i] = xx;
      ny[i] =
        y[j] * h00(t) +
        h * m[j] * h10(t) +
        y[j + 1] * h01(t) +
        h * m[j + 1] * h11(t);
      i++;
    }
  }
  return [nx, ny];
}
