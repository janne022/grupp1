import type { AvailableTimeInfo } from "@/routes/TestPage";
import type {} from "./managerBooking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface SubstituteDisplayProps {
  FilteredAvailableTime?: AvailableTimeInfo[];
  Loading: boolean;
}

export function filterAvailableTimes(
  times: AvailableTimeInfo[],
  from: Date,
  to: Date,
) {
  return times.filter((t) => {
    const availableFrom = new Date(t.startTime);
    const availableTo = new Date(t.endTime);
    return availableFrom <= from && availableTo >= to;
  });
}

export function SubstituteDisplay({
  FilteredAvailableTime,
  Loading,
}: SubstituteDisplayProps) {
  return (
    <>
      <h2 className="text-center font-semibold">Matchande vikarier</h2>
      <section className="flex h-50 overflow-y-auto flex-col rounded-2xl p">
        <div>
          {Loading ? (
            <p className="text-center mt-4 border rounded-2xl p-4">laddar</p>
          ) : FilteredAvailableTime == undefined ||
            FilteredAvailableTime.length === 0 ? (
            <p className="text-center mt-4 rounded-2xl p-4">inga resultat</p>
          ) : (
            <figure>
              <Table className="m-0 table-fixed">
                <TableHeader>
                  <TableHead className="w-3/5">Namn</TableHead>
                  <TableHead>Telefon</TableHead>
                  {/* 
                  <TableHead>Tillgänglig</TableHead> */}
                </TableHeader>
                <TableBody className="body">
                  {FilteredAvailableTime.map((b, index) => (
                    <TableRow key={index}>
                      <TableCell className="truncate">
                        {b.firstName + " " + b.lastName}
                      </TableCell>
                      <TableCell>07020022210</TableCell>

                      {/* <TableCell>
                        {formatTime(new Date(b.startTime))}
                        {"-"}
                        {formatTime(new Date(b.endTime))}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </figure>
          )}
        </div>
      </section>
    </>
  );
}
