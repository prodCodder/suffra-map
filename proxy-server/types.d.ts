import type { NextFunction, Request, Response, RequestHandler, } from 'express';
import type { IUser } from './models/user.model.js';
import { HydratedDocument } from 'mongoose';

export interface IAuthBody {
  user: HydratedDocument<IUser>;
}

export type TAuthRequestHandler<P = {}, resBody = any, reqBody = {}> = RequestHandler<P, resBody, IAuthBody & reqBody>

export type TCustomHttpError = Error & {status?: number, details?: any}



export interface ICommandArgsCheckResponse<TParams = any, TData = any> {
  success: boolean;
  data?: TData;
  msg?: string;
  params?: TParams;
}
export interface ICommandArgsCheckFunction<TParams = any, TData = any> {
  (arg: string, params?: TParams): TCommandArgsCheckResponse<TParams, TData> | Promise<TCommandArgsCheckResponse<TParams, TData>>
}

export interface ICommandPostArgsCheckFunction<TParams = any> {
  (params?: TParams): ICommandArgsCheckResponse | Promise<ICommandArgsCheckResponse>
}

export type TCommandArgsCheckTable<TParams = any> = {
  [key: string]: ICommandArgsCheckFunction<TParams>
}
export interface ICommandRunFunction {
  (any): undefined | Promise<undefined>
}
export interface ICommandFetchCommandFunction {
  (args?: string[], base?: string, depth?: integer): Promise<{
    commandArguments: TCommandArgsCheckTable,
    processPostArgs?: ICommandPostArgsCheckFunction,
    commandUsage: string,
    runCommand: ICommandRunFunction,
    depth: integer
  }>
}
