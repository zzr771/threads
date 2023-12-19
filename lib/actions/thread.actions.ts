"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB()

    const newThread = await Thread.create({ text, author, community: null })
    // $push：指令，向数组中push新元素。它是mongoDB driver的内容
    await User.findByIdAndUpdate(author, { $push: { threads: newThread._id } })

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`)
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()

  // calculate the number of posts to skip, depending the pageNumber
  const skipAmount = (pageNumber - 1) * pageSize

  // Fetch the posts that have no parents (top-level threads). Threads with parents are comments.
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } }) // $in 是一个查询操作符，用于在查询文档时匹配某个字段的值是否在指定的数组中。
    .sort({ createdAt: "desc" }) // 搜索结果按createdAt的降序排列 descending
    .skip(skipAmount) // 忽略指定数量的结果（从前往后数）
    .limit(pageSize) // 只要指定数量的结果
    .populate({ path: "author", model: User }) // 获取author属性所关联的 User类型的具体document
    .populate({
      // 在 "children" 字段中关联查询 "author" 字段，并将查询结果中的 "id"、"name"、"parentId" 和 "image" 字段返回。
      // 返回的结果将保存在 children对象的author属性中
      path: "children",
      populate: { path: "author", model: User, select: "_id name parentId image" },
    })

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

  const posts = await postsQuery.exec()
  const hasNextPage = totalPostsCount > skipAmount + posts.length

  return { posts, hasNextPage }
}

export async function fetchThreadById(id: string) {
  connectToDB()

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        // 填充每条评论的详细数据
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          // 评论可能也有评论
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec()
    return thread
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`)
  }
}

// 添加评论。评论本身也是一个thread
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB()

  try {
    // 找到本次新建的评论所属的thread，即评论的是哪一条thread
    const originalThread = await Thread.findById(threadId)
    if (!originalThread) throw new Error(`Thread not found`)

    // 新建评论
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    })
    const savedCommentThread = await commentThread.save()

    // 关联所属thread和本评论thread
    originalThread.children.push(savedCommentThread._id)
    await originalThread.save()

    // 刷新界面
    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }
}
