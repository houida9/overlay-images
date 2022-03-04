// Set the default transparency for the mockup image
var mockupAlpha = 0.5;
var overlayed = false;

let canvasResolutionMap = {
    "1280 x 800": {
        "width": 1280,
        "height": 800,
        "scaleBy": .75
    },
    "1920 x 1080": {
        "width": 1920,
        "height": 1080,
        "scaleBy": .60
    }
};

document.addEventListener('DOMContentLoaded', function(event) {
  setAlphaListener();
  setResolutionListener();

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
})

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

  screenshotImage.src = URL.createObjectURL(event.target.files[0]);

  screenshotImage.onload = function() {
    URL.revokeObjectURL(screenshotImage.src);
  }
};

function setAlphaListener() {

  var slider = document.getElementById("slider");
  // Set the default alpha
  slider.value = mockupAlpha * 100.0

  slider.oninput = function() {
      mockupAlpha = slider.value/100.0

      if (overlayed) {
        document.getElementById('overlay').click()
      }
  }
}

function setResolutionListener() {
      $('#resolution-dropdown-menu a').on('click', function(e){
        e.preventDefault();

        $('#resolution-dropdown-menu .dropdown-item').css('background-color', 'white')

        updateCanvasSize($(this).text())

        $(this).css('background-color', '#50C878')

        document.getElementById('overlay').disabled = false
        $('.overlay-wrapper').tooltip('dispose')

        if(overlayed) {
           document.getElementById('overlay').click()
        }
      });
}

function updateCanvasSize(resolutionOption) {
    var canvas = document.getElementById('canvas')

    var resolutionObject = canvasResolutionMap[resolutionOption]

    canvas.width = parseInt(
        resolutionObject.width * resolutionObject.scaleBy
    );

    canvas.height = parseInt(
        resolutionObject.height * resolutionObject.scaleBy
    );
}


function overlay() {
  var screenshotImage = document.getElementById('screenshot');
  var mockupImage = document.getElementById('mockup');

  if (mockupImage.src && screenshotImage.src){
    overlayed = true;

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.drawImage(screenshotImage, 0, 0, canvas.width, canvas.height);
    context.restore();
    context.save();
    context.globalAlpha = mockupAlpha;
    context.drawImage(mockupImage, 0, 0, canvas.width, canvas.height);
    context.restore();

    canvas.style.border = 'solid 4px rgb(104, 7, 104)';
    canvas.style.borderRadius = '10px';

    document.getElementById('download').style.visibility = "visible";
  }
}


function downloadOverlay() {
    if(overlayed) {
      const date = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      var month = months[date.getMonth()];
      const [day, year, hours, minutes, seconds] = [date.getDate(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()]
      const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

      let downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', `overlay${timestamp}.png`);
      let canvas = document.getElementById('canvas');
      let dataURL = canvas.toDataURL('image/png');
      let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    }
}

