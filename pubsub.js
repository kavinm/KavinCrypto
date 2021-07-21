//using pubnub instead of redis because getting redis setup was a hassle on windows

const PubNub = require('pubnub');

const credentials = {
    publishKey = 'pub-c-2bacca64-0dff-4918-8e6b-b8bcf23d472e',
    subscribeKey = 'sub-c-aece7564-e8f0-11eb-b05e-3ebc6f27b518',
    secretKey = 'sec-c-ZTUxYTFiMTgtNmUyOC00YzE5LTg5MTEtYTZiYmRjMTEwMGEw'
};

const CHANNELS = {
    TEST: 'Test',
    TESTTWO: 'TESTTWO'
};

class PubSub{
    constructor(){
        this.pubnub = new PubNub(credentials);

        
        
        //subscribe to the channel
        this.pubnub.subscribe({channels: [Object.values(CHANNELS)] }); //Object.values will return an array of all the values for that object
        
        //listener for the channel
        this.pubnub.addListener(this.listener());
    }

    listener(){
        return{
            //messageObject contains what the message is and channel published to, metadata (timestamp etc)
            message: messageObject =>{
                const {channel, message} = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        };
    }

    //publisher for the channel
    publish({channel, message}){
        this.pubnub.publish({channel, message});
    }
}
module.exports = PubSub;