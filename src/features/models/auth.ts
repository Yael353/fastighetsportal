export enum UserType {
  SuperUser = "SUPER_USER",
  PartnerAdmin = "PARTNER_ADMIN",
  PartnerReader = "PARTNER_READER",
  ValaDS = "VALA_DS",
}

export type AuthCredentials = {
  user: string; // Användarnamn
  password: string; // Lösenord
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
};

export type AuthResponse = {
  account: AuthAccount; // Användarens konto information
  accessToken: string; // Tillgångstoken för autentisering
};
