import express from 'express';
import createError from 'http-errors';
import { Issuer } from 'openid-client';
import expressSession from 'express-session';
import passport from 'passport';
import { oidc_clients, sessionSecret, ui_config } from './config';
import { locales_en, locales_fr } from './locales/translations';

import * as dotenv from "dotenv"

import { OpenIDConnectStrategy } from './strategy';


// Load .env.local if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

export const defaultBaseUrl = "http://localhost:8080";
export const BASE_URL = process.env.BASE_URL || defaultBaseUrl;
export const LINKING_BASE_URL = process.env.LINKING_BASE_URL || defaultBaseUrl;
export const DEFAULT_PORT = process.env.PORT || 8080;

interface RequestWithUserSession extends express.Request {
  user?: any,
  session?: any
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export class ServerExpress {
  static mounted: { [named: string]: string } = {};
  listener: import('http').Server;

  async start(port = DEFAULT_PORT) {
    const params = { scope: ['openid'] };
    const app = express();
    app.set('trust proxy', 1) // trust first proxy

    app.use(
      expressSession({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 600000,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        }
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set("view engine", "ejs");

    setupStrategies();



    app.get('/', (req, res) => res.render('index', { ui_config: ui_config }));

    app.get('/health', (req, res) => res.status(200).send('ok'));

    app.get('/rpsim/:page/:lang', (req: RequestWithUserSession, res) => {
      let template

      switch (req.params.lang) {
        case 'en':
          template = locales_en
          break;
        case 'fr':
          template = locales_fr
          break;
        default:
          return res.redirect('/');
      }

      let data = {
        ...template,
        page: req.params.page,
        ui_config: ui_config,
        isLoggedIn: req.user != undefined
      }

      switch (req.params.page) {
        case 'login':
          data = {
            ...data,
            oidc_clients: returnOIDCConfig().map((item) => { return { name: item.name, description: item.description, sic: item.sic } })
          }
          res.render('login', data)
          break;
        case 'response':
          data = {
            ...data,
            reqParams: req.session.reqParams,
            user: req.user,
            tokenSet: req.session.tokenSet,
            userinfo: req.session.userinfo
          }
          res.render('response', data)
          break;
        default:
          data = {
            ...data,
            oidc_clients: returnOIDCConfig().map((item) => { return { name: item.name, description: item.description } })
          }
          res.render('login', data)
      }
    });

    app.get('/auth/:provider', (req: RequestWithUserSession, res, next) => {
      const provider = req.params.provider

      passport.authenticate(provider, {
        ...req.query,
      })(req, res, next);
    });

    app.get('/auth/callback/:provider', (req, res, next) => {
      const provider = req.params.provider

      passport.authenticate(provider, {
        successRedirect: `/success/${provider}`,
        failureRedirect: `/error?error=${req.query.error}: ${req.query.error_description}`,
      })(req, res, next);
    });

    app.get('/success/:provider', (req: RequestWithUserSession, res) => {
      const provider = req.params.provider
      // save teh current provider in req.session for the logout
      req.session.provider = provider

      res.redirect(`/rpsim/response/${getLocale(req)}`);
    });

    app.get('/error', (req, res) => res.status(500).render('error', { err: req.query.error }));

    app.get('/login', (req, res) => {
      res.set('content-type', 'text/html;charset=UTF-8')
      return res.status(200).send(`
        <html xmlns="http://www.w3.org/1999/xhtml">
          <script type="text/javascript">
            function redirectToLoginPage() {
              const locale = localStorage.getItem('lang_locale');
              const language = (locale ? locale.substring(0,2) : 'undefined');
              window.location.replace("/rpsim/login/" + language);
            }
          </script>
          <body onload="redirectToLoginPage()"/>
        </html>`
      )
    });

    app.get('/signout', (req: RequestWithUserSession, res) => {
      res.set('content-type', 'text/html;charset=UTF-8')
      return res.status(200).send(`
        <html xmlns="http://www.w3.org/1999/xhtml">
          <script type="text/javascript">
            function callLogoutAPI() {
              const locale = localStorage.getItem('lang_locale');
              const id_token_hint = localStorage.getItem('id_token_hint');
              const language = (locale ? locale.substring(0,2) : 'undefined');
              window.location.replace("/logout/" + language + "/" + id_token_hint);
            }
          </script>
          <body onload="callLogoutAPI()"/>
        </html>`
      )
    });

    app.get('/logout/:locale/:hint', (req: RequestWithUserSession, res) => {
      const provider = req.session.provider
      let params = {}

      if (!provider) res.status(400).send('No Session')
      else {
        const strategy = passport._strategy(provider)
        const client = strategy._client
        const locale = req.params.locale
        const hint = req.params.hint
        params = {
          client_id: client.client_id
        }

        if (hint && hint == 'true') {
          params = {
            ...params,
            id_token_hint: req.session.tokenSet.id_token
          }
        }

        if (locale && req.session) {
          if (!req.session.userinfo) req.session.userinfo = {}
          req.session.userinfo.locale = locale
        }

        res.redirect(client.endSessionUrl(params));
      }
    });

    app.get('/logout/callback', (req: RequestWithUserSession, res) => {
      const locale = getLocale(req);

      (req as any).logout();
      req.session.destroy((err) => {
        if (err) res.status(500).render('error', { err: err });
        res.redirect(`/rpsim/login/${locale}`);
      });
    });

    app.get('/sector.json', (req: RequestWithUserSession, res) => {
      console.log("got to sector json endpoint");
      try {
        const uris = [
          // replace with your real redirect URIs when ready
          BASE_URL + "/auth/callback/client1",
          LINKING_BASE_URL + "/link/callback/client3"
        ];
        res.status(200)
          .set('Content-Type', 'application/json')
          .set('Cache-Control', 'no-store, max-age=0')
          .send(JSON.stringify(uris));
      } catch (e) {
        res.status(500).type('text/plain').send('sector.json error');
      }
    });

    // invalid routes

    // catch 404 and forward to error handler
    app.use((req, res, next) => next(createError(404)));

    // error handler
    app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error', {
        err: err.message
      });
    });

