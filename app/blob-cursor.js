'use client';
import {useEffect,useId,useRef} from 'react';
import gsap from 'gsap';

// Adapted from React Bits BlobCursor:
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Animations/BlobCursor
// Listening on window keeps this layer from intercepting links and controls.
export default function BlobCursor(){
 const id='blob-'+useId().replace(/:/g,'');
 const blobs=useRef([]);
 useEffect(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const move=e=>blobs.current.forEach((el,i)=>{if(!el)return;el.style.visibility='visible';gsap.to(el,{x:e.clientX,y:e.clientY,duration:i===0?.1:.5,ease:i===0?'power3.out':'power1.out',overwrite:'auto'})});
  window.addEventListener('pointermove',move,{passive:true});
  return()=>{window.removeEventListener('pointermove',move);blobs.current.forEach(el=>el&&gsap.killTweensOf(el))};
 },[]);
 const sizes=[23,49,32],inner=[7,12,9],opacity=[.5,.22,.34];
 return <div className="blob-container" aria-hidden="true"><svg width="0" height="0"><filter id={id}><feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"/><feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -5"/></filter></svg><div className="blob-main" style={{filter:`url(#${id})`}}>{sizes.map((size,i)=><span className="blob" key={size} ref={el=>blobs.current[i]=el} style={{width:size,height:size,marginLeft:-size/2,marginTop:-size/2,opacity:opacity[i]}}><i style={{width:inner[i],height:inner[i],inset:(size-inner[i])/2}}/></span>)}</div></div>
}
