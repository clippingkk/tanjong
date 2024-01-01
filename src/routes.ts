import { Clipping, SignupMutation } from "./schema/generated"
import { WenquBook } from "./service/wenqu"

export enum RouteKeys {
  AuthV3 = 'AuthV3',
  SignUpEmail = 'SignUpEmail',
  SignUpPassword = 'SignUpPassword',
  SignUpOTP = 'SignUpOTP',

  // created, update profile
  SignUpSetName = 'SignUpSetName',

  AuthAppleBind = 'AuthAppleBind',
  AuthPhoneOTP = 'AuthPhoneOTP',
  AuthQRCode = 'AuthQRCode',
  TabHome = 'TabHome',
  TabProfile = 'TabProfile',
  TabSquare = 'TabSquare',
  Book = 'Book',
  Profile = 'Profile',
  Clipping = 'Clipping',
  BookDetail = 'BookDetail',
  ProfileSettings = 'ProfileSettings',
  ProfileDebug = 'ProfileDebug',
  Payment = 'Payment'
}

export type RouteParamList = {
  empty: object
  Book: {
    book: WenquBook
  }
  Clipping: {
    clipping?: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
    clippingID?: number
  }
  AuthAppleBind: {
    idToken: string
  }
  AuthPhoneOTP: {
    phone: string
    idToken: string
  }
  [RouteKeys.AuthQRCode]: object
  [RouteKeys.Payment]: object
  [RouteKeys.AuthV3]: object
  [RouteKeys.BookDetail]: {
    book: WenquBook
  }
  [RouteKeys.ProfileSettings]: object
  [RouteKeys.ProfileDebug]: object

  [RouteKeys.SignUpEmail]: object
  [RouteKeys.SignUpPassword]: { email: string }
  [RouteKeys.SignUpOTP]: {
    email: string
    password: string
  }
  [RouteKeys.SignUpSetName]: {
    data: SignupMutation['signup']
  }

  root: object
}

export type TabRouteParamList = {
  [RouteKeys.TabHome]: object
  [RouteKeys.TabSquare]: object
  [RouteKeys.TabProfile]: {}
}
