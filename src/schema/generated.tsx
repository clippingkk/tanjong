import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AdminDashboard = {
  __typename?: 'AdminDashboard';
  uncheckedBooks: Array<UncheckedBook>;
};

export type AnalysisDataItem = {
  __typename?: 'AnalysisDataItem';
  count: Scalars['Int'];
  date: Scalars['String'];
};

/**
 * import * from './clippings.graphql'
 * import * from './comments.graphql'
 * import * from './webhook.graphql'
 */
export type AuthResponse = {
  __typename?: 'AuthResponse';
  isNewUser: Scalars['Boolean'];
  noAccountFrom3rdPart: Scalars['Boolean'];
  token: Scalars['String'];
  user: User;
};

/** import * from './clippings.graphql' */
export type Book = {
  __typename?: 'Book';
  clippings: Array<Clipping>;
  clippingsCount: Scalars['Int'];
  doubanId: Scalars['String'];
  isLastReadingBook: Scalars['Boolean'];
  lastReadingAt: Scalars['String'];
  randoms: Array<Clipping>;
  startReadingAt: Scalars['String'];
};

export type Clipping = {
  __typename?: 'Clipping';
  bookID: Scalars['String'];
  comments: Array<Comment>;
  content: Scalars['String'];
  createdAt: Scalars['String'];
  creator: User;
  id: Scalars['Int'];
  nextClipping: SiblingClippingObject;
  pageAt: Scalars['String'];
  prevClipping: SiblingClippingObject;
  reactionData: ReactionData;
  /** @deprecated use reactionData instead */
  reactions: Array<Reaction>;
  source: ClippingSource;
  title: Scalars['String'];
  visible: Scalars['Boolean'];
};

export type ClippingInput = {
  bookID: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['String'];
  pageAt: Scalars['String'];
  source?: InputMaybe<ClippingSource>;
  title: Scalars['String'];
};

/**
 * import * from './comments.graphql'
 * import * from './user.graphql'
 */
export enum ClippingSource {
  Kindle = 'kindle',
  Unknown = 'unknown',
  Weread = 'weread'
}

/**
 * import * from './user.graphql'
 * import * from './clippings.graphql'
 */
export type Comment = {
  __typename?: 'Comment';
  /** clipping id */
  belongsTo: Clipping;
  content: Scalars['String'];
  createdAt: Scalars['String'];
  creator: User;
  deletedAt: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['Int'];
  replyTo?: Maybe<User>;
  updatedAt: Scalars['String'];
};

export enum ExportDestination {
  Flomo = 'flomo',
  Mail = 'mail',
  Notion = 'notion'
}

export type LoginV3Payload = {
  email: Scalars['String'];
  otp: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authByPhone: AuthResponse;
  /** 绑定或者创建 */
  bindAppleUnique: AuthResponse;
  bindPhone: User;
  /** 绑定或者创建 */
  bindWeb3Address: AuthResponse;
  /** the api followed by jwt token */
  claimAPIKey: Scalars['String'];
  createClippings: Array<Clipping>;
  createComment: Comment;
  createReaction: Scalars['Boolean'];
  createWebHook: WebHookItem;
  deleteClipping: Clipping;
  deleteWebHook: Scalars['Boolean'];
  editClipping: Clipping;
  /**
   * flomo.args: https:/xxxxxxx
   * notion args: token | page id
   */
  exportData: Scalars['Boolean'];
  follow: Scalars['Boolean'];
  loginV3: AuthResponse;
  removeMyAccount: Scalars['Boolean'];
  removeReaction: Scalars['Boolean'];
  resetPassword: AuthResponse;
  sendOneTimePasscode: Scalars['Boolean'];
  sendResetTempCode: Scalars['Boolean'];
  signup: AuthResponse;
  syncBooksImage?: Maybe<Array<Scalars['String']>>;
  syncHomelessBook: Scalars['Boolean'];
  toggleClippingVisible: Array<Clipping>;
  unfollow: Scalars['Boolean'];
  updateClippingBookId: Clipping;
  updateUserProfile: User;
  wechatBindByKey: AuthResponse;
};


