import { Profile } from './profile.interface';
export interface Post {
    id: number,
    title: string,
    communityId: number,
    content: string,
    author: Profile,
    images: string[],
    createdAt: string,
    updatedAt: string,
    likes: number,
    likesUsers: [
      string
    ],
    comments: String[]
}