    this.listener = await app.listen(Number(port), "0.0.0.0", () => console.log(`Server listening on port: ${port}`));
  }
}


function returnOIDCConfig() {
  var baseUrl = BASE_URL || defaultBaseUrl;

  baseUrl = "http://localhost:8080";

  return oidc_clients.map((client) => {
    const tmp = JSON.parse(JSON.stringify(client)); // shallow-deep clone
    if (Array.isArray(tmp.config?.redirect_uris) && tmp.config.redirect_uris[0]) {
      tmp.config.redirect_uris[0] = String(tmp.config.redirect_uris[0]).replace("<baseurl1>", baseUrl);
    }
    return tmp;
  });
}


async function setupStrategies() {
  const params = { scope: ['openid'] };

  for (const cli of returnOIDCConfig()) {
    try {
      const issuer = await Issuer.discover(cli.ap);
      const client = new issuer.Client(cli.config);
      passport.use(
        cli.name,
        new OpenIDConnectStrategy({ client, params, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
          req.session.tokenSet = tokenSet;
          req.session.userinfo = userinfo;

          return done(null, tokenSet.claims());
        })
      );
    } catch (error) {
      console.log(`OPError: ${cli.ap} OIDC client not discovered successfully [Hint: OIDC client offline?].`);
    }
  }
}

function getLocale(req: RequestWithUserSession) {
  const userinfo = req.session && req.session.userinfo
  const reqParams = req.session && req.session.reqParams
  const locale = (userinfo && userinfo.locale ? userinfo.locale.substring(0, 2) : (reqParams && reqParams.ui_locales ? reqParams.ui_locales.substring(0, 2) : 'undefined'))

  return locale
}

new ServerExpress().start();
