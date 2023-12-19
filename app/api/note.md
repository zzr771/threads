/api目录下的文件将运行在服务端，用以响应客户端的相关http请求，相当于后端。

/api下的文件路径将决定路由，如/api/echo/route.ts，则该文件对应的路由为/api/echo
├── api
│ ├── echo
│ │ ├── route.ts

每个路由都对应一个route.ts文件，该文件用于接收请求和返回数据给客户端。

每个router.ts文件都需要用分别导出的形式编写GET/POST/PUT/DELETE等请求的处理逻辑，如：

```ts
import { NextResponse } from "next/server"

// 处理 /api/echo 下的get请求。 如果处理post请求，把函数名改为“POST”即可
export async function GET(request: Request) {
  const searchParams = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())
  // 使用 NextResponse 是为了防止TS报错。将来可能会变化
  return NextResponse.json({ name: obj.name, content: obj.content })
}
```
