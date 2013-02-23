console.log("Request handler 'js' was called.");
    url.parse(req.url,true).query.path;
    fs.readFile(__dirname + '/js/' + url.parse(req.url,true).query.path + '.js', function(err,data){
        if (err) throw err;
        res.writeHead(200,{'Content-type':'text/javascript'});
        res.write(data);
        res.end();
    });
