export enum UserType {
  SuperUser = "SUPER_USER",
  PartnerAdmin = "PARTNER_ADMIN",
  PartnerReader = "PARTNER_READER",
  ValaDS = "VALA_DS",
}

export type AuthCredentials = {
  user: string;
  password: string;
};

export type AuthAccount = {
  accountId: string;
  name: string;
  description: string;
  contact: string;
  userType: UserType;
  orgId: string;
  orgName: string;
  isNew: boolean;
  tags: string[];
  expiresAt: number;
};

export type AuthResponse = {
  account: AuthAccount;
  accessToken: string;
};
