/*!
 * Copyright 2011-2022, Lucien Saviot
 * License: GPL v3. See https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Date: April 2022
 */

function $(id) {
  return document.getElementById(id);
}

tab = document.createElement("table");
tab.id = "materials";

function p(x, t, v) {
  var s = x.toFixed(v),
    p = "";
  for (var pad = 0; pad < t - s.length; pad++) p += " ";
  s = p + s;
  return s;
}

function ChangeMat(name) {
  if (document.createElement("canvas").getContext) {
    if (name == "tab") {
      $("inputbox").style.display = "";
    } else {
      $("inputbox").style.display = "none";
    }
    if (name == "tab" && mat["ltab"].length == 0) {
      mat["ltab"] = mat[matx];
      mat["ntab"] = mat[matn];
      mat["ktab"] = mat[matk];
      $("input").value = "# " + prename + "\n";
      for (var i = 0; i < mat[matx].length; i++) {
        $("input").value +=
          p(mat["ltab"][i], 9, 3) +
          " " +
          p(mat["ntab"][i], 9, 4) +
          " " +
          p(mat["ktab"][i], 9, 4) +
          "\n";
      }
    }
    matx = "l" + name;
    matn = "n" + name;
    matk = "k" + name;
    el = $(name);
    if (typeof pre != "undefined") {
      pre.bgColor = "";
    }
    el.bgColor = "LightPink";
    pre = el;
    prename = name;
    calc();
  }
}

function readinput() {
  var line = $("input").value.split("\n");
  var ltmp = new Array();
  mat[matx] = [];
  mat[matn] = [];
  mat[matk] = [];
  for (var i = 0; i < line.length; i++) {
    var c = line[i].replace(/^\s+/, "").split(/\s+/);
    if (c.length > 2) {
      var myl = parseFloat(c[0]),
        myn = parseFloat(c[1]),
        myk = parseFloat(c[2]);
      if (!isNaN(myl) && !isNaN(myn) && !isNaN(myk)) {
        if (myl > 0 && myl < 3000 && myn >= 0 && myk >= 0) {
          ltmp.push([myl, myn, myk]);
        }
      }
    }
  }
  ltmp.sort(function (a, b) {
    return a[0] - b[0];
  });
  for (var i = 0; i < ltmp.length; i++) {
    mat[matx][i] = ltmp[i][0];
    mat[matn][i] = ltmp[i][1];
    mat[matk][i] = ltmp[i][2];
  }
  if (!$("nm").checked) {
    if ($("mum").checked) {
      for (var i = 0; i < mat[matx].length; i++) {
        mat[matx][i] = mat[matx][i] * 1000;
      }
    }
    if ($("ang").checked) {
      for (var i = 0; i < mat[matx].length; i++) {
        mat[matx][i] = mat[matx][i] / 10;
      }
    }
    if ($("eV").checked) {
      for (var i = 0; i < mat[matx].length; i++) {
        mat[matx][i] = 1239.8524 / mat[matx][i];
      }
    }
    if ($("cm").checked) {
      for (var i = 0; i < mat[matx].length; i++) {
        mat[matx][i] = 1e7 / mat[matx][i];
      }
    }
  }
  if ($("clean").checked) {
    var s = "";
    for (var i = 0; i < mat[matx].length; i++) {
      s +=
        p(mat["ltab"][i], 9, 3) +
        " " +
        p(mat["ntab"][i], 9, 4) +
        " " +
        p(mat["ktab"][i], 9, 4) +
        "\n";
    }
    $("input").value = s;
    $("nm").checked = true;
    $("clean").checked = false;
  }
  calc();
}

function readFile(e) {
  if (e.target.files.length > 0) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      $("input").value = reader.result;
    };
    reader.readAsBinaryString(file);
  }
}

