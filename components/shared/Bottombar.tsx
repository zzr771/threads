// 本组件是常见的app底部导航栏，只在小屏幕（移动端）中展示
"use client"
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Bottombar() {
  const pathname = usePathname()

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}>
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              {/* 在手机上不显示文字，在平板上显示文字。但是高度不足以支持2行文字，所以只取label的第一个单词 */}
              <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(" ")[0]}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
