// Set the default transparency, hue, and saturation
// for the screenshot image
var screenshotAlpha = 0.6;
var screenshotHue = 0.0;

var overlayClicked = false;

var uploadedImgEvent = ""

let alphaMap = {
  "Transparent": 0.2,
  "Translucent": 0.6,
  "Opaque": 0.8
}

let hueMap = {
  "None": 0.0,
  "Yellow": 0.2,
  "Blue": 0.6,
  "Red": 1.0,
}


var loadMockup = function(event) {
  var mockupImage = document.getElementById('mockup');
  mockupImage.style.display = "block";

  mockupImage.src = URL.createObjectURL(event.target.files[0]);
  mockupImage.onload = function() {
    URL.revokeObjectURL(mockupImage.src);
  }
};


var loadScreenshot = function(event) {
  var screenshotImage = document.getElementById('screenshot');
  screenshotImage.style.display = "block";

  uploadedImgEvent = event
  screenshotImage.src = URL.createObjectURL(event.target.files[0]);

  screenshotImage.onload = function() {
    URL.revokeObjectURL(screenshotImage.src);

    if (screenshotHue != 0)
      tint(screenshotImage, screenshotHue);
  }
};


function highlightDefaultAlpha() {
  $( "#alpha-dropdown-menu > a" )
    .filter(function() {
      return alphaMap[$(this).text()] == screenshotAlpha;
    })
    .css( "background-color", "#4BB543" );
}

function highlightDefaultHue() {
  $( "#hue-dropdown-menu > a" )
    .filter(function() {
      return hueMap[$(this).text()] == screenshotHue;
    })
    .css( "background-color", "#eed202" );
}

function setSelectedAlphaListener() {

  highlightDefaultAlpha();

  $('#alpha-dropdown-menu a').on('click', function(e){
    e.preventDefault();

    $('#alpha-dropdown-menu .dropdown-item').css('background-color', 'white')

    screenshotAlpha = alphaMap[$(this).text()]
    $(this).css('background-color', '#4BB543')

    if (overlayClicked) {
      document.getElementById('overlay').click()
    }
  });
}

function setSelectedHueListener() {

  highlightDefaultHue();

  $('#hue-dropdown-menu a').on('click', function(e){
    e.preventDefault();

    $('#hue-dropdown-menu .dropdown-item').css('background-color', 'white');

    screenshotHue = hueMap[$(this).text()]

    document.getElementById('screenshot-input').onchange(uploadedImgEvent)

    $(this).css('background-color', '#eed202');
    
    if (overlayClicked) {
      setTimeout(() => {
        document.getElementById('overlay').click()
      }, 100)
    }
  });
}


document.addEventListener('DOMContentLoaded', function(event) {

      setSelectedAlphaListener();
      setSelectedHueListener();

    document.getElementById('overlay').addEventListener('click', function() {
      overlayClicked = true
      var mockupImage = document.getElementById('mockup');
      var screenshotImage = document.getElementById('screenshot');


      if (mockupImage.src && screenshotImage.src){

        var canvas = document.getElementById("canvas");
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw overlay
        context.save();
        context.drawImage(mockupImage, 0, 0, canvas.width, canvas.height);
        context.restore();
        context.save();
        context.globalAlpha = screenshotAlpha;
        context.drawImage(screenshotImage, 0, 0, canvas.width, canvas.height);
        context.restore();

        document.getElementById('canvas').style.border = 'solid 4px rgb(104, 7, 104)';
        document.getElementById('canvas').style.borderRadius = '10px';
      }
    })
})



/* All of the following was copied verbatim from 
 * https://gist.github.com/matsadler/bf8c1b78295955fe56dc603237da0dcf 
*/

