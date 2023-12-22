import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/actions/user.actions"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()

  // 如果用户没登陆，clerk会自动将路由重定向到sign-in
  if (!user) return

  const userInfo = await fetchUser(params.id)
  // 如果新用户手动输入路由路径，跳过了onboarding
  if (!userInfo?.onboarded) redirect("/onboarding")

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain" />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* TabsTrigger 中的 value 和 TabsContent 的 value 对应。比如当前选中的 TabsTrigger
              的 value = account，那么就展示 value = account 的 TabsContent 中的内容
          */}
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              {/* 需要区分我们是不是thread的创建者，所以传递currentUserId和accountId */}
              <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType="User" />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