export type MutationAuthByPhoneArgs = {
  code: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationBindAppleUniqueArgs = {
  code?: InputMaybe<Scalars['String']>;
  payload: AppleVerifyPayload;
  phone?: InputMaybe<Scalars['String']>;
};


export type MutationBindPhoneArgs = {
  code: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationBindWeb3AddressArgs = {
  code?: InputMaybe<Scalars['String']>;
  payload: Web3VerifyPayload;
  phone?: InputMaybe<Scalars['String']>;
};


export type MutationClaimApiKeyArgs = {
  token: Scalars['String'];
};


export type MutationCreateClippingsArgs = {
  payload: Array<ClippingInput>;
  visible?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateCommentArgs = {
  cid: Scalars['Int'];
  content: Scalars['String'];
};


export type MutationCreateReactionArgs = {
  symbol: Scalars['String'];
  target: ReactionTarget;
  targetId: Scalars['Int'];
};


export type MutationCreateWebHookArgs = {
  hookUrl: Scalars['String'];
  step: WebHookStep;
};


export type MutationDeleteClippingArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteWebHookArgs = {
  id: Scalars['Int'];
};


export type MutationEditClippingArgs = {
  content: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationExportDataArgs = {
  args: Scalars['String'];
  destination: ExportDestination;
};


export type MutationFollowArgs = {
  targetUserID: Scalars['Int'];
};


export type MutationLoginV3Args = {
  payload: LoginV3Payload;
};


export type MutationRemoveReactionArgs = {
  rid: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};


export type MutationResetPasswordArgs = {
  code: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSendOneTimePasscodeArgs = {
  address: Scalars['String'];
  cfTurnstileToken: Scalars['String'];
  channel: OtpChannel;
};


export type MutationSendResetTempCodeArgs = {
  email: Scalars['String'];
};


export type MutationSignupArgs = {
  payload: SignupPayload;
};


export type MutationSyncHomelessBookArgs = {
  doubanID: Scalars['String'];
  title: Scalars['String'];
};


export type MutationToggleClippingVisibleArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationUnfollowArgs = {
  targetUserID: Scalars['Int'];
};


export type MutationUpdateClippingBookIdArgs = {
  clippingId: Scalars['Int'];
  doubanId: Scalars['Int'];
};


export type MutationUpdateUserProfileArgs = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationWechatBindByKeyArgs = {
  key: Scalars['String'];
};

export type NftItem = {
  __typename?: 'NftItem';
  amount: Scalars['String'];
  blockNumber: Scalars['String'];
  blockNumberMinted: Scalars['String'];
  contractType: Scalars['String'];
  lastMetadataSync: Scalars['String'];
  lastTokenURISync: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  ownerOf: Scalars['String'];
  symbol: Scalars['String'];
  tokenAddress: Scalars['String'];
  tokenHash: Scalars['String'];
  tokenID: Scalars['String'];
  tokenURI: Scalars['String'];
};

export type NftListResponse = {
  __typename?: 'NftListResponse';
  count: Scalars['Int'];
  edges: Array<NftItem>;
};

export enum OtpChannel {
  Email = 'Email'
}

export type Pagination = {
  lastId?: InputMaybe<Scalars['Int']>;
  limit: Scalars['Int'];
};

export type PaginationLegacy = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export enum PlatformEnv {
  Android = 'android',
  Ios = 'ios',
  Web = 'web'
}

/**
 * import * from './user.graphql'
 * import * from './books.graphql'
 * import * from './clippings.graphql'
 */
export type PublicData = {
  __typename?: 'PublicData';
  books: Array<Book>;
  clippings: Array<Clipping>;
  users: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  adminDashboard: AdminDashboard;
  auth: AuthResponse;
  book: Book;
  books: Array<Book>;
  clipping: Clipping;
  clippings: Array<Clipping>;
  domainAvailable: Scalars['Boolean'];
  featuredClippings: Array<Clipping>;
  githubAuth: AuthResponse;
  loginByApple: AuthResponse;
  loginByWeb3: AuthResponse;
  me: User;
  mpAuth: AuthResponse;
  public: PublicData;
  reportYearly: ReportYearly;
  search: SearchResult;
  wechatBindKey: Scalars['String'];
};


export type QueryAdminDashboardArgs = {
  pagination: PaginationLegacy;
};


export type QueryAuthArgs = {
  cfTurnstileToken: Scalars['String'];
  email: Scalars['String'];
  pwd: Scalars['String'];
};


export type QueryBookArgs = {
  id: Scalars['Int'];
  pagination?: InputMaybe<PaginationLegacy>;
  uid?: InputMaybe<Scalars['Int']>;
};


export type QueryBooksArgs = {
  pagination: PaginationLegacy;
  uid?: InputMaybe<Scalars['Int']>;
};


export type QueryClippingArgs = {
  id: Scalars['Int'];
  pagination?: InputMaybe<Pagination>;
};


export type QueryClippingsArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryDomainAvailableArgs = {
  q: Scalars['String'];
};


export type QueryFeaturedClippingsArgs = {
  pagination: Pagination;
};


export type QueryGithubAuthArgs = {
  code: Scalars['String'];
};


export type QueryLoginByAppleArgs = {
  payload: AppleVerifyPayload;
};


export type QueryLoginByWeb3Args = {
  payload: Web3VerifyPayload;
};


export type QueryMeArgs = {
  domain?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type QueryMpAuthArgs = {
  code: Scalars['String'];
};


export type QueryPublicArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryReportYearlyArgs = {
  domain?: InputMaybe<Scalars['String']>;
  uid: Scalars['Int'];
  year: Scalars['Int'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
  scope?: InputMaybe<SearchScope>;
  type?: InputMaybe<SearchType>;
};

export type Reaction = {
  __typename?: 'Reaction';
  createdAt: Scalars['String'];
  creator: User;
  id: Scalars['Int'];
  symbol: Scalars['String'];
  target: ReactionTarget;
  targetId: Scalars['Int'];
  updatedAt: Scalars['String'];
};

export type ReactionData = {
  __typename?: 'ReactionData';
  count: Scalars['Int'];
  symbolCounts: Array<ReactionWithSymbolCount>;
};

export enum ReactionTarget {
  Book = 'book',
  Clipping = 'clipping',
  User = 'user'
}

export type ReactionWithSymbolCount = {
  __typename?: 'ReactionWithSymbolCount';
  count: Scalars['Int'];
  done: Scalars['Boolean'];
  recently: Array<Reaction>;
  symbol: Scalars['String'];
};

export type ReportYearly = {
  __typename?: 'ReportYearly';
  books: Array<Book>;
  user: User;
};

export type SearchResult = {
  __typename?: 'SearchResult';
  clippings: Array<Clipping>;
  users: Array<User>;
};

export enum SearchScope {
  Me = 'Me'
}

export enum SearchType {
  BookName = 'BookName',
  User = 'User'
}

export type SignupPayload = {
  email: Scalars['String'];
  otp: Scalars['String'];
  password: Scalars['String'];
};

export type UncheckedBook = {
  __typename?: 'UncheckedBook';
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  analysis: UserAnalysis;
  appleUnique: Scalars['String'];
  avatar: Scalars['String'];
  bio: Scalars['String'];
  checked: Scalars['Boolean'];
  clippingsCount: Scalars['Int'];
  comments: Array<Comment>;
  createdAt: Scalars['String'];
  domain: Scalars['String'];
  email: Scalars['String'];
  externalInfo: UserExternalInfo;
  followers: Array<User>;
  id: Scalars['Int'];
  /** 已登录用户是否是是此用户的粉丝. 如果是自己: true */
  isFan: Scalars['Boolean'];
  name: Scalars['String'];
  nfts: NftListResponse;
  password: Scalars['String'];
  phone: Scalars['String'];
  /** 最近三个月读的书 */
  recent3mReadings: Array<Scalars['String']>;
  recents: Array<Clipping>;
  updatedAt: Scalars['String'];
  webhooks: Array<WebHookItem>;
  wechatOpenid: Scalars['String'];
};

export type UserAnalysis = {
  __typename?: 'UserAnalysis';
  daily: Array<AnalysisDataItem>;
  /** 最近一年的数据 */
  monthly: Array<AnalysisDataItem>;
  timelineLastYear: Array<UserAnalysisTimelineRow>;
};

export type UserAnalysisTimelineRow = {
  __typename?: 'UserAnalysisTimelineRow';
  bookDoubanID: Scalars['String'];
  clippingsCount: Scalars['Int'];
  lastAt: Scalars['String'];
  startAt: Scalars['String'];
};

export type UserExternalInfo = {
  __typename?: 'UserExternalInfo';
  address: Array<Scalars['String']>;
  appleUnique: Scalars['String'];
  githubBound: Scalars['Boolean'];
  iosDeviceId: Scalars['String'];
};

export type WebHookItem = {
  __typename?: 'WebHookItem';
  hookUrl: Scalars['String'];
  id: Scalars['Int'];
  owner: Scalars['Int'];
  step: WebHookStep;
};

export enum WebHookStep {
  OnCreateClippings = 'onCreateClippings'
}

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type AppleVerifyPayload = {
  code: Scalars['String'];
  idToken: Scalars['String'];
  platform: Scalars['String'];
  state: Scalars['String'];
};

export type SiblingClippingObject = {
  __typename?: 'siblingClippingObject';
  bookClippingID: Scalars['Int'];
  userClippingID: Scalars['Int'];
};

export type Web3VerifyPayload = {
  address: Scalars['String'];
  signature: Scalars['String'];
  text: Scalars['String'];
};

export type UncheckBooksQueryQueryVariables = Exact<{
  pagination: PaginationLegacy;
}>;


export type UncheckBooksQueryQuery = { __typename?: 'Query', adminDashboard: { __typename?: 'AdminDashboard', uncheckedBooks: Array<{ __typename?: 'UncheckedBook', title: string }> } };

export type AuthQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  cfTurnstileToken: Scalars['String'];
}>;


export type AuthQuery = { __typename?: 'Query', auth: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, domain: string, wechatOpenid: string } } };

export type BindAppleUniqueMutationVariables = Exact<{
  phone?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  payload: AppleVerifyPayload;
}>;


export type BindAppleUniqueMutation = { __typename?: 'Mutation', bindAppleUnique: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, wechatOpenid: string, domain: string } } };

export type LoginByAppleQueryVariables = Exact<{
  payload: AppleVerifyPayload;
}>;


export type LoginByAppleQuery = { __typename?: 'Query', loginByApple: { __typename?: 'AuthResponse', token: string, noAccountFrom3rdPart: boolean, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, domain: string, wechatOpenid: string } } };

export type DoLoginV3MutationVariables = Exact<{
  payload: LoginV3Payload;
}>;


export type DoLoginV3Mutation = { __typename?: 'Mutation', loginV3: { __typename?: 'AuthResponse', token: string, noAccountFrom3rdPart: boolean, isNewUser: boolean, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, domain: string, wechatOpenid: string } } };

