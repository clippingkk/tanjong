import { Clipping } from "./schema/generated"

export enum RouteKeys {
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
  Clipping: {
    clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
  }
}