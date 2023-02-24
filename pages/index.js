import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

const userfetcher = (...args) =>
  fetch(...args, { credentials: 'include' })
    .then(res => res.json())

const fetcher = (...args) => fetch(...args).then(res => res.json())

const userApi = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/auth/user`;
const ssoApi = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/auth/sso`;
const logoutApi = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/auth/logout?sso=1`;
const ownedNftApi = (addr) => `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/public/nfts/ownedBy?addr=${addr}`;
const collectionsApi = `${process.env.NEXT_PUBLIC_API_INSTANCE}/api/user/collections`;

export default function Home() {
  const { query, push } = useRouter();
  const { data: currentUser, error: currentUserErr, isValidating } = useSWR(userApi, userfetcher)
  const { data: ownedNfts, error: ownedNftsErr } = useSWR(
    currentUser?.user
    ? ownedNftApi(currentUser.user.ethereumPublicAddr)
    : undefined, fetcher, { fallbackData: { nfts: [] } }
  )

  const { data: ownedCollections, error: ownedCollectionsErr } = useSWR(
    currentUser?.user
    ? collectionsApi
    : undefined, userfetcher, { fallbackData: { collections: [] } }
  )

  useEffect(() => {
    const refreshSession = async () => {
      await fetcher(ssoApi, {
        body: JSON.stringify({ token: query.accessToken }),
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      await mutate(userApi);
      push('/');
    }

    if(query.accessToken) {
      refreshSession();
    }
  }, [query])

  const handleLogout = async () => {
    await userfetcher([logoutApi]);
    await mutate(userApi);
    push('/');
    window.location.href = `${logoutApi}&redirectBack=1`
  }

  const handleLogin = () => {
    const currentUrl = document.URL;
    const ssoUrl = `${process.env.NEXT_PUBLIC_API_INSTANCE}/auth/sso?redirectToSso=${currentUrl}`;
    window.location.href = ssoUrl;
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <Head>
        <title>CH Playground</title>
      </Head>
      <div className="hero-content text-center">
        <div className="max-w-md">
          {isValidating && <p className='mt-6 mb-6'>Loading...</p>}
          {!currentUser?.user && !isValidating && (
            <>
              <h1 className="text-5xl font-bold">CreatorsHub playground</h1>
              <p className="py-6">In this website you may try our API</p>
              <button className="btn btn-primary" onClick={handleLogin}>
                Connect to your account
              </button>
              {currentUserErr && (
                <div className="alert alert-error shadow-lg mt-6">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{currentUserErr?.message || "Cannot login"}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {currentUser?.user && !isValidating && (
            <>
              <h1 className="text-5xl font-bold">{currentUser.user.name}</h1>
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mt-6">
                  <img src={currentUser.user.profile.avatar} alt="user profile avatar" />
                </div>
              </div>
              <p className="py-6">{currentUser.user.ethereumPublicAddr}</p>
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Owned NFTs</div>
                  <div className="stat-value">{ownedNfts.nfts.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Collections</div>
                  <div className="stat-value">{ownedCollections.collections.length}</div>
                </div>
              </div>
              <p>
                <Link href={`/ownedNfts?addr=${currentUser.user.ethereumPublicAddr}`} className="btn btn-primary mt-6">
                  Show my NFTs
                </Link>
              </p>
              <p>
                <Link href={`/marketplaceStats`} className="btn btn-warning mt-6">
                  Basic marketplace stats
                </Link>
              </p>
              <p>
                <Link href={`/claimCoupons`} passHref className="btn btn-warning mt-6">
                  Coupons
                </Link>
              </p>
              <button className="btn btn-error mt-6" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
