import { Router } from 'express'
import { IGenericErrorMessage } from './error'

export type ModuleRoutesType = {
  path: string
  route: Router
}

export type PaginationOptionsType = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export type GenericResponseType<T> = {
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
  data: T
}
