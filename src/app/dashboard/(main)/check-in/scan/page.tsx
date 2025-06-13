"use client";

import { getTicket, updateCheckinStatus } from "@/actions/admin/collection";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Html5QrcodePlugin from "@/components/Html5QrcodeScanner";
import { toast } from "sonner";
import { Registration } from "@/schema/entities";

export default function CheckIn() {
  const router = useRouter();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [userData, setUserData] = useState<Registration | null | undefined>(null); // Store user data here
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchUserData(ticketId: string) {
    setIsLoading(true);
    try {
      const response = await getTicket({_id:ticketId});
      console.log(response)
      if (response && response.status) {
        setUserData(response.data); // Assuming response.data contains user info
      } else {
        setErrorText(response.message || 'Invalid QR code or ticket not found.')
        toast.error("Invalid ticket");
        // setScannedResult(null); // Reset QR code state
      } 
    } catch (error) {
      toast.error("Failed to fetch user data");
      setErrorText("Failed to fetch user data")
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkIn() {
    if (!userData) return;

    try {
      setLoading(true);
      
      const response = await updateCheckinStatus({ _id: userData._id }); // Make sure you're sending the correct ticket ID
      
      if (!response.status) {
        toast.error(response?.message || "Failed to update ticket status");
        router.refresh()
        setErrorText(response?.message || "Failed to update ticket status");
        return;
      }

      toast.success(response?.message || "Ticket status updated successfully");
      setScannedResult(null);
//   setUserData(null);
//   setErrorText(null);
//   setIsLoading(false);
//   setLoading(false);
  // Don't do this:
  router.refresh();
  window.location.reload();
    } catch (error) {
      console.error(error);
      router.refresh()
      toast.error("An error occurred");
      setErrorText("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (scannedResult) {
      fetchUserData(scannedResult); // Fetch user data when a QR code is scanned
    }
  }, [scannedResult]);

function reload() {
//   setScannedResult(null);
//   setUserData(null);
//   setErrorText(null);
//   setIsLoading(false);
//   setLoading(false);
  // Don't do this:
  router.refresh();
  window.location.reload();
}


  return (
    <main className="pt-24 xl:pt-32 pb-4 px-4 lg:px-8 min-h-dvh">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 text-balance">
          <h1 className="font-mono text-3xl font-bold text-center">
            Check-In Process
          </h1>
          <p>
            Kindly place your QR Code in view of the camera to scan and check-in.
            Ensure your hand is steady for a quicker capture.
          </p>
        </div>

        {!scannedResult && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl max-w-96 mx-auto">
              <Html5QrcodePlugin
              key={!scannedResult ? 'scanner-active' : 'scanner-inactive'}
                fps={10}
                qrbox={300}
                disableFlip={false}
                qrCodeSuccessCallback={(decodedText) => {
                  setScannedResult(decodedText); // Set the scanned result
                  
                }}
                className="!border-transparent bg-gray-50"
              />
            </div>
            <p className="text-center text-sm">
              Position the QR code within the frame to scan
            </p>
          </div>
        )}

        {isLoading && scannedResult && (
          <div className="text-center text-sm text-gray-500">
            <p>Loading user data...</p>
          </div>
        )}

        {userData && !isLoading && (
          <div className="space-y-3 text-center">
            <h2 className="text-xl font-bold">User Information</h2>
            <p className="text-sm">Name: {userData?.name || ''}</p>
            <p className="text-sm">Email: {userData?.email || ''}</p>
            {/* Add any other fields you want to display */}
            
            <div className="grid gap-2 mt-4 max-w-sm mx-auto">
            <Button onClick={() => checkIn()} disabled={loading}>
              {loading ? "Checking in..." : "Check In"}
            </Button>
<Button onClick={() => reload()} variant='outline'>Reset</Button>
            </div>
          </div>
        )}

        {!userData && scannedResult && !isLoading && !loading && (
          <div className="space-y-3 flex flex-col justify-center items-center text-center">
            <p className="text-center text-sm text-red-500">
              {errorText}
            </p>

 <div className="grid gap-2 max-w-sm mx-auto">

            <Button onClick={() => reload()}>Try another</Button>
 </div>
          </div>
        )}
      </div>
    </main>
  );
}
