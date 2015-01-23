var Cheerio, Fs, Q, SanitizeHtml, _, _Get, _Sanitize, _SortAndClassify, _regPerson, _regStreet, _regYear, _sanitizeSettings;

Fs = require('fs');

SanitizeHtml = require('sanitize-html');

Cheerio = require('cheerio');

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

_regYear = /\d{4}(?![A-z\.\-"'@])/g;

_regPerson = /[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)(?:\s+[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)){1,3}/g;

_regStreet = /([A-ZÅÄÖÉÜ][a-zåäöéü]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g;

_Get = function(path) {
  var _deferred;
  _deferred = Q.defer();
  Fs.exists(path, function(exists) {
    if (!exists) {
      return _deferred.reject();
    } else {
      return Fs.readFile(path, 'utf8', function(err, html) {
        if (err) {
          _deferred.reject(err);
        }
        return _deferred.resolve(_SortAndClassify(_Sanitize(html)));
      });
    }
  });
  return _deferred.promise;
};

_Sanitize = function(html) {
  var $;
  $ = Cheerio.load(html);
  return SanitizeHtml($('body').html(), _sanitizeSettings).replace(/(([A-ZÅÄÖ]) )(([A-zÅÄÖåäö]) )+/g, function(match) {
    return match.replace(/\ /g, '') + ' ';
  }).replace(/\s{2,}/g, ' ').replace(/<[a-z]+><\/[a-z]+>/g, '').replace(/<p> <\/p>/g, '').replace(/\n/g, '');
};

_SortAndClassify = function(html) {
  var $, _getElData, _handleElement, _score, _tag;
  _getElData = function(el) {
    return SanitizeHtml(el.html(), _sanitizeSettings);
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
  _handleElement = function($, el, type, index, opt) {
    $(el).addClass(type + '-' + index);
    return {
      attribs: el.attribs,
      text: $(el).text(),
      data: _getElData($(el)),
      index: index
    };
  };
  $ = Cheerio.load(_tag(html));
  _score = 0;
  return {
    images: _.sortBy($('img').map(function(i, elem) {
      return _handleElement($, elem, 'image', i);
    }).get(), 'attribs'),
    links: _.sortBy($('a').map(function(i, elem) {
      return _handleElement($, elem, 'link', i);
    }).get(), 'attribs'),
    years: _.sortBy($('.year').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'year', i);
    }).get(), 'data'),
    people: _.sortBy($('.person').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'person', i);
    }).get(), 'data'),
    streets: _.sortBy($('.street').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'street', i);
    }).get(), 'data'),
    html: _getElData($),
    score: _score
  };
};

module.exports = {
  get: _Get
};

//# sourceMappingURL=index.js.map
