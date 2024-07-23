// ─── Dependencies ────────────────────────────────────────────────────────────
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import { conversations, oauthAccess, postMessage, userInfo } from "./functions";
import { ISlackQuery } from "./interface";

// ─── Constants ───────────────────────────────────────────────────────────────
const env = dotenv.config({ path: ".env" });
expand(env);
const app = express();
const clientId = process.env.CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;
const port = process.env.PORT;

// ─── Login ───────────────────────────────────────────────────────────────────
app.get("/login", (req, res) => {
  const userId = "1";
  const scope = "users:read,groups:write,mpim:write,im:write,chat:write";
  const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${userId}`;
  res.redirect(url);
});

// ─── Callback ────────────────────────────────────────────────────────────────
app.get("/callback", async (req, res) => {
  const query = req.query as unknown as ISlackQuery;
  const userDatabaseId = query.state;

  try {
    const authData = await oauthAccess(query.code);
    if (!authData)
      return res.status(500).send("Authentication has not any data");

    // Access user id
    const userInfoData = await userInfo(
      authData.authed_user.id,
      authData.access_token
    );
    if (!userInfoData?.ok)
      return res.status(500).send("Failed on getting user info");

    // Open channel and find channel id
    const conversationData = await conversations(
      authData.authed_user.id,
      authData.access_token
    );
    if (!conversationData)
      return res.status(500).send("Cannot open conversation");

    // Send Message to channel id
    await postMessage(
      conversationData?.channel.id,
      "this is my message",
      authData.access_token
    );

    /**
     * TODO Compare user with database
     * slack id: authData.authed_user.id>
     * database id: userDatabaseId>
     * slack bot id: authData.bot_user_id>
     */

    res.send(userInfoData);
  } catch (error) {
    res.status(500).send("Error during authentication");
  }
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.all("*", (req, res) => {
  res.send("No routes matched");
  res.end();
});
// ─────────────────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
