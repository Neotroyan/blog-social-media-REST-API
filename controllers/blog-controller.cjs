const User = require("../model/User.cjs");

const Blog = require('../model/Blog.cjs')
const mongoose = require('mongoose');

const getAllBlogs = async(req, res, next) => {
    var blogs;
    try{
        blogs = await Blog.find();
    } catch(err) {
        return console.log(err);
    }
    if(!blogs) {
        return res.status(404).json({message: "No blogs found"})
    }
    return res.status(200).json({blogs})
}

const addBlog = async(req, res, next) => {
    const {title, description, image, user} = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        console.log(err)
    }
    if(!existingUser) {
        return res.status(400).json({message: "Unable to find user by this id"})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    })
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        return console.log(err)
    }
    return res.status(201).json({blog})
}

const updateBlog = async(req, res, next) => {
    const {title, description} = req.body;
    const blogId = req.params.id;
    var blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch (err) {
        console.log(err)
    }
    if(!blog) {
        return res.status(404).json({message: "Blog not found"})
    }
    return res.status(200).json(blog)

}

const getById = async(req, res, next) => {
    const id = req.params.id;
    var blog;
    try {
        blog = await Blog.findById(id);
    } catch(err) {
        return console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message: "No blog found"})
    }
    return res.status(200).json({blog})
}

const deleteBlog = async(req, res, next) => {
    const id = req.params.id;
    var blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch(err) {
        console.log(err)
    }
    if(!blog) {
        return res.status(404).json({message: "No blog found"})
    }
    return res.status(204).json({message: "Deleted blog successfully"});
    console.log("Deleted blog successfully");
}

const getByUserId = async(req, res, next) => {
    const userId = req.params.id;
    var userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (err) {
        console.log(err)
    }
    if(!userBlogs) {
        return res.status(404).json({message: "No blog found"})
    }
    return res.status(200).json({blogs:userBlogs})
}

module.exports = {getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId};