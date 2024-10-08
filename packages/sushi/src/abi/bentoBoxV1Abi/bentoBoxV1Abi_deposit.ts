export const bentoBoxV1Abi_deposit = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token_', type: 'address' },
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'share', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'shareOut', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
