import { Issuer } from "openid-client";
discover();

async function discover() {
  const issuer = await Issuer.discover("http://localhost:3000");
  console.log(issuer);
}
