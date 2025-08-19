/*
 MIT License

Copyright (c) 2023 - IBM Corp.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial
 portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const express = require('express');
const session = require('express-session');
require('dotenv').config();

const { Issuer, generators } = require('openid-client');
const path = require('path');
const app = express();

// Init session
app.use(session({
	secret: 'my-secret',
	resave: true,
	saveUninitialized: false,
	secure: true
}));

//middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'front-end'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const REDIRECT_URI_PATHNAME = new URL(process.env.REDIRECT_URI).pathname;

// Function for create client 
async function setUpOIDC() {
	let tenantURL = process.env.IBM_VERIFY_TENANT_URL;
	if (tenantURL?.endsWith('/')) {
		tenantURL = `${tenantURL}oauth2/.well-known/openid-configuration`
	} else {
		tenantURL = `${tenantURL}/oauth2/.well-known/openid-configuration`
	}
	const issuer = await Issuer.discover(tenantURL);
	const client = new issuer.Client({
		client_id: process.env.IBM_VERIFY_RP_CLIENT_ID,
		client_secret: process.env.IBM_VERIFY_RP_CLIENT_SECRET,
		redirect_uris: process.env.REDIRECT_URI,
		response_typese: process.env.RESPONSE_TYPE
	});

	return client;
}

// Home route
app.get('/', (req, res) => {
	if (req.session.token) {
		res.redirect("/dashboard");
	} else {
		res.render('index')
	}
});

// Login require
// store the code_verifier in your framework's session mechanism, if it is a cookie based solution
// it should be httpOnly (not readable by javascript) and encrypted.

app.get('/login', async (req, res) => {
	const client = await setUpOIDC();
	const url = client.authorizationUrl({
		scope: process.env.SCOPE,
		state: generators.state(),
		redirect_uri: process.env.REDIRECT_URI,
		response_types: process.env.RESPONSE_TYPE,
	});
	res.redirect(url);
});


app.get(REDIRECT_URI_PATHNAME, async (req, res) => {
	const client = await setUpOIDC();
	const params = client.callbackParams(req);
	const tokenSet = await client.callback(process.env.REDIRECT_URI,
		params, { state: req.query.state, nonce: req.session.nonce });
	const userinfo = await client.userinfo(tokenSet.access_token);
	req.session.tokenSet = tokenSet;
	req.session.userinfo = userinfo;
	res.redirect('/dashboard');
});

// Page for render userInfo
app.get('/dashboard', (req, res) => {
	const userinfo = req.session.userinfo;
	const profileApp = {
		url: process.env.PROFILE_MANAGEMENT_URL,
		rpAppId: process.env.IBM_VERIFY_RP_APP_ID
	}
	if (!userinfo) {
		return res.redirect('/login');
	}
	res.render('dashboard', { userInfo: userinfo, profileApp: profileApp });
});

app.get('/logout', async (req, res) => {
	// import client
	const client = await setUpOIDC();
	// get token from session
	const token = req.session.tokenSet;
	// check result
	req.session.destroy(() => {
		res.redirect('/');
	});
	// logout from OP ? doesn't work
	await client.revoke(token.access_token).catch(console.error);
});

app.get('/debug', (req, res) => {
	console.log('Session:', req.session);
	res.json(req.session);
});

// Listen PORT
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
	console.log('Server started');
	console.log(`Navigate to http://localhost:3005`);
});