"use client"

import { usePathname, useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form" // 这些组件来自库 shadcn
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form" // 这是一个react表单库，提供表单数据绑定，输入验证，提交等接口（不需单独安装）
import { zodResolver } from "@hookform/resolvers/zod" // Zod 是一个以 TypeScript 为首的模式声明和验证库。 "模式 "广义地指任何数据类型，从简单的字符串到复杂的嵌套对象。配合react-hook-form使用的库，可以简化表单结构的创建方式（不需单独安装）
import * as z from "zod"
import { UserValidation } from "@/lib/validations/user"
import Image from "next/image"
import { ChangeEvent, useState } from "react" // ts类型
import { Textarea } from "../ui/textarea"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from "@/lib/actions/user.actions"

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
export default function AccountProfile({ user, btnTitle }: Props) {
  const [files, setFiles] = useState<File[]>([])
  // 使用uploadthing进行上传，上传的图片将保存在uploadthing的服务器中
  const { startUpload } = useUploadThing("media")
  const router = useRouter()
  const pathname = usePathname()

  // react-hook-form: 可以直接修改form的属性，视图会自动更新。下面的values就是包含表单数据的对象。
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  })

  // 该回调函数读获取用户选择的文件url(base64)，并将其返回
  function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) {
    e.preventDefault() // prevent browser reloading
    const fileReader = new FileReader()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.includes("image")) return

      setFiles(Array.from(e.target.files))

      // 当文件成功读取时，触发fileReader的load事件。event.target.result是图片url(base64)，fileReader.result也一样
      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || ""
        fieldChange(imageDataUrl) // 更新 form.profile_photo
      }

      // readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取成功时触发onload事件。
      fileReader.readAsDataURL(file)
    }
  }

  // 由于绑定了react-hook-form，onSubmit函数会自动获得一个参数values,它包含了表单所有输入项的值
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    // values即form
    // 获取图片内容
    const blob = values.profile_photo
    const hasImageChanged = isBase64Image(blob) // 页面打开时，blob为''，当此函数返回true时，说明用户上传了一个图片

    // 上传完成后，更新视图
    if (hasImageChanged) {
      const imgResponse = await startUpload(files)
      if (imgResponse && imgResponse[0].fileUrl) {
        values.profile_photo = imgResponse[0].fileUrl
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    })

    // 提交完成后，路由跳转
    if (pathname === "/profile/edit") {
      router.back()
    } else {
      // 如果当前路径为 '/onboarding'，那么设置提交后跳转到主页
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          // 关于field的说明，见react-hook-form文档 https://react-hook-form.com/docs/usecontroller
          render={({ field }) => (
            <FormItem className="flex item-center gap-4">
              <FormLabel className="account-form_image-label">
                {
                  // field.value 是 form.profile_photo
                  field.value ? (
                    // priority属性：When true, the image will be considered high priority and preload. Lazy loading is automatically disabled.
                    <Image
                      priority
                      src={field.value}
                      alt="profile photo"
                      className="rounded-full object-contain"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile photo"
                      className="object-contain"
                      width={24}
                      height={24}
                    />
                  )
                }
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                {/* accept="image/*" 表示接收所有类型的图片 */}
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              {/* 展示错误信息的组件，放在每个FormControl下面 */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
              <FormControl>
                <Input type="text" className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
              <FormControl>
                <Input type="text" className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
              <FormControl>
                <Textarea rows={10} className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
