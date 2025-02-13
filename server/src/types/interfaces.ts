export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Pet {
  id: number;
  owner_id: number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  photo_url?: string;
  created_at: Date;
}

export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  sent_at: Date;
}

export interface Match {
  id: number;
  pet1_id: number;
  pet2_id: number;
  matched_at: Date;
}

export interface Like {
  id: number;
  liker_pet_id: number;
  liked_pet_id: number;
  liked_at: Date;
}
