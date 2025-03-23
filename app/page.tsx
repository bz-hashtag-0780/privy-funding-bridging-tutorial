'use client';

import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	const { login, authenticated } = usePrivy();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold mb-4">
					Privy Wallet Funding & Bridging Tutorial
				</h1>
				<p className="text-xl mb-8">
					Learn how to integrate Privy SDK for seamless wallet funding
					and bridging
				</p>

				{!authenticated ? (
					<button onClick={login} className="btn-primary text-lg">
						Get Started with Privy
					</button>
				) : (
					<Link
						href="/dashboard"
						className="btn-primary inline-block text-lg"
					>
						Go to Dashboard
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
				<div className="card">
					<h2 className="text-2xl font-bold mb-4">Wallet Funding</h2>
					<p className="mb-4">
						With Privy, you can easily enable wallet funding through
						multiple methods:
					</p>
					<ul className="list-disc pl-5 mb-4">
						<li>Credit/Debit Card Payments</li>
						<li>External Wallet Transfers</li>
						<li>Exchange Account Transfers</li>
					</ul>
				</div>

				<div className="card">
					<h2 className="text-2xl font-bold mb-4">Asset Bridging</h2>
					<p className="mb-4">
						Privy integrates with Reservoir Relay for seamless
						cross-chain asset bridging:
					</p>
					<ul className="list-disc pl-5 mb-4">
						<li>
							Bridge from any supported chain to your target chain
						</li>
						<li>Support for EVM chains and Solana</li>
						<li>
							Automatic bridge detection based on user balances
						</li>
					</ul>
				</div>
			</div>
		</main>
	);
}
