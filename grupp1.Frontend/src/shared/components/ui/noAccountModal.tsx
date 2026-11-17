import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

import type { Dispatch } from "react";

type NoAccountModalProps = {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
};

export default function NoAccountModal({
  open: open,
  setOpen,
}: NoAccountModalProps) {
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <DialogContent>
        <p>Denna tjänsten har inte öppen registrering.</p>
        <p>Kontakta din chef för att få tillgång till tjänsten.</p>
      </DialogContent>
    </Dialog>
  );
}
