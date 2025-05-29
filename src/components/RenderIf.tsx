import { ReactNode } from 'react';

const RenderIf = ({ value, children }: { children: ReactNode; value: boolean }) => {
  return value && children;
};

export default RenderIf;
