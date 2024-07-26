// ─── Dependencies ────────────────────────────────────────────────────────────
import axios from "axios";
import {
  ISlackChannel,
  ISlackConversation,
  ISlackFindChannels,
  ISlackGroupChannel,
  ISlackInviteChannel,
  ISlackMembers,
  ISlackOAuth,
  ISlackPostMessage,
  ISlackUserInfo,
} from "./interface";

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
    console.error(`error wile slack oauth:`, error);
  }
}

// ─── Get User Information ────────────────────────────────────────────────────
export async function userInfo(
  authnUserId: string,
  accessToken: string
): Promise<ISlackUserInfo | undefined> {
  try {
    const { data } = await axiosInstance.get<ISlackUserInfo>("/users.info", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        user: authnUserId,
      },
    });
    return data;
  } catch (error) {
    console.error(`error wile getting slack user information:`, error);
  }
}

// ─── Create Direct Channel And Get Channel Id ────────────────────────────────
export async function directChannel(
  userId: string,
  accessToken: string
): Promise<ISlackConversation | undefined> {
  try {
    const { data } = await axiosInstance.post<ISlackConversation>(
      "/conversations.open",
      { users: userId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data;
  } catch (error) {
    console.error(
      `error while opening conversation for user ${userId}:`,
      error
    );
  }
}

// ─── Post Message To Specific User ───────────────────────────────────────────
export async function postMessage(
  channel: string,
  text: string,
  accessToken: string
): Promise<ISlackPostMessage | undefined> {
  try {
    const { data } = await axiosInstance.post<ISlackPostMessage>(
      "/chat.postMessage",
      { channel, text },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data;
  } catch (error) {
    console.error(`error while sending message to ${channel}:`, error);
  }
}

// ─── Create Named Channel And Get Channel Id ─────────────────────────────────
export async function createChannel(
  channelName: string,
  accessToken: string,
  isPrivate: boolean = true
): Promise<ISlackGroupChannel | undefined> {
  try {
    const { data } = await axiosInstance.post<ISlackGroupChannel>(
      "/conversations.create",
      { name: channelName, is_private: isPrivate },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data;
  } catch (error) {
    console.error(
      `error while creating conversation named ${channelName}:`,
      error
    );
  }
}

export async function findChannel(
  channelName: string,
  accessToken: string,
  types: string = "public_channel,private_channel"
): Promise<ISlackFindChannels | undefined> {
  try {
    const { data } = await axiosInstance.get<ISlackFindChannels>(
      "/conversations.list",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { types },
      }
    );
    return data;
  } catch (error) {
    console.error(`error while finding channel named ${channelName}:`, error);
  }
}

export async function inviteUsersToChannel(
  channelId: string,
  userId: string,
  accessToken: string
): Promise<ISlackInviteChannel | undefined> {
  try {
    const { data } = await axiosInstance.post<ISlackInviteChannel>(
      "/conversations.invite",
      { channel: channelId, users: userId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data;
  } catch (error) {
    console.error(
      `error while inviting users into channel ${channelId}:`,
      error
    );
  }
}

export async function findOrCreateChannel(
  channelName: string,
  accessToken: string,
  isPrivate: boolean = true
): Promise<ISlackChannel | undefined> {
  try {
    const types = isPrivate ? "private_channel" : '"public_channel"';
    const foundedChannelData = await findChannel(
      channelName,
      accessToken,
      types
    );
    let channel = foundedChannelData?.channels.find(
      (c) => c.name === channelName
    );

    if (!channel) {
      const createPrivateChannelData = await createChannel(
        channelName,
        accessToken,
        isPrivate
      );
      channel = createPrivateChannelData?.channel;
    }

    return channel;
  } catch (error) {
    console.error(error);
  }
}

export async function isUserInChannel(
  channelId: string,
  userId: string,
  accessToken: string
): Promise<boolean | undefined> {
  try {
    const { data } = await axiosInstance.get<ISlackMembers>(
      "/conversations.members",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { channel: channelId },
      }
    );
    return data.members.includes(userId);
  } catch (error) {
    console.error(
      `error while finding user ${userId} in channel ${channelId}:`,
      error
    );
  }
}

export async function findOrInviteUserToChannel(
  channelId: string,
  userId: string,
  accessToken: string
): Promise<void> {
  try {
    const isUserAlreadyInvited = await isUserInChannel(
      channelId,
      userId,
      accessToken
    );
    if (!isUserAlreadyInvited)
      await inviteUsersToChannel(channelId, userId, accessToken);
  } catch (error) {}
}
