# vue-signalr

## Thanks [@latelierco/vue-signalr (github.com)](https://github.com/latelierco/vue-signalr#readme)

## 关于项目说明

个人在使用 @latelierco/vue-signalr 时发现了一些问题, 于是 clone 下项目进行了一些改进

## 问题的复现

- 在 main.js 下

  ```javascript
  import VueSignalR from './utils/signalR'
  Vue.use(VueSignalR, process.env.VUE_APP_BASE_API + 'hub/message')
  ```

- 在 app.vue

  ```js
  created() {
    // 启动
    this.$socket.start()
  	// 监听 init 事件
    this.$socket.on('init', () => {
    	console.log('init')
    })
  	// 监听 reconnect 事件
    this.$socket.on('reconnect', () => {
    	console.log('reconnect')
    })
  	// 输出 $socket
    console.log(this.$socket)
  },
  sockets: {
    // 监听 ReceiveMessage 事件
  	ReceiveMessage(data) {
    	console.log(data)
    }
  }
  ```

- 当我编辑多次 app.vue 然后保存

  ![image-20201221112232103](http://images.wynnyo.com/Markdown/image-20201221112232103.png?x-oss-process=style/wynnyo-style)

- 这时我断开后端

  ![image-20201221112447020](http://images.wynnyo.com/Markdown/image-20201221112447020.png?x-oss-process=style/wynnyo-style)

- 查看 $socket, 发现 event 注册了多次

  ![image-20201221112816365](http://images.wynnyo.com/Markdown/image-20201221112816365.png?x-oss-process=style/wynnyo-style)

## 分析原因

热启动不会重新启动一个 app, 只会把当前组件销毁并重启, 由于 $socket 是绑定到 *Vue* 和 *Vue.prototype* 上的, 所以会出现这个问题

## 解决问题

- 在源码中加入

  ```javascript
  /**
  * 同一种消息只定义一次
  *
  * @param {string| symbol} event
  * @param {(...args: any[]) => void} listener
  * @memberof SocketConnection
  */
  one(event, listener) {
  	if (this.listeners(event).length === 0) {
  		this.on(event, listener)
  	}
  }
  
  Vue.mixin({
  	created() {
  		if (this.$options.sockets) {
  			const methods = Object.getOwnPropertyNames(this.$options.sockets)
  			methods.forEach(method => {
  				Socket.listen(method)
           // 使用 one 代替 on
  				Socket.one(method, data => this.$options.sockets[method].call(this, data))
  			})
  		}
  
  		if (this.$options.subscribe) {
  			Socket.one('authenticated', () => {
  				this.$options.subscribe.forEach(channel => {
  					Socket.invoke('join', channel)
  				})
  			})
  		}
  	}
  })
  ```

- 其他监听也许要修改

- 修改 app.vue

  ```javascript
  created() {
    // 启动
    this.$socket.start()
  	// 监听 init 事件
    this.$socket.one('init', () => {
    	console.log('init')
    })
  	// 监听 reconnect 事件
    this.$socket.one('reconnect', () => {
    	console.log('reconnect')
    })
  	// 输出 $socket
    console.log(this.$socket)
  },
  ```


## 其他修改

### 关于 *SocketConnection* 实例 和 HubConnection 实例讨论

- 个人观点: 在 app 中应该只有一个 *SocketConnection* 和 HubConnection 实例

- 现有项目: 实现了 只有一个 *SocketConnection* 实例, 未实现只有一个 HubConnection 实例

- 出现的问题, 在 断开 signal server 端时, 出现 init 和 reconnect 事件是无限循环

- 修改: 

  - 把 build HubConnection 实例放到 start 方法中, 并判断 socket 不为空时才创建

    ```javascript
    async start(options = {}) {
      this.options = Object.assign(defaultOptions, options)

      // 组件重新加载时, 如果 socket 存在, 不需要新建
      if (!this.socket) {
        this.socket = new SignalR.HubConnectionBuilder()
          .configureLogging(SignalR.LogLevel.Information)
          .withUrl(this.connection, this.options)
          .build()

        this.socket.onclose(async () => {
          this.offline = true
          await this._initialize()
        })
    
      await this._initialize()
      }
    }
    ```
    
  - 在 *_initialize* 方法中, 只做 HubConnection 的启动

    ```javascript
    async _initialize() {
      try {
        await this.socket.start()
      } catch (error) {
        // 这里把重试改为了 5s, 减小客户端压力
        setTimeout(async () => {
          await this._initialize()
        }, 5000)
      }
    }
    ```

- 其他修改

  - init 事件监听更名为 onstart
  - reconnect 事件监听更名为 onrestart
  - 新增事件监听 onclose


## 安装


```console
$ npm install @wynnyo/vue-signalr --save
```

## Get started


```js
import Vue from 'vue'
import VueSignalR from '@wynnyo/vue-signalr'

Vue.use(VueSignalR, 'SOCKET_URL');

new Vue({
  el: '#app',
  render: h => h(App),
  
  created() {
    this.$socket.start({
      log: false // Active only in development for debugging.
    });
    // socket 链接触发事件
		this.$socket.one('onstart', () => {
		})
    // socket 断开链接触发的事件
		this.$socket.one('onclose', () => {
		})
		// socket 重新链接触发事件
		this.$socket.one('onrestart', () => {
		})
  },
});
```

## 在其他组件中使用

```js
Vue.extend({

  ...
  
  methods: {
  
    someMethod() {
      this.$socket.invoke('socketName', payloadData)
        .then(response => {
          ...
        })
    }
    
    async someAsyncMethod() {
      const response = await this.$socket.invoke('socketName', payloadData)
      ...
    }
    
  },

  // Register your listener here. 
  sockets: {
  
    // Equivalent of
    // signalrHubConnection.on('someEvent', (data) => this.someActionWithData(data))
    someEvent(data) {
      this.someActionWithData(data)
    }
    
    otherSomeEvent(data) {
      this.otheSomeActionWithOtherSomeData(data)
    }
    
  }

});
```
