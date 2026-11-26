export type Nav = {
  go: (name: string, params?: any) => void;
  back: () => void;
};