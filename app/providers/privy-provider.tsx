'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

// Replace with your actual Privy App ID when deploying
const PRIVY_APP_ID =
	process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'your-privy-app-id';

export default function PrivyClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const router = useRouter();

	// Configure Privy with the necessary configuration
	// These are the funding methods and network configurations
	return (
		<PrivyProvider
			appId={PRIVY_APP_ID}
			onSuccess={() => router.push('/dashboard')}
			config={{
				// Enable embedded wallet functionality
				embeddedWallets: {
					createOnLogin: 'all-users',
					noPromptOnSignature: true,
				},
				// Configure the appearance and behavior of login
				appearance: {
					theme: 'light',
					accentColor: '#0070f3',
					logo: '/logo.png',
				},
				// Configure funding methods - Replace with your actual funding methods
				// This enables card payments, wallet transfers and exchange transfers
				walletFunding: {
					methods: {
						card: {
							enabled: true,
						},
						wallet: {
							enabled: true,
						},
						exchange: {
							enabled: true,
						},
					},
					// The default chain is now Flow EVM
					defaultChain: 'flow-evm',
					// The default token to fund with
					defaultToken: 'flow',
					// The default amount to suggest for funding
					defaultAmount: '10',
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
