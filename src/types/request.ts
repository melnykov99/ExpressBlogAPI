import {Request} from "express";

type RequestWithBody<T> = Request<{}, {}, T>;
type RequestWithQuery<T> = Request<{}, {}, {}, T>;
type RequestWithParams<T> = Request<T>;
type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;

type ParamsId = {id: string};
type QueryRequest = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}
type BlogsQueryRequest = QueryRequest & {
    searchNameTerm: string,
}


export {RequestWithBody, RequestWithQuery, RequestWithParams, RequestWithParamsAndBody, ParamsId, BlogsQueryRequest, QueryRequest};