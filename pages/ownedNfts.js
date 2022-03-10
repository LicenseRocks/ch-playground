import Head from 'next/head'
import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const ownedNftApi = (addr) => `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/public/nfts/ownedBy?addr=${addr}`;

export default function OwnedNftsPage() {
  const { query } = useRouter();

  const { data: ownedNfts, error: ownedNftsErr } = useSWR(
    query?.addr
    ? ownedNftApi(query?.addr)
    : undefined, fetcher, { fallbackData: { nfts: [] } }
  )

  return (
    <div className="hero min-h-screen bg-base-200">
      <Head>
        <title>CH Playground - NFTs</title>
      </Head>
      <div className="hero-content text-center">
        <div className="max-w-md">
          {ownedNfts.nfts.map(item =>
            <div key={`nft-${item.id}`} className="card w-96 bg-base-100 shadow-xl">
              <figure>
                <img src={item.coverSrc} alt="Shoes" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                <p>{item.payload.description}</p>
                <div className="card-actions justify-end">
                  <a href={`${process.env.NEXT_PUBLIC_API_INSTANCE}/nft/${item.slug}`} target="_blank" rel="noreferrer">
                    <button className="btn btn-primary">Buy Now</button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
