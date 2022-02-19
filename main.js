var loadMockup = function(event) {
  
  var mockupImage = document.getElementById('mockup');
  document.getElementsByClassName('image-upload-wrap')[0].style.display = 'block';

  mockupImage.src = URL.createObjectURL(event.target.files[0]);
  mockupImage.onload = function() {
    URL.revokeObjectURL(mockupImage.src);
  }
  mockupImage.style.display = "block";
  document.getElementsByClassName('file-upload')[0].style.background_color = 'black';
};

var loadscreenshot = function(event) {
  var screenshotImage = document.getElementById('screenshot');

  document.getElementsByClassName('image-upload-wrap')[1].style.display = 'block';
  document.getElementsByClassName('file-upload')[0].style.background_color = 'black';

  screenshotImage.src = URL.createObjectURL(event.target.files[0]);
  screenshotImage.onload = function() {
    URL.revokeObjectURL(screenshotImage.src);
  }
  screenshotImage.style.display = "block";


};

document.addEventListener('DOMContentLoaded', function(event) {

    document.getElementById('overlay').addEventListener('click', function() {

      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      var mockupuserimage = document.getElementById('mockup');
      var screenshotuserimage = document.getElementById('screenshot');
    
      // draw overlay
      context.save();
      context.drawImage(mockupuserimage, 0, 0, canvas.width, canvas.height);
      context.restore();
      context.fillStyle = 'green';
      context.globalAlpha = 0.5;
      context.drawImage(screenshotuserimage, 0, 0, canvas.width, canvas.height);

      document.getElementById('canvas').style.border = 'solid 2px green';
    })
})