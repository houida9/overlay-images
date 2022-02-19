// Set the default transparency
var screenshotAlpha = 0.5;


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

    $('#dropdown-menu a').on('click', function(e){
      e.preventDefault();

      $('.dropdown-item').css('background-color', 'white')

      screenshotAlpha = $(this).text()
      $(this).css('background-color', 'orange')
      document.getElementById('overlay').click()
  });

    document.getElementById('overlay').addEventListener('click', function() {
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
        context.fillStyle = 'green';
        context.globalAlpha = screenshotAlpha;
        context.drawImage(screenshotImage, 0, 0, canvas.width, canvas.height);

        document.getElementById('canvas').style.border = 'solid 2px green';
        document.getElementById('canvas').style.borderRadius = '10px';
      }
    })
})
