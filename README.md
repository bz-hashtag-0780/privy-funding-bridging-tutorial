# Privy Wallet Funding & Bridging Tutorial

This tutorial demonstrates how to integrate Privy SDK for seamless wallet funding and bridging using the Reservoir Relay. It's designed to help developers implement solutions that make onboarding users with wallet funding and cross-chain bridging as smooth as possible, with a focus on Flow EVM.

## What You'll Learn

-   How to implement Privy's wallet funding functionality
-   How to leverage Privy's bridging capabilities via Reservoir Relay
-   Setting up automatic and manual funding prompts
-   Configuring chain, asset, and funding amounts for Flow EVM
-   Creating a seamless user experience for wallet funding and bridging

## Prerequisites

-   Basic knowledge of React and Next.js
-   Node.js and npm/yarn installed
-   Understanding of blockchain wallets and transactions

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/yourusername/privy-funding-bridging-tutorial.git
cd privy-funding-bridging-tutorial
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file with your Privy App ID:

```
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

-   `app/`: Next.js application code
    -   `providers/`: Privy provider components
    -   `dashboard/`: Wallet funding demonstration
    -   `bridge/`: Cross-chain bridging demonstration
    -   `config/`: Chain configurations including Flow EVM
-   `public/`: Static assets

## Flow EVM Details

This tutorial uses Flow EVM as the primary chain:

-   **Network Name**: Flow EVM
-   **RPC Endpoint**: https://mainnet.evm.nodes.onflow.org
-   **Chain ID**: 747
-   **Currency Symbol**: FLOW
-   **Block Explorer**: https://evm.flowscan.io/

## Tutorial Walkthrough

### 1. Setting Up Privy Provider with Flow EVM

The first step in implementing Privy's wallet funding and bridging functionality is setting up the Privy provider with Flow EVM as the default chain:

```tsx
// app/providers/privy-provider.tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

const PRIVY_APP_ID =
	process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'your-privy-app-id';

export default function PrivyClientProvider({ children }) {
	const router = useRouter();

	return (
		<PrivyProvider
			appId={PRIVY_APP_ID}
			config={{
				// Configure funding methods
				walletFunding: {
					methods: {
						card: { enabled: true },
						wallet: { enabled: true },
						exchange: { enabled: true },
					},
					defaultChain: 'flow-evm',
					defaultToken: 'flow',
					defaultAmount: '10',
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
```

### 2. Configuring Flow EVM Chain

To work with Flow EVM, you need to define the chain configuration:

```tsx
// app/config/chains.ts
import { Chain } from 'viem';

export const flowEvm: Chain = {
	id: 747,
	name: 'Flow EVM',
	network: 'flow-evm',
	nativeCurrency: {
		decimals: 18,
		name: 'FLOW',
		symbol: 'FLOW',
	},
	rpcUrls: {
		default: {
			http: ['https://mainnet.evm.nodes.onflow.org'],
		},
		public: {
			http: ['https://mainnet.evm.nodes.onflow.org'],
		},
	},
	blockExplorers: {
		default: {
			name: 'FlowScan',
			url: 'https://evm.flowscan.io',
		},
	},
};
```

### 3. Implementing Manual Wallet Funding with Flow EVM

Privy provides the `useFundWallet` hook to manually trigger wallet funding on Flow EVM:

```tsx
import { useFundWallet } from '@privy-io/react-auth';
import { flowEvm } from '../config/chains';

// Basic fund wallet function
const { fundWallet } = useFundWallet();

const handleFundWalletWithFlow = async () => {
	await fundWallet(walletAddress, {
		amount: '0.1', // Amount in FLOW
		chain: flowEvm, // Specify Flow EVM chain
	});
};
```

### 4. Automatic Funding Prompts

Privy will automatically prompt users to fund their wallets when they attempt to send a transaction but have insufficient funds. This happens without any additional code on your part, as long as you've configured the wallet funding methods in the Privy provider.

### 5. Cross-Chain Bridging to Flow EVM

Privy integrates with Reservoir Relay to facilitate cross-chain bridging to Flow EVM:

```tsx
import { useFundWallet } from '@privy-io/react-auth';
import { flowEvm } from '../config/chains';

const { fundWallet } = useFundWallet();

// Bridge from Ethereum to Flow EVM
const handleBridgeToFlow = async () => {
	await fundWallet(walletAddress, {
		amount: '0.01',
		chain: flowEvm, // Target chain (Flow EVM)
		defaultFundingMethod: 'wallet', // Use external wallet for bridging
	});
};
```

### 6. Tracking User Funding Actions

You can use the `onUserExited` callback to track when users exit the funding flow and take appropriate actions:

```tsx
const { fundWallet } = useFundWallet({
	onUserExited: ({ balance, chain, fundingMethod }) => {
		console.log('User exited funding flow:', {
			balance,
			chain,
			fundingMethod,
		});
		// Redirect or update UI based on funding outcome
	},
});
```

### 7. Customizing the Funding UI for Flow EVM

Privy allows you to customize the UI of the funding modal for Flow EVM:

```tsx
await fundWallet(walletAddress, {
	amount: '5',
	chain: flowEvm,
	uiConfig: {
		receiveFundsTitle: 'Fund Your Flow Wallet',
		receiveFundsSubtitle:
			'Add FLOW tokens to your wallet to interact with our dApp',
	},
});
```

## Use Cases

This implementation is particularly useful for:

-   Flow-based NFT marketplaces requiring users to have FLOW tokens for purchases
-   DeFi applications needing users to bridge assets to Flow EVM
-   Flow dApps requiring easy onboarding for new users
-   Any application where users need to fund wallets or bridge assets with minimal friction

## Best Practices for Flow EVM Integration

1. **Set Flow EVM as Default**: Configure `defaultChain: 'flow-evm'` in your Privy provider for native Flow integration.

2. **Use FLOW as Default Token**: Set `defaultToken: 'flow'` to use FLOW tokens by default.

3. **Specify Flow EVM in Individual Calls**: Use `chain: flowEvm` parameter in `fundWallet` calls to ensure funding goes to Flow EVM.

4. **Clear Bridging Instructions**: Provide clear instructions to users about what's happening during bridging to Flow EVM.

5. **Handle Chain-Specific Callbacks**: Make sure to implement proper callbacks to handle the state after users complete or exit the funding flow.

## Resources

-   [Privy Documentation](https://docs.privy.io/)
-   [Reservoir Relay](https://docs.reservoir.tools/reference/reservoir-relay)
-   [Flow EVM Documentation](https://evm.flowscan.io/)
-   [Privy React Auth GitHub](https://github.com/privy-io/privy-js)
-   [Flow Blockchain GitHub](https://github.com/onflow)
