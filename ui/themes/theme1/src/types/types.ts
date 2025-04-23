import { RootStackParamList } from "./navigation";

// types.ts
export interface User {
  name: string | undefined;
  email: string | undefined;
  avatarUri: string | undefined;
}

export interface UserProfileProps {
  
}

export type MenuItem = {
  id: string;
  title: string;
  screen: keyof RootStackParamList; // Update to be a key of RootStackParamList
};

export type SlideInModalProps = {
  visible: boolean;
  closeModal: () => void;
};
