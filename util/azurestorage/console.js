function malfunction(server, currConn) {
  console.log(currConn);
  var str = "";
  for (var i=0; i < currConn; i++) {
      console.log("!");

    str = str + ".";
  }
  console.log(server + " - " + str);
  
}


malfunction("test", 10);