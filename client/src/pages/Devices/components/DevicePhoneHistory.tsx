import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import type { TherapistPhoneConnection } from '@/backend/device.service';

interface DevicePhoneHistoryProps {
  therapistPhones: TherapistPhoneConnection[];
}

// Helper to format timestamp
const formatTimestamp = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy • hh:mm a');
  } catch {
    return dateString;
  }
};

export function DevicePhoneHistory({ therapistPhones }: DevicePhoneHistoryProps) {
  const [phonePage, setPhonePage] = useState(1);
  const phonesPerPage = 5;

  // Pagination calculations
  const totalPhones = therapistPhones?.length || 0;
  const totalPhonePages = Math.ceil(totalPhones / phonesPerPage);
  const phoneStartIndex = (phonePage - 1) * phonesPerPage;
  const phoneEndIndex = phoneStartIndex + phonesPerPage;
  const paginatedPhones = therapistPhones?.slice(phoneStartIndex, phoneEndIndex) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Phone Connection History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {therapistPhones && therapistPhones.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-semibold">Phone ID</th>
                    <th className="pb-3 font-semibold">Sessions run</th>
                    <th className="pb-3 font-semibold">Last connected</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedPhones.map((phone) => (
                    <tr key={phone.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-3">{phone.displayName || phone.phoneNumber}</td>
                      <td className="py-3">{phone.sessionsRun}</td>
                      <td className="py-3 text-muted-foreground">
                        {formatTimestamp(phone.lastConnected)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPhonePages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {phoneStartIndex + 1} to {Math.min(phoneEndIndex, totalPhones)} of {totalPhones}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhonePage((prev) => Math.max(1, prev - 1))}
                    disabled={phonePage === 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {phonePage} of {totalPhonePages}
                  </span>
                  <button
                    onClick={() => setPhonePage((prev) => Math.min(totalPhonePages, prev + 1))}
                    disabled={phonePage === totalPhonePages}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No phone connections found for this device
          </p>
        )}
      </CardContent>
    </Card>
  );
}