export type SendOtpMutationVariables = Exact<{
  channel: OtpChannel;
  address: Scalars['String'];
  cfTurnstileToken: Scalars['String'];
}>;


export type SendOtpMutation = { __typename?: 'Mutation', sendOneTimePasscode: boolean };

export type AuthByWeb3QueryVariables = Exact<{
  payload: Web3VerifyPayload;
}>;


export type AuthByWeb3Query = { __typename?: 'Query', loginByWeb3: { __typename?: 'AuthResponse', token: string, noAccountFrom3rdPart: boolean, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, domain: string, wechatOpenid: string } } };

export type WechatBindQueryVariables = Exact<{ [key: string]: never; }>;


export type WechatBindQuery = { __typename?: 'Query', wechatBindKey: string };

export type BindWeb3AddressMutationVariables = Exact<{
  phone?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  payload: Web3VerifyPayload;
}>;


export type BindWeb3AddressMutation = { __typename?: 'Mutation', bindWeb3Address: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, wechatOpenid: string, domain: string } } };

export type BookQueryVariables = Exact<{
  id: Scalars['Int'];
  pagination: PaginationLegacy;
}>;


export type BookQuery = { __typename?: 'Query', book: { __typename?: 'Book', doubanId: string, startReadingAt: string, lastReadingAt: string, isLastReadingBook: boolean, clippingsCount: number, clippings: Array<{ __typename?: 'Clipping', id: number, bookID: string, title: string, content: string, createdAt: string, pageAt: string }> } };

export type BooksQueryVariables = Exact<{
  id: Scalars['Int'];
  pagination: PaginationLegacy;
}>;


export type BooksQuery = { __typename?: 'Query', me: { __typename?: 'User', domain: string, recent3mReadings: Array<string>, recents: Array<{ __typename?: 'Clipping', id: number, content: string, bookID: string }> }, books: Array<{ __typename?: 'Book', doubanId: string }> };

export type ClaimCliApiTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ClaimCliApiTokenMutation = { __typename?: 'Mutation', claimAPIKey: string };

export type FetchClippingQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FetchClippingQuery = { __typename?: 'Query', clipping: { __typename?: 'Clipping', id: number, bookID: string, title: string, content: string, createdAt: string, pageAt: string, visible: boolean, prevClipping: { __typename?: 'siblingClippingObject', userClippingID: number, bookClippingID: number }, nextClipping: { __typename?: 'siblingClippingObject', userClippingID: number, bookClippingID: number }, reactionData: { __typename?: 'ReactionData', count: number, symbolCounts: Array<{ __typename?: 'ReactionWithSymbolCount', symbol: string, count: number, done: boolean, recently: Array<{ __typename?: 'Reaction', id: number, symbol: string, createdAt: string, creator: { __typename?: 'User', id: number, avatar: string, name: string } }> }> }, creator: { __typename?: 'User', id: number, name: string, avatar: string, domain: string }, comments: Array<{ __typename?: 'Comment', id: number, content: string, creator: { __typename?: 'User', id: number, avatar: string, name: string } }> } };

export type FetchExternalAccountQueryVariables = Exact<{
  id: Scalars['Int'];
  domain?: InputMaybe<Scalars['String']>;
}>;


export type FetchExternalAccountQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, externalInfo: { __typename?: 'UserExternalInfo', iosDeviceId: string, githubBound: boolean, appleUnique: string, address: Array<string> } } };

export type FetchMyWebHooksQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FetchMyWebHooksQuery = { __typename?: 'Query', me: { __typename?: 'User', webhooks: Array<{ __typename?: 'WebHookItem', id: number, step: WebHookStep, hookUrl: string }> } };

export type FetchMyNfTsQueryVariables = Exact<{
  uid: Scalars['Int'];
}>;


export type FetchMyNfTsQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, nfts: { __typename?: 'NftListResponse', count: number, edges: Array<{ __typename?: 'NftItem', tokenID: string, tokenAddress: string, ownerOf: string, blockNumber: string, blockNumberMinted: string, tokenHash: string, amount: string, contractType: string, name: string, symbol: string, tokenURI: string, metadata: string, lastTokenURISync: string, lastMetadataSync: string }> } } };

export type WebhookItemDataFragment = { __typename?: 'WebHookItem', id: number, step: WebHookStep, hookUrl: string };

export type GithubLoginQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type GithubLoginQuery = { __typename?: 'Query', githubAuth: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, bio: string, createdAt: string, updatedAt: string, domain: string, wechatOpenid: string } } };

export type DeleteMyAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMyAccountMutation = { __typename?: 'Mutation', removeMyAccount: boolean };

export type AuthByPhoneMutationVariables = Exact<{
  phone: Scalars['String'];
  code: Scalars['String'];
}>;


export type AuthByPhoneMutation = { __typename?: 'Mutation', authByPhone: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, wechatOpenid: string, domain: string } } };