// From http://scienceprimer.com/javascript-code-convert-light-wavelength-color
// takes wavelength in nm and returns an rgba value
function wavelengthToColor(wavelength) {
  var r,
    g,
    b,
    alpha,
    colorSpace,
    wl = wavelength,
    gamma = 1;

  if (wl >= 380 && wl < 440) {
    R = (-1 * (wl - 440)) / (440 - 380);
    G = 0;
    B = 1;
  } else if (wl >= 440 && wl < 490) {
    R = 0;
    G = (wl - 440) / (490 - 440);
    B = 1;
  } else if (wl >= 490 && wl < 510) {
    R = 0;
    G = 1;
    B = (-1 * (wl - 510)) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    R = (wl - 510) / (580 - 510);
    G = 1;
    B = 0;
  } else if (wl >= 580 && wl < 645) {
    R = 1;
    G = (-1 * (wl - 645)) / (645 - 580);
    B = 0.0;
  } else if (wl >= 645 && wl <= 780) {
    R = 1;
    G = 0;
    B = 0;
  } else {
    R = 0;
    G = 0;
    B = 0;
  }

  // intensty is lower at the edges of the visible spectrum.
  if (wl > 780 || wl < 380) {
    alpha = 0;
  } else if (wl > 700) {
    alpha = (780 - wl) / (780 - 700);
  } else if (wl < 420) {
    alpha = (wl - 380) / (420 - 380);
  } else {
    alpha = 1;
  }

  colorSpace = [
    "rgba(" + R * 100 + "%," + G * 100 + "%," + B * 100 + "%, " + alpha + ")",
    R,
    G,
    B,
    alpha,
  ];

  // colorSpace is an array with 5 elements.
  // The first element is the complete code as a string.
  // Use colorSpace[0] as is to display the desired color.
  // use the last four elements alone or together to access each of the individual r, g, b and a channels.

  return colorSpace;
}

//functions to convert to graph coordinates
function l2x(l) {
  return ((l - lmin) / (lmax - lmin)) * (w - 65) + 50;
}

function Q2y(Q) {
  return h - 40 - ((Q - Qmin) / (Qmax - Qmin)) * (h - 42);
}

//Reverse functions
function x2l(x) {
  return ((x - 50) / (w - 65)) * (lmax - lmin) + lmin;
}

function y2Q(y) {
  return ((h - 42 - y) / (h - 40)) * (Qmax - Qmin) + Qmin;
}

