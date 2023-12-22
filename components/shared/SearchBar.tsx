"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"

type routers = "search" | "communities"
export default function SearchBar({ searchRoute }: { searchRoute: routers }) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        router.push(`/${searchRoute}?q=${searchTerm}`)
      } else {
        router.push(`/${searchRoute}`)
      }
      return () => clearTimeout(timer)
    }, 300)
  }, [searchTerm])

  return (
    <div className="searchbar">
      <Image src="/assets/search-gray.svg" width={24} height={24} className="object-contain" alt="search" />
      <Input
        value={searchTerm}
        placeholder={searchRoute === "search" ? "Search Users" : "Search Communities"}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="no-focus searchbar_input"
      />
    </div>
  )
}
