import aedes from 'aedes';
import http from 'http';
import websocketStream from 'websocket-stream'
import net from 'net'
import optionsBroker from '../interfaces/settings'
import parsePayload from '../helpers/parsePayload'
export class Broker{

    constructor(settings,portBroker,portWebsockets,options = optionsBroker ){
    //params settings
    this.settings=settings
    this.portBroker=portBroker
    this.portWebsockets=portWebsockets
    this.options=options
    //pass settings aeades server
    this.aedesServer=aedes.server(this.settings);
    // create server tcp 
    this.serverMqtt=net.createServer(this.aedesServer.server.handler)
    // http server for websockets
    this.httpServer=http.createServer()
    this.websocketStreamServer=websocketStream.createServer({server:this.httpServer},this.aedesServer.server.handler)

    }
    init=()=>{
        //listening servers
        this.serverMqtt.listen(this.portBroker,()=>console.log(`Server aedes is running in the port ${this.portBroker}`))
        this.httpServer.listen(this.portWebsockets,()=>console.log(`Server Websockets in the port ${this.portWebsockets}`))
    }
    callEvent=(callback,client)=>callback?callback(client):0;
    clientDisconnect=(callback=null)=>{
        this.aedesServer.on('clientDisconnect',(client)=>{
             this.callEvent(this.callEvent,client)

            if(this.options.debug){
                console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', this.aedesServer.server.id)

            }
        })

    }
    clientPublish=(callback=null)=>{
        this.callEvent(this.callEvent,client)

        this.aedesServer.on('publish',(payload,client)=>{
            const payloadConvert=parsePayload(payload);
            if(payload!=null){
                console.log(`Parse payload ${payload}, publisher: ${client.id} `)
            }

        })

    }
    clientConnection=(callback)=>{

    }
   
}