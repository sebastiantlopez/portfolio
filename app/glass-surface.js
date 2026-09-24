'use client';

import {useEffect,useId,useRef,useState} from 'react';
import './glass-surface.css';

export default function GlassSurface({children,width='auto',height='auto',borderRadius=20,borderWidth=.07,brightness=70,opacity=.82,blur=11,displace=0,backgroundOpacity=.06,saturation=1.2,distortionScale=-120,redOffset=0,greenOffset=10,blueOffset=20,xChannel='R',yChannel='G',mixBlendMode='difference',className='',style={}}){
  const id=useId().replace(/:/g,'-');
  const filterId=`glass-filter-${id}`,redGradId=`red-grad-${id}`,blueGradId=`blue-grad-${id}`;
  const containerRef=useRef(null),imageRef=useRef(null),redRef=useRef(null),greenRef=useRef(null),blueRef=useRef(null),blurRef=useRef(null);
  const[supportsSvg,setSupportsSvg]=useState(false);

  function displacementMap(){
    const rect=containerRef.current?.getBoundingClientRect(),actualWidth=rect?.width||400,actualHeight=rect?.height||120,edgeSize=Math.min(actualWidth,actualHeight)*(borderWidth*.5);
    const svg=`<svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="${actualWidth}" height="${actualHeight}" fill="black"/><rect width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})"/><rect width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/><rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth-edgeSize*2}" height="${actualHeight-edgeSize*2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function updateFilter(){
    imageRef.current?.setAttribute('href',displacementMap());
    [[redRef,redOffset],[greenRef,greenOffset],[blueRef,blueOffset]].forEach(([ref,offset])=>{ref.current?.setAttribute('scale',String(distortionScale+offset));ref.current?.setAttribute('xChannelSelector',xChannel);ref.current?.setAttribute('yChannelSelector',yChannel)});blurRef.current?.setAttribute('stdDeviation',String(displace));
  }

  useEffect(()=>{
    const test=document.createElement('div');
    test.style.backdropFilter=`url(#${filterId})`;
    const unsupportedBrowser=/Safari/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)||/Firefox/.test(navigator.userAgent);
    setSupportsSvg(!unsupportedBrowser&&test.style.backdropFilter!=='');
  },[filterId]);
  useEffect(()=>{updateFilter()},[width,height,borderRadius,borderWidth,brightness,opacity,blur,displace,distortionScale,redOffset,greenOffset,blueOffset,xChannel,yChannel,mixBlendMode]);
  useEffect(()=>{if(!containerRef.current)return;const observer=new ResizeObserver(()=>requestAnimationFrame(updateFilter));observer.observe(containerRef.current);return()=>observer.disconnect()},[]);

  return <div ref={containerRef} className={`glass-surface ${supportsSvg?'glass-surface--svg':'glass-surface--fallback'} ${className}`} style={{...style,width:typeof width==='number'?`${width}px`:width,height:typeof height==='number'?`${height}px`:height,borderRadius:`${borderRadius}px`,'--glass-frost':backgroundOpacity,'--glass-saturation':saturation,'--glass-filter':`url(#${filterId})`}}>
    <svg className="glass-surface__filter" aria-hidden="true"><defs><filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%"><feImage ref={imageRef} width="100%" height="100%" preserveAspectRatio="none" result="map"/><feDisplacementMap ref={redRef} in="SourceGraphic" in2="map" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispRed"/><feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/><feDisplacementMap ref={greenRef} in="SourceGraphic" in2="map" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispGreen"/><feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/><feDisplacementMap ref={blueRef} in="SourceGraphic" in2="map" xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispBlue"/><feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/><feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="output"/><feGaussianBlur ref={blurRef} in="output" stdDeviation={displace}/></filter></defs></svg>
    <div className="glass-surface__content">{children}</div>
  </div>;
}
