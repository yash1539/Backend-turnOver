const express = require('express');
const userController = require('../Controller/userControllers');
const getUid = require('../middleware')
const router = express.Router();

//all user route
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/sendMail',userController.sendMailOtp);
router.post('/verifyMail',userController.emailVerify);
router.get('/getCategory', getUid,userController.showCategory)
router.patch('/category/isSelect', getUid,userController.selectDeselectCategory);



module.exports=router