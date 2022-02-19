var loadMockup = function(event) {
  var mockupImage = document.getElementById('mockup');
  mockupImage.src = URL.createObjectURL(event.target.files[0]);
  mockupImage.onload = function() {
    URL.revokeObjectURL(mockupImage.src);
  }
  mockupImage.style.display = "block";
};

var loadITU = function(event) {
  var ituImage = document.getElementById('itu');
  ituImage.src = URL.createObjectURL(event.target.files[0]);
  ituImage.onload = function() {
    URL.revokeObjectURL(ituImage.src);
  }
  ituImage.style.display = "block";
};

document.addEventListener('DOMContentLoaded', function(event) {

    document.getElementById('overlay').addEventListener('click', function() {

      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      var mockupuserimage = document.getElementById('mockup');
      var ituuserimage = document.getElementById('itu');
    
      // draw overlay
      context.save();
      context.drawImage(mockupuserimage, 0, 0, canvas.width, canvas.height);
      context.restore();
      context.fillStyle = 'green';
      context.globalAlpha = 0.5;
      context.drawImage(ituuserimage, 0, 0, canvas.width, canvas.height);
    })
})