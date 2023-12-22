import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/actions/user.actions"
import { fetchCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "@/components/cards/CommunityCard"
import SearchBar from "@/components/shared/SearchBar"

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const user = await currentUser()

  // 如果用户没登陆，clerk会自动将路由重定向到sign-in
  if (!user) return

  const userInfo = await fetchUser(user.id)
  // 如果新用户手动输入路由路径，跳过了onboarding
  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await fetchCommunities({
    searchString: searchParams.q || "",
    pageNumber: Number(searchParams?.page) || 1,
    pageSize: 25,
    sortBy: "desc",
  })

  return (
    <section>
      <h1 className="head-text mt-10">Search</h1>

      <div className="mt-5">
        <SearchBar searchRoute="communities" />
      </div>

      <div className="flex flex-wrap mt-14 gap-9 ">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
