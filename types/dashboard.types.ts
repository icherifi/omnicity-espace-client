export type ComponentsMap = {
    [key: string]: React.ReactNode;
  };
  
export interface NavbarProps {
    setContent: React.Dispatch<React.SetStateAction<keyof ComponentsMap>>;
}