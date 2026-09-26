'use client';
import {useEffect,useRef,useState} from 'react';
import BlobCursor from './blob-cursor';
export default function PhotoViewer({photo,onClose}){
 const ref=useRef(null);const [cursorTarget,setCursorTarget]=useState(null);
 useEffect(()=>{if(!photo)return;const dialog=ref.current,previous=document.activeElement,overflow=document.body.style.overflow;dialog.showModal();setCursorTarget(dialog);document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=overflow;previous?.focus()}},[photo]);
 if(!photo)return null;
 return <dialog ref={ref} className="photo-viewer" aria-label={photo.alt} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}}>
 {cursorTarget&&<BlobCursor portalTarget={cursorTarget} filterId="photo-viewer-blob" fillColor="#ffffff" innerColor="#ffffff" opacities={[1,1,1]}/>}
 <button autoFocus type="button" className="photo-viewer-close" aria-label="Close photo" onClick={onClose}>×</button>
 <img src={photo.src} alt={photo.alt}/><p>{photo.alt}</p></dialog>;
}
