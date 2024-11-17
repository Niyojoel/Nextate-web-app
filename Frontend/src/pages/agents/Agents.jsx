import React, { Suspense, useEffect } from 'react';
import "./agents.scss";
import { Await, useLoaderData, useResolvedPath } from 'react-router-dom';
import { useGlobalContext } from '../../context/useContext';
import { AgentCard } from '../../components';

const Agents = () => {
  const data = useLoaderData();
  const {getPath} = useGlobalContext();
  const {pathname} = useResolvedPath()

  const path = pathname.split("/")[1]

  useEffect(()=> {
    getPath(path)
  }, [])
  return (
    <section className='container homeWrapper'> 
      <div className="left left-agents">
        <div className='wrapper'>
          <figure className='banner'><img src='./imgedit.png' alt="" /></figure>
            <div className="agents">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={data.dataResponse} errorElement={<h3>Error Loading agents</h3>}>
                        {(dataResponse) => {
                            return dataResponse.data.data.map((agent) => {
                                return <AgentCard key= {agent._id} agent={agent}/>
                            })
                        }}
                    </Await>
                </Suspense>
            </div>
        </div>
      </div>
      <div className="right homeRight">
        <img src="/imgedit.png" alt="banner_img"/>
      </div>
    </section>
  )
}

export default Agents