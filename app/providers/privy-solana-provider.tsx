'use client';

import { PrivySolanaProvider } from '@privy-io/react-auth-solana';
import { Cluster } from '@solana/web3.js';
import { ReactNode } from 'react';

export default function PrivySolanaClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	// Configure the Solana provider with mainnet-beta as the default cluster
	return (
		<PrivySolanaProvider cluster={{ name: 'mainnet-beta' as Cluster }}>
			{children}
		</PrivySolanaProvider>
	);
}
