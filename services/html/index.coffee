fs = require 'fs'
sanitizeHtml = require 'sanitize-html'
cheerio = require 'cheerio'
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
_regYear = /\d{4}/g
_regPerson = /[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)(?:\s+[A-ZÅÄÖÉÜ]([a-zåäöéü]+|\.)){1,3}/g
_regStreet = /([A-ZÅÄÖÉÜ][a-zåäöéü]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g

_sanitize = (data) ->
    $ = cheerio.load data
    sanitizeHtml $('body').html(), _sanitizeSettings
        .replace(/\s{2,}/g, ' ') #empty double rows
        .replace(/<[a-z]+><\/[a-z]+>/g, '') #empty tags
        .replace(/<p> <\/p>/g, '') #spaces
        .replace(/\n/g, '') #line breaks    

_getElData = (el) ->
    sanitizeHtml el.html(), _sanitizeSettings

_tag = (html) ->
    html
        .replace _regYear, (match) ->
            '<span class="year">' + match + '</span>'
        .replace _regPerson, (match) ->
            '<span class="person">' + match + '</span>'
        .replace _regStreet, (match) ->
            match = match.replace('</span>', '') + '</span>' if match.indexOf('</span>') > -1
            '<span class="street">' + match + '</span>'   

_sortAndClassify = (html) ->
    _handleElement = ($, el, type, index, opt) ->                    
                        $(el).addClass type + '-' + index
                        _score++

                        attribs: el.attribs
                        text: $(el).text()
                        data: _getElData $(el)
                        index: index

    $ = cheerio.load _tag html
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
                        _handleElement $, elem, 'year', i
                    .get()
            , 'data')

    people: _.sortBy(
                $ '.person'
                    .map (i, elem) ->
                        _handleElement $, elem, 'person', i
                    .get()
            , 'data')

    streets: _.sortBy(
                $ '.street'
                    .map (i, elem) ->
                        _handleElement $, elem, 'street', i
                    .get()
            , 'data')                                                    
    html: _getElData $
    score: _score

module.exports = (path) ->
    deferred = Q.defer()

    fs.readFile path, 'utf8', (err, data) ->
        deferred.reject err if err           
        deferred.resolve _sortAndClassify _sanitize data

    deferred.promise
        