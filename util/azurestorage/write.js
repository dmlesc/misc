var fs = require("fs");

fs.writeFile('input1.txt', 'string',  function(err) {
   if (err) {
       return console.error(err);
   }

   fs.readFile('input1.txt', function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("Asynchronous read: " + data.toString());
   });
});


fs.writeFile('input1.txt', 'string',  function(err) {
   if (err) {
       return console.error(err);
   }
});
