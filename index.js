/* Define some initial variables. */
var appRoot = __dirname.replace(/\\/g,"/"),
  ip = '127.0.0.1',
  port = 8080;
  mockRoot = appRoot + '/branch',
  mockFilePattern = '.json',
  mockRootPattern = mockRoot + '/*' + mockFilePattern,
  apiRoot = '/lequ/branch',
  fs = require("fs"),
  glob = require("glob");

/* Create Express application */
var express = require("express");
var app = express();

/* Read the directory tree according to the pattern specified above. */
var files = glob.sync(mockRootPattern);

/* Register mappings for each file found in the directory tree. */
if(files && files.length > 0) {
  files.forEach(function(fileName) {
    console.log("found file name: ", fileName);
    var mapping = apiRoot + fileName.replace(mockRoot, '').replace(mockFilePattern,'');

    app.get(mapping, function (req, res) {
      var data =  fs.readFileSync(fileName, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    });

    console.log('Registered mapping: %s -> %s', mapping, fileName);
  })
} else {
    console.log('No mappings found! Please check the configuration.');
}

/* Start the API mock server. */
console.log('Application root directory: [' + appRoot +']');
console.log('Mock Api Server listening: [http://' + ip + ':' + port + ']');
app.listen(port, ip);