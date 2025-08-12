const randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function setOptionsValues() {	
    // Check localStorage expiration: clear the local storage every x amount of time 
    checkExpiration ();

    const max_age = localStorage.getItem('max_age');
    const acr_values = localStorage.getItem('acr_values');
    const redirect_uri = localStorage.getItem('redirect_uri');
    const scope = localStorage.getItem('scope');
    const prompt = localStorage.getItem('prompt');
    const nonce = localStorage.getItem('nonce');
    const login_hint = localStorage.getItem('login_hint'); 
    const id_token_hint = localStorage.getItem('id_token_hint');
    const ui_locales = localStorage.getItem('ui_locales');

    if ( max_age ) document.getElementById('max_age').value = max_age;
    if ( acr_values ) document.getElementById('acr_values').value = acr_values;
    if ( redirect_uri ) document.getElementById('redirect_uri').value = redirect_uri;
    if ( scope ) document.getElementById('scope').value = scope;
    if ( prompt ) document.getElementById('prompt').value = prompt;
    if ( nonce ) document.getElementById('nonce').checked = (nonce === 'true') ;
    if ( login_hint ) document.getElementById('login_hint').checked = (login_hint === 'true');
    if ( id_token_hint ) document.getElementById('id_token_hint').checked = (id_token_hint === 'true')
    else storeVal('id_token_hint', 'true') ;
    if ( ui_locales ) document.getElementById('ui_locales').checked = (ui_locales === 'true');

    // store lang_locale: for login page redirection purpose (to the right language)
    localStorage.setItem('lang_locale', window.location.toString().match(/fr$/) ? 'fr-CA' : 'en-CA');
}

function storeVal(key, val) {	
    localStorage.setItem(key, val);
}

function clearValues() {	
    localStorage.clear();
}

function checkExpiration () { 
    var hours = 3; // to clear the localStorage after 3 hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if ( setupTime == null ) {
        localStorage.setItem('setupTime', now)
    } else {
        if( now-setupTime > hours*60*60*1000 ) {
            localStorage.clear()
            localStorage.setItem('setupTime', now);
        }
    }
}

function submitWithQueryString(obj) {		     
    const cspUrl = new URL(obj.href);
    const scope = document.getElementById('scope');
    const prompt = document.getElementById('prompt');
    const max_age = document.getElementById('max_age').value;
    const acr_values = document.getElementById('acr_values').value;
    const redirect_uri = document.getElementById('redirect_uri').value;

    cspUrl.searchParams.set('scope', scope.options[scope.selectedIndex].text);
    cspUrl.searchParams.set('max_age', max_age);
    if ( prompt.options[prompt.selectedIndex].value != 'empty' ) cspUrl.searchParams.set('prompt', prompt.options[prompt.selectedIndex].text);
    if ( document.getElementById('ui_locales').checked ) cspUrl.searchParams.set('ui_locales', window.location.toString().match(/fr$/) ? 'fr-CA' : 'en-CA');
    if ( document.getElementById('nonce').checked ) cspUrl.searchParams.set('nonce', randomString(32));
    if ( document.getElementById('login_hint').checked ) cspUrl.searchParams.set('login_hint', randomString(32));
    if ( acr_values != '' ) cspUrl.searchParams.set('acr_values', acr_values);
    if ( redirect_uri != '' ) cspUrl.searchParams.set('redirect_uri', redirect_uri);

    obj.href = cspUrl;
}