import { ClientAuthMethod } from 'openid-client';

export const sessionSecret = 'keyboard cattens';

export const oidc_clients = [
  {
    name: 'client1',
    description: 'CLEINT1 OIDC',
    sic: false,
    ap: 'http://localhost:3000',
    config: {
      client_id: 'client1',
      client_secret: 'testlocalsecret',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['http://localhost:3100/auth/callback/client1'],
      post_logout_redirect_uris: ['http://localhost:3100/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,     
    }
  },
  {
    name: 'client2',
    description: 'CLEINT2 OIDC',
    ap: 'http://localhost:3000',
    config: {
      client_id: 'client2',
      client_secret: 'testlocalsecret',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['http://localhost:3100/auth/callback/client2'],
      post_logout_redirect_uris: ['http://localhost:3100/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,     
    }
  },
]

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb', 
  wet_cdts_version: 'v4_0_44',
  jquery_version: '2.2.4'
};
