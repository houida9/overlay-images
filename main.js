var loadMockup = function(event) {
  var mockupImage = document.getElementById('mockup');
  mockupImage.style.display = "block";

  mockupImage.src = URL.createObjectURL(event.target.files[0]);
  mockupImage.onload = function() {
    URL.revokeObjectURL(mockupImage.src);
  }
};


var loadscreenshot = function(event) {
  var screenshotImage = document.getElementById('screenshot');
  screenshotImage.style.display = "block";

  screenshotImage.src = URL.createObjectURL(event.target.files[0]);
  screenshotImage.onload = function() {
    URL.revokeObjectURL(screenshotImage.src);
  }
};


document.addEventListener('DOMContentLoaded', function(event) {

    document.getElementById('overlay').addEventListener('click', function() {

      var mockupuserimage = document.getElementById('mockup');
      var screenshotuserimage = document.getElementById('screenshot');

      if (mockupuserimage.src && screenshotuserimage.src){

        var canvas = document.getElementById("canvas");
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw overlay
        context.save();
        context.drawImage(mockupuserimage, 0, 0, canvas.width, canvas.height);
        context.restore();
        context.fillStyle = 'green';
        context.globalAlpha = 0.5;
        context.drawImage(screenshotuserimage, 0, 0, canvas.width, canvas.height);

        document.getElementById('canvas').style.border = 'solid 2px green';
        document.getElementById('canvas').style.borderRadius = '10px';
      }
    })
})