/*Path is a built in module in HTTP. It is a utility that handles
and tranforms file paths
*/
var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers.js');

var actions = {

  GET: function(req, res) {
    helper.serveAssets(res, req.url);
  },

  POST: function(req, res) {
    helper.collectData(req, function(url) {
      archive.isUrlInList(url, function(isInList) {
        if (isInList) {
          archive.isUrlArchived(url, function(isArchived) {
            if (isArchived) helper.redirect(res, url);
            else helper.redirect(res, '/loading.html');
          });
        } else {
          archive.addUrlToList(url, function() {  
            helper.redirect(res, '/loading.html');
          });
        }
      });
    });
  }

  //Function would finish before collectData is finished.
  //After we have collected the data, we can move to the next step. 
  // var list = helper.collectData();
  // if (archive.isUrlInList()) {
  //   if (archive.isUrlArchived()) {
  //     helpeer.redirect(loading);
  //   } else {
  //     helper.redirect(loading);
  //   }
  // } else {
  //   add to list
  //   redirect to loading
  // }


}

exports.handleRequest = function (req, res) {
  var method = req.method;
  if (actions[method]) 
    actions[method](req, res);
};

//handleRequest export has access to the actions object through closure scope

