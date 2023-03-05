import { TransactionResponse } from '@ethersproject/abstract-provider'
import { Dialog, Transition } from '@headlessui/react'
import { signTypedData } from '@wagmi/core'
import { Contract } from 'ethers'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { givabitApi } from '~/services/givabit/api'
import { NftEntity } from '~/types/entity/nft.entity'
import { CharityList } from '../Form/CharityList'
import { CountryList } from '../Form/CountryList'
import { TopicList } from '../Form/TopicList'
import { nftAbi } from './erc721'

interface Props {
  nfts: NftEntity[]
}

export default function SellNftDialog({ nfts }: Props) {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { data: signer } = useSigner()

  useEffect(() => {
    setOpen(nfts.length ? true : false)
  }, [nfts])

  const cancelButtonRef = useRef(null)

  const submit = async () => {
    const sale = await givabitApi.signingNftSale({
      nftId: nfts[0].id,
      countryCode: 'KY',
      charityId: 'ead87736-b0a7-4b36-b52f-232c6e948815',
      topicId: '0db06dd2-011d-4d6b-8fcd-4f6c9d0292f3',
      network: 'POLYGON_MUMBAI',
      charityShare: 1000,
      expiryInMinutes: 30 * 24 * 60,
      currency: 'NATIVE_CURRENCY',
      quantity: 1,
      price: 0.00000321,
      // price: 0.0,
    })
    // sale
    if (address && signer) {
      const typedData = JSON.parse(sale.data.signingData)
      console.log('typedData', typedData)
      const nftContract = new Contract(typedData.message.nftContract, nftAbi, signer)
      console.log('typedData.message.tokenId', typedData.message.tokenId)
      // if (typedData.message.isMinted)
      // const isApproved = (await nftContract.getApproved(
      //   typedData.message.tokenId
      // )) as providers.TransactionResponse
      // console.log('isApproved', isApproved)
      // if (!isApproved) {
      // const txResponse = (await nftContract.approve(
      //   typedData.domain.verifyingContract,
      //   typedData.message.tokenId,
      //   {
      //     from: address,
      //   }
      // )) as providers.TransactionResponse
      // const txReceipt = await txResponse.wait()
      // }
      // OR
      const approvedAll = await nftContract.isApprovedForAll(
        address,
        typedData.domain.verifyingContract
      )
      console.log('approvedAll', approvedAll)
      if (!approvedAll) {
        const txResponse = (await nftContract.setApprovalForAll(
          typedData.domain.verifyingContract,
          true,
          {
            from: address,
          }
        )) as TransactionResponse
        const txReceipt = await txResponse.wait()
        console.log('approved successful', txReceipt)
      }

      const signResponse = await signTypedData({
        domain: typedData.domain,
        types: typedData.types,
        value: typedData.message,
      })
      console.log('signResponse', signResponse)
      const result = await givabitApi.createSale({
        clientSignature: signResponse,
        serverSignature: sale.data.serverSignature,
        saleData: sale.data.saleData,
      })
      console.log('result', result)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <form className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-8 divide-y divide-gray-200">
                      <div className="pt-8">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Sell Information
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Placeholder</p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <CountryList />
                            <div className="mt-1"></div>
                          </div>

                          <div className="sm:col-span-6">
                            <TopicList />
                            <div className="mt-1"></div>
                          </div>

                          <div className="sm:col-span-6">
                            <CharityList />
                            <div className="mt-1"></div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="network"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Network
                            </label>
                            <div className="mt-1">
                              <select
                                id="network"
                                name="network"
                                autoComplete="network-name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="POLYGON_MUMBAI">Polygon Mumbai</option>
                                <option value="BSC_TESTNET">BSC Testnet</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="currency"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Currency
                            </label>
                            <div className="mt-1">
                              <select
                                id="currency"
                                name="currency"
                                autoComplete="currency-name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="NATIVE_CURRENCY">Polygon</option>
                                <option value="ETH">ETH</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Price
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="city"
                                id="city"
                                autoComplete="address-level2"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="region"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Charity percentage
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="region"
                                id="region"
                                autoComplete="address-level1"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={submit}
                  >
                    Sell
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}