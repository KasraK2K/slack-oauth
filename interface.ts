export interface ISlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  created: number;
  creator: string;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  name_normalized: string;
  is_shared: boolean;
  is_ext_shared: boolean;
  is_org_shared: boolean;
  pending_shared: any[];
  is_pending_ext_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  updated: number;
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  previous_names: string[];
  num_members: number;
}

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

export interface ISlackConversation {
  ok: boolean;
  no_op: boolean;
  already_open: boolean;
  channel: { id: string };
  warning: string;
  response_metadata: { warnings: string[] };
}

export interface ISlackPostMessage {
  ok: boolean;
  channel: string;
  ts: string;
  message: {
    user: string;
    type: string;
    ts: string;
    bot_id: string;
    app_id: string;
    text: string;
    team: string;
    bot_profile: {
      id: string;
      app_id: string;
      name: string;
      icons: {
        image_36: string;
        image_48: string;
        image_72: string;
      };
      deleted: boolean;
      updated: number;
      team_id: string;
    };
    blocks: [
      {
        type: string;
        block_id: string;
        elements: [
          {
            type: string;
            elements: { type: string; text: string }[];
          }
        ];
      }
    ];
  };
  warning: string;
  response_metadata: { warnings: string[] };
}

export interface ISlackGroupChannel {
  ok: boolean;
  channel: ISlackChannel;
  warning: string;
  response_metadata: { warnings: string[] };
}

export interface ISlackInviteChannel {
  ok: boolean;
  channel: ISlackChannel;
  warning: string;
  response_metadata: {
    warnings: string[];
  };
}

export interface ISlackFindChannels {
  ok: boolean;
  channels: ISlackChannel[];
  response_metadata: {
    next_cursor: string;
  };
}

export interface ISlackMembers {
  ok: true;
  members: string[];
  response_metadata: {
    next_cursor: string;
  };
}
