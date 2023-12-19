// 本文件用于创建应用于全局(auth下所有路由组件)的样式和布局

import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "../globals.css"

export const metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Applicatoin",
}

// 使用nextjs优化过的字体加载方式：字体文件将在编译阶段就被下载并和静态assets一起保存，并一起发往客户端，避免了字体文件的http请求
const inter = Inter({ subsets: ["latin"] })

// 声明children类型
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 使用ClerkProvider包裹内容，其内部的组件就可以使用clerk的功能了。
    <ClerkProvider>
      <html lang="en">
        {/* 引入字体。注意这里的样式只在(auth)文件夹内部的路由组件上生效 */}
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full min-h-screen flex justify-center items-center">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  )
}
