export interface Employee {
  id: number;
  name: string; //info
  position: string; //info
  department: string; //for filtering and grouping
  hireDate: string; // ISO string format
  status: 'active' | 'inactive'; //filtering too
  imageUrl: string; //looking at clowns
}
