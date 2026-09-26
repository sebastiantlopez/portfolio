'use client';

import {useCallback,useEffect,useRef} from 'react';
import gsap from 'gsap';
import './blob-cursor.css';

export default function BlobCursor({
  blobType='circle',
  fillColor='#ffffff',
  trailCount=3,
  sizes=[10.23,13.75,8.25],
  innerSizes=[6.71,3.85,2.75],
  innerColor='#ffffff',
  opacities=[.6,.6,.6],
  shadowColor='#7C3AED',
  shadowBlur=.55,
  shadowOffsetX=1.1,
  shadowOffsetY=1.1,
  filterId='portfolio-blob',
  filterStdDeviation=3.3,
  filterColorMatrixValues='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter=true,
  fastDuration=.14,
  slowDuration=.2,
  fastEase='power3.out',
  slowEase='power1.out',
  zIndex=100
}){
  const containerRef=useRef(null),blobsRef=useRef([]),visibleRef=useRef(false),lastMoveRef=useRef(null);
  const updateOffset=useCallback(()=>{if(!containerRef.current)return{left:0,top:0};const rect=containerRef.current.getBoundingClientRect();return{left:rect.left,top:rect.top}},[]);
  const handleMove=useCallback(e=>{const{left,top}=updateOffset(),x=e.clientX-left,y=e.clientY-top,now=performance.now(),previous=lastMoveRef.current;let speed=0;if(previous){const elapsed=Math.max(1,now-previous.time);speed=Math.hypot(x-previous.x,y-previous.y)/elapsed}lastMoveRef.current={x,y,time:now};const catchUpDuration=Math.max(fastDuration+.02,slowDuration-.04),speedFactor=Math.min(1,speed/1.5),trailingDuration=slowDuration-(slowDuration-catchUpDuration)*speedFactor;if(!visibleRef.current){visibleRef.current=true;blobsRef.current.forEach(el=>{if(el)gsap.set(el,{visibility:'visible',x,y})})}blobsRef.current.forEach((el,i)=>{if(!el)return;const isLead=i===0;gsap.to(el,{x,y,duration:isLead?fastDuration:trailingDuration,ease:isLead?fastEase:slowEase,overwrite:'auto'})})},[updateOffset,fastDuration,slowDuration,fastEase,slowEase]);
  useEffect(()=>{if(!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches)return;let frame=0,latest;const move=e=>{latest=e;if(!frame)frame=requestAnimationFrame(()=>{frame=0;handleMove(latest)})};window.addEventListener('pointermove',move,{passive:true});return()=>{window.removeEventListener('pointermove',move);cancelAnimationFrame(frame);blobsRef.current.forEach(el=>{if(el)gsap.killTweensOf(el)})}},[handleMove]);
  return <div ref={containerRef} className="blob-container" style={{zIndex}} aria-hidden="true">
    {useFilter&&<svg className="blob-filter" aria-hidden="true"><filter id={filterId}><feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation}/><feColorMatrix in="blur" values={filterColorMatrixValues}/></filter></svg>}
    <div className="blob-main" style={{filter:useFilter?`url(#${filterId})`:undefined}}>{Array.from({length:trailCount}).map((_,i)=><div key={i} ref={el=>{blobsRef.current[i]=el}} className="blob" style={{width:sizes[i],height:sizes[i],marginLeft:-sizes[i]/2,marginTop:-sizes[i]/2,borderRadius:blobType==='circle'?'50%':'0%',backgroundColor:fillColor,opacity:opacities[i],boxShadow:`${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`}}><div className="inner-dot" style={{width:innerSizes[i],height:innerSizes[i],top:(sizes[i]-innerSizes[i])/2,left:(sizes[i]-innerSizes[i])/2,backgroundColor:innerColor,borderRadius:blobType==='circle'?'50%':'0%'}}/></div>)}</div>
  </div>;
}
