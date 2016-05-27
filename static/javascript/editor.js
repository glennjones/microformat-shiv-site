/*!
	parse
	Used by http://localhost:3000/
	Copyright (C) 2010 - 2016 Glenn Jones. All Rights Reserved.
	MIT License: https://raw.github.com/glennjones/microformat-shiv/master/license.txt
*/

window.onload = function() {

    var htmlEditor = document.getElementById('html'),
        baseUrl = document.getElementById('baseurl'),
        filters = document.getElementById('filters'),
        collapsewhitespace = document.getElementById('collapsewhitespace'),
        //overlappingversions = document.getElementById('overlappingversions'),
        //impliedPropertiesByVersion  = document.getElementById('impliedPropertiesByVersion'),
        parseLang = document.getElementById('parseLang'),
        parseLatLonGeo = document.getElementById('parseLatLonGeo'),
        dateformat = document.getElementById("dateformat");

    addTypeEvents( htmlEditor );
    addTypeEvents( baseUrl );
    addTypeEvents( filters  );

    addChangeEvents( collapsewhitespace );
    //addChangeEvents( overlappingversions );
    //addChangeEvents( impliedPropertiesByVersion );
    addChangeEvents( parseLang );
    addChangeEvents( parseLatLonGeo );
    addChangeEvents( dateformat )

    fireParse();
};


function addTypeEvents( input ){
    input.addEventListener('keypress', function (e) {
        fireParse();
    },false);

    input.addEventListener('input', function (e) {
        fireParse();
    },false);

    addChangeEvents( input );
}


function addChangeEvents( input ){
    input.addEventListener('change', function (e) {
        fireParse();
    },false);
}


function fireParse(){
         var html,
            baseUrl,
            filter,
            collapsewhitespace,
            //overlappingversions,
            //impliedPropertiesByVersion,
            dateformatElt,
            dateformat,
            doc,
            node,
            options,
            mfJSON,
            parserJSONElt;

        // get data from html
        html = document.getElementById('html').value;
        baseUrl = document.getElementById('baseurl').value;
        filters = document.getElementById('filters').value;
        collapsewhitespace = document.getElementById('collapsewhitespace').checked;
        //overlappingversions = document.getElementById('overlappingversions').checked;
        //impliedPropertiesByVersion  = document.getElementById('impliedPropertiesByVersion').checked;

        parseLang = document.getElementById('parseLang').checked;
        parseLatLonGeo = document.getElementById('parseLatLonGeo').checked;
        dateformatElt = document.getElementById("dateformat");
        dateformat = dateformatElt.options[dateformatElt.selectedIndex].value;
        parserJSONElt = document.querySelector('#parser-json pre code')


        var dom = new DOMParser();
        doc = dom.parseFromString( html, 'text/html' );

        options ={
            'document': doc,
            'node': doc,
            'dateFormat': dateformat,
            //'overlappingVersions': true,
            //'impliedPropertiesByVersion': false,
            'lang': false,
            'parseLatLonGeo': false
        };

        if(baseUrl.trim() !== ''){
            options.baseUrl = baseUrl;
        }

        if(filters.trim() !== ''){
            if(filters.indexOf(',') > -1){
               options.filters = trimArrayItems(filters.split(','));
            }else{
                options.filters = [filters.trim()];
            }
        }

        if(collapsewhitespace === true){
            options.textFormat = 'normalised';
        }

        /*
        if(overlappingversions === true){
            options.overlappingVersions = false;
        }

        if(impliedPropertiesByVersion === true){
            options.impliedPropertiesByVersion = true;
        }
        */

        if(parseLang === true){
            options.lang = true
        }

        if(parseLatLonGeo === true){
            options.parseLatLonGeo = true
        }

        if(options.baseUrl){
            html = '<base href="' + baseUrl+ '">' + html;
        }



        // parse direct into Modules to help debugging
        if(window.Modules){
            var parser = new Modules.Parser();
            mfJSON = parser.get(options);
        }else if(window.Microformats){
            mfJSON = Microformats.get(options);
        }


        // format output
        parserJSONElt.innerHTML = htmlEscape( js_beautify( JSON.stringify(mfJSON) ) );
        //prettyPrint();
}



function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}


function trimArrayItems( arr ){
    return arr.map(function(item){
        return item.trim();
    })
}