export type BindUserPhoneMutationVariables = Exact<{
  phone: Scalars['String'];
  code: Scalars['String'];
}>;


export type BindUserPhoneMutation = { __typename?: 'Mutation', bindPhone: { __typename?: 'User', id: number } };

export type CreateClippingsMutationVariables = Exact<{
  payload: Array<ClippingInput> | ClippingInput;
  visible?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateClippingsMutation = { __typename?: 'Mutation', createClippings: Array<{ __typename?: 'Clipping', id: number }> };

export type CreateCommentMutationVariables = Exact<{
  cid: Scalars['Int'];
  content: Scalars['String'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: number } };

export type ExportDataToMutationVariables = Exact<{
  destination: ExportDestination;
  args: Scalars['String'];
}>;


export type ExportDataToMutation = { __typename?: 'Mutation', exportData: boolean };

export type FollowUserMutationVariables = Exact<{
  targetUserID: Scalars['Int'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', follow: boolean };

export type SyncHomelessBookMutationVariables = Exact<{
  title: Scalars['String'];
  doubanID: Scalars['String'];
}>;


export type SyncHomelessBookMutation = { __typename?: 'Mutation', syncHomelessBook: boolean };

export type ToggleClippingVisibleMutationVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ToggleClippingVisibleMutation = { __typename?: 'Mutation', toggleClippingVisible: Array<{ __typename?: 'Clipping', id: number, visible: boolean }> };

export type UnfollowUserMutationVariables = Exact<{
  targetUserID: Scalars['Int'];
}>;


export type UnfollowUserMutation = { __typename?: 'Mutation', unfollow: boolean };

export type UpdateProfileMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'User', id: number, name: string, avatar: string, bio: string, domain: string } };

export type CreateNewWebHookMutationVariables = Exact<{
  step: WebHookStep;
  hookUrl: Scalars['String'];
}>;


export type CreateNewWebHookMutation = { __typename?: 'Mutation', createWebHook: { __typename?: 'WebHookItem', id: number, step: WebHookStep, hookUrl: string } };

export type DeleteAWebHookMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAWebHookMutation = { __typename?: 'Mutation', deleteWebHook: boolean };

export type QueryMyIdByDomainQueryVariables = Exact<{
  domain: Scalars['String'];
}>;


export type QueryMyIdByDomainQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, domain: string } };

export type ProfileQueryVariables = Exact<{
  id: Scalars['Int'];
  domain?: InputMaybe<Scalars['String']>;
}>;


export type ProfileQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, password: string, phone: string, avatar: string, checked: boolean, bio: string, createdAt: string, updatedAt: string, wechatOpenid: string, isFan: boolean, domain: string, clippingsCount: number, followers: Array<{ __typename?: 'User', id: number, name: string, avatar: string, bio: string }>, recents: Array<{ __typename?: 'Clipping', id: number, bookID: string, title: string, content: string, createdAt: string, pageAt: string }>, analysis: { __typename?: 'UserAnalysis', monthly: Array<{ __typename?: 'AnalysisDataItem', date: string, count: number }>, daily: Array<{ __typename?: 'AnalysisDataItem', date: string, count: number }> }, comments: Array<{ __typename?: 'Comment', id: number, content: string, belongsTo: { __typename?: 'Clipping', id: number, content: string, bookID: string, creator: { __typename?: 'User', id: number, avatar: string, name: string } } }> } };

export type PublicDataQueryVariables = Exact<{ [key: string]: never; }>;


export type PublicDataQuery = { __typename?: 'Query', public: { __typename?: 'PublicData', users: Array<{ __typename?: 'User', id: number, avatar: string, bio: string, name: string, domain: string }>, books: Array<{ __typename?: 'Book', doubanId: string }>, clippings: Array<{ __typename?: 'Clipping', id: number, content: string, bookID: string, title: string, creator: { __typename?: 'User', id: number, name: string, avatar: string, domain: string } }> } };

export type ReactionCreateMutationVariables = Exact<{
  targetId: Scalars['Int'];
  target: ReactionTarget;
  symbol: Scalars['String'];
}>;


export type ReactionCreateMutation = { __typename?: 'Mutation', createReaction: boolean };

export type ReactionRemoveMutationVariables = Exact<{
  symbol: Scalars['String'];
}>;


export type ReactionRemoveMutation = { __typename?: 'Mutation', removeReaction: boolean };

export type FetchYearlyReportQueryVariables = Exact<{
  year: Scalars['Int'];
  uid: Scalars['Int'];
}>;


export type FetchYearlyReportQuery = { __typename?: 'Query', reportYearly: { __typename?: 'ReportYearly', user: { __typename?: 'User', id: number, avatar: string, name: string, domain: string }, books: Array<{ __typename?: 'Book', doubanId: string, clippingsCount: number, clippings: Array<{ __typename?: 'Clipping', id: number, content: string }> }> } };

export type SearchQueryQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQueryQuery = { __typename?: 'Query', search: { __typename?: 'SearchResult', clippings: Array<{ __typename?: 'Clipping', id: number, content: string }> } };

export type SignupMutationVariables = Exact<{
  payload: SignupPayload;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, phone: string, password: string, avatar: string, checked: boolean, createdAt: string, updatedAt: string, bio: string, domain: string, wechatOpenid: string } } };

export type FetchSquareDataQueryVariables = Exact<{
  pagination: Pagination;
}>;


export type FetchSquareDataQuery = { __typename?: 'Query', featuredClippings: Array<{ __typename?: 'Clipping', id: number, title: string, content: string, bookID: string, pageAt: string, creator: { __typename?: 'User', id: number, avatar: string, clippingsCount: number, name: string, domain: string } }> };

export type UpdateClippingBookIdMutationVariables = Exact<{
  cid: Scalars['Int'];
  doubanId: Scalars['Int'];
}>;


export type UpdateClippingBookIdMutation = { __typename?: 'Mutation', updateClippingBookId: { __typename?: 'Clipping', id: number, bookID: string, title: string, content: string, createdAt: string, pageAt: string } };

export const WebhookItemDataFragmentDoc = `
    fragment webhookItemData on WebHookItem {
  id
  step
  hookUrl
}
    `;
export const UncheckBooksQueryDocument = `
    query uncheckBooksQuery($pagination: PaginationLegacy!) {
  adminDashboard(pagination: $pagination) {
    uncheckedBooks {
      title
    }
  }
}
    `;
export const useUncheckBooksQueryQuery = <
      TData = UncheckBooksQueryQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: UncheckBooksQueryQueryVariables,
      options?: UseQueryOptions<UncheckBooksQueryQuery, TError, TData>
    ) =>
    useQuery<UncheckBooksQueryQuery, TError, TData>(
      ['uncheckBooksQuery', variables],
      fetcher<UncheckBooksQueryQuery, UncheckBooksQueryQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UncheckBooksQueryDocument, variables),
      options
    );
