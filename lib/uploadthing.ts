// 使用库 uploadthing 来完成文件上传的功能
// 本文件内容复制自 uploadthing 官网

import { generateReactHelpers } from "@uploadthing/react/hooks"

import type { OurFileRouter } from "@/app/api/uploadthing/core"

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
