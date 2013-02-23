function route(pathname, handle, response, request){
    console.log("About to route a request for "+pathname);
    if (typeof handle[pathname] === 'function'){
        handle[pathname](response, request);
    } else{
        console.log("No request handler found for "+pathname);
        response.writeHead(404, {"Content-type": "text/plain"});
        response.write("OOPS!!! 404 page not found");
        response.end();
    }
}

exports.route = route;
