/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, Method } from "axios";
import * as z from "zod";
import { env } from "../../env";

/**
 * Creates an instance of axios with a base URL.
 */
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
    // Construct full URL
    const fullUrl = new URL(`${env.API_BASE_URL}${config.url}`);

    // Append query params if provided
    if (config.params) {
      Object.keys(config.params).forEach((key) =>
        fullUrl.searchParams.append(key, String(config.params[key]))
      );
    }

    const fetchResponse = await fetch(fullUrl, {
      method: config.method.toUpperCase() || "GET",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: config.data ? JSON.stringify(config.data) : undefined,
    });

    if (!fetchResponse.ok) {
      const errorDetails = await fetchResponse.text();

      if (errorDetails) {
        const errorDetailsJson = JSON.parse(errorDetails);
        if (errorDetailsJson && errorDetailsJson?.message)
          throw new Error(errorDetailsJson?.message || "An error occured", {
            cause: errorDetailsJson,
          });
      }

      throw new Error(
        `Failed to fetch resource: ${fetchResponse.status} ${fetchResponse.statusText}. Details: ${errorDetails}`
      );
    }

    const fetchResponseJson: BaseResponse<any> = await fetchResponse.json();

    // Validate the `data` field using the provided Zod schema
    const validatedData = validator.safeParse(fetchResponseJson.data);

    if (validatedData.success) {
      // Return a successful response with validated data
      return {
        ...fetchResponseJson,
        message:
          fetchResponseJson?.error?.[0]?.message || fetchResponseJson?.message,
        response_code: fetchResponse.status,
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
  } catch (error: any) {
    if (error?.error && error.message) {
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
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
