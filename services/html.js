var Q, cheerio, fs, sanitizeHtml, _, _getReg, _sanitize, _sanitizeSettings, _tag;

fs = require('fs');

sanitizeHtml = require('sanitize-html');

cheerio = require('cheerio');

Q = require('Q');

_ = require('lodash-node');

_sanitizeSettings = {
  allowedTags: ['p', 'a', 'img', 'h1', 'h2'],
  allowedAttributes: {
    'a': ['href', 'class'],
    'img': ['src', 'class']
  }
};

_getReg = function(data, reg) {
  return _.sortBy(_.uniq(data.match(reg, function(x) {
    return x[0];
  })));
};

_sanitize = function(data) {
  var $, _sanitizedHtml;
  $ = cheerio.load(data);
  _sanitizedHtml = sanitizeHtml($('body').html(), _sanitizeSettings);
  _sanitizedHtml = _sanitizedHtml.replace(/\s{2,}/g, ' ');
  _sanitizedHtml = _sanitizedHtml.replace(/<[a-z]+><\/[a-z]+>/g, '');
  _sanitizedHtml = _sanitizedHtml.replace(/<p> <\/p>/g, '');
  return _sanitizedHtml = _sanitizedHtml.replace(/\n/g, '');
};

_tag = function(html) {
  var $;
  $ = cheerio.load(html);
  return {
    images: $('img').map(function(i, elem) {
      $(this).addClass('image-' + i);
      return this.attribs.src;
    }).get(),
    links: $('a').map(function(i, elem) {
      $(this).addClass('link-' + i);
      return {
        id: i,
        href: this.attribs.href,
        innerHTML: $(this).html()
      };
    }).get(),
    html: $.html()
  };
};

module.exports = function(path) {
  var deferred;
  deferred = Q.defer();
  fs.readFile(path, 'utf8', function(err, data) {
    var _data;
    if (err) {
      deferred.reject(err);
    }
    _data = _tag(_sanitize(data));
    return deferred.resolve({
      html: sanitizeHtml(_data.html, _sanitizeSettings),
      links: _data.links,
      images: _.uniq(_data.images),
      people: _getReg(_data.html, /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g),
      years: _getReg(_data.html, /\d{4}/g),
      streets: _getReg(_data.html, /([A-ZÅÄÖ][a-zåäö]+(([.] )|( )|([-])))+[1-9][0-9]{0,3}[a-z]/g)
    });
  });
  return deferred.promise;
};

//# sourceMappingURL=html.js.map
