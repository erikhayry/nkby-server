Fs = require 'fs'
Path = require 'path'
SanitizeHtml = require 'sanitize-html'
Cheerio = require 'cheerio'
Q = require 'Q'
_ = require 'lodash-node'

_sanitizeSettings = {
            allowedTags: ['p', 'a', 'img', 'h1', 'h2', 'span']
            allowedAttributes:
                'a': ['href', 'class']
                'img': ['src', 'class']
                'span': ['class']
        } 

#Regexs        
_regYear = /\d{4}(?![A-z\.\-"'@\/])/g
_regPeople = /[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)(?:\s+[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)){1,3}/g
_regStreet = /([A-ZÅÄÖÉÜ][a-zåäöéü]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g

_Get = (path) ->
    _deferred = Q.defer()
    path = './data/www/'+path

    console.log path

    Fs.exists path, (exists) ->
        if not exists
            console.log 'not found'
            _deferred.reject()
        else    
            Fs.readFile path, 'utf8', (err, html) ->
                _deferred.reject err if err           
                _deferred.resolve _SortAndClassify _Sanitize html

    _deferred.promise
    
_Sanitize = (html) ->
    $ = Cheerio.load html
    SanitizeHtml $('body').html(), _sanitizeSettings
        .replace /(([A-ZÅÄÖ]) )(([A-zÅÄÖåäö]) )+/g, (match) ->
            match.replace(/\ /g, '') + ' '
        .replace /\s{2,}/g, ' ' #empty double rows
        .replace /<[a-z]+><\/[a-z]+>/g, '' #empty tags
        .replace /<p> <\/p>/g, '' #spaces
        .replace /\n/g, '' #line breaks    

_SortAndClassify = (html) ->

    _getElData = (el) ->
        SanitizeHtml el.html(), _sanitizeSettings

    _tag = (html) ->
        html
            .replace _regYear, (match) ->
                '<span class="years">' + match + '</span>'
            .replace _regPeople, (match) ->
                '<span class="people">' + match + '</span>'
            .replace _regStreet, (match) ->
                match = match.replace('</span>', '') + '</span>' if match.indexOf('</span>') > -1
                '<span class="streets">' + match + '</span>' 

    _handleElement = ($, el, type, index, opt) ->                    
        $(el).addClass type + '-' + index

        src = el.attribs.src || ''
        href = el.attribs.href || ''

        text: $(el).text()
        data: _getElData $(el)
        index: index
        src:
            local: el.attribs.src
            www: 'http://www.nykarlebyvyer.nu' + Path.resolve('/data/www/', src)
        href: 
            local: el.attribs.href
            www: 'http://www.nykarlebyvyer.nu' + Path.resolve('/data/www/', href)   

    $ = Cheerio.load _tag html
    _score = 0
    
    images: _.sortBy(
                $ 'img'
                    .map (i, elem) ->                 
                        $(elem).attr('src', 'http://www.nykarlebyvyer.nu'+Path.resolve('/data/www/', elem.attribs.src)) if elem.attribs.src
                        _handleElement $, elem, 'image', i
                    .get()
                , 'attribs')        

    links:  _.sortBy(
                $ 'a'
                    .map (i, elem) ->
                        _handleElement $, elem, 'links', i
                    .get()
                , 'attribs')        

    years: _.sortBy(
                $ '.years'
                    .map (i, elem) ->
                        _score++
                        _handleElement $, elem, 'years', i
                    .get()
                , 'data')

    people: _.sortBy(
                $ '.people'
                    .map (i, elem) ->
                        _score++
                        _handleElement $, elem, 'people', i
                    .get()
                , 'data')

    streets: _.sortBy(
                $ '.street'
                    .map (i, elem) ->
                        _score++                        
                        _handleElement $, elem, 'streets', i
                    .get()
                , 'data')

    html: _getElData $
    score: _score

module.exports = 
    get: _Get
        