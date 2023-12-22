webhook允许从服务端向客户端发送请求。当一个事件发生时，webhook会发送一个post请求到客户端，告知事件的发生或数据的变化。这一特性使它取代了传统的轮询方式，使客户端能够实时地获得服务端的数据。一般用于从后端向前端同步数据，使用场景较少。

这里使用webhook来监听来自clerk的消息。当用户加入一个社区，或者所在社区发生变化时，clerk通过webhook发送一个post请求，告知服务端（注意，这里不是客户端，而是本应用所部署的服务端 https://threads-smoky.vercel.app）数据发生了变化。而后服务端调用对应的server action，来修改数据库中的社区信息。这样，clerk中的用户&社区信息，就与数据库中的用户&社区信息保持同步了。

在clerk中，需要配置webhook的endpoint，即一个URL，clerk将使用webhook发送消息到这个URL。这里，根据路径，我们的API route是: /api/webhook/clerk。所以完整的end point URL是：https://threads-smoky.vercel.app/api/webhook/clerk
然后需要勾选我们希望监听的事件类型，这里选择了organization的变化事件、organization invitation相关事件、organization member相关事件。
最后，把webhook启用后，clerk生成的 signing secret 复制到本应用的.evn.local文件中。
