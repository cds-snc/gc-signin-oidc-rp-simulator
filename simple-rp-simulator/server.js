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
// Create a MemoryStore instance
const memoryStore = new session.MemoryStore();
require('dotenv').config();

const { Issuer, generators } = require('openid-client');
const { createRemoteJWKSet, jwtVerify } = require('jose');
const crpto = require('crypto');
const path = require('path');
const app = express();

// Init session
app.use(session({
	secret: 'my-secret',
	resave: true,
	saveUninitialized: false,
	secure: true,
	store: memoryStore,
	genid: (req) => {
		if (req.oidcSub)
			return req.oidcSub;
		else
			return crpto.randomUUID();
	},
}));

//middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'front-end'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => res.status(200).send('OK'));

// const REDIRECT_URI_PATHNAME = new URL(process.env.REDIRECT_URI).pathname;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8080/callback';
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
	
	// use sub in this sample as session id
	req.oidcSub = tokenSet.claims().sub;
	// regenerate session, so that genid function will use sub as session id
	req.session.regenerate((err) => {
		if (err) {
			console.error('Session regeneration error:', err);
			return res.status(500).send('Internal Server Error');
		}
		req.session.tokenSet = tokenSet; // Save tokenSet in session
		req.session.userinfo = userinfo; // Save userinfo in session
		res.redirect('/dashboard');
	});
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
	const tokenSet = req.session.tokenSet;
	res.render('dashboard', { userInfo: userinfo, profileApp: profileApp, tokenSet: tokenSet });
});

app.get('/logout', async (req, res) => {
	// import client
	const client = await setUpOIDC();
	// get token from session
	const token = req.session.tokenSet;
	// check result
	req.session.destroy(() => {
		if (process.env.POST_LOGOUT_REDIRECT_URI) {
			// Get end_session_endpoint from issuer metadata
			const endSessionUrl = client.issuer.metadata.end_session_endpoint;
            // Build logout URL for IdP (Single Logout)
			let logoutUrl = endSessionUrl;
			if (logoutUrl) {
				const params = new URLSearchParams();
				if (token && token.id_token) {
					params.append('id_token_hint', token.id_token);
				}
				params.append('post_logout_redirect_uri', process.env.POST_LOGOUT_REDIRECT_URI);
				logoutUrl += `?${params.toString()}`;

				res.redirect(logoutUrl);
			}
			else{
				res.redirect('/');
			}
		}
		else{
			res.redirect('/');
		}
	});
	// Optionally revoke access token at OP
	// if (token && token.access_token) {
	// 	await client.revoke(token.access_token).catch(console.error);
	// }
});

// Back Channel Logout endpoint
app.post('/backchannel_logout', async (req, res) => {
	console.log('Back channel logout init:');
	try {
		const client = await setUpOIDC();
		const logoutToken = req.body.logout_token;

		if (!logoutToken) {
			return res.status(400).json({ error: 'logout_token is required' });
		}

		const jwks = createRemoteJWKSet(new URL(client.issuer.metadata.jwks_uri));
        const payload = await validateLogoutToken(logoutToken, jwks);
	
		// Terminate session(s)
		if (payload.sid) {
			await destroySessionsBySid(payload.sid);
		} else if (payload.sub) {
			await destroySessionsBySub(payload.sub);
		}

		// Return successful response
		return res.status(200).json({ status: 'ok' });
	} catch (error) {
		console.error('Back channel logout error:', error);
		return res.status(400).json({ error: 'Internal server error' });
	}
});

async function validateLogoutToken(logoutToken, jwks) {
  if (!logoutToken) throw new Error('missing logout_token');

  // Verify signature and standard claims (exp, nbf, iss, aud) via jose
  const { payload } = await jwtVerify(logoutToken, jwks, {
    audience: process.env.CLIENT_ID
    // iat/exp/nbf are validated by jwtVerify by default
  });

  // Required: events claim with backchannel-logout event
  const events = payload.events;
  const bcEventKey = 'http://schemas.openid.net/event/backchannel-logout';
  if (!events || typeof events !== 'object' || !events[bcEventKey]) {
    throw new Error('missing backchannel logout event claim');
  }

  // Required: jti present
//   if (!payload.jti) throw new Error('missing jti claim');

//   // Replay protection: reject if jti already seen
//   if (seenJti.has(payload.jti)) throw new Error('replayed logout_token (jti seen)');
//   // Mark as seen; in production persist with TTL at least until token expiry
//   seenJti.add(payload.jti);

  // Required: sub or sid present (per spec)
  if (!payload.sub && !payload.sid) throw new Error('must contain sub or sid');

  return payload;
}

// Helper placeholders - implement according to your session store
async function destroySessionsBySid(sid) {
  // Example: find session by sid and destroy it
  memoryStore.destroy(sid, (err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
    }
  });
}
async function destroySessionsBySub(sub) {
  // Example: find sessions by sub and destroy them
    memoryStore.destroy(sub, (err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
    }
  });
}

app.get('/debug', (req, res) => {
	console.log('Session:', req.session);
	res.json(req.session);
});

// Listen PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log('Server started');
	console.log(`Navigate to http://localhost:${PORT}`);
});