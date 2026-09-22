import Personal from '../../personal';
import {notFound} from 'next/navigation';
export default async function Page({params}){const {slug}=await params;if(!['plant-drainage','wind-turbine','vending-machine'].includes(slug))notFound();return <Personal page="project" slug={slug}/>}
