import PostModel from '../models/Post.js';
export const getLastTags = async (req, res) => {
    try{
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Posts fetching error",
        })
    }
}

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Posts fetching error",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: "after" }
        ).populate("user");

        if (!doc) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Post fetching error" });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        // Ищем пост
        const doc = await PostModel.findById(postId);

        if (!doc) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Проверяем, является ли пользователь автором поста или админом
        if (doc.user.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: "No permission to delete this post" });
        }

        // Удаляем пост
        await PostModel.findByIdAndDelete(postId);
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Post deletion error" });
    }
};

export const create = async (req, res) => {
    try {

        console.log(req.body);
        console.log(req.userId);
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl,
        })
        
        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Post creation error",
        })
    }
}

export const update = async (req, res) => {
    try {
        const doc = await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags.split(','),
                imageUrl: req.body.imageUrl,
                user: req.userId,
            },
            { returnDocument: "after" }
        );

        if (!doc) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ success: true, updatedPost: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Post updating error" });
    }
};