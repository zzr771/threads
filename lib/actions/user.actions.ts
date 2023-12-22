"use server" // 声明使用 server actions

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import Community from "../models/community.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"

interface userParams {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}
/*
  这里的 Promise<void> 表示函数返回一个Promise，且此promise的成功值为void。即此
    promise的resolve()方法调用时不传递任何参数。
  Promise<void> 一般用在异步且不返回任何值的函数上
*/
export async function updateUser({ userId, username, name, bio, image, path }: userParams): Promise<void> {
  connectToDB()

  try {
    // 找到目标document，并且更新。第一个参数是搜索条件，第二个参数是更新内容，第三个参数是设置
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      // upsert:更新插入：一种数据库操作，如果记录已存在，则更新记录；如果记录不存在，则插入新记录。
      { upsert: true }
    )

    if (path === "/profile/edit") {
      // revalidatePath是nextjs提供的函数。当下一次访问参数路径时，使与该路径相关的缓存数据无效化，这样就会更新缓存
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

// 根据ID查找单个用户
export async function fetchUser(userId: string) {
  try {
    connectToDB()
    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: "Community",
    })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

// 批量查找其它用户
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    // 创建一个查询条件(search criteria)对象
    // FilterQuery是monggose的一个泛型。这里需要查询的是User，需要把User的类型，即typeof User作为参数传递给泛型。
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // ne: not equal to. we don't need current user's threads
    }

    if (searchString.trim().length > 0) {
      const regex = new RegExp(searchString, "i")
      // $or：一个document满足数组中所有条件的任一一个，就算命中
      // 这里的含义是：寻找username满足regex表达式，或者name满足regex表达式的document
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)
    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()
    const hasNextPage = totalUsersCount > skipAmount + users.length

    return { users, hasNextPage }
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

// 查找一位用户发布的threads
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB()
    // find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    })
    return threads
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}

// 获取和一位用户相关的通知(回复)
export async function getActivity(userId: string) {
  try {
    connectToDB()

    // find all threads created by the user
    const userThreads = await Thread.find({ author: userId })
    // collect all the child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children)
    }, [])

    // get all replies, except for the ones created by the user
    const replies = await Thread.find({ _id: { $in: childThreadIds }, author: { $ne: userId } }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    })
    return replies
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }
}
