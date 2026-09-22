'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import fragment from './shader-source';
import {cubicBezier} from './bezier';
export default function Shader({style,className}){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true});if(!gl)return;
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
  const program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,'#version 300 es\nlayout(location=0) in vec4 a_position;void main(){gl_Position=a_position;}'),fs=compile(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  const uniform=(name,value)=>{const p=gl.getUniformLocation(program,name);if(Array.isArray(value)){if(value.length===4)gl.uniform4fv(p,value);else gl.uniform2fv(p,value)}else gl.uniform1f(p,value)};
  Object.entries({u_scale:.48,u_rotation:0,u_color1:[0,0,0,1],u_color2:[1,1,1,1],u_color3:[0,0,0,1],u_proportion:.33,u_softness:1,u_shape:2,u_shapeScale:.48,u_distortion:.08,u_swirl:.65,u_swirlIterations:5}).forEach(([k,v])=>uniform(k,v));
  let time=-2350/120;const speed=cubicBezier(.65,0,.88,.77)(.2)*5;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);gl.viewport(0,0,canvas.width,canvas.height);uniform('u_resolution',[canvas.width,canvas.height]);uniform('u_pixelRatio',d)};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();const render=(_,delta)=>{if(!reduced)time+=delta/1000*speed;uniform('u_time',time);gl.drawArrays(gl.TRIANGLES,0,6)};gsap.ticker.add(render);
  return()=>{gsap.ticker.remove(render);observer.disconnect();gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)};
 },[]);return <canvas ref={ref} className={className} style={{width:'100%',height:'100%',...style}} aria-hidden="true"/>;
}
