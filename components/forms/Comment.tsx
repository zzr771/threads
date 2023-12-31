"use client"

import { useForm } from "react-hook-form" // 这是一个react表单库，提供表单数据绑定，输入验证，提交等接口（不需单独安装）
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form" // 这些组件来自库 shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod" // Zod 是一个以 TypeScript 为首的模式声明和验证库。 "模式 "广义地指任何数据类型，从简单的字符串到复杂的嵌套对象。配合react-hook-form使用的库，可以简化表单结构的创建方式（不需单独安装）

// import { updateUser } from "@/lib/actions/user.actions"
import { CommentValidation } from "@/lib/validations/thread"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { addCommentToThread } from "@/lib/actions/thread.actions"

interface Props {
  threadId: string
  currentUserImg: string
  currentUserId: string
}

export default function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  })

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)

    // 重置表单项的内容
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}
