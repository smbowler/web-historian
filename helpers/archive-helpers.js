var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var urlHelper = require('url');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

/*Path functions that help us manipulate path names.
Mainly for convenience sake. Because we reuse these pathways a bunch of times. */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  //access sites.txt file data
  // path (string), encoding, callback // utf8 encodes the raw buffer into a string
  fs.readFile(exports.paths.list, "utf8", function(error, urls){
    if (error) console.log('/archives/sites.txt not found.');
    else callback(urls.split('\n'));
  });

};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    urls.indexOf(url) > -1 ? callback(true) : callback(false);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', "utf8", function(error) {
    if (error) console.log('Could not add url to /archives/sites.txt.');
    else callback && callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  // __dirname/../archives/sites + / + wwww.example.com
  fs.readFile(exports.paths.archivedSites + '/' + url, function(error, data) {
    if (error) callback(false);
    else callback(true);
  });
};

exports.downloadUrls = function(urlArray) {
  for (var i = 0; i < urlArray.length; i++) {
    var url = urlArray[i];

    if (!url) continue;

    var options = {
      hostname: url,
      path: '/',
      rejectUnauthorized: false,
    };

    (function(url, options) {
      http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) { body += chunk });
        res.on('end', function() {
          fs.writeFile(exports.paths.archivedSites + '/' + url, body, function(err) {
            console.log(url)
            console.log(body)
            if (err) console.log('Could not archive ' + url);
          });
        });
      }).on('error', function(err) { console.log(url, err) });
    }(url, options));

  }
};
