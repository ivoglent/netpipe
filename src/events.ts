import {NetworkEventInterface} from "./interfaces/network.event.interface";
import {eventServers} from "./configs/server.config";
import {EventDataInterface} from "./components/EventData";
const EventEmitter = require('events');
let serverList = [];
export class NetworkEvent extends EventEmitter implements NetworkEventInterface{
    private name : string = 'unknown';
    private server : any = null;
    private clients : any = {};
    private listenners = {};

    /**
     *
     * @param {string} env
     * @returns {this}
     */
    setEnv(env : string) : NetworkEventInterface {
        serverList = eventServers.setEnv(env).getServerConfigs();
        return this;
    }

    /**
     *
     * @param {string} name
     * @returns {NetworkEventInterface}
     */
    setNetworkName(name: string): NetworkEventInterface {
        this.name = name;
        return this;
    }

    /**
     *
     * @param {string} targetName
     * @param {string} eventName
     * @param callback
     * @returns {any}
     */
    addListener(targetName: string, eventName: string, callback: any) {
        if (serverList[targetName]) {
            let targetUri = serverList[targetName];
            if (targetUri) {
                let socket;
                if (this.clients[eventName]) {
                    console.log('Event client existed');
                    socket = this.clients[eventName];
                } else {
                    let io = require('socket.io-client');
                    socket = io('http://' + targetUri, {
                        reconnection :  true,
                        reconnectionAttempts : 5,
                        reconnectionDelay : 5000,
                        rejectUnauthorized: false,
                        transports: ['websocket'],
                        agent: false,
                        upgrade: false,
                    });
                    console.log('Connecting to', targetUri);
                    socket.on('connect', function(){
                        console.log('Connected', targetName, eventName);
                    });
                    socket.on(eventName, function(data){
                        console.log('Event emitted', targetName, eventName);
                        callback(data);
                    });
                    socket.on('disconnect', function(){
                        console.log('Disconnected', targetName, eventName);
                    });
                    socket.on('reconnect', (num) => {
                        console.log('Error. Reconnecting...' + num, targetName, eventName);
                    });
                    socket.on('connect_error', (error) => {
                        console.log('Connection error', error, targetName, eventName);
                    })
                }

                this.clients[eventName] = socket;
                return socket;
            } else {
                console.log('No event listener', targetName, eventName);
            }
        }
        console.log('Listen failed');
        return false;
    }

    /**
     *
     * @param {string} eventName
     * @param {EventDataInterface} message
     */
    triggerEvent(eventName: string, message : EventDataInterface) {
        if (this.listenners[eventName]) {
            console.log('Triggering event', eventName);
            if (this.listenners[eventName].length > 0) {
                let i = 0;
                this.listenners[eventName].forEach(function (socket) {
                    socket.emit(eventName, message);
                    i++;
                });
                console.log("Emitted message to", i, " clients");
            } else {
                console.log("No client connected. Ignoring..");
            }

        }
    }

    /**
     *
     * @param {string} eventName
     * @param options
     * @returns {Promise<any>}
     */
    registerEvent(eventName: string, options: any) : Promise<any> {
        let self = this;
        return new Promise(((resolve, reject) => {
            if (typeof (serverList[self.name]) == 'undefined') {
                console.log('Invalid network name');
                return reject(false);
            }
            if (self.server != null) {
                return resolve(true);
            }

            let ipPort = serverList[self.name].split(':');
            self.server = require('socket.io')();
            self.server.on('connection', function(client){
                console.log('New client listened event', eventName);
                self.addClient(eventName, client);
            });
            self.server.use(function(socket, next){
                let ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress || socket.conn.remoteAddress || socket.request.connection.remoteAddress;
                if (ip) {
                    let p = ip.match(/:([0-9\.]+)$/);
                    if (p) {
                        ip = p[1];
                        for (let name in serverList) {
                            let svIps = serverList[name];
                            if (Array.isArray(svIps)) {
                                let check = false;
                                svIps.forEach(function (svIp) {
                                    if ((new RegExp('^' + ip)).test(svIp)) {
                                        check = true;
                                    }
                                });
                                if (check) {
                                    return next();
                                }
                            } else {
                                if ((new RegExp('^' + ip)).test(svIps)) {
                                    return next();
                                }
                            }

                        }
                    }
                }
                next(new Error('Authentication error'));
            });
            self.server.listen(ipPort[1]);
            console.log('Event listening', eventName, ipPort);
            resolve(true);
        }));
    }

    /**
     *
     * @param event
     * @param client
     */
    private addClient(event, client) {
        if (typeof (this.listenners[event]) == 'undefined') {
            this.listenners[event] = [];
        }
        if (this.listenners[event].indexOf(client) < 0) {
            let self = this;
            client.on('disconnect', function(){
                delete self.listenners[event][self.listenners[event].indexOf(client)];
                console.log("Client", client.id, " was disconnected");
            });
            this.listenners[event].push(client);
        }
    }

}
