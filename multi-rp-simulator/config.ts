
  import { config } from 'dotenv';
  import { ClientAuthMethod } from 'openid-client';

  config();

  const env = (key: string, fallback?: string) => {
    const value = process.env[key];
    return value !== undefined ? value : fallback;
  };

  const envBool = (key: string, fallback = false) => {
    const value = process.env[key];
    if (value === undefined) {
      return fallback;
    }
    return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
  };

  const envList = (key: string, fallback: string[] = []) => {
    const value = env(key);
    if (!value) {
      return fallback;
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  export const sessionSecret = env('SESSION_SECRET') as string;
  // The redirect URI for the RP simulator has to have a the name in the callback URL
  // Name is client1, client2, etc.
  // Reduct URI example: ...../callback/client1
  // http://localhost:8080/auth/callback/client1
  const client1 = {
    name: 'client1',
    description: env('CLIENT1_DESCRIPTION', 'GC SIC Migration - 1'),
    skip: envBool('CLIENT1_SKIP', false),
    sic: envBool('CLIENT1_SIC', false),
    ap: env('CLIENT1_URL'),
    config: {
      client_id: env('CLIENT1_CLIENT_ID'),
      client_secret: env('CLIENT1_CLIENT_SECRET'),
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: envList('CLIENT1_REDIRECT_URIS', ['http://localhost:8080/auth/callback/client1']),
      post_logout_redirect_uris: envList('CLIENT1_POST_LOGOUT_REDIRECT_URIS', ['http://localhost:8080/logout/callback']),
      token_endpoint_auth_method: (env('CLIENT1_TOKEN_ENDPOINT_AUTH_METHOD', 'client_secret_post') as ClientAuthMethod),
    }
  };

  const client2 = {
    name: 'client2',
    description: env('CLIENT2_DESCRIPTION', 'GC SIC Migration'),
    skip: envBool('CLIENT2_SKIP', false),
    sic: envBool('CLIENT2_SIC', false),
    ap: env('CLIENT2_URL'),
    config: {
      client_id: env('CLIENT2_CLIENT_ID'),
      client_secret: env('CLIENT2_CLIENT_SECRET'),
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: envList('CLIENT2_REDIRECT_URIS', ['http://localhost:8080/auth/callback/client1']),
      post_logout_redirect_uris: envList('CLIENT2_POST_LOGOUT_REDIRECT_URIS', ['http://localhost:8080/logout/callback']),
      token_endpoint_auth_method: (env('CLIENT2_TOKEN_ENDPOINT_AUTH_METHOD', 'client_secret_post') as ClientAuthMethod),
    }
  };

  const client3 = {
    name: 'client3',
    description: env('CLIENT3_DESCRIPTION', 'GC SIC Migration'),
    skip: envBool('CLIENT3_SKIP', true),
    sic: envBool('CLIENT3_SIC', true),
    ap: env('CLIENT3_URL'),
    config: {
      client_id: env('CLIENT3_CLIENT_ID'),
      client_secret: env('CLIENT3_CLIENT_SECRET'),
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: envList('CLIENT3_REDIRECT_URIS', ['http://localhost:8080/auth/callback/client1']),
      post_logout_redirect_uris: envList('CLIENT3_POST_LOGOUT_REDIRECT_URIS', ['http://localhost:8080/logout/callback']),
      token_endpoint_auth_method: (env('CLIENT3_TOKEN_ENDPOINT_AUTH_METHOD', 'client_secret_post') as ClientAuthMethod),
    }
  };

  const client4 = {
    name: 'client4',
    description: env('CLIENT4_DESCRIPTION', 'SIC no IBM Verify'),
    skip: envBool('CLIENT4_SKIP', false),
    sic: envBool('CLIENT4_SIC', false),
    ap: env('CLIENT4_URL'),
    config: {
      client_id: env('CLIENT4_CLIENT_ID'),
      client_secret: env('CLIENT4_CLIENT_SECRET'),
      grant_types: ['refresh_token', 'authorization_code', 'openid'],
      redirect_uris: envList('CLIENT4_REDIRECT_URIS', ['http://localhost:8080/auth/callback/client1']),
      post_logout_redirect_uris: envList('CLIENT4_POST_LOGOUT_REDIRECT_URIS', ['http://localhost:8080/logout/callback']),
      token_endpoint_auth_method: (env('CLIENT4_TOKEN_ENDPOINT_AUTH_METHOD', 'client_secret_basic') as ClientAuthMethod),
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
