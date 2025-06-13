"use server";

import { api } from "@/lib/api";
import { auth } from "../../../auth";

import { Registration, Sponsor, Volunteer } from "@/schema/entities";
import { PaginationState } from "@/schema/pagination";
import { z } from "zod";

interface Params {
  collection: "registration" | "sponsor" | "volunteer";
  pagination: PaginationState;
  filter?: string;
  sort?: string;
}

export interface BaseResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export async function getCollectionList(params: Params): Promise<{
  data: {
    items: Array<Registration | Sponsor | Volunteer> | null;
    total: number;
  };
  status: boolean;
  message: string;
}> {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "admin") {
    return {
      data: {
        items: null,
        total: 0,
      },
      status: false,
      message: "Unauthorized access to specified resource!",
    };
  }

  const collectionValidator =
    params.collection === "registration"
      ? Registration
      : params.collection === "volunteer"
      ? Sponsor
      : params.collection === "sponsor"
      ? Volunteer
      : undefined;

  if (!collectionValidator) {
    return {
      data: {
        items: null,
        total: 0,
      },
      status: false,
      message: "Recourse key not specified!",
    };
  }

  try {
    const response = await api(
      z.object({
        items: z.any().array(),
        total: z.number(),
        limit: z.number(),
        skip: z.number(),
      }),
      {
        url: `/admin/collections/${params.collection}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        params: {
          limit: params.pagination.pageSize,
          skip: params.pagination.pageIndex * (params.pagination.pageSize || 24),
          filter: params.filter ? params.filter : undefined,
          sort: params.sort ? params.sort : undefined,
        }
      }
    );

    return {
      data: response?.data as any,
      status: response?.response_code == 200,
      message:
        response?.response_code == 200
          ? `${params.collection} data retrieved sucessfully`
          : response?.message ?? "Something went wrong",
    };
  } catch (error) {
    console.error(`Error requesting ${params.collection} data`, error);
    return {
      data: {
        items: null,
        total: 0,
      },
      status: false,
      message: "An unexpected error occured!",
    };
  }
}

export async function getTicket(params: { _id: string }): Promise<{
  data?: Registration;
  status: boolean;
  message: string;
}> {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "admin") {
    return {
      status: false,
      message: "Unauthorized access to specified resource!",
    };
  }

  try {
    const response = await api(
      z.any(),
      {
        url: `/admin/collection/registration/${params._id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );

    console.log(response)

    return {
      data: response?.data as any,
      status: response?.response_code == 200,
      message:
        response?.response_code == 200
          ? `Entry retrieved sucessfully`
          : response?.message ?? "Something went wrong",
    };
  } catch (error) {
    console.error(`Error requestingcheck in for ticket ${params._id}`, error);
    return {
      status: false,
      message: "An unexpected error occured!",
    };
  }
}


export async function updateCheckinStatus(params: { _id: string }): Promise<{
  data?: Registration;
  status: boolean;
  message: string;
}> {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "admin") {
    return {
      status: false,
      message: "Unauthorized access to specified resource!",
    };
  }

  try {
    const response = await api(
      z.any(),
      {
        url: `/admin/check-in/${params._id}`,
        method: "post",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );

    return {
      data: response?.data as any,
      status: response?.response_code == 200,
      message:
        response?.response_code == 200
          ? `Checked in sucessfully`
          : response?.message ?? "Something went wrong",
    };
  } catch (error) {
    console.error(`Error requestingcheck in for ticket ${params._id}`, error);
    return {
      status: false,
      message: "An unexpected error occured!",
    };
  }
}
