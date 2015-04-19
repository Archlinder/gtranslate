const Request = require('sdk/request').Request

function translationResult(str) {  
  newstr = '[';
  str = str.replace(/\\(?=[^u])/g, "\\");
  q = 0;
  insideQuote = false;
  for (var i = 1, len = str.length; i < len; i++) { //start at 1, take into acount opening brace      
    if(str[i] === '"'  && str[i-1] != '\\') {
      q++;
    }
    if(q % 2 == 0) { //even
      insideQuote = false;
    } else {
      insideQuote = true;
    }
    if(!insideQuote && str[i] === ',' && (str[i-1] === ',' || str[i-1] === '[' )) {
      newstr += '""';
    }
    newstr += str[i];
  }

  const result  = JSON.parse(newstr);
   //const translation = newstr.substr(15500);
  
  const translation = (
    result[0] && result[0].map(chunk => chunk[0]).join(' ')
  ) || null
   return {
    detectedSource: result[2],
    translation: translation? translation.trim() : null,
  }
}

function url(from, to, text) {
  const protocol = 'http://'
  const host = 'translate.google.com'
  const path = `/translate_a/single?client=t&ie=UTF-8&oe=UTF-8` +
               `&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at` +
               `&q=${encodeURIComponent(text)}&sl=${from}&tl=${to}&hl=${to}`
  return `${protocol}${host}${path}`
}

exports.translate = function translate(from, to, text, cb) {
  const req = Request({
    url: url(from, to, text),
    onComplete: res => cb(translationResult(res.text))
  })
  req.get()
}
