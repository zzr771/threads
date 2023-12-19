import mongoose from "mongoose"

// The Mongoose Schema constructor
const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  /*
    Thread分为两种：一种是普通thread，相当于贴吧里发的一篇帖子，另一种是回复，相当于回帖。
      两种都是thread。不过回复thread多了一个 parentId 属性，标记它回复的是哪一篇thread
    结构：
      Thread Original
        -> Thread Comment1
        -> Thread Comment2
          -> Thread Comment Comment 1
  */
  parentId: {
    type: String,
  },
  //  本thread的回复
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
})

// 如果已经创建过 Thread model，那就不需要重复创建了
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema)
export default Thread
