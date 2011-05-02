feather.ns("featherdoc");

var md = require("node-markdown").Markdown,
    request = require("request");

featherdoc.getMarkdown = function(url, cb) {
  //var url = 'https://github.com/mikeal/request/raw/master/README.md';
  feather.logger.info("In getMarkdown");
  
  var doc = featherdoc.markdownCache.get(url);
  if (doc) {
    feather.logger.info({message:"Returning cached document for "+url, category: "featherdoc"});
    cb({doc: doc});
  } else {
    feather.logger.info({message:"Requesting " + url, category: "featherdoc"});
    request({url:url}, function(err, res, body) {
      debugger;
      if (!err) {
        if (res.statusCode == 200) {
          var output = md(body);
          featherdoc.markdownCache.add(url, output);
          cb({doc: output});
        } else {
          feather.logger.error("Error getting markdown doc: " + res.statusCode);
          debugger;
          cb({doc: url + ": " + res.statusCode});
        }
      } else {
        cb({doc: err.reason});
      }
    });
  }
};

featherdoc.markdown = feather.widget.create({
	name: "featherdoc.markdown",
	path: "w/markdown/",
	prototype: {
		initialize: function($super, options) {
			$super(options);
			this.url = options.url;
      if (options.url) {
        featherdoc.getMarkdown(options.url, function(result) {
          this.doc = result.doc;
        });
      }
		}
	}		
});