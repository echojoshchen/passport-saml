import type * as express from 'express';
import * as passport from 'passport';
import type { CacheProvider } from './inmemory-cache-provider';

export type CertCallback = (callback: (err: Error | null, cert?: string | string[]) => void) => void;

export interface AuthenticateOptions extends passport.AuthenticateOptions {
  additionalParams?: Record<string, any>;
}

export interface AuthorizeOptions extends AuthenticateOptions {
  samlFallback?: 'login-request' | 'logout-request';
}

export interface SamlConfig {
    // Core
    callbackUrl?: string;
    path?: string;
    protocol?: string;
    host?: string;
    entryPoint?: string;
    issuer?: string;
    privateCert?: string;
    cert?: string | string[] | CertCallback;
    decryptionPvk?: string;
    signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512';

    // Additional SAML behaviors
    additionalParams?: any;
    additionalAuthorizeParams?: any;
    identifierFormat?: string;
    acceptedClockSkewMs?: number;
    attributeConsumingServiceIndex?: string | null;
    disableRequestedAuthnContext?: boolean;
    authnContext?: string;
    forceAuthn?: boolean;
    skipRequestCompression?: boolean;
    authnRequestBinding?: string;
    RACComparison?: 'exact' | 'minimum' | 'maximum' | 'better';
    providerName?: string;
    passive?: boolean;
    idpIssuer?: string;
    audience?: string;
    scoping? : SamlScopingConfig;

    // InResponseTo Validation
    validateInResponseTo?: boolean;
    requestIdExpirationPeriodMs?: number;
    cacheProvider?: CacheProvider;

    // Passport
    name?: string;
    passReqToCallback?: boolean;

    // Logout
    logoutUrl?: string;
    additionalLogoutParams?: any;
    logoutCallbackUrl?: string;
}

export interface SamlScopingConfig {
  idpList: SamlIDPListConfig[];
  proxyCount?: number;
  requesterId?: string[];
}

export type XMLValue = string | number | boolean | null | XMLObject | XMLValue[];

export type XMLObject = {
  [key: string]: XMLValue;
};

export type XMLInput = XMLObject;

export interface AuthorizeRequestXML {
  'samlp:AuthnRequest': XMLInput;
}

export interface LogoutRequestXML {
  'samlp:LogoutRequest': {
    'saml:NameID': XMLInput;
    [key: string]: XMLValue;
  };
}

export interface ServiceMetadataXML {
  EntityDescriptor: {
    [key: string]: XMLValue;
    SPSSODescriptor: XMLObject;
  };
}

export interface AudienceRestrictionXML {
  Audience?: XMLObject[];
}

export type XMLOutput = Record<string, any>;

export interface SamlIDPListConfig {
  entries: SamlIDPEntryConfig[];
  getComplete?: string;
}

export interface SamlIDPEntryConfig {
  providerId: string;
  name?: string;
  loc?: string;
}

export type Profile = {
    issuer?: string;
    sessionIndex?: string;
    nameID?: string;
    nameIDFormat?: string;
    nameQualifier?: string;
    spNameQualifier?: string;
    ID?: string;
    mail?: string; // InCommon Attribute urn:oid:0.9.2342.19200300.100.1.3
    email?: string; // `mail` if not present in the assertion
    ['urn:oid:0.9.2342.19200300.100.1.3']?: string;
    getAssertionXml(): string; // get the raw assertion XML
    getAssertion(): Record<string, unknown>; // get the assertion XML parsed as a JavaScript object
    getSamlResponseXml(): string; // get the raw SAML response XML
  } & {
    [attributeName: string]: unknown; // arbitrary `AttributeValue`s
  };

  export interface RequestWithUser extends express.Request {
    samlLogoutRequest: any;
    user?: Profile
}
  
export type VerifiedCallback = (err: Error | null, user?: Record<string, unknown>, info?: Record<string, unknown>) => void;

export type VerifyWithRequest = (req: express.Request, profile: Profile | null | undefined, done: VerifiedCallback) => void;

export type VerifyWithoutRequest = (profile: Profile | null | undefined, done: VerifiedCallback) => void;

export type SamlOptionsCallback = (err: Error | null, samlOptions?: SamlConfig) => void;

export interface MultiSamlConfig extends SamlConfig {
  getSamlOptions(req: express.Request, callback: SamlOptionsCallback): void;
}
