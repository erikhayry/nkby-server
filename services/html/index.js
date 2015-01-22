var Q, cheerio, fs, sanitizeHtml, _, _getElData, _regPerson, _regStreet, _regYear, _sanitize, _sanitizeSettings, _sortAndClassify, _tag;

fs = require('fs');

sanitizeHtml = require('sanitize-html');

cheerio = require('cheerio');

Q = require('Q');

_ = require('lodash-node');

_sanitizeSettings = {
  allowedTags: ['p', 'a', 'img', 'h1', 'h2', 'span'],
  allowedAttributes: {
    'a': ['href', 'class'],
    'img': ['src', 'class'],
    'span': ['class']
  }
};

_regYear = /\d{4}/g;

_regPerson = /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g;

_regStreet = /([A-ZÅÄÖ][a-zåäö]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g;

_sanitize = function(data) {
  var $;
  $ = cheerio.load(data);
  return sanitizeHtml($('body').html(), _sanitizeSettings).replace(/\s{2,}/g, ' ').replace(/<[a-z]+><\/[a-z]+>/g, '').replace(/<p> <\/p>/g, '').replace(/\n/g, '');
};

_getElData = function(el) {
  return sanitizeHtml(el.html(), _sanitizeSettings);
};

_tag = function(html) {
  return html.replace(_regYear, function(match) {
    return '<span class="year">' + match + '</span>';
  }).replace(_regPerson, function(match) {
    return '<span class="person">' + match + '</span>';
  }).replace(_regStreet, function(match) {
    if (match.indexOf('</span>') > -1) {
      match = match.replace('</span>', '') + '</span>';
    }
    return '<span class="street">' + match + '</span>';
  });
};

_sortAndClassify = function(html) {
  var $;
  $ = cheerio.load(_tag(html));
  return {
    images: _.sortBy($('img').map(function(i, elem) {
      $(this).addClass('image-' + i);
      return {
        attribs: this.attribs,
        index: i
      };
    }).get(), 'attribs'),
    links: _.sortBy($('a').map(function(i, elem) {
      $(this).addClass('link-' + i);
      return {
        attribs: this.attribs,
        data: _getElData($(this)),
        index: i
      };
    }).get(), 'attribs'),
    years: _.sortBy($('.year').map(function(i, elem) {
      $(this).addClass('year-' + i);
      return {
        data: _getElData($(this)),
        index: i
      };
    }).get(), 'data'),
    people: _.sortBy($('.person').map(function(i, elem) {
      $(this).addClass('person-' + i);
      return {
        data: _getElData($(this)),
        index: i
      };
    }).get(), 'data'),
    streets: _.sortBy($('.street').map(function(i, elem) {
      $(this).addClass('street-' + i);
      return {
        data: _getElData($(this)),
        index: i
      };
    }).get(), 'data'),
    html: _getElData($)
  };
};

module.exports = function(path) {
  var deferred;
  deferred = Q.defer();
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      deferred.reject(err);
    }
    return deferred.resolve(_sortAndClassify(_sanitize(data)));
  });
  return deferred.promise;
};

//# sourceMappingURL=index.js.map