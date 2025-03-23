'use client';

import { ReactNode } from 'react';
import PrivyClientProvider from './privy-provider';
import PrivySolanaClientProvider from './privy-solana-provider';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<PrivyClientProvider>
			<PrivySolanaClientProvider>{children}</PrivySolanaClientProvider>
		</PrivyClientProvider>
	);
}
