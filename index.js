var port = process.env.PORT || 3000, http = require('http'), fs = require('fs'), html = fs
		.readFileSync('geochart.html');

var server = http.createServer(function(req, res) {
	if (req.method === 'POST') {
		var body = '';

		req.on('data', function(chunk) {
			body += chunk;
		});

		req.on('end', function() {
			res.writeHead(200, 'OK', {
				'Content-Type' : 'text/plain'
			});
			res.end();
		});
	} else {
		res.writeHead(200);
		res.write(html);
		res.end();
	}
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
