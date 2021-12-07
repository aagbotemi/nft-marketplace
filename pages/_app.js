import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../styles/globals.css'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

const navigation = [
  { name: 'CreateNFT', url: '/create-item', current: true },
  { name: 'Profile', url: '/creator-dashboard', current: false }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function MyApp({ Component, pageProps }) {

  // const currentAccount = "0x3904809348afd930092"
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
      } else {
        alert("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        alert("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        alert("No authorized account found")
      }
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    // setLoadingWallet(true);
    try {
      const { ethereum } = window;

      if (!ethereum) {
        // alert("Get MetaMask!");
        // setLoadingWallet(false);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // setLoadingWallet(false);
    } catch (error) {
      console.log(error)
      // setLoadingWallet(false);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="shadow sticky top-0 bg-white">
            <div className="px-2 sm:px-6 lg:px-8 relative flex items-center justify-between h-14 max-w-7xl mx-auto">
              <div className="flex-1 flex items-center sm:justify-between sm:items-stretch">
                <div className="flex items-center text-xl">
                  <Link
                    href="/"
                  >
                    <a
                    className={'rounded-full'}>NFT Marketplace</a>
                  </Link>
                  {/* <img
                    className="block lg:hidden h-8 w-auto"
                    src={Logo}
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={Logo}
                    alt="Workflow"
                  /> */}
                  {currentAccount && (<Link
                    href="/my-assets"
                  >
                    <a className={'px-4 rounded-full font-base hidden sm:block'}>Gallery</a>
                  </Link>)}
                </div>
                <div className="hidden md:block sm:ml-6">
                  <div className="flex space-x-4">
                    {currentAccount && navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.url}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <a
                        className={classNames(
                          item.current ? 'text-white bg-blue-light' : 'text-blue-light border border-blue-light',
                          'px-4 py-2 rounded-full text-sm font-medium'
                        )}>{item.name}</a>
                      </Link>
                    ))}

                    {!currentAccount && (
                      <button className="font-base cursor-pointer text-white bg-blue-light px-4 py-2 rounded-full text-sm font-medium" onClick={connectWallet}>
                        Connect Wallet
                      </button>
                    )}

                    {currentAccount && (
                      <div className='mt-2 text-blue-light'>Account: [{currentAccount.substring(0, 2).concat('...')}{currentAccount.substring(currentAccount.length - 6)}]
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                {!currentAccount && (
                  <button className="font-base cursor-pointer text-white text-blue-light border border-blue-light px-3 py-2 rounded-full text-sm font-medium" onClick={connectWallet}>
                    Connect Wallet
                  </button>
                )}
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none text-blue-light">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    currentAccount && (<MenuIcon className="block h-6 w-6" aria-hidden="true" />)
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-blue-light text-white border-t">
            {currentAccount && (<div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.url}
                  className={classNames(
                    item.current ? 'text-gray-50' : 'text-gray-100',
                    'block px-3 py-2 rounded-md text-sm font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Link
                href="/my-assets"
              >
                <a className={'block px-3 py-2 rounded-md text-sm font-medium sm:hidden'}>Gallery</a>
              </Link>
            </div>)}
          </Disclosure.Panel>
          <Component {...pageProps} />
        </>
      )}
    </Disclosure>
  )
}

export default MyApp
