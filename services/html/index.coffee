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
_regPerson = /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g
_regStreet = /([A-ZÅÄÖ][a-zåäö]+(( )|([-])|(<\/span> )))+[1-9][0-9]{0,3}/g

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
    $ = cheerio.load _tag html
    
    {        
        images: _.sortBy(
                    $ 'img'
                        .map (i, elem) ->
                            $(this).addClass 'image-' + i        
                            
                            attribs: this.attribs
                            index: i
                        .get()
                , 'attribs')        

        links:  _.sortBy(
                    $ 'a'
                        .map (i, elem) ->
                            $(this).addClass 'link-' + i

                            attribs: this.attribs
                            data: _getElData $(this)
                            index: i
                        .get()
                , 'attribs')        

        years: _.sortBy(
                    $ '.year'
                        .map (i, elem) ->
                            $(this).addClass 'year-' + i        
                            data: _getElData $(this)
                            index: i
                        .get()
                , 'data')

        people: _.sortBy(
                    $ '.person'
                        .map (i, elem) ->
                            $(this).addClass 'person-' + i        
                            
                            data: _getElData $(this)
                            index: i
                        .get()
                , 'data')

        streets: _.sortBy(
                    $ '.street'
                        .map (i, elem) ->
                            $(this).addClass 'street-' + i        
                            
                            data: _getElData $(this)
                            index: i
                        .get()
                , 'data')                                                    

        html: _getElData $
    }

module.exports = (path) ->
    deferred = Q.defer()

    fs.readFile path, 'utf8', (err, data) ->
        deferred.reject err if err                
        deferred.resolve _sortAndClassify _sanitize data

    deferred.promise
        