// img should be an img element (ensure the image has loaded first)
//
// hue sets the colour, and is a float in the range 0-1.
//
// saturation is how much colour, and is a float in the range 0-1.
// Default: 0.6
//
// white is the white point, a lower value will move white towards grey,
// allowing more colour into the image, but making it dimmer. Default: 1
//
// black is the black point, a higher value will move black towards grey,
// allowing more colour into the image, but making it appear washed out.
// Default: 0
//
function tint(img, hue, saturation, white, black) {
  hue = hue || 0.6;
  saturation = saturation || 0.6;
  black = black || 0;
  white = white || 1;

  newPixels = hsvFilter(getPixels(img), function(pixel) {
      pixel[0] = hue;
      pixel[1] = saturation;
      pixel[2] = ((white - black) / 1) * pixel[2] + black;
      return pixel;
  });
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  putPixels(canvas.getContext("2d"), newPixels, img.width, img.height);
  img.src = canvas.toDataURL();
}

function getPixels(img) {
  var canvas = document.createElement("canvas"),
      pixels = [],
      rgbPixel,
      ctx,
      data,
      i;

  canvas.width = img.width;
  canvas.height = img.height;
  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  for (i = 0; i < data.length; i += 4) {
      rgbPixel = [];
      rgbPixel[0] = data[i];
      rgbPixel[1] = data[i + 1];
      rgbPixel[2] = data[i + 2];
      pixels.push(rgbPixel);
  }
  return pixels;
}

function hsvFilter(pixels, filter) {
  var result = [],
      i;
  for (i = 0; i < pixels.length; i += 1) {
      result[i] = hsvToRgb(filter(rgbToHsv(pixels[i])));
  }
  return result;
}

function putPixels(ctx, rgb, width, height) {
  var imageData = ctx.createImageData(width, height),
      i = 0,
      j = 0;
  for (i = 0; i < rgb.length; i += 1) {
      imageData.data[j] = rgb[i][0];
      imageData.data[j + 1] = rgb[i][1];
      imageData.data[j + 2] = rgb[i][2];
      imageData.data[j + 3] = 255;
      j += 4;
  }
  ctx.putImageData(imageData, 0, 0);
}

// adapted from from http://www.easyrgb.com/index.php?X=MATH

function rgbToHsv(rgb, buffer) {
  buffer = buffer || [];
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h = 0,
      s = 0,
      v = max,
      delta_r,
      delta_g,
      delta_b;

  if (delta !== 0) {
      s = delta / max;

      delta_r = (((max - r) / 6) + (delta / 2)) / delta;
      delta_g = (((max - g) / 6) + (delta / 2)) / delta;
      delta_b = (((max - b) / 6) + (delta / 2)) / delta;

      if (r === max) {
          h = delta_b - delta_g;
      } else if (g === max) {
          h = (1 / 3) + delta_r - delta_b;
      } else if (b === max) {
          h = (2 / 3) + delta_g - delta_r;
      }

      if (h < 0) {
          h += 1;
      }
      if (h > 1) {
          h -= 1;
      }
  }

  buffer[0] = h;
  buffer[1] = s;
  buffer[2] = v;
  return buffer;
}

function hsvToRgb(hsv, buffer) {
  buffer = buffer || [];
  var h = hsv[0],
      s = hsv[1],
      v = hsv[2],
      i,
      a,
      b,
      c;

  if (s === 0) {
      buffer[0] = v;
      buffer[1] = v;
      buffer[2] = v;
  } else {
      if (h === 1) {
          h = 0;
      } else {
          h *= 6;
      }
      i = Math.floor(h);
      a = v * (1 - s);
      b = v * (1 - s * (h - i));
      c = v * (1 - s * (1 - (h - i)));

      if (i === 0) {
          buffer[0] = v;
          buffer[1] = c;
          buffer[2] = a;
      } else if (i === 1) {
          buffer[0] = b;
          buffer[1] = v;
          buffer[2] = a;
      } else if (i === 2) {
          buffer[0] = a;
          buffer[1] = v;
          buffer[2] = c;
      } else if (i === 3) {
          buffer[0] = a;
          buffer[1] = b;
          buffer[2] = v;
      } else if (i === 4) {
          buffer[0] = c;
          buffer[1] = a;
          buffer[2] = v;
      } else {
          buffer[0] = v;
          buffer[1] = a;
          buffer[2] = b;
      }
  }

  buffer[0] *= 255;
  buffer[1] *= 255;
  buffer[2] *= 255;
  return buffer;
}