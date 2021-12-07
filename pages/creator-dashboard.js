import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import LoadingIndicator from '../components/Loading'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        /* const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        }) */
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded') 
    }

    return (
        <div>
            <div className="p-4">
                <h2 className="text-3xl py-2 text-center">Assets Created</h2>
                {
                    loadingState === 'not-loaded' ? <LoadingIndicator /> : null
                }
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mx-5 sm:mx-8 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-auto" style={{ maxWidth: '1536px' }}>
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="border w-full shadow rounded-xl overflow-hidden">
                                <img src={nft.image} className="max-h-60 min-w-full object-fill" />
                                <div className="flex justify-between items-center p-4 bg-black text-xl text-black">
                                    <p>Price </p>
                                    <span className="font-medium">{nft.price} Eth</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                {
                    Boolean(sold.length) && (
                        <div>
                            <h2 className="text-2xl py-2">Items sold</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mx-5 sm:mx-8 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-auto" style={{ maxWidth: '1536px' }}>
                                {
                                    sold.map((nft, i) => (
                                        <div key={i} className="border shadow rounded-xl overflow-hidden">
                                        <img src={nft.image} className="rounded" alt="nft asset" />
                                        <div className="p-4 bg-black">
                                            <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                        </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
