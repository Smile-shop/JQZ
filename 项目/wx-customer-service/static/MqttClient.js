require('./mqttws31');
let _client = null;

export default class {
  constructor({
    hostname = '120.79.224.218', 
    port = 61614, 
    clientId = 'MQTTHelper-asdffsdfsdf15612761654', 
    timeout = 5, 
    keepAlive = 10, 
    cleanSession = false, 
    ssl = false, 
    userName = 'admin', 
    password = 'jqzmq_88', 
    topic = 'jqz/platForm/saveLog'
  } = {}) {
    this.hostname = hostname;
    this.port = port;
    this.clientId = clientId;
    this.timeout = timeout;
    this.keepAlive = keepAlive;
    this.cleanSession = cleanSession;
    this.ssl = ssl;
    this.userName = userName;
    this.password = password;
    this.topic = topic;
  }

  init(onMessageArrived, onConnectionLost, onSuccess, onFailure) {
    try {
      _client = new Paho.MQTT.Client(this.hostname, parseFloat(this.port), this.clientId);
    } catch (error) {
      console.log('您的浏览器不支持MQTT服务！');
    }
    // 监听收到信息的方法
    _client.onMessageArrived = function(e) {
      if(onMessageArrived) {
        onMessageArrived(e, _client);
      } else {
        console.log(e);
      }
    }
    // 监听连接断开的方法
    _client.onConnectionLost = function(e) {
      if(onConnectionLost) {
        onConnectionLost(e, _client);
      } else {
        console.log(e);
      }
    }
    _client.connect({
      useSSL: this.ssl,
      cleanSession: this.cleanSession,
      userName: this.userName,
      password: this.password,
      keepAliveInterval: this.keepAlive,
      timeout: this.timeout,
      onSuccess: function() {
        if(onSuccess) {
          onSuccess(_client);
        } else {
          console.log('MQTT连接成功！')
        };
        // this.clientSubscribe(2);
      },
      onFailure: function() {
        if(onFailure) {
          onFailure(_client);
        } else {
          console.log('MQTT连接失败，请重试！')
        }
      }
    })
  }
  // 订阅主题
  clientSubscribe(qos) {
    console.let(qos)
    // _client.subscribe(this.topic, {
    //   qos: 2
    // })
  }
};

