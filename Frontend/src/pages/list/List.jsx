import React, { Suspense, useEffect } from 'react';
import './list.scss';
import {Filter, Card, Map} from '../../components';
import { Await, useLoaderData, useResolvedPath, useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '../../context/useContext';
import { FaCircleCheck } from 'react-icons/fa6';

const List = () => {
  const posts = useLoaderData();
  const {getPath} = useGlobalContext();

  const {pathname} = useResolvedPath()

  const path = pathname.split("/")[1]

  useEffect(()=> {
    getPath(path)
  }, [])

  return (
    <section className='container changeFlex'>
        <div className="left">
            <div className="wrapper listWrapper">
                <Filter />
               <div className='postLists'>
                 <Suspense>
                    <Await resolve={posts.postResponse}>
                        {(postResponse) => {
                        return postResponse.data.data.agent && <div className="filterHeader">
                            <span> <img src={postResponse.data.data.agent?.avatar} className='userImg agentImg'/> {postResponse.data.data.agent?.username} <FaCircleCheck/></span>
                        </div>
                         }}
                    </Await>
                </Suspense>
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={posts.postResponse} errorElement={<h3>Error Loading Page</h3>}>
                        {(postResponse) => {
                        return <div className='propertyList'>
                        {postResponse?.data.data.posts.map((post, i)=> {
                        return <Card key={i} post={post}/>
                        })}
                        </div>
                        }}
                    </Await>
                </Suspense>
               </div>
            </div>
        </div>
        <div className="right listRight">
            <Suspense fallback={undefined}>
                <Await resolve={posts.postResponse} errorElement={<h3>Error Loading Page</h3>}>
                    {(postResponse) => {
                    return postResponse?.data?.data && <Map locations = {postResponse.data.data.posts}/>
                    }}
                </Await>
            </Suspense>
        </div>
    </section>
  )
}

export default List
