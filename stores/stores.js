var stores;

function init() {
   var ajax = new XMLHttpRequest();
   ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
         stores = JSON.parse(ajax.responseText);
         getID("English").innerHTML = getAppStoreStati("English");
         getID("Espanol").innerHTML = getAppStoreStati("Espanol");
      }
   };
   ajax.open("GET", "stores/stores.json", true);
   ajax.send();
}

function getAppStoreStati(app) {
   var head = app;
   if (head == "Espanol")
      head = "Español";
   var html = "<h2>" + head + "</h2>";
   html += "<table class='left20'><tr><th>STORE</th><th>CURRENT</th><th>BETA</th></tr>";
   app = stores[app];
   for (var store in app) {
      var data = app[store];
      var Current = data["Current"];
      var CurrentStatus = data["CurrentStatus"];
      var Beta = data["Beta"];
      var BetaStatus = data["BetaStatus"];
      if (CurrentStatus != "none")
         Current += " (" + CurrentStatus + ")";
      if (BetaStatus != "none")
         Beta += " (" + BetaStatus + ")";
      html += createTableRow([store, Current, Beta]);
   }
   html += "</table>";
   return html;
}

function getID(id) {
   return document.getElementById(id);
}
function createTableRow(data) {
   var html = "<tr>";
   for (var i = 0; i < data.length; i++)
      html += "<td>" + data[i] + "</td>";
   html += "</tr>";
   return html;
}