export const AuthDocument = `
    query auth($email: String!, $password: String!, $cfTurnstileToken: String!) {
  auth(email: $email, pwd: $password, cfTurnstileToken: $cfTurnstileToken) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      domain
      wechatOpenid
    }
    token
  }
}
    `;
export const useAuthQuery = <
      TData = AuthQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: AuthQueryVariables,
      options?: UseQueryOptions<AuthQuery, TError, TData>
    ) =>
    useQuery<AuthQuery, TError, TData>(
      ['auth', variables],
      fetcher<AuthQuery, AuthQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AuthDocument, variables),
      options
    );
export const BindAppleUniqueDocument = `
    mutation bindAppleUnique($phone: String, $code: String, $payload: appleVerifyPayload!) {
  bindAppleUnique(phone: $phone, code: $code, payload: $payload) {
    user {
      id
      name
      email
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      wechatOpenid
      domain
    }
    token
  }
}
    `;
export const useBindAppleUniqueMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<BindAppleUniqueMutation, TError, BindAppleUniqueMutationVariables, TContext>
    ) =>
    useMutation<BindAppleUniqueMutation, TError, BindAppleUniqueMutationVariables, TContext>(
      ['bindAppleUnique'],
      (variables?: BindAppleUniqueMutationVariables) => fetcher<BindAppleUniqueMutation, BindAppleUniqueMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, BindAppleUniqueDocument, variables)(),
      options
    );
export const LoginByAppleDocument = `
    query loginByApple($payload: appleVerifyPayload!) {
  loginByApple(payload: $payload) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      domain
      wechatOpenid
    }
    token
    noAccountFrom3rdPart
  }
}
    `;
export const useLoginByAppleQuery = <
      TData = LoginByAppleQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: LoginByAppleQueryVariables,
      options?: UseQueryOptions<LoginByAppleQuery, TError, TData>
    ) =>
    useQuery<LoginByAppleQuery, TError, TData>(
      ['loginByApple', variables],
      fetcher<LoginByAppleQuery, LoginByAppleQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, LoginByAppleDocument, variables),
      options
    );
export const DoLoginV3Document = `
    mutation doLoginV3($payload: LoginV3Payload!) {
  loginV3(payload: $payload) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      domain
      wechatOpenid
    }
    token
    noAccountFrom3rdPart
    isNewUser
  }
}
    `;
export const useDoLoginV3Mutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DoLoginV3Mutation, TError, DoLoginV3MutationVariables, TContext>
    ) =>
    useMutation<DoLoginV3Mutation, TError, DoLoginV3MutationVariables, TContext>(
      ['doLoginV3'],
      (variables?: DoLoginV3MutationVariables) => fetcher<DoLoginV3Mutation, DoLoginV3MutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DoLoginV3Document, variables)(),
      options
    );
export const SendOtpDocument = `
    mutation sendOTP($channel: OTPChannel!, $address: String!, $cfTurnstileToken: String!) {
  sendOneTimePasscode(
    channel: $channel
    address: $address
    cfTurnstileToken: $cfTurnstileToken
  )
}
    `;
export const useSendOtpMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<SendOtpMutation, TError, SendOtpMutationVariables, TContext>
    ) =>
    useMutation<SendOtpMutation, TError, SendOtpMutationVariables, TContext>(
      ['sendOTP'],
      (variables?: SendOtpMutationVariables) => fetcher<SendOtpMutation, SendOtpMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SendOtpDocument, variables)(),
      options
    );
export const AuthByWeb3Document = `
    query authByWeb3($payload: web3VerifyPayload!) {
  loginByWeb3(payload: $payload) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      domain
      wechatOpenid
    }
    token
    noAccountFrom3rdPart
  }
}
    `;
export const useAuthByWeb3Query = <
      TData = AuthByWeb3Query,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: AuthByWeb3QueryVariables,
      options?: UseQueryOptions<AuthByWeb3Query, TError, TData>
    ) =>
    useQuery<AuthByWeb3Query, TError, TData>(
      ['authByWeb3', variables],
      fetcher<AuthByWeb3Query, AuthByWeb3QueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AuthByWeb3Document, variables),
      options
    );
export const WechatBindDocument = `
    query wechatBind {
  wechatBindKey
}
    `;
export const useWechatBindQuery = <
      TData = WechatBindQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: WechatBindQueryVariables,
      options?: UseQueryOptions<WechatBindQuery, TError, TData>
    ) =>
    useQuery<WechatBindQuery, TError, TData>(
      variables === undefined ? ['wechatBind'] : ['wechatBind', variables],
      fetcher<WechatBindQuery, WechatBindQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, WechatBindDocument, variables),
      options
    );
export const BindWeb3AddressDocument = `
    mutation bindWeb3Address($phone: String, $code: String, $payload: web3VerifyPayload!) {
  bindWeb3Address(phone: $phone, code: $code, payload: $payload) {
    user {
      id
      name
      email
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      wechatOpenid
      domain
    }
    token
  }
}
    `;
export const useBindWeb3AddressMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<BindWeb3AddressMutation, TError, BindWeb3AddressMutationVariables, TContext>
    ) =>
    useMutation<BindWeb3AddressMutation, TError, BindWeb3AddressMutationVariables, TContext>(
      ['bindWeb3Address'],
      (variables?: BindWeb3AddressMutationVariables) => fetcher<BindWeb3AddressMutation, BindWeb3AddressMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, BindWeb3AddressDocument, variables)(),
      options
    );
export const BookDocument = `
    query book($id: Int!, $pagination: PaginationLegacy!) {
  book(id: $id, pagination: $pagination) {
    doubanId
    startReadingAt
    lastReadingAt
    isLastReadingBook
    clippingsCount
    clippings {
      id
      bookID
      title
      content
      createdAt
      pageAt
    }
  }
}
    `;
export const useBookQuery = <
      TData = BookQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: BookQueryVariables,
      options?: UseQueryOptions<BookQuery, TError, TData>
    ) =>
    useQuery<BookQuery, TError, TData>(
      ['book', variables],
      fetcher<BookQuery, BookQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, BookDocument, variables),
      options
    );
export const BooksDocument = `
    query books($id: Int!, $pagination: PaginationLegacy!) {
  me(id: $id) {
    domain
    recent3mReadings
    recents {
      id
      content
      bookID
    }
  }
  books(pagination: $pagination) {
    doubanId
  }
}
    `;
