var cheerio, fs, sanitizeHtml, _, _getReg;

fs = require('fs');

sanitizeHtml = require('sanitize-html');

cheerio = require('cheerio');

_ = require('lodash-node');

_getReg = function(data, reg) {
  return _.sortBy(_.uniq(data.match(reg, function(x) {
    return x[0];
  })));
};

fs.readFile('./test.html', 'utf8', function(err, data) {
  var $, _images, _links, _sanitizedHtml, _settings;
  if (err) {
    throw err;
  }
  $ = cheerio.load(data);
  _settings = {
    allowedTags: ['p', 'a', 'img', 'h1', 'h2'],
    allowedAttributes: {
      'a': ['href'],
      'img': ['src']
    }
  };
  _sanitizedHtml = sanitizeHtml($('body').html(), _settings);
  _sanitizedHtml = _sanitizedHtml.replace(/\s{2,}/g, ' ');
  _sanitizedHtml = _sanitizedHtml.replace(/<[a-z]+><\/[a-z]+>/g, '');
  $ = cheerio.load(_sanitizedHtml);
  _images = $('img').map(function(i, elem) {
    return this.attribs.src;
  }).get();
  _links = $('a').map(function(i, elem) {
    return {
      href: this.attribs.href,
      innerHTML: $(this).html()
    };
  }).get();
  return console.log({
    html: _sanitizedHtml,
    links: _links,
    images: _.uniq(_images),
    people: _getReg(_sanitizedHtml, /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g),
    years: _getReg(_sanitizedHtml, /\d{4}/g),
    streets: _getReg(_sanitizedHtml, /([A-ZÅÄÖ][a-zåäö]+(([.] )|( )|([-])))+[1-9][0-9]{0,3}[a-z]/g)
  });
});

//# sourceMappingURL=html.js.map
