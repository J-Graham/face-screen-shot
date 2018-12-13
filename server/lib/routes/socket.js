var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(1);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  lastSaveTime = new Date().getSeconds();
  console.log(lastSaveTime);
  setInterval(function () {
    camera.read(function (err, im) {
      if (err) throw err;

      if (im.size()[0] > 0 && im.size()[1] > 0) {

        im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
          if (err) throw err;
          if (!faces.length) return;

          var face = faces[0];
          var im2 = im.roi(face.x, face.y, face.width, face.height)
          if (Math.abs(lastSaveTime - new Date().getSeconds()) > 2 && faces.length > 0) {
            lastSaveTime = new Date().getSeconds();
            //im2.save(`../examples/face-pics${new Date().getTime()}.jpg`)
            console.log('Image saved');
            socket.emit('face');
          }
        })
      } else {
        console.log("Camera didn't return image")
      }
      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function (err, faces) {
        if (err) throw err;
        //console.log(im);
        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          //im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};
