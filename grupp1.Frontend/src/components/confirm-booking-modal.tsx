import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
}) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bekräfta bokning</AlertDialogTitle>
          <AlertDialogDescription>
            {/* "Detta bokar ... Stämmer det?" */}
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