export const useBooksQuery = <
      TData = BooksQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: BooksQueryVariables,
      options?: UseQueryOptions<BooksQuery, TError, TData>
    ) =>
    useQuery<BooksQuery, TError, TData>(
      ['books', variables],
      fetcher<BooksQuery, BooksQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, BooksDocument, variables),
      options
    );
export const ClaimCliApiTokenDocument = `
    mutation claimCliAPIToken($token: String!) {
  claimAPIKey(token: $token)
}
    `;
export const useClaimCliApiTokenMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<ClaimCliApiTokenMutation, TError, ClaimCliApiTokenMutationVariables, TContext>
    ) =>
    useMutation<ClaimCliApiTokenMutation, TError, ClaimCliApiTokenMutationVariables, TContext>(
      ['claimCliAPIToken'],
      (variables?: ClaimCliApiTokenMutationVariables) => fetcher<ClaimCliApiTokenMutation, ClaimCliApiTokenMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ClaimCliApiTokenDocument, variables)(),
      options
    );
export const FetchClippingDocument = `
    query fetchClipping($id: Int!) {
  clipping(id: $id) {
    id
    bookID
    title
    content
    createdAt
    pageAt
    visible
    prevClipping {
      userClippingID
      bookClippingID
    }
    nextClipping {
      userClippingID
      bookClippingID
    }
    reactionData {
      count
      symbolCounts {
        symbol
        count
        done
        recently {
          id
          symbol
          creator {
            id
            avatar
            name
          }
          createdAt
        }
      }
    }
    creator {
      id
      name
      avatar
      domain
    }
    comments {
      id
      content
      creator {
        id
        avatar
        name
      }
    }
  }
}
    `;
export const useFetchClippingQuery = <
      TData = FetchClippingQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchClippingQueryVariables,
      options?: UseQueryOptions<FetchClippingQuery, TError, TData>
    ) =>
    useQuery<FetchClippingQuery, TError, TData>(
      ['fetchClipping', variables],
      fetcher<FetchClippingQuery, FetchClippingQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchClippingDocument, variables),
      options
    );
export const FetchExternalAccountDocument = `
    query fetchExternalAccount($id: Int!, $domain: String) {
  me(id: $id, domain: $domain) {
    id
    externalInfo {
      iosDeviceId
      githubBound
      appleUnique
      address
    }
  }
}
    `;
export const useFetchExternalAccountQuery = <
      TData = FetchExternalAccountQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchExternalAccountQueryVariables,
      options?: UseQueryOptions<FetchExternalAccountQuery, TError, TData>
    ) =>
    useQuery<FetchExternalAccountQuery, TError, TData>(
      ['fetchExternalAccount', variables],
      fetcher<FetchExternalAccountQuery, FetchExternalAccountQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchExternalAccountDocument, variables),
      options
    );
export const FetchMyWebHooksDocument = `
    query fetchMyWebHooks($id: Int!) {
  me(id: $id) {
    webhooks {
      ...webhookItemData
    }
  }
}
    ${WebhookItemDataFragmentDoc}`;
export const useFetchMyWebHooksQuery = <
      TData = FetchMyWebHooksQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchMyWebHooksQueryVariables,
      options?: UseQueryOptions<FetchMyWebHooksQuery, TError, TData>
    ) =>
    useQuery<FetchMyWebHooksQuery, TError, TData>(
      ['fetchMyWebHooks', variables],
      fetcher<FetchMyWebHooksQuery, FetchMyWebHooksQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchMyWebHooksDocument, variables),
      options
    );
export const FetchMyNfTsDocument = `
    query fetchMyNFTs($uid: Int!) {
  me(id: $uid) {
    id
    nfts {
      count
      edges {
        tokenID
        tokenAddress
        ownerOf
        blockNumber
        blockNumberMinted
        tokenHash
        amount
        contractType
        name
        symbol
        tokenURI
        metadata
        lastTokenURISync
        lastMetadataSync
      }
    }
  }
}
    `;
export const useFetchMyNfTsQuery = <
      TData = FetchMyNfTsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchMyNfTsQueryVariables,
      options?: UseQueryOptions<FetchMyNfTsQuery, TError, TData>
    ) =>
    useQuery<FetchMyNfTsQuery, TError, TData>(
      ['fetchMyNFTs', variables],
      fetcher<FetchMyNfTsQuery, FetchMyNfTsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchMyNfTsDocument, variables),
      options
    );
export const GithubLoginDocument = `
    query githubLogin($code: String!) {
  githubAuth(code: $code) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      bio
      createdAt
      updatedAt
      domain
      wechatOpenid
    }
    token
  }
}
    `;
export const useGithubLoginQuery = <
      TData = GithubLoginQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GithubLoginQueryVariables,
      options?: UseQueryOptions<GithubLoginQuery, TError, TData>
    ) =>
    useQuery<GithubLoginQuery, TError, TData>(
      ['githubLogin', variables],
      fetcher<GithubLoginQuery, GithubLoginQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GithubLoginDocument, variables),
      options
    );
export const DeleteMyAccountDocument = `
    mutation deleteMyAccount {
  removeMyAccount
}
    `;
export const useDeleteMyAccountMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteMyAccountMutation, TError, DeleteMyAccountMutationVariables, TContext>
    ) =>
    useMutation<DeleteMyAccountMutation, TError, DeleteMyAccountMutationVariables, TContext>(
      ['deleteMyAccount'],
      (variables?: DeleteMyAccountMutationVariables) => fetcher<DeleteMyAccountMutation, DeleteMyAccountMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteMyAccountDocument, variables)(),
      options
    );
export const AuthByPhoneDocument = `
    mutation authByPhone($phone: String!, $code: String!) {
  authByPhone(phone: $phone, code: $code) {
    user {
      id
      name
      email
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      wechatOpenid
      domain
    }
    token
  }
}
    `;
export const useAuthByPhoneMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<AuthByPhoneMutation, TError, AuthByPhoneMutationVariables, TContext>
    ) =>
    useMutation<AuthByPhoneMutation, TError, AuthByPhoneMutationVariables, TContext>(
      ['authByPhone'],
      (variables?: AuthByPhoneMutationVariables) => fetcher<AuthByPhoneMutation, AuthByPhoneMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AuthByPhoneDocument, variables)(),
      options
    );
export const BindUserPhoneDocument = `
    mutation bindUserPhone($phone: String!, $code: String!) {
  bindPhone(phone: $phone, code: $code) {
    id
  }
}
    `;
export const useBindUserPhoneMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<BindUserPhoneMutation, TError, BindUserPhoneMutationVariables, TContext>
    ) =>
    useMutation<BindUserPhoneMutation, TError, BindUserPhoneMutationVariables, TContext>(
      ['bindUserPhone'],
      (variables?: BindUserPhoneMutationVariables) => fetcher<BindUserPhoneMutation, BindUserPhoneMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, BindUserPhoneDocument, variables)(),
      options
    );
