export type ComponentsMap = {
    [key: string]: React.ReactNode;
  };
  
export interface NavbarProps {
    content: keyof ComponentsMap,
    setContent: React.Dispatch<React.SetStateAction<keyof ComponentsMap>>;
}