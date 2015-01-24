Fs = require 'fs'
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
_regYear = /\d{4}(?![A-z\.\-"'@])/g
_regPerson = /[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)(?:\s+[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)){1,3}/g
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
                '<span class="year">' + match + '</span>'
            .replace _regPerson, (match) ->
                '<span class="person">' + match + '</span>'
            .replace _regStreet, (match) ->
                match = match.replace('</span>', '') + '</span>' if match.indexOf('</span>') > -1
                '<span class="street">' + match + '</span>' 

    _handleElement = ($, el, type, index, opt) ->                    
        $(el).addClass type + '-' + index

        attribs: el.attribs
        text: $(el).text()
        data: _getElData $(el)
        index: index

    $ = Cheerio.load _tag html
    _score = 0
    
    images: _.sortBy(
                $ 'img'
                    .map (i, elem) ->
                        _handleElement $, elem, 'image', i
                    .get()
                , 'attribs')        

    links:  _.sortBy(
                $ 'a'
                    .map (i, elem) ->
                        _handleElement $, elem, 'link', i
                    .get()
                , 'attribs')        

    years: _.sortBy(
                $ '.year'
                    .map (i, elem) ->
                        _score++
                        _handleElement $, elem, 'year', i
                    .get()
                , 'data')

    people: _.sortBy(
                $ '.person'
                    .map (i, elem) ->
                        _score++
                        _handleElement $, elem, 'person', i
                    .get()
                , 'data')

    streets: _.sortBy(
                $ '.street'
                    .map (i, elem) ->
                        _score++                        
                        _handleElement $, elem, 'street', i
                    .get()
                , 'data')

    html: _getElData $
    score: _score

module.exports = 
    get: _Get
        