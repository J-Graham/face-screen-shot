// Load the page
// NB: This needs to be the last route added
const fs = require('fs');
const path = require('path');

exports.serveIndex = function (app, staticFolder) {
  app.post('/imagesave', (req, res) => {
    var dataUrl = req.body.img;

    var matches = dataUrl.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer(matches[2], 'base64');

    var savePath = path.resolve(`../examples/face-pics${new Date().getTime()}.png`);

    fs.writeFileSync(savePath, buffer);
  })
  app.get('*', function (req, res) {
    res.sendFile('index.html', { root: staticFolder });
  });
};

// exports.saveImage = function (dataUrl) {
//   var matches = dataUrl.match(/^data:.+\/(.+);base64,(.*)$/);
//   var buffer = new Buffer(matches[2], 'base64');

//   var savePath = path.resolve(`../examples/face-pics${new Date().getTime()}.png`);
//   fs.writeFileSync(savePath, buffer);
//   return savePath;
// };
