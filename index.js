var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var handle = {};
handle['/'] = requestHandlers.index;
handle['/start'] = requestHandlers.start;
handle['/c9a3928d-900f-ee74'] = requestHandlers.video;
handle['/css'] = requestHandlers.css;
handle['/js'] = requestHandlers.js;
handle['/favicon.ico'] = requestHandlers.favicon;

server.start(router.route, handle);
