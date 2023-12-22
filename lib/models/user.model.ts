import mongoose from "mongoose"

/**
 * 一个User document中会有2个id，一个叫“_id”,一个叫“id”
 *    _id：是任何document在mongoDB中都会被默认添加的唯一标识符
 *     id: 包含在clerk返回的用户信息中。本项目中使用的基本上都是这个属性。如果在各个网站都
 *           用同一个账号，如谷歌账号登录，那么这个id应该是相同的。
 *         这个id属性必须一并保存到数据库中。从clerk获取到用户信息后，使用id属性查询数据库，
 *           才能获取用户的threads等信息。
 */

// The Mongoose Schema constructor
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // 用户昵称
  name: { type: String, required: true }, // 用户姓名
  image: String,
  bio: String,
  // 每个用户可以关联多个Threads，所以threads是数组，而每个Thread是对象
  // 这里使用mongoose内置的类型ObjectId来作为每个Thread的type类型
  // ref: "Thread"，表示关联数据库中Thread collection
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  // 是否完成了onboarding流程
  onboarded: { type: Boolean, default: false },
})

// 如果已经创建过 User model，那就不需要重复创建了
const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
