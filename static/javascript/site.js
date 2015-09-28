/*
All content and code is released into the public domain
http://en.wikipedia.org/wiki/public_domain

Contributors
Glenn Jones - http://glennjones.net/

Takes existing blocks of html with class 'e-x-microformat' 
and creates a viewable version of the code within the page
*/


window.onload = function () {


    var format = document.getElementById('format').innerHTML;

    // html markup
    var node = document.getElementById('example');
    var title = createHeading(node, 'HTML markup for the '+ format +':')
    createCodeBlock(title, node.innerHTML, 'language-html', 'html')

    // script example
    node = document.getElementById('example-script');
    title = createHeading(node, 'Javascript used to parse the '+ format +':')
    code = createCodeBlock(title, node.innerHTML, 'language-javascript', 'text')

    // json output
    var options = {
        'node': document.getElementById('example'),
        'filters': [format],
        'textFormat': 'normalised'
    }
    items = Microformats.get( options );
    text = JSON.stringify( items );
    text = js_beautify( text );

    title = createHeading(code, 'JSON output from parser:')
    code = createCodeBlock(title, text, 'language-json', 'html')
 
    
    prettyPrint();


};


function createHeading(node, text){
    var title = document.createElement('h2');
    title.appendChild(document.createTextNode(text));
    insertAfter(title, node);
    return title;
}

function createCodeBlock(node, text, language, format){
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    code.className = language;
    pre.appendChild(code);
    pre.className = 'prettyprint'; 
    insertAfter(pre, node);
    if(format === 'html'){
        code.innerHTML = encodeHTML(text);
    }
    if(format === 'text'){
        if(code.innerText){
            code.innerText = encodeHTML(text);
        }else if(code.textContent === ''){
            code.textContent = encodeHTML(text);
        }
    }
    return pre;
}




function encodeHTML(str) {
    return str.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


// Does the node have a class
function hasClass(node, className) {
    if (node.className) {
        return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    } else {
        return false;
    }
};
 
 
// Add a class to an node
function addClass(node, className) {
    if (hasClass(node, className)) node.className += " " + className;
};
 
 
// Removes a class from an node
function removeClass(node, className) {
    if (hasClass(node, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        node.className = node.className.replace(reg, ' ');
    }
};
 

//create function, it expects 2 values.
function insertAfter(newElement,targetElement) {
    //target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;
    
    //if the parents lastchild is the targetElement...
    if(parent.lastchild == targetElement) {
        //add the newElement after the target element.
        parent.appendChild(newElement);
        } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
        }
}