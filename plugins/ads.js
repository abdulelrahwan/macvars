function addScript(attribute, text, callback) {
    var s = document.createElement('script');
    s.setAttribute("src","https://hb.vntsm.com/v3/live/ad-manager.min.js")
    s.setAttribute("type","javascript")
    s.setAttribute("data-site-id","5ed7746cb519801b8a4d515b")
    s.setAttribute("data-mode","scan")
    s.setAttribute('data-cfasync',false)
    s.setAttribute("async",true)
    s.onload = callback;
    document.head.appendChild(s);
}

addScript({
    src: 'https://www.google.com',
    type: 'text/javascript',
    async: null
}, '', function(){});