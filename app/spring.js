// Analytic damped oscillator. The source's stiffness/damping/mass values
// drive a GSAP custom ease directly rather than a generic easing preset.
export function springTransition(t){
 if(t.type!=='spring')return {duration:t.duration||.6,ease:'none'};
 const stiffness=t.stiffness||170,damping=t.damping||(t.bounce===0?26:20),mass=t.mass||1;
 const w=Math.sqrt(stiffness/mass),z=damping/(2*Math.sqrt(stiffness*mass));
 const response=time=>{if(z<1){const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*time)*(Math.cos(wd*time)+z*w/wd*Math.sin(wd*time))}if(z===1)return 1-Math.exp(-w*time)*(1+w*time);const a=-w*(z-Math.sqrt(z*z-1)),b=-w*(z+Math.sqrt(z*z-1));return 1-(b*Math.exp(a*time)-a*Math.exp(b*time))/(b-a)};
 let duration=t.duration||.3;if(!t.duration){while(duration<8&&(Math.abs(1-response(duration))>.0005||Math.abs(response(duration+.01)-response(duration))>.00005))duration+=.01;}
 return {duration,ease:p=>p===1?1:response(p*duration)};
}
