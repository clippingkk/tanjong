export interface JwtPayload {
  id: string;
  exp: number;
  iat: number;
  iss: string;
}