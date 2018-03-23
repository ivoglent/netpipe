export interface NetworkEventInterface{
    setNetworkName(name : string) : NetworkEventInterface;
    addListener(targetName : string, eventName : string, callback : any);
    triggerEvent(eventName : string, data : any);
    registerEvent(eventName : string, options : any) : Promise<any>;
}