var Cheerio, Fs, Path, Q, SanitizeHtml, _, _Get, _Sanitize, _SortAndClassify, _regPeople, _regStreet, _regYear, _sanitizeSettings;

Fs = require('fs');

Path = require('path');

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

_regYear = /\d{4}(?![A-z\.\-"'@\/])/g;

_regPeople = /[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)(?:\s+[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)){1,3}/g;

_regStreet = /([A-ZÅÄÖÉÜ][a-zåäöéü]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g;

_Get = function(path) {
  var _deferred;
  _deferred = Q.defer();
  path = './data/www/' + path;
  console.log(path);
  Fs.exists(path, function(exists) {
    if (!exists) {
      console.log('not found');
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
      return '<span class="years">' + match + '</span>';
    }).replace(_regPeople, function(match) {
      return '<span class="people">' + match + '</span>';
    }).replace(_regStreet, function(match) {
      if (match.indexOf('</span>') > -1) {
        match = match.replace('</span>', '') + '</span>';
      }
      return '<span class="streets">' + match + '</span>';
    });
  };
  _handleElement = function($, el, type, index, opt) {
    var href, src, wwwSrc;
    $(el).addClass(type + '-' + index);
    src = el.attribs.src || '';
    href = el.attribs.href || '';
    if (src.indexOf('http') < 0) {
      wwwSrc = 'http://www.nykarlebyvyer.nu' + Path.resolve('/data/www/', src);
    }
    return {
      text: $(el).text(),
      data: _getElData($(el)),
      index: index,
      src: {
        local: el.attribs.src,
        www: wwwSrc || src
      },
      href: {
        local: el.attribs.href,
        www: 'http://www.nykarlebyvyer.nu' + Path.resolve('/data/www/', href)
      }
    };
  };
  $ = Cheerio.load(_tag(html));
  _score = 0;
  return {
    images: _.sortBy($('img').map(function(i, elem) {
      if (elem.attribs.src) {
        $(elem).attr('src', 'http://www.nykarlebyvyer.nu' + Path.resolve('/data/www/', elem.attribs.src));
      }
      return _handleElement($, elem, 'image', i);
    }).get(), 'attribs'),
    links: _.sortBy($('a').map(function(i, elem) {
      return _handleElement($, elem, 'links', i);
    }).get(), 'attribs'),
    years: _.sortBy($('.years').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'years', i);
    }).get(), 'data'),
    people: _.sortBy($('.people').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'people', i);
    }).get(), 'data'),
    streets: _.sortBy($('.street').map(function(i, elem) {
      _score++;
      return _handleElement($, elem, 'streets', i);
    }).get(), 'data'),
    html: _getElData($),
    score: _score
  };
};

module.exports = {
  get: _Get
};

//# sourceMappingURL=index.js.map
