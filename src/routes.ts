import { Clipping } from "./schema/generated"
import { WenquBook } from "./service/wenqu"

export enum RouteKeys {
  AuthV3 = 'AuthV3',
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
  ProfileDebug = 'ProfileDebug'
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
  AuthQRCode: object
}