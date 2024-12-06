export enum UserType {
  SuperUser = "SUPER_USER",
  PartnerAdmin = "PARTNER_ADMIN",
  PartnerReader = "PARTNER_READER",
  ValaDS = "VALA_DS",
}
export type AccessTokenData = {
  accessToken: string;
  expiresAt: number;
};

export type AuthCredentials = {
  user: string;
  password: string;
};

export type AuthContentData = {
  account: AuthAccount | null;
  jwtData: AccessTokenData | null;
  isLoggedIn: boolean;
  hasInitiatedLocalAccount: boolean;
  isOnboardingDone: boolean | null;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  changePassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type AuthAccount = {
  accountId: string;
  name: string;
  description: string;
  contact: string;
  userType: UserType;
  orgId: string;
  orgName: string;
  // isNew: boolean;
  tags: string[];
  // expiresAt: number;
};

export type AuthResponse = {
  account: AuthAccount;
  access_token: string;
};
