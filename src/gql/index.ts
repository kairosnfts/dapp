/* eslint-disable */
/*********************************************/
/*  This file is auto-generated.             */
/*  See codegen.yml to contribute to it.     */
/*********************************************/

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type UUID = Scalars['UUID']
export type PubkeyBase58 = Scalars['PubkeyBase58']

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  Email: string;
  MetadataTraitValue: string|number;
  PubkeyBase58: string;
  URI: string;
  UUID: string;
};

export type CreateNftRes = {
  __typename?: 'CreateNftRes';
  nft: Nft;
};

export type CreateOneOfOneNft = CreateNftRes | CreateOneOfOneNftError;

export type CreateOneOfOneNftError = {
  __typename?: 'CreateOneOfOneNftError';
  message: CreateOneOfOneNftErrorCode;
};

export enum CreateOneOfOneNftErrorCode {
  GENERATIVE = 'GENERATIVE',
  MAX_NFTS = 'MAX_NFTS'
}

export type CreateOneOfOneNftInput = {
  collectionId: Scalars['UUID'];
  /**
   * The description that appears in the user's wallet below the NFT name,
   * and in marketplaces. You can use Markdown here.
   */
  description: Scalars['String'];
  name: Scalars['String'];
  /**
   * The price in native cryptocurrency set for the collection.
   * E.g. a collection on the Ethereum blockchain will have a price in ETH;
   * a collection on the Polygon blockchain will have a price in MATIC.
   */
  price: Scalars['Float'];
};

export type DeployNftInput = {
  /**
   * When `true`, the request will not return success until the NFT has been
   * deployed to the blockchain.
   */
  isBlocking?: InputMaybe<Scalars['Boolean']>;
  nftId: Scalars['UUID'];
};

export type MetadataAttribute = {
  __typename?: 'MetadataAttribute';
  trait_type: Scalars['String'];
  value: Scalars['MetadataTraitValue'];
};

export type MetadataAttributeInput = {
  trait_type: Scalars['String'];
  value: Scalars['MetadataTraitValue'];
};

export type MetadataPatch = {
  __typename?: 'MetadataPatch';
  /**
   * Web3-standardized attributes for the NFT. This determines the uniquenesses,
   * rarity, and resale value. Conventionally, these are assigned randomly at purchase,
   * or through user effort (e.g. staking, gameplay, interaction.) For more information,
   * see: https://docs.opensea.io/docs/metadata-standards#attributes
   */
  attributes?: Maybe<Array<Maybe<MetadataAttribute>>>;
  /**
   * The description that appears in the user's wallet below the NFT name,
   * and in marketplaces. You can use Markdown here.
   */
  description?: Maybe<Scalars['String']>;
  /**
   * A link out to a relevant website. Some wallets and marketplaces may not
   * support this field, so if this is call-to-action, also include it in the
   * description.
   */
  external_url?: Maybe<Scalars['URI']>;
  /**
   * The original, high-res image of the NFT. If this image is ephemeral or will
   * change over time, feel free to upload it to something simple and cheap like S3.
   * When the image will be static, it's more web3-conventional to upload it to a
   * permanent storage solution like Arweave.
   */
  image?: Maybe<Scalars['URI']>;
};

