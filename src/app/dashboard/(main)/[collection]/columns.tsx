"use client";

import { Registration, Sponsor, Volunteer } from "@/schema/entities";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import SponsorDialog from "./dialogs/sponsor";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import VolunteerDialog from "./dialogs/volunteer";
import { updateCheckinStatus } from "@/actions/admin/collection";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const regColumns: ColumnDef<Registration>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tel",
    header: "Phone Number",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "metadata.financial_goals",
    header: "Financial Goals",
    cell({ row }) {
      const value = row.original.metadata.financial_goals;

      return <span className=''>{!value ? " - " : value}</span>;
    },
  },
  {
  accessorKey: "checked_in",
  header: "Checked in",
  cell({ row }) {
    const value = row.original.checked_in;
    const _id = row.original._id;

    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: () => updateCheckinStatus({ _id }),
      onSuccess: () => {
        queryClient.invalidateQueries(); // optionally pass the correct query key
      },
    });

    if (value === false) {
      return (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {mutation.isPending ? "..." : "Check In"}
          </button>
        </div>
      );
    } else if (value === true) {
      return (
        <div className="h-6 px-2 py-1 bg-[#e7f6ec] rounded-xl inline-flex items-center">
          <span className="text-[#036b26] text-xs font-medium">Yes</span>
        </div>
      );
    } else {
      return <span>-</span>;
    }
  },
}

];

export const volunteerColumns: ColumnDef<Volunteer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tel",
    header: "Phone Number",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "metadata.shirt_size",
    header: "T Shirt Size",
    cell({ row }) {
      const value: string = row.original.metadata.shirt_size;

      return <span className=''>{!value ? " - " : value}</span>;
    },
  },
  {
    accessorKey: "metadata.availability",
    header: "Availability",
    cell({ row }) {
      const value = row.original.metadata.availability;

      if (value === false)
        return (
          <div className='h-6 px-2 py-1 bg-[#fbeae9] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#d3251f] text-xs font-medium'>
                  No
                </span>
              </div>
            </div>
          </div>
        );
      else if (value == true)
        return (
          <div className='h-6 px-2 py-1 bg-[#e7f6ec] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#036b26] text-xs font-medium'>
                  Yes
                </span>
              </div>
            </div>
          </div>
        );
      else return <span>-</span>;
    },
  },
  {
    accessorKey: "metadata.teams",
    header: "Teams",
    cell({ row }) {
      const value = row.original.metadata.teams;
      const teams =
        value.other && value.other !== ""
          ? [...value?.value, value.other]
          : value?.value;

      return <span className=''>{teams?.join(",")}</span>;
    },
  },
  {
    accessorKey: "metadata.futureInterest",
    header: "Future Interest",
    cell({ row }) {
      const value: boolean = row.original.metadata.futureInterest;

      if (value === false)
        return (
          <div className='h-6 px-2 py-1 bg-[#fbeae9] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#d3251f] text-xs font-medium'>
                  No
                </span>
              </div>
            </div>
          </div>
        );
      else if (value == true)
        return (
          <div className='h-6 px-2 py-1 bg-[#e7f6ec] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#036b26] text-xs font-medium'>
                  Yes
                </span>
              </div>
            </div>
          </div>
        );
      else return <span>-</span>;
    },
  },
  {
    accessorKey: "details",
    header: "View Details",
    cell({ row }) {
      return (
        <div>
          <VolunteerDialog volunteer={row.original}>
            <Button variant='link' className='px-0'>
              <Eye />
              <span>View</span>
            </Button>
          </VolunteerDialog>
        </div>
      );
    },
  },
];

export const sponsorColumns: ColumnDef<Sponsor>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tel",
    header: "Phone Number",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "metadata.contactPerson",
    header: "Contact Person",
    cell({ row }) {
      const value = row.original.metadata.contactPerson;

      return <span className=''>{!value || value === "" ? " - " : value}</span>;
    },
  },
  {
    accessorKey: "metadata.sponsorhip.category",
    header: "Sponsorhip category",
    cell({ row }) {
      const value = row.original.metadata.sponsorhip.category;

      return <span className=''>{!value ? " - " : value}</span>;
    },
  },
  {
    accessorKey: "metadata.sponsorhip.custom",
    header: "Custome Sponsor category",
    cell({ row }) {
      const value = row.original.metadata.sponsorhip.custom;

      return <span>{!value || value === "" ? " - " : value}</span>;
    },
  },
  {
    accessorKey: "metadata.sponsorhip.type",
    header: "Sponsorhip type",
    cell({ row }) {
      const value: string = row.original.metadata.sponsorhip.type;

      return <span className=''>{!value ? " - " : value}</span>;
    },
  },
  {
    accessorKey: "metadata.sponsorhip.future",
    header: "Future Interest",
    cell({ row }) {
      const value: boolean = row.original.metadata.sponsorhip.future;

      if (value === false)
        return (
          <div className='h-6 px-2 py-1 bg-[#fbeae9] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#d3251f] text-xs font-medium'>
                  No
                </span>
              </div>
            </div>
          </div>
        );
      else if (value == true)
        return (
          <div className='h-6 px-2 py-1 bg-[#e7f6ec] rounded-xl flex-col justify-center items-center gap-2 inline-flex'>
            <div className='justify-center items-center inline-flex'>
              <div className='px-1 justify-center items-center flex'>
                <span className='text-center text-[#036b26] text-xs font-medium'>
                  Yes
                </span>
              </div>
            </div>
          </div>
        );
      else return <span>-</span>;
    },
  },
  {
    accessorKey: "details",
    header: "View Details",
    cell({ row }) {
      return (
        <div>
          <SponsorDialog sponsor={row.original}>
            <Button variant='outline' size='icon'>
              <Eye />
            </Button>
          </SponsorDialog>
        </div>
      );
    },
  },
];
