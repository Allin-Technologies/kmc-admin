'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";
import { toast } from "sonner";
import { getCollectionList, updateCheckinStatus } from "@/actions/admin/collection";
import { Registration } from "@/schema/entities";

export default function TicketSearchCheckIn() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Registration[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  async function handleSearch() {
    setLoading(true);
    try {
      const res = await getCollectionList({
        collection: "registration",
        pagination: { pageIndex: 0, pageSize: 100 }, // Adjust as needed
        filter: JSON.stringify({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { _id: query }, // Assuming query can be an ID
          ],
        }),
        sort: JSON.stringify({ createdAt: -1 }), // Sort by creation date, adjust as needed
      }); // your server-side search logic
      if (res?.status && res.data?.total > 0) {
        setSearchResults(res.data?.items as Registration[] || []);
      } else {
        toast.error("No matching tickets found");
        setSearchResults([]);
      }
    } catch (err) {
      toast.error("Error searching");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(value: string) {
    setSelectedId(value);
    const user = searchResults.find((u) => u._id === value) || null;
    setSelectedUser(user);
  }

  async function handleCheckIn() {
    if (!selectedUser) return;

    setCheckingIn(true);
    try {
      const response = await updateCheckinStatus({ _id: selectedUser._id });
      if (response.status) {
        toast.success("Checked in successfully");
        setSelectedUser({ ...selectedUser, checked_in: true });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred during check-in");
    } finally {
      setCheckingIn(false);
    }
  }

  function reset() {
    setQuery("");
    setSearchResults([]);
    setSelectedId(null);
    setSelectedUser(null);
  }

  return (
    <div className="w-full max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">Manual Check-In</h1>

      {!selectedUser && (
        <div className="space-y-4 w-full">
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Search by name, email, or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <Select onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ticket" />
              </SelectTrigger>
              <SelectContent>
                {searchResults.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name} - {item.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {selectedUser && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.tel}</p>
            <p><strong>Checked In:</strong> {selectedUser.checked_in ? "Yes" : "No"}</p>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleCheckIn}
                disabled={checkingIn || selectedUser.checked_in}
              >
                {checkingIn ? "Checking In..." : selectedUser.checked_in ? "Already Checked In" : "Check In"}
              </Button>
              <Button variant="outline" onClick={reset}>
                Try Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
