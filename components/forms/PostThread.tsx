"use client"

// 在React中构建表单大同小异：使用useForm来绑定表单控件，然后布置所需的表单控件，使用一个按钮来提交，使用zod进行用户输入校验
import { useForm } from "react-hook-form" // 这是一个react表单库，提供表单数据绑定，输入验证，提交等接口（不需单独安装）
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form" // 这些组件来自库 shadcn
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod" // Zod 是一个以 TypeScript 为首的模式声明和验证库。 "模式 "广义地指任何数据类型，从简单的字符串到复杂的嵌套对象。配合react-hook-form使用的库，可以简化表单结构的创建方式（不需单独安装）

import { usePathname, useRouter } from "next/navigation"
// import { updateUser } from "@/lib/actions/user.actions"
import { ThreadValidation } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thread.actions"

interface Props {
  user: {
    id: string
    objectId: string
    username: string
    name: string
    bio: string
    image: string
  }
  btnTitle: string
}

export default function PostThread({ userId }: { userId: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  })

  async function onSubmit(values: z.infer<typeof ThreadValidation>) {
    await createThread({ text: values.thread, author: userId, communityId: null, path: pathname })

    router.push("/")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  )
}
