import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import UserCard from "@/components/cards/UserCard"
import SearchBar from "@/components/shared/SearchBar"

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const user = await currentUser()

  // 如果用户没登陆，clerk会自动将路由重定向到sign-in
  if (!user) return

  const userInfo = await fetchUser(user.id)
  // 如果新用户手动输入路由路径，跳过了onboarding
  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q || "",
    pageNumber: Number(searchParams?.page) || 1,
    pageSize: 25,
    sortBy: "desc",
  })

  return (
    <section>
      <h1 className="head-text mt-10">Search</h1>

      <div className="mt-5">
        <SearchBar searchRoute="search" />
      </div>

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
