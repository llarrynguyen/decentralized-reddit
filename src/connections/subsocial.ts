import { SubsocialApi } from '@subsocial/api'
import { registry } from '@subsocial/types/substrate/registry'
import { ipfsConfig } from './ipfs'
import { types } from '@subsocial/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { substrateNodeUrl } from '../env'
let subsocial: SubsocialApi
let api: ApiPromise
/**
 * Create a new or return existing connection to Subsocial API
 * (includes Substrate and IPFS connections).
 */

type Api = SubsocialApi & {
  api: ApiPromise
}

export const resolveSubsocialApi = async (): Promise<Api> => {
  // Connect to Subsocial's Substrate node:
  if (!subsocial) {
    const provider = new WsProvider(substrateNodeUrl)
    api = await new ApiPromise({ provider, types }).isReady
    const properties = await api.rpc.system.properties()

    registry.setChainProperties(properties)
    subsocial = new SubsocialApi({
      substrateApi: api,
      ...ipfsConfig
    });

    (subsocial as any).api = api

  }

  return subsocial as unknown as Api
}
