import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  // if (!isBentoBoxV1ChainId(chainId)) {
  //   throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  // }

  // const args = [bentoBoxV1Address[chainId], []]

  const args = ['0x0000000000000000000000000000000000000000', []]

  const { address } = await deploy('RouteProcessor3_1', {
    from: deployer,
    args,
    // waitConfirmations: 5,
  })

  // await run('verify:verify', {
  //   address,
  //   constructorArguments: args,
  // })

  console.log(`RouteProcessor3_1 deployed to ${address}`)
}

func.tags = ['RouteProcessor3_1']

export default func
