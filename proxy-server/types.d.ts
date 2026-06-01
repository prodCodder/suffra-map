import type { NextFunction, Request, Response, RequestHandler, } from 'express';
import type { IUser } from './models/user.model.js';
import { HydratedDocument } from 'mongoose';

export interface IAuthBody {
  user: HydratedDocument<IUser>
}

export type TAuthRequestHandler<P = {}, resBody = any, reqBody = {}> = RequestHandler<P, resBody, IAuthBody & reqBody>

export type TCustomHttpError = Error & {status?: number, details?: any}