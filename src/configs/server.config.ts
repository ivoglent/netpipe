class ServerList {
    private servers = {
        //Example
        development : {
            db : '127.0.0.1:8080',
            collector : '127.0.0.1:8081',
            trader : '127.0.0.1:8082',
            thinker : '127.0.0.1:8083',
            processor : '127.0.0.1:8084',
            semi : '127.0.0.1:8085'
        },
        testing : {
            db : '192.168.1.100:2501',
            collector : '172.21.29.173:2501',
            trader : '172.21.29.172:2501',
            thinker : '192.168.1.103:2501',
            processor : '172.21.29.176:2501',
            semi : '172.21.29.169:2501'
        },
        production : {
            db : '192.168.1.100:8080',
            collector : '192.168.1.101:8081',
            trader : '192.168.1.102:8082',
            thinker : '192.168.1.103:8083',
            processor : '192.168.1.104:8084',
            semi : '192.168.1.105:8085'
        }
    };

    /**
     *
     * @param {string} env
     */
    public constructor(public env: string = null) {
        if (!env) {
            this.env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
        }
    }

    /**
     *
     * @param {string} env
     * @param servers
     */
    setConfig(env: string, servers : any) {
        this.servers[env] = servers;
    }
    /**
     *
     * @param {string} env
     * @returns {this}
     */
    public setEnv(env : string) {
        this.env = env;
        return this;
    }

    /**
     *
     * @returns {any}
     */
    public getServerConfigs() {
        return this.servers[this.env];
    }
}

export const eventServers = new ServerList();
