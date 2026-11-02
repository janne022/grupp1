import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmBookingModal({
  open,
  setOpen,
  onConfirm,
  userName,
  startTime,
  endTime,
  date,
  kindergartenName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
  startTime: string;
  endTime: string;
  date: string;
  kindergartenName: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bekräfta bokning</AlertDialogTitle>
          <AlertDialogDescription>
            Det här kommer boka{" "}
            <strong className="text-foreground">{userName}</strong> till{" "}
            <strong className="text-foreground">{kindergartenName}</strong> den{" "}
            <strong className="text-foreground">{date}</strong> klockan{" "}
            <strong className="text-foreground">
              {startTime}–{endTime}
            </strong>
            .
            <br />
            Stämmer detta?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Nej</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Ja</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
