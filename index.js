import dotenv from "dotenv";
import { promises as fs } from "fs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const createAssertion = async () => {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      aud: `${process.env.baseUrl}/`,
      iss: process.env.clientId,
      iat: now,
      exp: now + 120, // 120 seconds
      jti: uuidv4(),
      consumer_org: process.env.orgId,
      scope: process.env.scope,
    },
    await readKey(),
    {
      algorithm: "RS256",
      header: {
        typ: "JWT",
        alg: "RS256",
        x5c: [process.env.x5c],
      },
    }
  );
};

const readKey = () => {
  return fs.readFile("./private_key.txt", "utf-8");
};

createAssertion().then((assertion) => {
  console.log(assertion);
});
