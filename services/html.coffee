fs = require('fs')      
sanitizeHtml = require('sanitize-html')     
cheerio = require('cheerio')   
_ = require('lodash-node')

_getReg = (data, reg) ->
    _.sortBy _.uniq data.match reg, (x) ->
        x[0]    

fs.readFile './test.html', 'utf8', (err, data) ->
    throw err if err

    $ = cheerio.load data

    _settings = {
        allowedTags: ['p', 'a', 'img', 'h1', 'h2']
        allowedAttributes:
            'a': ['href']
            'img': ['src']
    }      
    
    _sanitizedHtml = sanitizeHtml $('body').html(), _settings
    _sanitizedHtml = _sanitizedHtml.replace(/\s{2,}/g, ' ')
    _sanitizedHtml = _sanitizedHtml.replace(/<[a-z]+><\/[a-z]+>/g, '')

    $ = cheerio.load _sanitizedHtml

    _images = $ 'img'
    .map (i, elem) ->
      this.attribs.src
    .get()

    _links = $ 'a'
    .map (i, elem) ->
      href: this.attribs.href
      innerHTML: $(this).html()
    .get()

    console.log 
        html: _sanitizedHtml
        links: _links
        images: _.uniq _images
        people: _getReg _sanitizedHtml, /[A-ZÅÄÖ]([a-zåäöé]+|\.)(?:\s+[A-ZÅÄÖ]([a-zåäöé]+|\.)){1,3}/g
        years: _getReg _sanitizedHtml, /\d{4}/g
        streets: _getReg _sanitizedHtml, /([A-ZÅÄÖ][a-zåäö]+(([.] )|( )|([-])))+[1-9][0-9]{0,3}[a-z]/g