import { DatePickerTime } from "./date-picker"
import { SelectGroups } from "./selectGroups"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Field, FieldGroup } from "./ui/field"


export default function AddEditTimeModal() {

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a new available time!</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <DatePickerTime labelName="Startdag"  />
            </Field>
            <Field>
              <DatePickerTime labelName="Slutdag" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <SelectGroups />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}