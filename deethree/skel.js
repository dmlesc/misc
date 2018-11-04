"use strict";

window.onload = function(){}

var a = performance.now();
var b = performance.now();
console.log((b - a) + " ms");


function somefunction() {
   console.log("!!!");
}

function init() {
   console.log("init");
}

function req() {
   var req = new XMLHttpRequest();
   var url = "script.php";
   req.onreadystatechange=function() {
      if (req.readyState==4 && req.status==200) {
      }
   };
   req.open("GET", url, true);
   req.send();
}
function reqSync() {
   var req = new XMLHttpRequest();
   var url = "script.php";
   req.onreadystatechange=function() {
      var text = req.responseText;
   }
   req.open("GET", url, false);
   req.send();
}
function getID(id) { return document.getElementById(id); }
function transition(hide,show) {
   hideID(hide);
   showID(show);
}
function hideID(ids) {
   for (var i in ids)
      getID(ids[i]).style.display = "none";
}
function showID(ids) {
   for (var i in ids)
      getID(ids[i]).style.display = "block";
}
function giveFocus(id){ getID(id).focus(); }
function setInnerHTML(id,string){ getID(id).innerHTML = string; }
