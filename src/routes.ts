import { Clipping } from "./schema/generated"
import { WenquBook } from "./service/wenqu"

export enum RouteKeys {
  AuthV3 = 'AuthV3',
  SignUp = 'Signup',
  AuthAppleBind = 'AuthAppleBind',
  AuthPhoneOTP = 'AuthPhoneOTP',
  AuthQRCode = 'AuthQRCode',
  TabHome = 'TabHome',
  TabProfile = 'TabProfile',
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
  [RouteKeys.SignUp]: object
  [RouteKeys.BookDetail]: {
    book: WenquBook
  }
  [RouteKeys.ProfileSettings]: object
  [RouteKeys.ProfileDebug]: object

  root: object
}

export type TabRouteParamList = {
  [RouteKeys.TabHome]: object
  [RouteKeys.TabProfile]: {}
}
