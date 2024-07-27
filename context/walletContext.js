import { createContext } from 'react';

const WalletContext = createContext({
  db: null,
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export default WalletContext;