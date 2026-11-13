import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ForgotPasswordModal() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // TODO: The actual API call hereeeee

    setSubmitted(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="link" />}>
        Glömt ditt lösenord?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Glömt ditt lösenord?</DialogTitle>
          <DialogDescription>
            Var god skriv din emailadress nedan så vi kan skicka dig en länk för
            att ändra ditt lösenord.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Länken skickas nu om den emailadressen finns sparad i våra system.
            </p>

            <Button className="w-full" onClick={() => setOpen(false)}>
              Stäng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Emailadress</Label>

              <Input
                id="email"
                type="email"
                placeholder="din_address@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Skicka min länk
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
