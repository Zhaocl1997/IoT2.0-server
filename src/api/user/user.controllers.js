'use strict'

const svgCaptcha = require('svg-captcha')
const User = require('./user.model')
const { svgOptions, svgPath, avatarPath } = require('../../helper/config')
const sharp = require('sharp')
const fs = require('fs')

/**
 * @method register
 * @param { Object } req.body
 * @return { json }
 * @description 注册 || public 
 */
exports.register = async (req, res, next) => {
    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = new User(req.body)
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method login
 * @param { Object } req.body
 * @return { json }
 * @description 登录 || public 
 */
exports.login = async (req, res, next) => {
    // 验证验证码
    if (req.session.randomcode !== req.body.verifyCode) { throw new Error('验证码错误') }

    // 通过email/phone查找用户验证密码并生成令牌
    const user = await User.findByCredentials(req.body)
    const token = await user.generateAuthToken()
    res.json({ code: "000000", data: { token, user } })
}

/**
 * @method logout
 * @param { null } 
 * @return { null }
 * @description 登出 || public
 */
exports.logout = async (req, res, next) => {
    res.json({ code: '000000' })
}

/**
 * @method captcha
 * @param { null }
 * @return { json }
 * @description 获取验证码 || public 
 */
exports.captcha = async (req, res, next) => {
    // 验证码，有两个属性，text是字符，data是svg代码
    svgCaptcha.loadFont(svgPath)
    const svgCode = svgCaptcha.create(svgOptions)
    // 保存到session,忽略大小写'eueh' 
    req.session.randomcode = svgCode.text.toLowerCase()
    res.json({ code: "000000", data: { img: svgCode.data } })
}

/**
 * @method avatar
 * @param { form-data }
 * @return { json }
 * @description 上传头像 || public 
 */
exports.avatar = async (req, res, next) => {
    const avatarName = `${req.user._id}.png`
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()

    fs.writeFile(
        avatarPath + avatarName,
        buffer,
        "binary",
        (err) => {
            if (err) throw err;
            req.user.avatar = process.env.SERVER_URL + 'avatar/' + avatarName
            req.user.save()
            res.json({ code: "000000" })
        })
}

/**
 * @method index
 * @param { Object } req.body
 * @return { json }
 * @description 获取所有用户信息 || admin
 */
exports.index = async (req, res, next) => {
    const sortOrder = req.body.sortOrder || -1
    const sortField = req.body.sortField || 'status'
    const filters = req.body.filters
    const reg = new RegExp(filters, 'i')

    // 按表头排序
    let sortUsers
    switch (sortField) {
        case "role":
            sortUsers = { role: sortOrder }
            break
        case "createdAt":
            sortUsers = { createdAt: sortOrder }
            break
        case "updatedAt":
            sortUsers = { updatedAt: sortOrder }
            break
        case "status":
            sortUsers = { status: sortOrder }
            break
        default:
            break
    }

    const total = await User
        .find({
            $or: [
                { name: { $regex: reg } },
                { email: { $regex: reg } },
                { phone: { $regex: reg } },
            ]
        })
        .countDocuments()

    const data = await User
        .find({
            $or: [
                { name: { $regex: reg } },
                { email: { $regex: reg } },
                { phone: { $regex: reg } },
            ]
        })
        .skip(parseInt((req.body.pagenum - 1) * req.body.pagerow))
        .limit(parseInt(req.body.pagerow))
        .sort(sortUsers)

    res.json({ code: "000000", data: { total, data } })
}

/**
 * @method create
 * @param { Object } req.body
 * @return { json }
 * @description 创建新用户 || admin 
 */
exports.create = async (req, res, next) => {
    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await new User(req.body)
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method read
 * @param { Object } req.body
 * @return { json }
 * @description 获取指定用户 || admin
 */
exports.read = async (req, res, next) => {
    const user = await User.findById(req.user._id, '-status -password -createdAt -updatedAt')
    res.json({ code: '000000', data: user })
}

/**
 * @method update
 * @param { Object } req.body
 * @return { json }
 * @description 更新用户 || admin 
 */
exports.update = async (req, res, next) => {
    // 根据email或phone查找用户 解决email/phone唯一问题
    await User.isExist(req.body)

    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true })
    if (!user) { throw new Error('用户不存在') }
    await user.save()
    res.json({ code: "000000", data: user })
}

/**
 * @method delete
 * @param { Object } req.body
 * @return { json }
 * @description 删除指定用户 || admin
 */
exports.delete = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.body._id)
    if (!user) { throw new Error('用户不存在') }
    await user.remove()
    res.json({ code: '000000', data: user })
}