type Kindergarten = {
  label: string;
  value: string;
};

export type KindergartenGroup = {
  groupName: string;
  kindergartens: Kindergarten[];
};

export type BookingData = {
  id: string;
  name: string;
  kindergarten: string; //maybe not?
  startTime: Date;
  endTime: Date;
}