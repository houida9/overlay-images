// Set the default transparency for the mockup image
var mockupAlpha = 0.5;
var overlayed = false;

document.addEventListener('DOMContentLoaded', function(event) {
  setSelectedAlphaListener();
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

function setSelectedAlphaListener() {

  var slider = document.getElementById("slider");

  slider.oninput = function() {
      screenshotAlpha = slider.value/100.0

      if (overlayed) {
        document.getElementById('overlay').click()
      }
  }
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
    context.globalAlpha = screenshotAlpha;
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
      var monthString = months[date.getMonth()]
      const [month, day, year, hours, minutes, seconds] = [monthString, date.getDate(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()]
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
