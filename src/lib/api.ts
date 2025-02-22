/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, Method } from "axios";
import * as z from "zod";
import { env } from "../../env";

/**
 * Creates an instance of axios with a base URL.
 */
export const client = axios.create({
  baseURL: env.API_BASE_URL,
});

interface BaseResponse<T> {
  message: string;
  error: Array<{ message: string }>;
  response_code: number;
  data: T | null;
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  total_pages: number;
}

interface ApiRequestConfig extends AxiosRequestConfig {
  method: Method;
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}

/**
 * A handler function to make an API request and return either a success or error response.
 * It validates only the `data` field of the base response using the provided Zod validator.
 *
 * @param validator - Zod validator for validating the response data field
 * @param config - AxiosRequestConfig for the request
 * @returns - The base response structure with either the validated data or error information
 */
export async function api<T>(
  validator: z.ZodType<T>,
  config: ApiRequestConfig
): Promise<BaseResponse<T>> {
  try {
    const response = await client(config);

    // Assuming the response is of the BaseResponse structure
    const baseResponse: BaseResponse<any> = response.data;

    // Validate the `data` field using the provided Zod schema
    const validatedData = validator.safeParse(baseResponse.data);

    if (validatedData.success) {
      // Return a successful response with validated data
      return {
        ...baseResponse,
        message: baseResponse?.error?.[0]?.message || baseResponse?.message,
        response_code: response.status,
        data: validatedData.data,
      };
    } else {
      // If validation fails, return a validation error
      console.log(validatedData.error);

      return {
        response_code: 400,
        message: "Validation failed for the response data",
        data: null,
        count: 1,
        next: null,
        previous: null,
        page_size: 1,
        total_pages: 1,
        error: [],
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle API errors, assuming the error follows BaseErrorResponse format
      const errorResponse: BaseResponse<null> = error.response.data;

      return {
        response_code: 500,
        message: errorResponse?.error?.[0]?.message || errorResponse.message,
        data: errorResponse.data,
        count: 1,
        next: null,
        previous: null,
        page_size: 1,
        total_pages: 1,
        error: [],
      };
    } else {
      // Handle other unexpected errors in the same BaseErrorResponse format
      return {
        response_code: 500,
        message: "An unexpected error occurred",
        data: null,
        count: 1,
        next: null,
        previous: null,
        page_size: 1,
        total_pages: 1,
        error: [],
      };
    }
  }
}
