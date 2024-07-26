// ─── Dependencies ────────────────────────────────────────────────────────────
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import {
  directChannel,
  findOrCreateChannel,
  findOrInviteUserToChannel,
  isUserInChannel,
  oauthAccess,
  postMessage,
  userInfo,
} from "./functions";
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
  const business_id = "101";
  const store_id = "900";
  const server_number = "0";
  const scope =
    "users:read,groups:write,groups:read,mpim:write,mpim:read,im:write,im:read,chat:write,channels:manage,channels:read";
  const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${business_id},${store_id}${server_number}`;
  res.redirect(url);
});

// ─── Callback ────────────────────────────────────────────────────────────────
app.get("/callback", async (req, res) => {
  const query = req.query as unknown as ISlackQuery;
  const [business_id, store_id, server_number] = query.state.split(",");

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

    // Open direct channel and find channel id
    const directChannelData = await directChannel(
      authData.authed_user.id,
      authData.access_token
    );
    if (!directChannelData?.ok)
      return res.status(500).send("Cannot open direct channel");

    // Send Message to channel id
    await postMessage(
      directChannelData.channel.id,
      "this is my message",
      authData.access_token
    );

    const foundedChannel = await findOrCreateChannel(
      "fresh-private-channel",
      authData.access_token
    );
    if (!foundedChannel?.id)
      return res.status(500).send("Cannot find or create private channel");

    const foundedUserData = await isUserInChannel(
      foundedChannel.id,
      authData.authed_user.id,
      authData.access_token
    );

    await findOrInviteUserToChannel(
      foundedChannel.id,
      authData.authed_user.id,
      authData.access_token
    );

    // Send message to private channel id
    await postMessage(
      foundedChannel.id,
      "kasra's private message",
      authData.access_token
    );

    /**
     * TODO Compare user with database
     * slack id: authData.authed_user.id>
     * database id: userDatabaseId>
     * slack bot id: authData.bot_user_id>
     */

    res.send({ userInfoData, foundedUsersData: foundedUserData });
  } catch (error) {
    res.status(500).send(error);
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
