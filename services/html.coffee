fs = require 'fs'
sanitizeHtml = require 'sanitize-html'
cheerio = require 'cheerio'
Q = require 'Q'
_ = require 'lodash-node'
_sanitizeSettings = {
            allowedTags: ['p', 'a', 'img', 'h1', 'h2']
            allowedAttributes:
                'a': ['href', 'class']
                'img': ['src', 'class']
        } 

_getReg = (data, reg) ->
    _.sortBy _.uniq data.match reg, (x) ->
        x[0] 

_sanitize = (data) ->
    $ = cheerio.load data
    _sanitizedHtml = sanitizeHtml $('body').html(), _sanitizeSettings
    _sanitizedHtml = _sanitizedHtml.replace(/\s{2,}/g, ' ')
    _sanitizedHtml = _sanitizedHtml.replace(/<[a-z]+><\/[a-z]+>/g, '')
    _sanitizedHtml = _sanitizedHtml.replace(/<p> <\/p>/g, '')
    _sanitizedHtml = _sanitizedHtml.replace(/\n/g, '')    

_tag = (html) ->
    $ = cheerio.load html
    {        
        images: $ 'img'
                .map (i, elem) ->
                    $(this).addClass 'image-' + i        
                    this.attribs.src
                .get()

        links: $ 'a'
                .map (i, elem) ->
                    $(this).addClass 'link-' + i

                    id: i
                    href: this.attribs.href
                    innerHTML: $(this).html()
                .get()

        html: $.html()
    }


module.exports = (path) ->
    deferred = Q.defer()

    fs.readFile path, 'utf8', (err, data) ->
        deferred.reject err if err

        _data = _tag _sanitize data        
                 
        deferred.resolve 
            html: sanitizeHtml _data.html, _sanitizeSettings
            links: _data.links
            images: _.uniq _data.images
            people: _getReg _data.html, /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g
            years: _getReg _data.html, /\d{4}/g
            streets: _getReg _data.html, /([A-ZÅÄÖ][a-zåäö]+(([.] )|( )|([-])))+[1-9][0-9]{0,3}[a-z]/g

    deferred.promise
        