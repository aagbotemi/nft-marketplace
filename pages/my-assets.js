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

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])

    console.log(nfts)
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
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
        }
        return item
        }))
        setNfts(items)
        setLoadingState('loaded') 
    }

    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 text-center text-3xl">No assets owned</h1>)
    
    return (
        <div className="">
            <div className="text-2xl py-2 text-center mt-6">My Digital Assets</div>
            {
                loadingState === 'not-loaded' ? <LoadingIndicator /> : null
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mx-5 sm:mx-8 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-auto" style={{ maxWidth: '1536px' }}>
            {
                nfts.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img src={nft.image} className="h-60 min-w-full object-fill" alt="nfts assets" />
                        <div className="flex justify-between items-center p-4 bg-black text-xl text-black">
                            <p>Price </p>
                            <span className="font-medium">{nft.price} Eth</span>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}
