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
  return <></>;
}
