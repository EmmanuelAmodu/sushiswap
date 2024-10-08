export const bentoBoxV1Abi_batch = [
  {
    inputs: [
      { internalType: 'bytes[]', name: 'calls', type: 'bytes[]' },
      { internalType: 'bool', name: 'revertOnFail', type: 'bool' },
    ],
    name: 'batch',
    outputs: [
      { internalType: 'bool[]', name: 'successes', type: 'bool[]' },
      { internalType: 'bytes[]', name: 'results', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