export const CreateClippingsDocument = `
    mutation createClippings($payload: [ClippingInput!]!, $visible: Boolean) {
  createClippings(payload: $payload, visible: $visible) {
    id
  }
}
    `;
export const useCreateClippingsMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<CreateClippingsMutation, TError, CreateClippingsMutationVariables, TContext>
    ) =>
    useMutation<CreateClippingsMutation, TError, CreateClippingsMutationVariables, TContext>(
      ['createClippings'],
      (variables?: CreateClippingsMutationVariables) => fetcher<CreateClippingsMutation, CreateClippingsMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateClippingsDocument, variables)(),
      options
    );
export const CreateCommentDocument = `
    mutation createComment($cid: Int!, $content: String!) {
  createComment(cid: $cid, content: $content) {
    id
  }
}
    `;
export const useCreateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>
    ) =>
    useMutation<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>(
      ['createComment'],
      (variables?: CreateCommentMutationVariables) => fetcher<CreateCommentMutation, CreateCommentMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateCommentDocument, variables)(),
      options
    );
export const ExportDataToDocument = `
    mutation exportDataTo($destination: ExportDestination!, $args: String!) {
  exportData(destination: $destination, args: $args)
}
    `;
export const useExportDataToMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<ExportDataToMutation, TError, ExportDataToMutationVariables, TContext>
    ) =>
    useMutation<ExportDataToMutation, TError, ExportDataToMutationVariables, TContext>(
      ['exportDataTo'],
      (variables?: ExportDataToMutationVariables) => fetcher<ExportDataToMutation, ExportDataToMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ExportDataToDocument, variables)(),
      options
    );
export const FollowUserDocument = `
    mutation followUser($targetUserID: Int!) {
  follow(targetUserID: $targetUserID)
}
    `;
export const useFollowUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<FollowUserMutation, TError, FollowUserMutationVariables, TContext>
    ) =>
    useMutation<FollowUserMutation, TError, FollowUserMutationVariables, TContext>(
      ['followUser'],
      (variables?: FollowUserMutationVariables) => fetcher<FollowUserMutation, FollowUserMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FollowUserDocument, variables)(),
      options
    );
export const SyncHomelessBookDocument = `
    mutation syncHomelessBook($title: String!, $doubanID: String!) {
  syncHomelessBook(title: $title, doubanID: $doubanID)
}
    `;
export const useSyncHomelessBookMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<SyncHomelessBookMutation, TError, SyncHomelessBookMutationVariables, TContext>
    ) =>
    useMutation<SyncHomelessBookMutation, TError, SyncHomelessBookMutationVariables, TContext>(
      ['syncHomelessBook'],
      (variables?: SyncHomelessBookMutationVariables) => fetcher<SyncHomelessBookMutation, SyncHomelessBookMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SyncHomelessBookDocument, variables)(),
      options
    );
export const ToggleClippingVisibleDocument = `
    mutation toggleClippingVisible($ids: [Int!]!) {
  toggleClippingVisible(ids: $ids) {
    id
    visible
  }
}
    `;
export const useToggleClippingVisibleMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<ToggleClippingVisibleMutation, TError, ToggleClippingVisibleMutationVariables, TContext>
    ) =>
    useMutation<ToggleClippingVisibleMutation, TError, ToggleClippingVisibleMutationVariables, TContext>(
      ['toggleClippingVisible'],
      (variables?: ToggleClippingVisibleMutationVariables) => fetcher<ToggleClippingVisibleMutation, ToggleClippingVisibleMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ToggleClippingVisibleDocument, variables)(),
      options
    );
export const UnfollowUserDocument = `
    mutation unfollowUser($targetUserID: Int!) {
  unfollow(targetUserID: $targetUserID)
}
    `;
export const useUnfollowUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UnfollowUserMutation, TError, UnfollowUserMutationVariables, TContext>
    ) =>
    useMutation<UnfollowUserMutation, TError, UnfollowUserMutationVariables, TContext>(
      ['unfollowUser'],
      (variables?: UnfollowUserMutationVariables) => fetcher<UnfollowUserMutation, UnfollowUserMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UnfollowUserDocument, variables)(),
      options
    );
export const UpdateProfileDocument = `
    mutation updateProfile($name: String, $avatar: String, $bio: String, $domain: String) {
  updateUserProfile(name: $name, avatar: $avatar, bio: $bio, domain: $domain) {
    id
    name
    avatar
    bio
    domain
  }
}
    `;
export const useUpdateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>
    ) =>
    useMutation<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>(
      ['updateProfile'],
      (variables?: UpdateProfileMutationVariables) => fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateProfileDocument, variables)(),
      options
    );
export const CreateNewWebHookDocument = `
    mutation createNewWebHook($step: WebHookStep!, $hookUrl: String!) {
  createWebHook(step: $step, hookUrl: $hookUrl) {
    ...webhookItemData
  }
}
    ${WebhookItemDataFragmentDoc}`;
export const useCreateNewWebHookMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<CreateNewWebHookMutation, TError, CreateNewWebHookMutationVariables, TContext>
    ) =>
    useMutation<CreateNewWebHookMutation, TError, CreateNewWebHookMutationVariables, TContext>(
      ['createNewWebHook'],
      (variables?: CreateNewWebHookMutationVariables) => fetcher<CreateNewWebHookMutation, CreateNewWebHookMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateNewWebHookDocument, variables)(),
      options
    );
export const DeleteAWebHookDocument = `
    mutation deleteAWebHook($id: Int!) {
  deleteWebHook(id: $id)
}
    `;
export const useDeleteAWebHookMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteAWebHookMutation, TError, DeleteAWebHookMutationVariables, TContext>
    ) =>
    useMutation<DeleteAWebHookMutation, TError, DeleteAWebHookMutationVariables, TContext>(
      ['deleteAWebHook'],
      (variables?: DeleteAWebHookMutationVariables) => fetcher<DeleteAWebHookMutation, DeleteAWebHookMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteAWebHookDocument, variables)(),
      options
    );
export const QueryMyIdByDomainDocument = `
    query queryMyIdByDomain($domain: String!) {
  me(id: -1, domain: $domain) {
    id
    domain
  }
}
    `;
export const useQueryMyIdByDomainQuery = <
      TData = QueryMyIdByDomainQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: QueryMyIdByDomainQueryVariables,
      options?: UseQueryOptions<QueryMyIdByDomainQuery, TError, TData>
    ) =>
    useQuery<QueryMyIdByDomainQuery, TError, TData>(
      ['queryMyIdByDomain', variables],
      fetcher<QueryMyIdByDomainQuery, QueryMyIdByDomainQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, QueryMyIdByDomainDocument, variables),
      options
    );
