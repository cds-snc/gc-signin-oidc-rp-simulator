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
  description: process.env.CLIENT1_DESCRIPTION,
  sic: false,
  ap: process.env.CLIENT1_URL,
  config: {
    client_id: process.env.CLIENT1_CLIENT_ID,
    client_secret: process.env.CLIENT1_CLIENT_SECRET,
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: ["http://localhost:8080/auth/callback/client1"],
    post_logout_redirect_uris: [process.env.CLIENT1_POST_LOGOUT_REDIRECT_URI],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client2 = {
  name: 'client2',
  description: process.env.CLIENT2_DESCRIPTION,
  sic: false,
  ap: process.env.CLIENT2_URL,
  config: {
    client_id: process.env.CLIENT2_URL,
    client_secret: process.env.CLIENT2_URL,
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: [process.env.CLIENT2_REDIRECT_URI],
    post_logout_redirect_uris: [process.env.CLIENT2_POST_LOGOUT_REDIRECT_URI],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client3 = {
  name: 'client3',
  description: process.env.CLIENT3_DESCRIPTION,
  sic: false,
  ap: process.env.CLIENT3_URL,
  config: {
    client_id: process.env.CLIENT3_URL,
    client_secret: process.env.CLIENT3_URL,
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: [process.env.CLIENT3_REDIRECT_URI],
    post_logout_redirect_uris: [process.env.CLIENT3_POST_LOGOUT_REDIRECT_URI],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

const client4 = {
  name: 'client4',
  description: process.env.CLIENT4_DESCRIPTION,
  sic: false,
  ap: process.env.CLIENT4_URL,
  config: {
    client_id: process.env.CLIENT4_URL,
    client_secret: process.env.CLIENT4_URL,
    grant_types: ['refresh_token', 'authorization_code', 'openid'],
    redirect_uris: [process.env.CLIENT4_REDIRECT_URI],
    post_logout_redirect_uris: [process.env.CLIENT4_POST_LOGOUT_REDIRECT_URI],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

export const oidc_clients = [client1, client2, client3, client4].filter(client => client.ap !== undefined);

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb',
  wet_cdts_version: 'v4_0_44',
  jquery_version: '2.2.4'
};
