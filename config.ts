import { config } from 'dotenv';
import { ClientAuthMethod } from 'openid-client';

config();

export const sessionSecret = 'keyboard cattens';
console.log("process", process.env)
// The redirect URI for the RP simulator has to have a the name in the callback URL
// Name is client1, client2, etc. 
// Reduct URI example: ...../callback/client1
// http://localhost:8080/auth/callback/client1
//
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


// export const oidc_clients = [client1, client2, client3, client4].filter(client => client.ap !== undefined);
// export const oidc_clients = [

// ];



// CLIENT1_URL = https://cds-gcsignin-dev.verify.ibm.com/oauth2
// CLIENT1_DESCRIPTION = GC SIC Migration
// CLIENT1_CLIENT_ID = 6b435765 - 484a - 4896 - aae6 - 7638ce768307
// CLIENT1_CLIENT_SECRET = bGK470rBzT
// CLIENT1_REDIRECT_URI = http://localhost:8080/auth/callback/client1
// CLIENT1_POST_LOGOUT_REDIRECT_URI = http://localhost:8080/logout/callback



export const oidc_clients = [
  {
    name: 'client1',
    description: 'Default Theme: Client ID: b14fede2-ab4a-4f62-b120-df221eeeed5d',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '6b435765-484a-4896-aae6-7638ce768307',
      client_secret: 'bGK470rBzT',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['http://localhost:8080/auth/callback/client1'],
      post_logout_redirect_uris: ['http://localhost:8080/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client2',
    description: 'Passkeys Default: Client ID: 4ae06cd5-233d-4545-b5a8-6b25894ad73d',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '4ae06cd5-233d-4545-b5a8-6b25894ad73d',
      client_secret: '3eHM1volkP',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/auth/callback/client2'],
      post_logout_redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client3',
    description: 'Theme: GC Sign In Login Page: Client ID: 89868c80-e4b9-4ec7-b9d4-4346961aa570',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '89868c80-e4b9-4ec7-b9d4-4346961aa570',
      client_secret: 'U9luy7RgKP',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/auth/callback/client3'],
      post_logout_redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client4',
    description: 'LOA3 - Default PassKeys Client ID: 5de8b509-4c4c-4a13-8627-9ae3765d5ba1',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '5de8b509-4c4c-4a13-8627-9ae3765d5ba1',
      client_secret: 'W4pxHrafOI',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/auth/callback/client4'],
      post_logout_redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  },
  {
    name: 'client5',
    description: 'Custom React App - ID: 52d8fc24-f1ee-4820-a643-9b0ba8ab5f83',
    sic: false,
    ap: 'https://cds-gcsignin-dev.verify.ibm.com/oauth2',
    config: {
      client_id: '52d8fc24-f1ee-4820-a643-9b0ba8ab5f83',
      client_secret: 'fdtBgA3erQ',
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/auth/callback/client5'],
      post_logout_redirect_uris: ['https://rp.app.gc-signin.cdssandbox.xyz/logout/callback'],
      token_endpoint_auth_method: 'client_secret_post' as ClientAuthMethod,
    }
  }


]

console.log("oidc_clients", oidc_clients);

export const ui_config = {
  client_label: 'RP1',
  title_en: 'OIDC RP Simulator',
  title_fr: 'Simulateur OIDC de la partie utilisatrice',
  wet_cdts_hosturl: 'https://www.canada.ca/etc/designs/canada/cdts/gcweb',
  wet_cdts_version: 'v4_0_44',
  jquery_version: '2.2.4'
};