// Rounding function to avoid printing too many digits
function draw() {
  var canvas = $("plot");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    if (keepwh != "on")
      (w = Math.min((window.innerWidth - canvas.offsetLeft) * 0.95, 800)),
        (h = (2 * w) / 3);
    //clear canvas
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    // rainbow on wavelength axis
    ctx.lineWidth = 6;
    //    for (var wl=Math.max(lmin,380);wl<Math.min(lmax,780);wl++) {
    //      ctx.beginPath();
    //      ctx.fillStyle = wavelengthToColor(wl)[0];
    //      ctx.strokeStyle = wavelengthToColor(wl)[0];
    //      ctx.moveTo(l2x(wl-1),Q2y(0)+1);
    //      ctx.lineTo(l2x(wl),Q2y(0)+1);
    //      ctx.stroke();
    //    }
    for (var myx = l2x(lmin); myx <= l2x(lmax); myx++) {
      ctx.beginPath();
      ctx.fillStyle = wavelengthToColor(x2l(myx))[0];
      ctx.strokeStyle = wavelengthToColor(x2l(myx))[0];
      ctx.moveTo(myx - 1, Q2y(Qmin) + 3);
      ctx.lineTo(myx, Q2y(Qmin) + 3);
      ctx.stroke();
    }
    // graph box
    ctx.lineWidth = 1;
    ctx.fillStyle = "#eeeeee";
    ctx.strokeStyle = "#000000";
    ctx.fillRect(
      l2x(lmin),
      Q2y(Qmin),
      l2x(lmax) - l2x(lmin),
      Q2y(Qmax) - Q2y(Qmin)
    );
    //    ctx.strokeRect(l2x(lmin),Q2y(Qmin), l2x(lmax)-l2x(lmin),Q2y(Qmax)-Q2y(Qmin));
    ctx.fillStyle = "#000000";
    // x axis
    ctx.beginPath();
    ctx.font = "10px sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    var delta = Math.pow(10, Math.floor(Math.log(lmax - lmin) / Math.log(10)));
    var xmin = Math.floor(lmin / delta) * delta;
    var xmax = Math.ceil(lmax / delta) * delta;
    var xstep = delta;
    var nticks = 0;
    for (var myl = xmin; myl <= lmax; myl += xstep) {
      if (myl >= lmin && myl <= lmax) nticks++;
    }
    if (nticks == 0) xstep = xstep / 5;
    if (nticks <= 2) xstep = xstep / 2;
    if (nticks >= 10) xstep = xstep * 2;
    var fixed = Math.ceil(Math.abs(Math.log(xstep)) / Math.log(10));
    if (xstep > 1) fixed = 0;
    ctx.beginPath();
    for (var myl = xmin; myl <= lmax; myl += xstep)
      if (myl >= lmin && myl <= lmax) {
        ctx.moveTo(l2x(myl), Q2y(Qmin) - 3);
        ctx.lineTo(l2x(myl), Q2y(Qmin) + 3);
        ctx.moveTo(l2x(myl), Q2y(Qmax) + 3);
        ctx.lineTo(l2x(myl), Q2y(Qmax));
        ctx.fillText(myl.toFixed(fixed), l2x(myl), Q2y(Qmin) + 8);
      }
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.textBaseline = "bottom";
    ctx.fillText("λ (nm)", l2x((lmax + lmin) / 2), h);
    ctx.restore();
    // y axis
    delta = Math.pow(10, Math.floor(Math.log(Qmax - Qmin) / Math.log(10)));
    var ymin = Math.floor(Qmin / delta) * delta;
    var ymax = Math.ceil(Qmax / delta) * delta;
    var ystep = delta;
    nticks = 0;
    for (var q = ymin; q < Qmax; q += ystep) {
      if (q >= Qmin && q <= Qmax) nticks++;
    }
    if (nticks == 0) ystep = ystep / 10;
    if (nticks <= 2) ystep = ystep / 5;
    if (ystep > 1) fixed = 0;
    fixed = Math.ceil(Math.abs(Math.log(ystep)) / Math.log(10));
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.font = "10px sans-serif";
    ctx.beginPath();
    for (var q = ymin; q < Qmax; q += ystep)
      if (q >= Qmin && q <= Qmax) {
        ctx.moveTo(l2x(lmin) + 3, Q2y(q));
        ctx.lineTo(l2x(lmin) - 3, Q2y(q));
        ctx.moveTo(l2x(lmax) - 3, Q2y(q));
        ctx.lineTo(l2x(lmax), Q2y(q));
        if (Q2y(q) > Q2y(Qmax) + 5)
          ctx.fillText(q.toFixed(fixed), l2x(lmin) - 8, Q2y(q));
      }
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "12px serif";
    ctx.save();
    ctx.translate(0, Q2y((Qmax + Qmin) / 2));
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ff0000";
    ctx.fillText("Qsca", -30, 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText("Qabs", 0, 2);
    ctx.textAlign = "left";
    ctx.fillStyle = "#0000ff";
    ctx.fillText("Qext", 30, 2);
    ctx.restore();
    // commands
    ///full scale
    if (rescaled == "on") {
      ctx.strokeStyle = "#444444";
      ctx.fillStyle = "#444444";
    } else {
      ctx.strokeStyle = "#cccccc";
      ctx.fillStyle = "#cccccc";
    }
    ctx.strokeRect(0, h - 20, 20, 20);
    ctx.beginPath();
    ctx.moveTo(10, h - 19);
    ctx.lineTo(10, h - 1);
    ctx.moveTo(8, h - 17);
    ctx.lineTo(10, h - 19);
    ctx.lineTo(12, h - 17);
    ctx.moveTo(8, h - 3);
    ctx.lineTo(10, h - 1);
    ctx.lineTo(12, h - 3);
    ctx.moveTo(1, h - 10);
    ctx.lineTo(19, h - 10);
    ctx.moveTo(3, h - 12);
    ctx.lineTo(1, h - 10);
    ctx.lineTo(3, h - 8);
    ctx.moveTo(17, h - 12);
    ctx.lineTo(19, h - 10);
    ctx.lineTo(17, h - 8);
    ctx.stroke();
    //    ctx.strokeStyle = 'LightPink';
    //    ctx.fillStyle = 'LightPink';
    ctx.strokeStyle = "#444444";
    ctx.fillStyle = "#444444";
    ctx.beginPath();
    ///export
    ctx.strokeRect(25, h - 20, 20, 20);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "9px serif";
    ctx.fillText("DAT", 35, h - 9);
    ctx.stroke();
    ///resize
    //    ctx.strokeRect(w-20,h-20,20,20);
    //    ctx.strokeRect(w-20,h-20,12,12);
    ctx.fillRect(w - 4, h - 4, 3, 3);
    ctx.fillRect(w - 8, h - 4, 3, 3);
    ctx.fillRect(w - 12, h - 4, 3, 3);
    ctx.fillRect(w - 4, h - 8, 3, 3);
    ctx.fillRect(w - 8, h - 8, 3, 3);
    ctx.fillRect(w - 4, h - 12, 3, 3);
    ctx.stroke();
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    // curve
    ctx.rect(
      l2x(lmin),
      Q2y(Qmax),
      l2x(lmax) - l2x(lmin),
      Q2y(Qmin) - Q2y(Qmax)
    );
    ctx.clip();
    ctx.strokeStyle = "#0000ff";
    ctx.fillStyle = "#0000ff";
    ctx.beginPath();
    ctx.strokeRect(l2x(data[0][0]) - 1, Q2y(data[0][1][0]) - 1, 2, 2);
    for (var i = 1; i < data.length; i++) {
      ctx.moveTo(l2x(data[i - 1][0]), Q2y(data[i - 1][1][0]));
      ctx.lineTo(l2x(data[i][0]), Q2y(data[i][1][0]));
      ctx.strokeRect(l2x(data[i][0]) - 1, Q2y(data[i][1][0]) - 1, 2, 2);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.strokeRect(
      l2x(data[0][0]) - 1,
      Q2y(data[0][1][0] - data[0][1][1]) - 1,
      2,
      2
    );
    for (var i = 1; i < data.length; i++) {
      ctx.moveTo(
        l2x(data[i - 1][0]),
        Q2y(data[i - 1][1][0] - data[i - 1][1][1])
      );
      ctx.lineTo(l2x(data[i][0]), Q2y(data[i][1][0] - data[i][1][1]));
      ctx.strokeRect(
        l2x(data[i][0]) - 1,
        Q2y(data[i][1][0] - data[i][1][1]) - 1,
        2,
        2
      );
    }
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.strokeRect(l2x(data[0][0]) - 1, Q2y(data[0][1][1]) - 1, 2, 2);
    for (var i = 1; i < data.length; i++) {
      ctx.moveTo(l2x(data[i - 1][0]), Q2y(data[i - 1][1][1]));
      ctx.lineTo(l2x(data[i][0]), Q2y(data[i][1][1]));
      ctx.strokeRect(l2x(data[i][0]) - 1, Q2y(data[i][1][1]) - 1, 2, 2);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.strokeRect(
      l2x(lmin),
      Q2y(Qmin),
      l2x(lmax) - l2x(lmin),
      Q2y(Qmax) - Q2y(Qmin)
    );
  }
}

function calc() {
  var n = parseFloat($("n").value);
  var r = parseFloat($("d").value) / 2;
  rescaled = "off";
  lmin = parseFloat($("lambdamin").value);
  lmax = parseFloat($("lambdamax").value);
  if (isNaN(lmin)) lmin = 200;
  if (isNaN(lmax)) lmax = 1200;
  lmin = Math.min(1199, Math.max(200, lmin));
  lmax = Math.max(Math.min(1200, lmax), lmin + 1);

  if (!r || r <= 0 || r > 1000 || !n || n < 1 || n > 3) return;
  var j = 0,
    k = 0;
  data = new Array();
  if (document.param.interpolate[1].checked == true) {
    var step = parseFloat($("pas").value);
    if (!(step >= 0.1)) step = 10;
    for (
      var l = Math.ceil(Math.max(lmin, mat[matx][0]));
      l <= Math.min(lmax, mat[matx][mat[matx].length - 1]);
      l += step
    ) {
      while (mat[matx][j + 1] < l) j++;
      var myx = (mat[matx][j + 1] - l) / (mat[matx][j + 1] - mat[matx][j]);
      data[k] = [
        l,
        mie(
          n,
          mat[matn][j + 1] * (1 - myx) + mat[matn][j] * myx,
          mat[matk][j + 1] * (1 - myx) + mat[matk][j] * myx,
          r,
          l,
          1
        ),
      ];
      k++;
    }
  }
  if (document.param.interpolate[0].checked == true) {
    j = 0;
    k = 0;
    while (mat[matx][j] < lmin) j++;
    while (mat[matx][j] <= lmax && j < mat[matx].length) {
      data[k] = [
        mat[matx][j],
        mie(n, mat[matn][j], mat[matk][j], r, mat[matx][j], 1),
      ];
      k++;
      j++;
    }
  }
  if (document.param.interpolate[2].checked == true) {
    var step = parseFloat($("pas").value);
    if (!(step >= 0.1)) step = 10;
    var nn = mci(mat[matx], mat[matn], lmin, lmax, step);
    var kk = mci(mat[matx], mat[matk], lmin, lmax, step);
    for (var k = 0; k < nn[0].length; k++) {
      data[k] = [nn[0][k], mie(n, nn[1][k], kk[1][k], r, nn[0][k], 1)];
    }
  }
  //  alert(k+' '+mat[matx][0]+' '+mat[matx][mat[matx].length-1]+' '+data.length);
  var ymax = 0;
  for (var i = 0; i < data.length; i++) ymax = Math.max(ymax, data[i][1][0]);
  //  lmin=data[0][0];
  //  lmax=data[k-1][0];
  //  if (rescaled=="off") {
  Qmin = 0;
  Qmax = ymax * 1.05;
  //  }
  draw();
}

function mousedown(e) {
  var canvas = $("plot");
  var ctx = canvas.getContext("2d");
  var X = e.pageX - canvas.offsetLeft;
  var Y = e.pageY - canvas.offsetTop;
  var w = ctx.canvas.width;

  mouseX = x2l(X);
  mouseY = y2Q(Y);
  if (click != "on") {
    click = "on";
    frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  if (X >= 0 && X <= 20 && Y >= h - 20 && Y <= h) {
    if (rescaled == "on") {
      var ymax = 0;
      for (var i = 1; i < data.length; i++)
        ymax = Math.max(ymax, data[i][1][0]);
      lmin = data[0][0];
      lmax = data[data.length - 1][0];
      Qmin = 0;
      Qmax = ymax * 1.05;
      rescaled = "off";
      draw();
    }
    click = "off";
  }
  if (X > 20 && X <= 41 && Y >= h - 20 && Y <= h) {
    var n = parseFloat($("n").value);
    var d = parseFloat($("d").value);
    var tmp;
    click = "off";
    tmp = "#" + matx.substring(1) + ", d=" + d + " nm, n=" + n;
    tmp += "\n#nm  Qext    Qsca    Qabs";
    for (var i = 0; i < data.length; i++) {
      tmp +=
        "\n" +
        data[i][0] +
        " " +
        data[i][1][0].toFixed(5) +
        " " +
        data[i][1][1].toFixed(5) +
        " " +
        (data[i][1][0] - data[i][1][1]).toFixed(5);
    }
    //      window.location.href="data:text/plain;charset=UTF-8," + encodeURIComponent(tmp);
    // From https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
    if (window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([tmp], { type: "text/plain;charset=utf-8;" });
      window.navigator.msSaveBlob(blob, "mie.dat");
    } else {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(tmp)
      );
      element.setAttribute("download", "mie.dat");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    // end
  }
  if (X >= w - 20 && X <= w && Y >= h - 20 && Y <= h) {
    rescale = "on";
  }
}

function mousemove(e) {
  var canvas = $("plot");
  var ctx = canvas.getContext("2d");
  if (click == "on") {
    var newmouseX = e.pageX - canvas.offsetLeft;
    var newmouseY = e.pageY - canvas.offsetTop;
    ctx.putImageData(frame, 0, 0);
    ctx.save();
    ctx.rect(
      l2x(lmin),
      Q2y(Qmin),
      l2x(lmax) - l2x(lmin),
      Q2y(Qmax) - Q2y(Qmin)
    );
    ctx.clip();
    ctx.fillStyle = "rgba(128,128,128,0.5)";
    ctx.strokeStyle = "#000000";
    ctx.fillRect(
      l2x(mouseX),
      Q2y(mouseY),
      newmouseX - l2x(mouseX),
      newmouseY - Q2y(mouseY)
    );
    ctx.restore();
  }
}

function mouseup(e) {
  var canvas = $("plot");
  if (click == "on") {
    var newmouseX = x2l(e.pageX - canvas.offsetLeft);
    var newmouseY = y2Q(e.pageY - canvas.offsetTop);
    newmouseX = Math.min(newmouseX, lmax);
    newmouseX = Math.max(newmouseX, lmin);
    newmouseY = Math.min(newmouseY, Qmax);
    newmouseY = Math.max(newmouseY, Qmin);
    if (
      Math.abs(newmouseX - mouseX) > (lmax - lmin) / 100 &&
      Math.abs(newmouseY - mouseY) > (Qmax - Qmin) / 100
    ) {
      lmin = Math.min(mouseX, newmouseX);
      lmax = Math.max(mouseX, newmouseX);
      Qmin = Math.min(mouseY, newmouseY);
      Qmax = Math.max(mouseY, newmouseY);
      rescaled = "on";
      draw();
    }
  }
  click = "off";
}

window.onmousemove = function (event) {
  var canvas = $("plot");
  var ctx = canvas.getContext("2d");
  if (rescale == "on") {
    w = Math.max(event.pageX - canvas.offsetLeft, 300);
    h = Math.max(event.pageY - canvas.offsetTop, 200);
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.fillStyle = "#eeeeee";
    ctx.strokeStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    click = "off";
  }
};

window.onmouseup = function () {
  if (rescale == "on") {
    keepwh = "on";
    draw();
  }
  rescale = "off";
};

window.onload = function () {
  if (document.createElement("canvas").getContext) {
    var div = $("tabdiv");
    div.appendChild(tab);
    var td = document.getElementsByTagName("td");
    var random = Math.floor(Math.random() * (td.length - 1));
    data = new Array();
    click = "off";
    rescale = "off";
    rescaled = "off";
    lmin = 0;
    lmax = 0;
    Qmin = 0;
    Qmax = 0;
    w = 0;
    h = 0;
    keepwh = "off";
    ChangeMat(td[random].id);
    var canvas = $("plot");
    canvas.onmousedown = mousedown;
    canvas.onmouseup = mouseup;
    canvas.onmouseout = mouseup;
    canvas.onmousemove = mousemove;
    for (var i = 0; i < document.param.interpolate.length; i++)
      document.param.interpolate[i].onclick = calc;
    $("pas").oninput = calc;
    $("d").oninput = function () {
      $("slider-d").value = this.value;
      calc();
    };
    $("slider-d").oninput = function () {
      $("d").value = this.value;
      calc();
    };
    $("n").oninput = function () {
      $("slider-n").value = this.value * 100;
      calc();
    };
    $("slider-n").oninput = function () {
      $("n").value = this.value / 100;
      calc();
    };
    $("lambdamin").oninput = calc;
    $("lambdamax").oninput = calc;
    $("inputbutton").onclick = readinput;
    $("file").addEventListener("change", readFile, false);

    window.addEventListener("resize", function () {
      keepwh = "off";
      draw();
    });
  }
};
