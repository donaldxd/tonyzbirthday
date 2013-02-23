var qs = require("querystring");
var fs = require("fs");
var e = require('events').EventEmitter;
var c = require('cradle');
var url = require('url');

function index(response){
    console.log("Request handler 'index' was called.");
    response.writeHead(200, {"Content-type":"text/plain"});
    response.write("Hello Tony! Don't know where to \"start\"? How about \"/start\"?");
    response.end();
}

function start(response, request){
    console.log("Request handler 'start' was called.");
    var body =
    '<html>'+
        '<head>'+
            '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />'+
            '<title>start</title>'+
            '<link rel="stylesheet" type="text/css" href="/css?path=main">'+
        '</head>'+
        '<body>'+
        '<h3>Start by cracking!</h3>'+
        '<div class="box">'+
            '<form action="/c9a3928d-900f-ee74" method="POST">'+
                '<div><span>username: </span></div><input type="text" name="username" class="input" />'+
                '<div><span>password: </span></div><input type="password" name="password" class="input" /><br>'+
                '<input type="submit" value="log in" class="submit"/>'+
            '</form>'+
        '</div>'+
        '<div class="hint"><p>User name is your name Tony</p><p>hint for pwd: What\'s the point of this web?</p></div>'
        '</body>'+
    '</html>';
    
    response.writeHead(200, {"Content-type":"text/html"});
    response.write(body);
    response.end();
}

function video(response,request){
    var postEmitter = new e();
    console.log('Req handler "video" was called.');
    var body =
    '<html>'+
        '<head>'+
            '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />'+
            '<title>watch?v=</title>'+
        '</head>'+
        '<body>'+
            '<p>You got another code... What should you do with it?</p>'+
            '<p>M9zH8pPKehg</p>'+
            '<a title="look at the title" href="#">want a hint? hover me</a>'+
        '</body>'+
    '</html>';

    
    var db = new(c.Connection)('https://nodejitsudb7717398644.iriscouch.com',6984,{
        cache: true,
        raw: false
    }).database('tony');

    if (request.method == 'POST'){
        var postbody = '';
        request.on('data',function(data){
            postbody += data;
        });
        request.on('end',function(){
            var POST = qs.parse(postbody);
            db.view('tony/all', function(err,res){
                var username = '';
                var pwd = '';
                if (err) throw err;
                res.forEach(function(row){
                    username = row.username;
                    pwd = row.pwd;
                });
                postEmitter.emit('postend',POST,username,pwd);
            });
            //console.log(POST);
            //console.log(POST.username);
        });
        postEmitter.on('postend',function(post,username,pwd){
            if(post.username == username && post.password == pwd){
                console.log('logged in');
                //response.write(POST.username);
                response.writeHead(200,{'Content-type':'text/html'});
                response.write(body);
                response.end();
            } else{
                console.log('blocked oops!');
                //response.write('wrong');
                response.writeHead(200,{'Content-type':'text/html'});
                response.write('<a href="/start">oops!! wrong... try again.</a>');
                response.end();
            }
        });
    }else{
        response.writeHead(200,{'Content-type':'text/html'});
        response.write('<a href="/start">please log in first</a>');
        response.end();
    }
}

function css(res,req){
    console.log("Request handler 'css' was called.");
    fs.readFile(__dirname + '/css/' + url.parse(req.url,true).query.path + '.css', function(err,data){
        if (err) throw err;
        res.writeHead(200,{'Content-type':'text/css'});
        res.write(data);
        res.end();
    });
}

function js(res,req){
    console.log("Request handler 'js' was called.");
    fs.readFile(__dirname + '/js/' + url.parse(req.url,true).query.path + '.js', function(err,data){
        if (err) throw err;
        res.writeHead(200,{'Content-type':'text/javascript'});
        res.write(data);
        res.end();
    });
}

function favicon(res,req){
    console.log("Request handler 'favicon' was called.");
    fs.readFile(__dirname + url.parse(req.url,true).pathname, function(err,data){
        if (err) throw err;
        res.writeHead(200,{'Content-type':'image/x-icon'});
        res.write(data);
        res.end();
    });
}

exports.index = index;
exports.start = start;
exports.video = video;
exports.css = css;
exports.js = js;
exports.favicon = favicon;
