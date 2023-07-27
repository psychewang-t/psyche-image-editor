import { ReactNode } from 'react';
import { IndexContextProvider } from './userContext';

type Props = {
  children: ReactNode;
};

export const IndexProviders = ({ children }: Props) => <IndexContextProvider>{children}</IndexContextProvider>;
