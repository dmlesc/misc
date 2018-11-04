'use strict';

const request = require('request');


function sendRequest(req) {
	request(req, (err, res, body) => {
		if (err) { console.log(err); }
		else {
			//console.log(res);
      //console.log(res.statusCode, body);
      
      received++;

      if (received % 1000 == 0)
        console.log('received', received);

			if (requests.length)
				sendRequest(requests.shift());
			else
				console.log('done');
		}
	});
}

var requests = [];

var numRequests = 50000;

var received = 0;

var uri = 'http://10.1.0.234:8000/';
//var uri = 'http://52.229.26.18:8000/';
var uri = 'https://portallogstest.my.imaginelearning.com/';

var log = {
  username: 'test@test.com',
  code: '400',
  message: 'error message',
  service: 'service',
  backend_url: 'https://backend.my.testservice.com',
  ui_url: 'https://ui.my.testservice.com?adsalkfjasdflkj&asdf=yes'
}

var options = {
	uri: 'placeholder',
	method: 'POST',
	json: 'placeholder'
};

for (var i=0; i<numRequests; i++) {
  var opt = JSON.parse(JSON.stringify(options));
  opt.uri = uri;
  opt.json = log;
  requests.push(opt);
}


sendRequest(requests.shift());