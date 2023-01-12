import { Clipping } from "./schema/generated"
import { WenquBook } from "./service/wenqu"

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
  Book: {
    book: WenquBook
  }
  Clipping: {
    clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
  }
}