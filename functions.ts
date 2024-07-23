// ─── Dependencies ────────────────────────────────────────────────────────────
import axios from "axios";
import util from "util";
import { ISlackOAuth, ISlackUserInfo, SlackConversation } from "./interface";

const axiosInstance = axios.create({
  baseURL: "https://slack.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Oauth ───────────────────────────────────────────────────────────────────
export async function oauthAccess(
  code: string
): Promise<ISlackOAuth | undefined> {
  try {
    const { data } = await axiosInstance.post<ISlackOAuth>(
      "/oauth.v2.access",
      null,
      {
        params: {
          code,
          client_id: process.env.CLIENT_ID,
          redirect_uri: process.env.REDIRECT_URI,
          client_secret: process.env.CLIENT_SECRET,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(`error wile slack oauth:`, error);
  }
}

// ─── Get User Information ────────────────────────────────────────────────────
export async function userInfo(
  authedUserId: string,
  accessToken: string
): Promise<ISlackUserInfo | undefined> {
  try {
    const { data } = await axiosInstance.get<ISlackUserInfo>("/users.info", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        user: authedUserId,
      },
    });
    return data;
  } catch (error) {
    console.log(`error wile getting slack user information:`, error);
  }
}

// ─── Get Channel Id ──────────────────────────────────────────────────────────
export async function conversations(
  userId: string,
  accessToken: string
): Promise<SlackConversation | undefined> {
  try {
    const { data } = await axiosInstance.post<SlackConversation>(
      "/conversations.open",
      { users: userId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data;
  } catch (error) {
    console.log(`error while opening conversation for user ${userId}:`, error);
  }
}

// ─── Post Message To Specific User ───────────────────────────────────────────
export async function postMessage(
  channel: string,
  text: string,
  accessToken: string
) {
  try {
    const { data } = await axiosInstance.post(
      "/chat.postMessage",
      { channel, text },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log("postMessage =>", util.inspect(data, false, null, true));
    return data;
  } catch (error) {
    console.log(`error while sending message to ${channel}:`, error);
  }
}
