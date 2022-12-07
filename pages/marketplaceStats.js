import Head from 'next/head'
import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const marketplaceStatsApiUrl = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/public/stats`;
const creatorsApiUrl = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/public/creators`;

export default function OwnedNftsPage() {
  const { query } = useRouter();

  const { data: statsApi, error: statsErr, isValidating: statsLoading } = useSWR(marketplaceStatsApiUrl, fetcher, {
    fallbackData: {
      stats: {
        nfts: {
          total: 0,
          unique: 0,
          rare: 0,
          unlimited: 0,
        }
      }
    }
  })

  const { data: creatorsApi, error: creatorsErr, isValidating: creatorsLoading } = useSWR(creatorsApiUrl, fetcher, {
    fallbackData: {
      creators: []
    }
  })

  return (
    <div className="hero min-h-screen bg-base-200">
      <Head>
        <title>CH Playground - Stats</title>
      </Head>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className='mt-6 mb-6 text-xl'>NFT stats</h2>
          {statsLoading && <p>Loading...</p>}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total</div>
              <div className="stat-value">{statsApi.stats.nfts.total}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Unique</div>
              <div className="stat-value">{statsApi.stats.nfts.unique}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Rare</div>
              <div className="stat-value">{statsApi.stats.nfts.rare}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Unlimited</div>
              <div className="stat-value">{statsApi.stats.nfts.unlimited}</div>
            </div>
          </div>
          <h2 className='mt-6 mb-6 text-xl'>Recent creators</h2>
          {creatorsApi.creators.map(creator =>
            <div key={`user-${creator.id}`} className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={creator.profile.avatar} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