export type MetadataPatchInput = {
  /**
   * Web3-standardized attributes for the NFT. This determines the uniquenesses,
   * rarity, and resale value. Conventionally, these are assigned randomly at purchase,
   * or through user effort (e.g. staking, gameplay, interaction.) For more information,
   * see: https://docs.opensea.io/docs/metadata-standards#attributes
   */
  attributes?: InputMaybe<Array<InputMaybe<MetadataAttributeInput>>>;
  /**
   * The description that appears in the user's wallet below the NFT name,
   * and in marketplaces. You can use Markdown here.
   */
  description?: InputMaybe<Scalars['String']>;
  /**
   * A link out to a relevant website. Some wallets and marketplaces may not
   * support this field, so if this is call-to-action, also include it in the
   * description.
   */
  external_url?: InputMaybe<Scalars['URI']>;
  /**
   * The original, high-res image of the NFT. If this image is ephemeral or will
   * change over time, feel free to upload it to something simple and cheap like S3.
   * When the image will be static, it's more web3-conventional to upload it to a
   * permanent storage solution like Arweave.
   */
  image?: InputMaybe<Scalars['URI']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new NFT in the collection on Kairos. This does not deploy the NFT to the blockchain. */
  createOneOfOneNft: CreateOneOfOneNft;
  /**
   * Deploys the collection to the blockchain (if it hasn't been deployed yet) and
   * then, depending on the type of NFT, deploys some or all of the metadata of the NFT
   * to the blockchain. This can only be done once per NFT. NFTs are "lazy minted"
   * to the blockchain, meaning that their metadata is put on-chain in this operation
   * but the NFT itself doesn't exist, and isn't assigned to any wallet until purchase.
   */
  deployNft: Nft;
  /**
   * Updates the metadata for the NFT. You can change the metadata after deploy
   * and after purchase. Requires the collection to have `hasDynamicMetadata` set to `true`.
   */
  updateDynamicMetadata: Scalars['Boolean'];
};


export type MutationCreateOneOfOneNftArgs = {
  input: CreateOneOfOneNftInput;
};


export type MutationDeployNftArgs = {
  input: DeployNftInput;
};


export type MutationUpdateDynamicMetadataArgs = {
  input: UpdateDynamicMetadataInput;
};

export type Nft = {
  __typename?: 'Nft';
  collectionId?: Maybe<Scalars['UUID']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['UUID']>;
  metadataPatch?: Maybe<MetadataPatch>;
  /**
   * "
   * The on-chain unique identifier of the NFT in the collection.
   * Also known as tokenId (uint256). Usually (but not always) an incrementing
   * integer by order of minting.
   */
  mintPubkey?: Maybe<Scalars['PubkeyBase58']>;
  name?: Maybe<Scalars['String']>;
};

/**
 * An ownership connects minted NFTs to wallets.
 * A user can have many wallets.
 */
export type Ownership = {
  __typename?: 'Ownership';
  id: Scalars['UUID'];
  nft?: Maybe<Nft>;
  nftId: Scalars['UUID'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Gets the known relationship between a user's wallet and an NFT. Ownerships
   * may be delayed when NFTs are transferred or resold.
   */
  collectorOwnershipsByCollection: Array<Maybe<Ownership>>;
  nft: Nft;
  /** Gets the session for the user's current session token that is stored in the cookie */
  session?: Maybe<Session>;
  /** Gets the user that owns the NFT with the given ID. */
  userByNftId: User;
};


export type QueryCollectorOwnershipsByCollectionArgs = {
  collectionId: Scalars['UUID'];
  sessionToken: Scalars['String'];
};


export type QueryNftArgs = {
  nftId: Scalars['UUID'];
};


export type QuerySessionArgs = {
  sessionToken: Scalars['String'];
};


export type QueryUserByNftIdArgs = {
  nftId: Scalars['UUID'];
};

export type Session = {
  __typename?: 'Session';
  createdAt?: Maybe<Scalars['Date']>;
  /** When a session is expiring or has been manually expired */
  expiresAt?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['UUID']>;
  ipAddress?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
  wallet?: Maybe<Wallet>;
  walletId?: Maybe<Scalars['UUID']>;
};

export type UpdateDynamicMetadataInput = {
  /**
   * Overrides to the metadata for the NFT. Any fields not provided are
   * defaulted to values computed from the Collection or the initial NFT creation.
   *
   * Providing an array value for an attribute will replace the default array value.
   * To remove an attribute previously set, omit it from the next request.
   */
  metadataPatch: MetadataPatchInput;
  nftId: Scalars['UUID'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id?: Maybe<Scalars['UUID']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  id?: Maybe<Scalars['UUID']>;
  /** A wallet in our custody */
  isCustody?: Maybe<Scalars['Boolean']>;
  /** Either their own custody or ours */
  pubkey: Scalars['PubkeyBase58'];
};
