import { InjectedConnector } from '@web3-react/injected-connector'

console.log('process.env', process.env)

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 97, 80001],
})
