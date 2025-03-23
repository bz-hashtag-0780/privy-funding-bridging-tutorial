'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useFundWallet } from '@privy-io/react-auth';
import { useFundWallet as useFundWalletSolana } from '@privy-io/react-auth/solana';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { flowEvm } from '../config/chains';

// This component demonstrates cross-chain bridging functionality
export default function Bridge() {
	const router = useRouter();
	const { ready, authenticated, user } = usePrivy();
	const { wallets } = useWallets();

	// For EVM chains
	const { fundWallet: fundEvmWallet } = useFundWallet({
		onUserExited: ({ balance, chain, fundingMethod }) => {
			console.log('User exited EVM funding flow:', {
				balance,
				chain,
				fundingMethod,
			});
		},
	});

	// For Solana
	const { fundWallet: fundSolanaWallet } = useFundWalletSolana({
		onUserExited: ({ balance }) => {
			console.log(
				'User exited Solana funding flow with balance:',
				balance
			);
		},
	});

	const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);

	useEffect(() => {
		if (ready && !authenticated) {
			router.push('/');
		}

		// Find the embedded wallet
		if (wallets) {
			const privyWallet = wallets.find(
				(wallet) => wallet.walletClientType === 'privy'
			);
			setEmbeddedWallet(privyWallet);
		}
	}, [ready, authenticated, router, wallets]);

	// Bridge from Ethereum to Flow EVM
	const handleBridgeToFlow = async () => {
		if (!embeddedWallet) return;

		try {
			await fundEvmWallet(embeddedWallet.address, {
				amount: '0.01', // Amount to bridge
				chain: flowEvm, // Target chain (Flow EVM)
				defaultFundingMethod: 'wallet', // Use external wallet for bridging
			});
		} catch (error) {
			console.error('Error bridging to Flow EVM:', error);
		}
	};

	// Bridge from any chain to Solana
	const handleBridgeToSolana = async () => {
		if (!embeddedWallet) return;

		try {
			await fundSolanaWallet(embeddedWallet.address, {
				amount: '0.01', // Amount in SOL
				cluster: { name: 'mainnet-beta' },
				defaultFundingMethod: 'wallet', // Use external wallet for bridging
			});
		} catch (error) {
			console.error('Error bridging to Solana:', error);
		}
	};

	// USDC bridge example (from any available chain to Flow EVM)
	const handleBridgeUsdc = async () => {
		if (!embeddedWallet) return;

		try {
			await fundEvmWallet(embeddedWallet.address, {
				amount: '10', // Amount in USDC
				chain: flowEvm, // Target chain (Flow EVM)
				defaultFundingMethod: 'wallet', // Use external wallet for bridging
			});
		} catch (error) {
			console.error('Error bridging USDC to Flow EVM:', error);
		}
	};

	// Example of bridging Solana USDC to Flow EVM USDC
	const handleSolanaUsdcToFlowUsdc = async () => {
		if (!embeddedWallet) return;

		try {
			// First fund a Solana wallet with USDC
			await fundSolanaWallet(embeddedWallet.address, {
				amount: '10', // Amount in USDC on Solana
				cluster: { name: 'mainnet-beta' },
				defaultFundingMethod: 'wallet', // Use external wallet for bridging
			});

			// Then use Reservoir Relay to bridge to Flow EVM
			// Note: In a real implementation, you would need to check when the Solana funding is complete
			console.log(
				'Bridging USDC from Solana to Flow EVM via Reservoir Relay...'
			);

			// The actual bridging happens behind the scenes via Reservoir Relay
			// Bridge result would be USDC on Flow EVM
		} catch (error) {
			console.error('Error bridging Solana USDC to Flow EVM:', error);
		}
	};

	if (!ready || !authenticated) {
		return <div className="p-8">Loading...</div>;
	}

	return (
		<main className="container-custom py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Cross-Chain Bridging</h1>
				<Link href="/dashboard" className="btn-primary">
					&larr; Back to Dashboard
				</Link>
			</div>

			{embeddedWallet ? (
				<div className="card mb-8">
					<h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
					<p className="mb-2">
						<span className="font-medium">Address:</span>{' '}
						<code className="bg-gray-100 px-2 py-1 rounded">
							{embeddedWallet.address}
						</code>
					</p>
				</div>
			) : (
				<div className="card mb-8 bg-yellow-50">
					<p className="text-yellow-700">
						No embedded wallet found. Please refresh or log in
						again.
					</p>
				</div>
			)}

			<div className="mb-8">
				<div className="card">
					<h2 className="text-xl font-semibold mb-4">
						How Bridging Works with Privy
					</h2>
					<p className="mb-4">
						Privy integrates with Reservoir Relay to provide
						seamless asset bridging between different blockchains.
						When a user needs to bridge assets:
					</p>
					<ol className="list-decimal pl-5 mb-4 space-y-2">
						<li>
							Privy checks the user's balances across supported
							networks
						</li>
						<li>
							If the user has sufficient funds on a different
							chain than your target, Privy offers bridging as an
							option
						</li>
						<li>
							When the user selects bridging, Reservoir Relay
							facilitates the cross-chain transfer
						</li>
						<li>
							The funds appear in the user's wallet on the target
							chain after the bridging is complete
						</li>
					</ol>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="card">
					<h2 className="text-xl font-semibold mb-4">
						Bridging Options
					</h2>
					<p className="mb-4">
						Try out different bridging options using Privy's
						integration with Reservoir Relay:
					</p>

					<div className="space-y-4">
						<button
							onClick={handleBridgeToFlow}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Bridge ETH to Flow EVM
						</button>

						<button
							onClick={handleBridgeToSolana}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Bridge to Solana
						</button>

						<button
							onClick={handleBridgeUsdc}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Bridge USDC to Flow EVM
						</button>

						<button
							onClick={handleSolanaUsdcToFlowUsdc}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Bridge Solana USDC to Flow USDC
						</button>
					</div>
				</div>

				<div className="card">
					<h2 className="text-xl font-semibold mb-4">
						Implementation Details
					</h2>

					<p className="mb-3">
						When working with Privy's bridging functionality, there
						are a few key points to understand:
					</p>

					<div className="bg-gray-100 p-4 rounded mb-4">
						<h3 className="font-medium mb-2">
							Using External Wallets for Bridging:
						</h3>
						<p className="mb-2">
							Setting{' '}
							<code className="bg-gray-200 px-1">
								defaultFundingMethod: 'wallet'
							</code>
							enables Privy to check balances across chains and
							facilitate bridging.
						</p>
						<pre className="bg-gray-200 p-2 rounded text-sm">
							{`// Example code for Flow EVM
await fundWallet(address, {
  amount: '0.01',
  chain: flowEvm,
  defaultFundingMethod: 'wallet'
});`}
						</pre>
					</div>

					<div className="bg-gray-100 p-4 rounded mb-4">
						<h3 className="font-medium mb-2">
							Bridging from Solana to Flow EVM:
						</h3>
						<p className="mb-2">
							For Solana functionality, use the Solana-specific
							import:
						</p>
						<pre className="bg-gray-200 p-2 rounded text-sm">
							{`import { useFundWallet } from '@privy-io/react-auth/solana';

// Use the hook for Solana operations
const { fundWallet } = useFundWallet();

// Fund Solana wallet
await fundWallet(address, {
  amount: '10', // USDC on Solana
  cluster: { name: 'mainnet-beta' }
});`}
						</pre>
					</div>

					<div className="bg-gray-100 p-4 rounded">
						<h3 className="font-medium mb-2">
							Flow EVM Chain Details:
						</h3>
						<ul className="list-disc pl-5 space-y-1">
							<li>Chain ID: 747</li>
							<li>Native Currency: FLOW</li>
							<li>
								RPC Endpoint:
								https://mainnet.evm.nodes.onflow.org
							</li>
							<li>Block Explorer: https://evm.flowscan.io/</li>
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
