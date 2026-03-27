import { useQuery } from "@tanstack/react-query";
import { fetchGeethaDashboard } from "@/services/geethaApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);
  const rest = safeMinutes % 60;
  if (rest === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hr${hours > 1 ? "s" : ""} ${rest} min`;
};

const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const GeethaPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["geetha-dashboard"],
    queryFn: fetchGeethaDashboard,
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Geetha Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Live totals and all submissions from the database.
          </p>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">Loading data...</CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardHeader>
              <CardTitle>Could not load data</CardTitle>
              <CardDescription>
                {error instanceof Error ? error.message : "Unknown server error"}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardDescription>Total Time</CardDescription>
                  <CardTitle>{formatDuration(data.totalMinutes)}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Contributed Time Till Now</CardDescription>
                  <CardTitle>{formatDuration(data.timeCompletedMinutes)}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>
                  {data.submissions.length} record{data.submissions.length === 1 ? "" : "s"} found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Selected Options</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Deducted</TableHead>
                      <TableHead>Remaining After</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.id}</TableCell>
                        <TableCell>{submission.selectedOptionIds.join(", ") || "-"}</TableCell>
                        <TableCell>{formatDuration(submission.requestedMinutes)}</TableCell>
                        <TableCell>{formatDuration(submission.deductedMinutes)}</TableCell>
                        <TableCell>{formatDuration(submission.remainingMinutesAfter)}</TableCell>
                        <TableCell>{formatDateTime(submission.createdAt)}</TableCell>
                        <TableCell>{submission.ipAddress || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default GeethaPage;
