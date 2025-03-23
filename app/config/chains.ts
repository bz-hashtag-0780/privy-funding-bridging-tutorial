import { Chain } from 'viem';

// Flow EVM Chain Configuration
// From https://evm.flowscan.io/
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
