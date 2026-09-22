const {startServer}=require('next/dist/server/lib/start-server');
startServer({dir:__dirname,isDev:true,hostname:'127.0.0.1',port:3001,allowRetry:false});
