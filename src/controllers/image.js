const path = require('path');
const md5 = require('md5');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const { image, comments } = require('../model/index');
const ctrl = {};

ctrl.index = async (req, res) => {
    const ViewModel = { images : {} , comments : {}};
    const images = await image.findOne({filename : {$regex : req.params.image_id }});
    if(images)
    {
        images.views += 1;
        ViewModel.images = images;
        await images.save();
        const comment = await comments.find({image_id : images._id})
        ViewModel.comments = comment;
        res.render('image', ViewModel);
    }
    else
    {
        res.redirect('/');
    }
};
ctrl.create =  async (req, res) => {     
        const imgUrl = randomNumber();
        const ImageSaved = await image.find({ filename: imgUrl});
        if (ImageSaved.length > 0) {
            create();
        }
        else {
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const NewImage = new image(
                    {
                        title: req.body.title,
                        filename: imgUrl + ext,
                        description: req.body.description
                    }
                );
                const imgSaved = await NewImage.save();
                res.redirect('/images/' + imgUrl);
            }
            else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only Images are Allowed' });
            }
        }
};

ctrl.like = async (req, res) => {
    const imagen = await image.findOne({filename : {$regex : req.params.image_id}});
    if(imagen)
    {
        imagen.likes += 1;
        await imagen.save();
        res.json({likes : imagen.likes});
    }
    else
    {
        res.status('500').json({error : 'Error Interno'});
    }
};

ctrl.comment = async (req, res) => {
    const imagen = await image.findOne({filename : {$regex : req.params.image_id}});
    if(imagen)
    {
        const NewComment = new comments(
            {
                name : req.body.name,
                mail : req.body.mail,
                comment : req.body.comment
            }
        );
        NewComment.gravatar = md5(NewComment.mail);
        NewComment.image_id = imagen._id;
        console.log(req.body);
        await NewComment.save();
        res.redirect('/images/' + imagen.uniqueId );
    }
    else
    {
        res.redirect('/');
    }
};

ctrl.remove = async (req, res) => {
    const imagen = await image.findOne({filename : {$regex : req.params.image_id}});
    if(imagen)
    {
        await fs.unlink(path.resolve('./src/public/upload/' + imagen.filename));
        await comments.deleteOne({image_id : imagen._id});
        await imagen.remove();
        res.json(true);
    }
};
module.exports = ctrl;