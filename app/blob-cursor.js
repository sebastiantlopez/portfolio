'use client';
import {useEffect,useId,useRef} from 'react';

// Adapted from React Bits BlobCursor:
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Animations/BlobCursor
// Listening on window keeps this layer from intercepting links and controls.
export default function BlobCursor(){
 const id='blob-'+useId().replace(/:/g,'');
 const blobs=useRef([]);
 useEffect(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const target={x:0,y:0},last={x:0,y:0,time:0};let frame,started=false,speed=0,angle=0;
  const move=e=>{const now=performance.now(),dx=e.clientX-last.x,dy=e.clientY-last.y,travel=Math.hypot(dx,dy),elapsed=Math.max(now-last.time,1);target.x=e.clientX;target.y=e.clientY;if(!started){blobs.current.forEach(el=>{if(el)el.style.visibility='visible'});started=true}else if(travel>4){speed=Math.max(speed,travel/elapsed);angle=Math.atan2(dy,dx)}last.x=e.clientX;last.y=e.clientY;last.time=now};
  const tick=()=>{if(started){const fast=speed>.9,trail=fast?Math.min((speed-.9)*2.4,5):0,cos=Math.cos(angle),sin=Math.sin(angle);blobs.current.forEach((el,i)=>{if(!el)return;const offset=trail*[0,.45,1][i],stretch=fast?Math.min((speed-.9)*.13,.22)*(1-i*.2):0;el.style.transform=`translate3d(${target.x-cos*offset}px,${target.y-sin*offset}px,0) rotate(${angle}rad) scale(${1+stretch},${1-stretch*.45})`});speed*=.8}frame=requestAnimationFrame(tick)};
  window.addEventListener('pointermove',move,{passive:true});
  frame=requestAnimationFrame(tick);return()=>{window.removeEventListener('pointermove',move);cancelAnimationFrame(frame)};
 },[]);
 const sizes=[19,41,27],opacity=[.5,.22,.34];
 return <div className="blob-container" aria-hidden="true"><svg width="0" height="0"><filter id={id}><feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="8"/><feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -4"/></filter></svg><div className="blob-main" style={{filter:`url(#${id})`}}>{sizes.map((size,i)=><span className="blob" key={size} ref={el=>blobs.current[i]=el} style={{width:size,height:size,marginLeft:-size/2,marginTop:-size/2,opacity:opacity[i]}}/>)}</div></div>
}
