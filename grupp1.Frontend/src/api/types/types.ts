type Kindergarten = {
  label: string;
  value: string;
};

export type KindergartenGroup = {
  groupName: string;
  kindergartens: Kindergarten[];
};
