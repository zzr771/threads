"use client"
import Link from "next/link"
import Image from "next/image"
/*  
  usePathname: a Client Component hook that lets you read the current URL's pathname.
  useRouter: a hook that allows you to programmatically change routes inside Client Components.
*/
import { usePathname, useRouter } from "next/navigation"
import { sidebarLinks } from "../../constants"
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs"

export default function LeftSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  // useAuth是一个钩子，返回一系列关于用户的属性和方法，不发送请求。而currentUser会发送请求来获取用户信息
  const { userId } = useAuth()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          // determine if this link is active. "link.route.length > 1" is to exclude: link.route==="/"
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

          if (link.route === "/profile") link.route = `${link.route}/${userId}`
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}>
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton
            signOutCallback={() => {
              router.push("/sign-in")
            }}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}
