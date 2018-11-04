"use strict";

var start = true;
var black = true;
var blackBack = true;
var starColor = "white";
var backColor = "white";

function init() {
  lightItUp();
}

function lightItUp() {
  if (start)
    blink();
  else
    blinkBack();
  start = false;
}

function blink() {
  if (black) {
    getID("star").style.color = starColor;
    black = false;
  }
  else {
    getID("star").style.color = "black";
    black = true;
  }
  setTimeout("blink()",500);
}

function blinkBack() {
  if (blackBack) {
    getID("body").style.backgroundColor = backColor;
    blackBack = false;
  }
  else {
    getID("body").style.backgroundColor = "black";
    blackBack = true;
  }
  setTimeout("blinkBack()",500);
}

function getID(id) { return document.getElementById(id); }