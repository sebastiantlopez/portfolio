'use client';

import {useEffect,useRef} from 'react';
import * as THREE from 'three';

const vertexShader=`
varying vec2 v_texcoord;
void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);v_texcoord=uv;}
`;

const fragmentShader=`
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform vec3 u_color;
#define PI 3.14159265358979323846
#define TWO_PI 6.28318530717958647692
#ifndef VAR
#define VAR 0
#endif
vec2 coord(vec2 p){p/=u_resolution.xy;if(u_resolution.x>u_resolution.y){p.x*=u_resolution.x/u_resolution.y;p.x+=(u_resolution.y-u_resolution.x)/u_resolution.y/2.0;}else{p.y*=u_resolution.y/u_resolution.x;p.y+=(u_resolution.x-u_resolution.y)/u_resolution.x/2.0;}p-=0.5;p*=vec2(-1.0,1.0);return p;}
#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse*u_pixelRatio)
float sdRoundRect(vec2 p,vec2 b,float r){vec2 d=abs(p-0.5)*4.2-b+vec2(r);return min(max(d.x,d.y),0.0)+length(max(d,0.0))-r;}
float sdCircle(vec2 st,vec2 center){return length(st-center)*2.0;}
float sdPoly(vec2 p,float w,int sides){float a=atan(p.x,p.y)+PI;float r=TWO_PI/float(sides);float d=cos(floor(0.5+a/r)*r-a)*length(max(abs(p),0.0));return d*2.0-w;}
float fill(float x,float size,float edge){return 1.0-smoothstep(size-edge,size+edge,x);}
float strokeAA(float x,float size,float w,float edge){float afwidth=length(vec2(dFdx(x),dFdy(x)))*0.70710678;float d=smoothstep(size-edge-afwidth,size+edge+afwidth,x+w*0.5)-smoothstep(size-edge-afwidth,size+edge+afwidth,x-w*0.5);return clamp(d,0.0,1.0);}
void main(){vec2 st=st0+0.5;vec2 posMouse=mx*vec2(1.0,-1.0)+0.5;float influence=fill(sdCircle(st,posMouse),u_circleSize,u_circleEdge);float sdf;
if(VAR==0){sdf=strokeAA(sdRoundRect(st,vec2(u_shapeSize),u_roundness),0.0,u_borderSize,influence)*4.0;}
else if(VAR==1){sdf=fill(sdCircle(st,vec2(0.5)),0.6,influence)*1.2;}
else if(VAR==2){sdf=strokeAA(sdCircle(st,vec2(0.5)),0.58,0.02,influence)*4.0;}
else{sdf=fill(sdPoly(st-vec2(0.5,0.45),0.3,3),0.05,influence)*1.4;}
gl_FragColor=vec4(u_color,sdf);}
`;

export default function ShapeBlur({className='',color='#ffffff',variation=0,pixelRatio=1,shapeSize=.58,roundness=.18,borderSize=.018,circleSize=.12,circleEdge=.32}){
  const mountRef=useRef(null),materialRef=useRef(null);

  useEffect(()=>{
    const mount=mountRef.current;if(!mount)return;
    let active=true,frame,last=performance.now();
    const mouse=new THREE.Vector2(-1000,-1000),damped=new THREE.Vector2(-1000,-1000),resolution=new THREE.Vector2();
    const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera();camera.position.z=1;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});renderer.setClearColor(0x000000,0);mount.appendChild(renderer.domElement);
    const geometry=new THREE.PlaneGeometry(1,1);
    const material=new THREE.ShaderMaterial({vertexShader,fragmentShader,defines:{VAR:variation},transparent:true,depthTest:false,uniforms:{u_mouse:{value:damped},u_resolution:{value:resolution},u_pixelRatio:{value:pixelRatio},u_shapeSize:{value:shapeSize},u_roundness:{value:roundness},u_borderSize:{value:borderSize},u_circleSize:{value:circleSize},u_circleEdge:{value:circleEdge},u_color:{value:new THREE.Color(color)}}});
    materialRef.current=material;const quad=new THREE.Mesh(geometry,material);scene.add(quad);
    const resize=()=>{if(!active)return;const width=mount.clientWidth||1,height=mount.clientHeight||1,dpr=Math.min(window.devicePixelRatio,pixelRatio);renderer.setSize(width,height,false);renderer.setPixelRatio(dpr);camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();quad.scale.set(width,height,1);resolution.set(width,height).multiplyScalar(dpr);material.uniforms.u_pixelRatio.value=dpr};
    const move=event=>{const rect=mount.getBoundingClientRect(),inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;if(inside)mouse.set(event.clientX-rect.left,event.clientY-rect.top);else mouse.set(-1000,-1000)};
    document.addEventListener('pointermove',move);const observer=new ResizeObserver(resize);observer.observe(mount);resize();
    const render=now=>{if(!active)return;const delta=Math.min((now-last)/1000,.1);last=now;damped.x=THREE.MathUtils.damp(damped.x,mouse.x,7,delta);damped.y=THREE.MathUtils.damp(damped.y,mouse.y,7,delta);renderer.render(scene,camera);frame=requestAnimationFrame(render)};frame=requestAnimationFrame(render);
    return()=>{active=false;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('pointermove',move);if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement);geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();materialRef.current=null};
  },[variation]);

  useEffect(()=>{const material=materialRef.current;if(!material)return;material.uniforms.u_pixelRatio.value=pixelRatio;material.uniforms.u_shapeSize.value=shapeSize;material.uniforms.u_roundness.value=roundness;material.uniforms.u_borderSize.value=borderSize;material.uniforms.u_circleSize.value=circleSize;material.uniforms.u_circleEdge.value=circleEdge;material.uniforms.u_color.value.set(color)},[color,pixelRatio,shapeSize,roundness,borderSize,circleSize,circleEdge]);

  return <div ref={mountRef} className={className} aria-hidden="true"/>;
}
