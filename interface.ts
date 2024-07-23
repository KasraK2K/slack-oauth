export interface ISlackQuery {
  code: string;
  state: string;
}

export interface ISlackUserInfo {
  ok: boolean;
  error?: string;
  user?: ISlackUser;
}

export interface ISlackOAuth {
  ok: boolean;
  app_id: string;
  authed_user: { id: string };
  scope: string;
  token_type: string;
  access_token: string;
  bot_user_id: string;
  team: { id: string; name: string };
  enterprise: any | null;
  is_enterprise_install: boolean;
}

export interface ISlackUser {
  user: {
    id: string;
    team_id: string;
    name: string;
    deleted: boolean;
    color: string;
    real_name: string;
    tz: string;
    tz_label: string;
    tz_offset: number;
    profile: {
      title: string;
      phone: string;
      skype: string;
      real_name: string;
      real_name_normalized: string;
      display_name: string;
      display_name_normalized: string;
      fields: null;
      status_text: string;
      status_emoji: string;
      status_emoji_display_info: any[];
      status_expiration: number;
      avatar_hash: string;
      image_original: string;
      is_custom_image: boolean;
      email: string;
      huddle_state: string;
      huddle_state_expiration_ts: number;
      first_name: string;
      last_name: string;
      image_24: string;
      image_32: string;
      image_48: string;
      image_72: string;
      image_192: string;
      image_512: string;
      image_1024: string;
      status_text_canonical: string;
      team: string;
    };
    is_admin: boolean;
    is_owner: boolean;
    is_primary_owner: boolean;
    is_restricted: boolean;
    is_ultra_restricted: boolean;
    is_bot: boolean;
    is_app_user: boolean;
    updated: number;
    is_email_confirmed: boolean;
    who_can_share_contact_card: string;
  };
}

export interface SlackConversation {
  ok: boolean;
  no_op: boolean;
  already_open: boolean;
  channel: { id: string };
  warning: string;
  response_metadata: { warnings: string[] };
}
