//using pubnub instead of redis because getting redis setup was a hassle on windows

const redis = require("redis");

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        //second parameter is a callback function that fires everytime a message is received
        this.subscriber.on("message", (channel, message) =>
            this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(
            `Message received. Channel: ${channel}. Message: ${message}.`
        );

        const parsedMessage = JSON.parse(message);

        if(channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    //subscribes to all channels
    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel =>{
            this.subscriber.subscribe(channel);
        });
    }
    // unsubscribe temporarily to not have the message sent to the publisher
    publish({channel, message}){
        this.subscriber.unsubscribe(channel, () =>{
            this.publisher.publish(channel, message, () =>{
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain(){
        this.publish({
            channel : CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;
