'use client';

import './globals.css';
import Providers from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<title>Privy Wallet Funding & Bridging Tutorial</title>
				<meta
					name="description"
					content="Learn how to implement Privy SDK for wallet funding and bridging"
				/>
			</head>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
