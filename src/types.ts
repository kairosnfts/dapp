export enum ContractStatusCode {
  ALREADY_TRANSFERED = 'ALREADY_TRANSFERED',
  AUCTION_OVER = 'AUCTION_OVER',
  BLOCKCHAIN_GENERIC_ERROR = 'BLOCKCHAIN_GENERIC_ERROR',
  CONFIRMING_1 = 'CONFIRMING_1',
  CONFIRMING_2 = 'CONFIRMING_2',
  CONFIRMING_3 = 'CONFIRMING_3',
  CONFIRMING_4 = 'CONFIRMING_4',
  CONFIRMING_5 = 'CONFIRMING_5',
  CONFIRMING_6 = 'CONFIRMING_6',
  GAS_TOO_LOW = 'GAS_TOO_LOW',
  MINT_CHOICES_MINTED = 'MINT_CHOICES_MINTED',
  OUTBID = 'OUTBID',
  SOLD_OUT = 'SOLD_OUT',
  SUCCESS = 'SUCCESS',
}

export type OnBidSuccessArgs = {
  txId: string
  txHash: string
  nftId: string
  code: ContractStatusCode
  userPubkey: string
}

export type OnBidErrorArgs = {
  txId?: string
  txHash?: string
  nftId?: string
  code?: ContractStatusCode
  userPubkey?: string
  apolloError?: { message: string }
}
export enum EmbeddedRequestKind {
  PLACE_BID = 'PLACE_BID',
  DESTROY_SESSION = 'DESTROY_SESSION',
  CHECK_COOKIE_INTEGRITY = 'CHECK_COOKIE_INTEGRITY',
}

export enum EmbeddedResponseKind {
  POP_UP_EXIT = 'POP_UP_EXIT',
  PLACE_BID_START = 'PLACE_BID_START',
  PLACE_BID_SUCCESS = 'PLACE_BID_SUCCESS',
  PLACE_BID_ERROR = 'PLACE_BID_ERROR',
  UPDATE_SESSION = 'UPDATE_SESSION',
  COOKIE_INTEGRITY = 'COOKIE_INTEGRITY',
}

export type DeferPromise<T> = Promise<T> & { resolve: (value: T) => void, reject: (value: T) => void }
