export interface Owner {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phone: string;
  email: string;
  cccd: string;
  taxCode?: string;
  address?: string;
  isDeleted: boolean;
}

export interface OwnerSummary extends Owner {
  buildingsOwned: Array<{
    buildingId: string;
    buildingName: string;
  }>;
  totalBuildings: number;
}
