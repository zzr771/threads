// 本文件的路径是 app/(root)/page.tsx，(root)不出现在路径中，所以本文件对应的路径是"/"
import ThreadCard from "@/components/cards/ThreadCard"
import { fetchPosts } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"

export default async function Home() {
  const user = await currentUser()
  const result = await fetchPosts(1, 30) // 获取最近的30条thread, 不管作者是谁

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found.</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currnetUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
