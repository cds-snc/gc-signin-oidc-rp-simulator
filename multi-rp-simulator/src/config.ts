import { ClientAuthMethod } from 'openid-client';

export const sessionSecret = 'keyboard cattens';

export const oidc_clients = [
  {
    name: 'client1',
    description: 'GC SIC Migration -  Custom App',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '35505dc7-8937-4743-9510-e797dd4eca7d',
      client_secret: 'biGBPCTAUe',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['<baseurl1>/auth/callback/client1'],
      post_logout_redirect_uris: ['<baseurl1>/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client2',
    description: 'GC SIC Migration',
    sic: false,
    ap: 'https://cds-gcsignin-dev2.verify.ibm.com/oauth2',
    config: {
      client_id: '4781061a-fa12-4973-8cc6-1676688a89cc',
      client_secret: 'SNqvBK3IHz',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['<baseurl1>/auth/callback/client2'],
      post_logout_redirect_uris: ['<baseurl1>/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client3',
    description: 'SIC no IBM Verify',
    sic: false,
    ap: 'https://te-auth.id.tbs-sct.gc.ca/oxauth',
    config: {
      client_id: 'e1a58c16-a649-45e1-b80c-3cd3daaeea0d',
      client_secret: 'C6SsNghkFONJ06gpg0lltWmUlOWzbDm7Kw36hm50',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['<baseurl1>/auth/callback/client3'],
      post_logout_redirect_uris: ['<baseurl1>/logout/callback'],
      token_endpoint_auth_method: 'client_secret_basic' as ClientAuthMethod,
    }
  }
];

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb', 
  wet_cdts_version: 'v4_0_44',
  jquery_version: '2.2.4'
};
