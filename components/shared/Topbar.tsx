"use client"
import Image from "next/image" // nextjs中的图片组件，在大小、懒加载方面均有优化
import Link from "next/link" // 同react中的Link组件，也是用于路由导航
import { useRouter } from "next/navigation"
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes" // 引入主题来修改clerk组件的颜色

export default function Topbar() {
  const router = useRouter()
  return (
    <nav className="topbar">
      <Link href="/" className="flex item-center gap-4">
        {/* 以"/"开头的路径将解析为public文件夹 */}
        <Image src="/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          {/* 只有当用户登录后，被 SignedIn 组件包裹的子组件才会显示 */}
          <SignedIn>
            <SignOutButton
              signOutCallback={() => {
                router.push("/sign-in")
              }}>
              <div className="flex cursor-pointer">
                <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* The <OrganizationSwitcher /> component is used to enable the ability to switch
           between available organizations the user may be part of in your application. */}
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  )
}
