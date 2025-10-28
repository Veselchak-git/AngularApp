export interface Profile {
  id: number,
  userName: string,
  avataUrl: string | null,
  subscribersAmount: number,
  firstName: string,
  lastName: string,
  isActive: boolean,
  stack: string[],
  city: string
}
