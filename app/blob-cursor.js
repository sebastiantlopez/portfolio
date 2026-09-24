'use client';

import {useCallback,useEffect,useRef} from 'react';
import gsap from 'gsap';
import './blob-cursor.css';

export default function BlobCursor({
  blobType='circle',
  fillColor='#ffffff',
  trailCount=3,
  sizes=[9.3,12.5,7.5],
  innerSizes=[6.1,3.5,2.5],
  innerColor='#ffffff',
  opacities=[.6,.6,.6],
  shadowColor='#7C3AED',
  shadowBlur=.5,
  shadowOffsetX=1,
  shadowOffsetY=1,
  filterId='portfolio-blob',
  filterStdDeviation=3,
  filterColorMatrixValues='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter=true,
  fastDuration=.14,
  slowDuration=.23,
  fastEase='power3.out',
  slowEase='power1.out',
  zIndex=100
}){
  const containerRef=useRef(null),blobsRef=useRef([]),visibleRef=useRef(false);
  const updateOffset=useCallback(()=>{if(!containerRef.current)return{left:0,top:0};const rect=containerRef.current.getBoundingClientRect();return{left:rect.left,top:rect.top}},[]);
  const handleMove=useCallback(e=>{const{left,top}=updateOffset(),x=e.clientX-left,y=e.clientY-top;if(!visibleRef.current){visibleRef.current=true;blobsRef.current.forEach(el=>{if(el)gsap.set(el,{visibility:'visible',x,y})})}blobsRef.current.forEach((el,i)=>{if(!el)return;const isLead=i===0;gsap.to(el,{x,y,duration:isLead?fastDuration:slowDuration,ease:isLead?fastEase:slowEase,overwrite:'auto'})})},[updateOffset,fastDuration,slowDuration,fastEase,slowEase]);
  useEffect(()=>{window.addEventListener('pointermove',handleMove,{passive:true});window.addEventListener('resize',updateOffset,{passive:true});return()=>{window.removeEventListener('pointermove',handleMove);window.removeEventListener('resize',updateOffset);blobsRef.current.forEach(el=>{if(el)gsap.killTweensOf(el)})}},[handleMove,updateOffset]);
  return <div ref={containerRef} className="blob-container" style={{zIndex}} aria-hidden="true">
    {useFilter&&<svg className="blob-filter" aria-hidden="true"><filter id={filterId}><feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation}/><feColorMatrix in="blur" values={filterColorMatrixValues}/></filter></svg>}
    <div className="blob-main" style={{filter:useFilter?`url(#${filterId})`:undefined}}>{Array.from({length:trailCount}).map((_,i)=><div key={i} ref={el=>{blobsRef.current[i]=el}} className="blob" style={{width:sizes[i],height:sizes[i],marginLeft:-sizes[i]/2,marginTop:-sizes[i]/2,borderRadius:blobType==='circle'?'50%':'0%',backgroundColor:fillColor,opacity:opacities[i],boxShadow:`${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`}}><div className="inner-dot" style={{width:innerSizes[i],height:innerSizes[i],top:(sizes[i]-innerSizes[i])/2,left:(sizes[i]-innerSizes[i])/2,backgroundColor:innerColor,borderRadius:blobType==='circle'?'50%':'0%'}}/></div>)}</div>
  </div>;
}
