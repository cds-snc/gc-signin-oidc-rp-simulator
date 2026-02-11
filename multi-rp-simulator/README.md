# OIDC-RP-Simulator

Source code and configuration for the Sign in Canada OIDC Relying Party Simulator.

`npm i`, create a config.ts file based on sample-config.ts, then `npm start`.

`npm test` to run e2e tests.

See the complementary project at https://github.com/sign-in-canada/oidc-provider


## Running Mutli RP Simulator:

1. Create a `.env` that contains configuration for client you wish to simulate. You can refer to the `.env.example` file for the envrironment variables required to run this sample app.
2. From the CLI enter `npm install`
3. After successfully intalling node_modules, from the CLI start the sample application by running `npm run start`
4. Navigate to `http://localhost:8080` in your browser. You should see the list of clients available to simulate.
