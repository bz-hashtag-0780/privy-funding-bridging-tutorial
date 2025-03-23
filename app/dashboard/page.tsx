'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useFundWallet } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { flowEvm } from '../config/chains';

// This component demonstrates the manual wallet funding functionality
export default function Dashboard() {
	const router = useRouter();
	const { ready, authenticated, user } = usePrivy();
	const { wallets } = useWallets();
	const { fundWallet } = useFundWallet({
		onUserExited: ({ balance }) => {
			console.log('User exited funding flow with balance:', balance);
			// You could redirect or show different UI based on balance
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

	// Basic fund wallet function
	const handleFundWallet = async () => {
		if (!embeddedWallet) return;

		try {
			await fundWallet(embeddedWallet.address);
		} catch (error) {
			console.error('Error funding wallet:', error);
		}
	};

	// Fund wallet with specific amount of FLOW
	const handleFundWalletWithFlow = async () => {
		if (!embeddedWallet) return;

		try {
			await fundWallet(embeddedWallet.address, {
				amount: '0.1', // Amount in FLOW
				chain: flowEvm, // Specify Flow EVM chain
			});
		} catch (error) {
			console.error('Error funding wallet with FLOW:', error);
		}
	};

	// Fund wallet with USDC on Flow EVM
	const handleFundWalletWithUsdc = async () => {
		if (!embeddedWallet) return;

		try {
			await fundWallet(embeddedWallet.address, {
				amount: '10', // Amount in USDC
				chain: flowEvm, // Specify Flow EVM chain
				defaultFundingMethod: 'card',
				card: {
					preferredProvider: 'moonpay',
				},
			});
		} catch (error) {
			console.error('Error funding wallet with USDC on Flow EVM:', error);
		}
	};

	// Fund wallet with custom UI configurations
	const handleFundWalletCustomUi = async () => {
		if (!embeddedWallet) return;

		try {
			await fundWallet(embeddedWallet.address, {
				amount: '5',
				chain: flowEvm, // Specify Flow EVM chain
				uiConfig: {
					receiveFundsTitle: 'Fund Your Flow Wallet',
					receiveFundsSubtitle:
						'Add FLOW tokens to your wallet to interact with our dApp',
				},
			});
		} catch (error) {
			console.error('Error funding wallet with custom UI:', error);
		}
	};

	if (!ready || !authenticated) {
		return <div className="p-8">Loading...</div>;
	}

	return (
		<main className="container-custom py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Wallet Dashboard</h1>
				<Link href="/bridge" className="btn-primary">
					Try Bridging &rarr;
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
					<p className="mb-4">
						<span className="font-medium">Type:</span>{' '}
						{embeddedWallet.walletClientType}
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

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="card">
					<h2 className="text-xl font-semibold mb-4">
						Manual Funding Options
					</h2>
					<p className="mb-4">
						Try out different wallet funding options using
						Privy&apos;s SDK with Flow EVM:
					</p>

					<div className="space-y-4">
						<button
							onClick={handleFundWallet}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Basic Fund Wallet
						</button>

						<button
							onClick={handleFundWalletWithFlow}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Fund Wallet with 0.1 FLOW
						</button>

						<button
							onClick={handleFundWalletWithUsdc}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Fund Wallet with 10 USDC on Flow EVM
						</button>

						<button
							onClick={handleFundWalletCustomUi}
							className="w-full btn-primary"
							disabled={!embeddedWallet}
						>
							Fund Flow Wallet with Custom UI
						</button>
					</div>
				</div>

				<div className="card">
					<h2 className="text-xl font-semibold mb-4">
						When to Use Funding Prompts
					</h2>
					<p className="mb-2">
						Privy wallet funding can be triggered in two ways:
					</p>
					<ol className="list-decimal pl-5 mb-4 space-y-2">
						<li>
							<span className="font-medium">Manually</span>: By
							calling the{' '}
							<code className="bg-gray-100 px-2 py-1 rounded">
								fundWallet
							</code>{' '}
							method as shown in the examples.
						</li>
						<li>
							<span className="font-medium">Automatically</span>:
							When a user attempts to send a transaction but has
							insufficient funds.
						</li>
					</ol>
					<p className="mb-4">
						The automatic prompt is particularly useful for a
						seamless user experience where funding is only suggested
						when actually needed.
					</p>
					<div className="bg-gray-100 p-4 rounded">
						<h3 className="font-medium mb-2">
							Flow EVM Implementation Tips:
						</h3>
						<ul className="list-disc pl-5 space-y-2">
							<li>Use automatic prompting for the best UX</li>
							<li>
								In Privy provider, set{' '}
								<code className="bg-gray-200 px-1">
									defaultChain: 'flow-evm'
								</code>{' '}
								to use Flow EVM by default
							</li>
							<li>
								Set{' '}
								<code className="bg-gray-200 px-1">
									defaultToken: 'flow'
								</code>{' '}
								to fund with FLOW tokens
							</li>
							<li>
								Use the{' '}
								<code className="bg-gray-200 px-1">
									chain: flowEvm
								</code>{' '}
								parameter to specify Flow EVM chain in
								individual funding calls
							</li>
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
