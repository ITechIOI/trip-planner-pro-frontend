import type { PackedStatus, PackingCategory, RequiredStatus } from "@/shared";

export type { PackedStatus, PackingCategory, RequiredStatus };

export type PackingItem = {
  id: number;
  name: string;
  category: PackingCategory;
  quantity: number;
  requiredStatus: RequiredStatus;
  packedStatus: PackedStatus;
};

export type PackingItemFormValues = {
  name: string;
  category: PackingCategory;
  quantity: number;
  requiredStatus: RequiredStatus;
  packedStatus: PackedStatus;
};
