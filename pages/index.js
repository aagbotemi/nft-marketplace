import Head from 'next/head'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/Loading'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  toast.configure({
    autoClose: 7000,
    draggable: true,
  });

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/262c982def2340dcb7434a9dfa0e33c5")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether') 
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    toast.dismiss()
    toast.success('Asset created successfully', {
      position: "top-right",
      pauseOnHover: true,
      draggable: false,
    });
    loadNFTs()
  }
  
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="Your number one NFT marketplace" />
        <meta name="author" content="Abiodun Awoyemi" />
        <meta name="keyword" content="nft, nft-maketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className=' text-center mt-8'>
          <h1 className="font-bold text-3xl">TRENDING COLLECTIONS</h1>
          <p className="">Where your dream lives</p>
        </div>
        {
          loadingState === 'not-loaded' ? <LoadingIndicator /> : null
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 mx-5 sm:mx-8 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-auto" style={{ maxWidth: '1536px' }}>
          {
            nfts.map((nft, i) => (
              <div key={i} className="border w-full shadow rounded-xl overflow-hidden">
                <img
                  src={nft.image}
                  alt="nfts assets"
                  className="h-64 w-full object-fill"
                />
                <div className="p-4 py-3">
                  <p style={{ height: '20px' }} className="text-xl font-medium">{nft.name}</p>
                  <div style={{ height: '25px', overflow: 'hidden' }}>
                    <p className="text-gray-400 mt-1 text-sm">{nft.description}</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-300">
                  <p className="text-xl mb-1 font-medium font-raleway">{nft.price} ETH</p>
                  <button className="w-full bg-blue-light text-white font-bold py-2 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  )
}
