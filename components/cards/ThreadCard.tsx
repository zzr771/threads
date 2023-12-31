import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import DeleteThread from "../forms/DeleteThread"

interface Props {
  id: string
  currnetUserId: string
  parentId: string | null
  content: string
  author: {
    name: string
    image: string
    id: string
  }
  community: {
    name: string
    image: string
    id: string
  } | null
  createdAt: string
  comments: {
    author: {
      image: string
    }
  }[]
  isComment?: boolean // 该组件可以用于展示thread，也可以用于展示评论。用这个标志位来区分
}

export default function ThreadCard({
  id,
  currnetUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7 mt-6" : "bg-dark-2 p-7"}`}>
      <div className="flex item-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              {/* fill属性: 图片将自动填充父元素的长宽。一般用于宽高未知的情况 */}
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {author.id === currnetUserId && <DeleteThread threadId={JSON.stringify(id)} parentId={parentId} />}
      </div>

      {/* commenter avatars */}
      {comments.length > 0 && (
        <Link href={`/thread/${id}`} className="flex items-center ml-1 mt-3 gap-2">
          {comments.slice(0, 3).map((comment, index) => (
            <Image
              key={index}
              alt="avatar"
              src={comment.author.image}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}
          <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
        </Link>
      )}

      {/* time and community name */}
      {!isComment && community ? (
        <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>
          <Image
            src={community.image}
            alt={community.name}
            width={24}
            height={24}
            className="ml-1 rounded-full object-cover !h-[24px]"
          />
        </Link>
      ) : (
        <p className="mt-5 text-subtle-medium text-gray-1">{formatDateString(createdAt)}</p>
      )}
    </article>
  )
}
