import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function SubstituteCard({
  firstName,
  lastName,
  phoneNumber,
  email,
}: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-lg">
          {firstName} {lastName}
        </CardTitle>
        <CardAction>
          <Badge className="p-3" variant="secondary">
            Vikarie
          </Badge>
        </CardAction>
      </CardHeader>

      <CardDescription className="flex flex-col gap-2 pl-3">
        <div className="flex justify-start gap-1">
          <Mail />
          <p>{email}</p>
        </div>
        <div className="flex justify-start gap-1 ml-1">
          <Phone size={18} />
          <p>{phoneNumber}</p>
        </div>
      </CardDescription>
    </Card>
  );
}
