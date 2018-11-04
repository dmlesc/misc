"use strict";
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;

var validSites = ["changereport", "cloudservices", "jenkinsbrokenjobs", "psycle", "stores"];

var ct = [];
ct[".html"] = "text/html";
ct[".js"] = "application/javascript";
ct[".json"] = "application/json";
ct[".txt"] = "text/plain";
ct[".png"] = "image/png";

var fof = "404 - not found";
var bad = "bad query, you ought to be ashamed of yourself";
var fnf = "file not found, but seek more and ye shall find";

var server = http.createServer(function(req, res) {
   var contenttype;
   var parsedUrl = url.parse(req.url, true);
   var pnsplit = parsedUrl.pathname.split("/");
   var site = pnsplit[1];

   if (validSites.indexOf(site) == -1) {
      res.writeHead(404);
      res.end(fof);
   }
   else if (parsedUrl.search) {
      if (parsedUrl.query.dir) {
         var dir = parsedUrl.query.dir;
         if (/^[\.\/]/.test(dir))
            res.end(bad);
         else {
            fs.readdir(site + "/" + dir, function (err, list) {
               if (err)
                  res.end(bad);
               else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(list.reverse()));
               }
            });
         }
      }
      else if (parsedUrl.query.run) {
         var script = parsedUrl.query.run;
         if (script == "retrieveToday") {
            var child = spawn("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                              ["D:\\scripts\\changereport\\changereport.ps1 -date today"]);
            child.stdout.on("data", function(data) {
               res.end("out: " + data);
            });
            child.stderr.on("data", function(data) {
               res.end("err: " + data);
            });
            child.on("exit", function() {
               res.end("success");
            });
            child.stdin.end();
         }
         else
            res.end(bad);
      }
      else
         res.end(bad);
   }
   else {
      var file = "." + parsedUrl.pathname;
      if (!pnsplit[2])
         file += "/index.html";
      contenttype = ct[path.extname(file)];
      fs.readFile(file, function (err, data) {
         if (err)
            data = fnf;
         if (contenttype)
            res.writeHead(200, { "Content-Type": contenttype });
         res.end(data);
      });
   }
});
server.listen(80, "devops-util");