var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(res, data, statusCode) {
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.redirect = function(res, url) {
  headers['Location'] = url;
  res.writeHead(302, headers);
  res.end();
};

exports.collectData = function(req, callback) {
  //Attach an event hanlder to data
  var body = '';
  req.on('data', function(chunk) { body += chunk; });
  req.on('end', function() {
    body = body.split("=")[1];
    callback(body);
  });
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change o/fn.)

  //Asset is the URL of the request

  //if the asset is index.html
  asset = asset === "/" ? "/index.html" : asset;
  fs.readFile(archive.paths.siteAssets + asset, function(error, data){
    
    if (error) {

      fs.readFile(archive.paths.archivedSites + asset, function(error, data){
        if (error)exports.sendResponse(res, "File not found", 404);
        else exports.sendResponse(res, data, 200);
      });

    } else {

      exports.sendResponse(res, data, 200);

    }
    
  })
};



// As you progress, keep thinking about what helper functions you can put here!
