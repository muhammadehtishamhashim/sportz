import { WebSocket, WebSocketServer } from 'ws';
import { wsArcjet } from '../arcjet.js';

function sendJson(socket,payload){
  if(socket.readyState!==WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss,payload){
  for(const client of wss.clients){
    if(client.readyState!==WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  }
}

export function createWebSocketServer(server){
  const wss = new WebSocketServer({ server, path:'/ws', maxPayload: 1024 * 1024 });

  wss.on('connection', async(socket, req)=>{
    if(wsArcjet){
      try{
        const decision = await wsArcjet.protect(req);
        if(decision.isDenied()){
          const code = decision.reason.isRateLimit() ? 1013 : 1008;
          const reason = decision.reason.isRateLimit() ? 'Rate limit exceeded' : 'Access denied';
          socket.close(code, reason);
          return;
        }
      }catch(e){
        console.error('WS connection error', e);
        socket.close(1011, 'Server security error');
        return;
      }
    }

    socket.isAlive = true;
    socket.on('pong', ()=>{ socket.isAlive = true; });
    socket.on('error', console.error);

    sendJson(socket,{
      type:'connected',
      message:'WebSocket connected to Sports Dashboard'
    });

    socket.on('message', (rawMessage)=>{
      const message = rawMessage.toString();
      sendJson(socket,{ type:'echo', message });
    });
  });

  const interval = setInterval(()=>{
    wss.clients.forEach((socket)=>{
      if(socket.isAlive===false) return socket.terminate();
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  wss.on('close', ()=> clearInterval(interval));

  return {
    wss,
    broadcast: (payload)=>broadcast(wss,payload)
  };
}

