# NetPipe

This module created in order to support communication between services in ```Micro Services architecture``` .
In that case, almost service was located on separated machines.

Netpipe uses socket.io and socket.io-client to make a connection from event host and event listener.

## Installation
```
$ npm i --save netpipe
```

Netpipe uses socket.io and socket.io-client to make a connection from event host and event listener.


## Testing

Run the testing command :
```js
$ npm test
```

## Usage

For example, collector is a module that request and update real-time data from all exchanges.
When it gots new exchange's feed (ohcl). It will trigger an event to inform to all listeners :



```js

let event = new NetworkEvent();
event.setNetworkName('collector').setEnv('development');
event.registerEvent('newFeed').then((result) => {
   //Event registered successfully
});
//Get OHCL from and exchange
onGetNewFeedSuccess().then((feed) => {
    event.triggerEvent('newFeed', {feed : feed});
})

```

Next, analytics is a module which always wait for exchange feed update and recalculate new indicator values.
It needs listen ```newfeed``` event of collector module.

```js
let event = new NetworkEvent();
event.setNetworkName('analytics');
event.addListener('collector', 'newFeed', function(feed) {
    //New feed received. Start recalculate...
});

```