export const ProfileDocument = `
    query profile($id: Int!, $domain: String) {
  me(id: $id, domain: $domain) {
    id
    name
    email
    password
    phone
    avatar
    checked
    bio
    createdAt
    updatedAt
    wechatOpenid
    isFan
    domain
    followers {
      id
      name
      avatar
      bio
    }
    recents {
      id
      bookID
      title
      content
      createdAt
      pageAt
    }
    analysis {
      monthly {
        date
        count
      }
      daily {
        date
        count
      }
    }
    comments {
      id
      content
      belongsTo {
        id
        content
        bookID
        creator {
          id
          avatar
          name
        }
      }
    }
    clippingsCount
  }
}
    `;
export const useProfileQuery = <
      TData = ProfileQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: ProfileQueryVariables,
      options?: UseQueryOptions<ProfileQuery, TError, TData>
    ) =>
    useQuery<ProfileQuery, TError, TData>(
      ['profile', variables],
      fetcher<ProfileQuery, ProfileQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ProfileDocument, variables),
      options
    );
export const PublicDataDocument = `
    query publicData {
  public {
    users {
      id
      avatar
      bio
      name
      domain
    }
    books {
      doubanId
    }
    clippings {
      id
      content
      bookID
      title
      creator {
        id
        name
        avatar
        domain
      }
    }
  }
}
    `;
export const usePublicDataQuery = <
      TData = PublicDataQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: PublicDataQueryVariables,
      options?: UseQueryOptions<PublicDataQuery, TError, TData>
    ) =>
    useQuery<PublicDataQuery, TError, TData>(
      variables === undefined ? ['publicData'] : ['publicData', variables],
      fetcher<PublicDataQuery, PublicDataQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, PublicDataDocument, variables),
      options
    );
export const ReactionCreateDocument = `
    mutation reactionCreate($targetId: Int!, $target: ReactionTarget!, $symbol: String!) {
  createReaction(targetId: $targetId, target: $target, symbol: $symbol)
}
    `;
export const useReactionCreateMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<ReactionCreateMutation, TError, ReactionCreateMutationVariables, TContext>
    ) =>
    useMutation<ReactionCreateMutation, TError, ReactionCreateMutationVariables, TContext>(
      ['reactionCreate'],
      (variables?: ReactionCreateMutationVariables) => fetcher<ReactionCreateMutation, ReactionCreateMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ReactionCreateDocument, variables)(),
      options
    );
export const ReactionRemoveDocument = `
    mutation reactionRemove($symbol: String!) {
  removeReaction(rid: 0, symbol: $symbol)
}
    `;
export const useReactionRemoveMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<ReactionRemoveMutation, TError, ReactionRemoveMutationVariables, TContext>
    ) =>
    useMutation<ReactionRemoveMutation, TError, ReactionRemoveMutationVariables, TContext>(
      ['reactionRemove'],
      (variables?: ReactionRemoveMutationVariables) => fetcher<ReactionRemoveMutation, ReactionRemoveMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, ReactionRemoveDocument, variables)(),
      options
    );
export const FetchYearlyReportDocument = `
    query fetchYearlyReport($year: Int!, $uid: Int!) {
  reportYearly(year: $year, uid: $uid) {
    user {
      id
      avatar
      name
      domain
    }
    books {
      doubanId
      clippingsCount
      clippings {
        id
        content
      }
    }
  }
}
    `;
export const useFetchYearlyReportQuery = <
      TData = FetchYearlyReportQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchYearlyReportQueryVariables,
      options?: UseQueryOptions<FetchYearlyReportQuery, TError, TData>
    ) =>
    useQuery<FetchYearlyReportQuery, TError, TData>(
      ['fetchYearlyReport', variables],
      fetcher<FetchYearlyReportQuery, FetchYearlyReportQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchYearlyReportDocument, variables),
      options
    );
export const SearchQueryDocument = `
    query searchQuery($query: String!) {
  search(query: $query) {
    clippings {
      id
      content
    }
  }
}
    `;
export const useSearchQueryQuery = <
      TData = SearchQueryQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: SearchQueryQueryVariables,
      options?: UseQueryOptions<SearchQueryQuery, TError, TData>
    ) =>
    useQuery<SearchQueryQuery, TError, TData>(
      ['searchQuery', variables],
      fetcher<SearchQueryQuery, SearchQueryQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SearchQueryDocument, variables),
      options
    );
export const SignupDocument = `
    mutation signup($payload: SignupPayload!) {
  signup(payload: $payload) {
    user {
      id
      name
      email
      phone
      password
      avatar
      checked
      createdAt
      updatedAt
      bio
      domain
      wechatOpenid
    }
    token
  }
}
    `;
export const useSignupMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<SignupMutation, TError, SignupMutationVariables, TContext>
    ) =>
    useMutation<SignupMutation, TError, SignupMutationVariables, TContext>(
      ['signup'],
      (variables?: SignupMutationVariables) => fetcher<SignupMutation, SignupMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SignupDocument, variables)(),
      options
    );
export const FetchSquareDataDocument = `
    query fetchSquareData($pagination: Pagination!) {
  featuredClippings(pagination: $pagination) {
    id
    title
    content
    bookID
    pageAt
    creator {
      id
      avatar
      clippingsCount
      name
      domain
    }
  }
}
    `;
export const useFetchSquareDataQuery = <
      TData = FetchSquareDataQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: FetchSquareDataQueryVariables,
      options?: UseQueryOptions<FetchSquareDataQuery, TError, TData>
    ) =>
    useQuery<FetchSquareDataQuery, TError, TData>(
      ['fetchSquareData', variables],
      fetcher<FetchSquareDataQuery, FetchSquareDataQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FetchSquareDataDocument, variables),
      options
    );
export const UpdateClippingBookIdDocument = `
    mutation updateClippingBookId($cid: Int!, $doubanId: Int!) {
  updateClippingBookId(clippingId: $cid, doubanId: $doubanId) {
    id
    bookID
    title
    content
    createdAt
    pageAt
  }
}
    `;
export const useUpdateClippingBookIdMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateClippingBookIdMutation, TError, UpdateClippingBookIdMutationVariables, TContext>
    ) =>
    useMutation<UpdateClippingBookIdMutation, TError, UpdateClippingBookIdMutationVariables, TContext>(
      ['updateClippingBookId'],
      (variables?: UpdateClippingBookIdMutationVariables) => fetcher<UpdateClippingBookIdMutation, UpdateClippingBookIdMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateClippingBookIdDocument, variables)(),
      options
    );