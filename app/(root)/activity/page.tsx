import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser, getActivity } from "@/lib/actions/user.actions"
import Link from "next/link"
import Image from "next/image"

export default async function Page() {
  const user = await currentUser()

  // 如果用户没登陆，clerk会自动将路由重定向到sign-in
  if (!user) return

  const userInfo = await fetchUser(user.id)
  // 如果新用户手动输入路由路径，跳过了onboarding
  if (!userInfo?.onboarded) redirect("/onboarding")

  const activity = await getActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text mt-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((item) => (
              <Link key={item._id} href={`/thread/${item.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={item.author.image}
                    alt="Profile Picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{item.author.name}</span> replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  )
}
