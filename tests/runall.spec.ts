import { expect } from 'chai';
import 'mocha';
import {NetworkEvent} from "../src/events";

let event = new NetworkEvent();
event.setEnv('development');
describe('Testing listener', () => {
   it('Testing event listener', (done) => {
        event.setNetworkName('collector');
        event.registerEvent('newFeed', {}).then(function (result) {
            if (result) {
                console.log('Network event started');
            } else {
                console.log('Network event start failed');
            }
            expect(result).to.be.true;
            done();
        }, function (error) {
            console.log(error);
            expect(error).to.be.true;
            done();
        });
   });

   it('Testing network event listening', (done => {
       event.addListener('collector', 'newFeed', function (feed) {
           console.log('Received feed', feed);
       });
       done();
   }));

   it('Testing trigger event', (done) => {
       setTimeout(function () {
           event.triggerEvent('newFeed', {
               data : {},
               from:  '',
               to: 'all',
               error: false,
               message: 'Success request',
               event : 'NONE'
            });

       }, 3000);
       setTimeout(done, 6000);
   })
});