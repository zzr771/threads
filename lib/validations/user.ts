import * as z from "zod"

export const UserValidation = z.object({
  // 要求profile_photo必须是string类型，格式符合url，并且不能为空字符串
  profile_photo: z.string().url().min(1),
  // profile_photo: z.string().url().nonempty(), // nonempty应该不能用在这里，zod文档说这是用在Array上的
  // 限制name的长度在3到30之间。还可以添加提示文本
  name: z.string().min(3, { message: "Name must contain more than 3 charaters." }).max(30),
  username: z.string().min(3, { message: "Username must contain more than 3 charaters." }).max(30),
  bio: z.string().min(3).max(1000),
})
