import { config } from 'dotenv';
import { ClientAuthMethod } from 'openid-client';

config();

export const sessionSecret = 'keyboard cattens';
// The redirect URI for the RP simulator has to have a the name in the callback URL
// Name is client1, client2, etc. 
// Reduct URI example: ...../callback/client1
// http://localhost:8080/auth/callback/client1
const client1 = {
  name: 'client1',
  description: 'GC SIC Migration - 1',
  skip: 'false',
  sic: false,
  ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
  config: {
    client_id: '35505dc7-8937-4743-9510-e797dd4eca7d',
    client_secret: 'biGBPCTAUe',
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: ['http://localhost:8080/auth/callback/client1'],
    post_logout_redirect_uris: ['http://localhost:8080/logout/callback'],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client2 = {
  name: 'client2',
  description: 'GC SIC Migration',
  skip: 'false',
  sic: false,
  ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
  config: {
    client_id: '35505dc7-8937-4743-9510-e797dd4eca7d',
    client_secret: 'biGBPCTAUe',
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: ['http://localhost:8080/auth/callback/client1'],
    post_logout_redirect_uris: ['http://localhost:8080/logout/callback'],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client3 = {
  name: 'client3',
  description: 'GC SIC Migration',
  skip: 'true',
  sic: true,
  ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2?skipmigration=true',
  config: {
    client_id: '35505dc7-8937-4743-9510-e797dd4eca7d',
    client_secret: 'biGBPCTAUe',
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: ['http://localhost:8080/auth/callback/client1'],
    post_logout_redirect_uris: ['http://localhost:8080/logout/callback'],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client4 = {
  name: 'client4',
  description: 'SIC no IBM Verify',
  skip: 'false',
  sic: false,
  ap: 'https://te-auth.id.tbs-sct.gc.ca/oxauth',
  config: {
    client_id: 'e1a58c16-a649-45e1-b80c-3cd3daaeea0d',
    client_secret: 'C6SsNghkFONJ06gpg0lltWmUlOWzbDm7Kw36hm50',
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: ['http://localhost:8080/auth/callback/client1'],
    post_logout_redirect_uris: ['http://localhost:8080/logout/callback'],
    token_endpoint_auth_method: 'client_secret_basic' as ClientAuthMethod,
  }
};


export const oidc_clients = [client1, client2, client3].filter(client => client.ap !== undefined);

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb',
  wet_cdts_version: 'v5_0_5',
  jquery_version: '2.2.4'
};
