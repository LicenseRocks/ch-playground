import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) =>
  fetch(...args, { credentials: 'include' })
    .then(res => res.json())

const giveawaysApiUrl = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/public/giveaways`;
const claimApiUrl = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/giveaways/claim`;

export default function OwnedNftsPage() {
  const { query } = useRouter();
  const couponRef = useRef();
  const nftRef = useRef();
  const [giveawayId, setSelectedGiveawayId] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccesMsg] = useState(null);

  const { data, error, isValidating } = useSWR(giveawaysApiUrl, fetcher, {
    fallbackData: {
      giveaways: [],
    }
  })

  const handleGiveawayChange = (e) => {
    setSelectedGiveawayId(Number(e.current.value));
  }

  const handleClaim = async () => {
    try {
      setErrorMsg(null);
      const response = await fetch(claimApiUrl, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
          giveawayId,
          nftId: Number(nftRef.current.value),
          coupon: couponRef.current.value
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { nft, error } = await response.json();
      if(error) throw new Error(error);

      if(nft) {
        setSuccesMsg(`Success! You just received "${nft.title}" NFT!`);
      }

    } catch(err) {
      setErrorMsg(`${err}`);
    }
  }

  useEffect(() => {
    if(data?.giveaways && data.giveaways[0]) {
      setSelectedGiveawayId(data.giveaways[0].id)
    }
  }, [data])

  return (
    <div className="hero min-h-screen bg-base-200">
      <Head>
        <title>CH Playground - Coupons</title>
      </Head>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className='mt-6 mb-6 text-xl'>Use coupon to get NFT</h2>
          {isValidating && <p>Loading...</p>}
          {data.giveaways.length > 0 && (
            <>
              <select onChange={handleGiveawayChange} className="select select-bordered select-lg w-full max-w-xs">
                {data.giveaways.map(campaign => {
                  return(
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  )
                })}
              </select>
              {giveawayId && (
                <select ref={nftRef} className="mt-5 select select-bordered select-lg w-full max-w-xs">
                  {data.giveaways.find(item => item.id == giveawayId).GiveawayNft.map(({ nft }) => {
                    return(
                      <option key={nft.id} value={nft.id}>
                        {nft.title}
                      </option>
                    )
                  })}
                </select>
              )}


              <input
                ref={couponRef}
                type="text"
                placeholder="Type coupon here"
                className="mt-5 input input-bordered w-full max-w-xs"
              />
              <button onClick={handleClaim} className="mt-5 btn btn-secondary btn-wide">Claim now</button>
              {errorMsg && <p className='mt-5 text-red-400'>{errorMsg}</p>}
              {successMsg && <p className='mt-5 text-green-400'>{successMsg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
