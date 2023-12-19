import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.actions"

async function Page() {
  const user = await currentUser()

  // 如果用户没登陆，clerk会自动将路由重定向。到哪里？
  if (!user) return

  const userInfo = await fetchUser(user.id)
  // 如果新用户手动输入路由路径，跳过了onboarding
  if (!userInfo?.onboarded) redirect("/onboarding")

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  )
}
export default Page
