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
  ap: process.env.CLIENT1_TENANT_URI,
  config: {
    client_id: process.env.CLIENT1_CLIENT_ID,
    client_secret: process.env.CLIENT1_CLIENT_SECRET,
    grant_types: ['openid'],
    redirect_uris: [process.env.CLIENT1_REDIRECT_URI],
    post_logout_redirect_uris: [process.env.CLIENT1_POST_LOGOUT_REDIRECT_URI],
    token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
  }
};

export const oidc_clients = [client1].filter(client => client.ap !== undefined);

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb',
  wet_cdts_version: 'v4_0_44',
  jquery_version: '2.2.4'
};
