const userModel = require('../Model/userModels');
const prisma = require('../DB/db.config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const register = async (req, res)=> {
  try {
    const { name, email, password } = req.body;
      console.log("data", name,email,password);
    // Validate user input
    if (!name ||!email ||!password) {
      return res.status(400).json({ msg: 'name , email and password are required' });
    }
   ///check user exit
    const isUser = await userModel.findUserByUsername(email);
    if(isUser){
     return res.status(400).json({msg:'user is already exit plz login'});
     }

    // Create user
    const user = await userModel.createUser(name,email, password);
    res.status(201).json({ msg:'user created', data:user.email });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}
const sendMailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    if(!email) return res.status(400).json({msg:"email missing"})
    // Check if email is verified
    const user = await userModel.findUserByUsername(email);
    if (user.emailVerified) {
      return res.status(400).json({ msg: 'Email is already verified' });
    }

    // If email is not verified, send OTP mail
    const mail = await userModel.sendOTP(email);
    if (!mail) {
      return res.status(400).json({ msg: 'Bad request' });
    }

    return res.status(200).json({ msg: 'Mail sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const emailVerify = async (req,res)=>{
try {
  // const email = res.email;
  const { email ,otp } = req.body;
   if(!email || !otp){
   return res.status(401).json({ error: 'invalid email or otp' });
   }
   const verify = await userModel.validateOTP(email,otp);
   if(verify== false){
   return  res.status(400).json({msg:"invalid otp"})
   }
   await prisma.user.update({
    where: { email: email },
    data: { emailVerified: true }
  });
   return res.status(200).json({msg:"user vrifyed plz login",data:true})
} catch (error) {
  return res.status(500).json({ error: 'Internal server error' });
}
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({"msg":"missing params"})
    const user = await userModel.findUserByUsername(email);
    if (!user) {
      res.status(401).json({created:false, error: 'Invalid username or password' });
      return;
    }

    // Check if the email is verified
    if (!user.emailVerified) {
      res.status(401).json({ error: 'Email not verified. Please verify your email before logging in.',emailVerified:false });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id,email:user.email,emailVerified:user.emailVerified }, 'your_secret_key', { expiresIn: '1h' });

    // Send token in response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const createCategory = async (req,res)=> {
try {
  const user = await userModel.createmany();

  return res.status(200).json({mag:true, data:user})
  
} catch (error) {
  res.status(500).json({mag:"internal server error"})
}
} 
const showCategory = async (req, res) => {
  const userId = res.userId;
  const page = parseInt(req.query.page) || 1;
  let ITEMS_PER_PAGE = 6;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { categories: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const totalcat = await prisma.category.findMany();
    const totalPages = Math.floor(totalcat.length/ITEMS_PER_PAGE)
    const totalCategories = user.categories.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCategories);

    const selectedCategories = user.categories.slice(startIndex, endIndex);
    const remainingSpace = ITEMS_PER_PAGE - selectedCategories.length;
    
    const deselectedCategories = await prisma.category.findMany({
      where: { users: { none: { id: userId } } },
      take: remainingSpace,
      skip: Math.max(0, startIndex - totalCategories), // Adjust skip value
    });
  
    res.status(200).json({ 
      SCAT: selectedCategories, 
      DSCAT: deselectedCategories, 
      totalPages:  totalPages
    });
  } catch (error) {
    console.error('Error fetching categories for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const selectDeselectCategory = async (req,res)=>{
  const {categoryId, isSelected } = req.body; // Extract user ID, category ID, and selection status from request body
  const userId = res.userId;
  try {
    let v=''
    if (isSelected) {
      // If isSelected is true, connect the category with the user
      await prisma.user.update({
        where: { id: userId },
        data: { categories: { connect: { id: categoryId } } },
      });
      v='selection'
    } else {
      // If isSelected is false, disconnect the category from the user
      await prisma.user.update({
        where: { id: userId },
        data: { categories: { disconnect: { id: categoryId } } },
      });
      v='deselection'
    }

    res.status(200).json({ message: `Category ${v} updated successfully` });
  } catch (error) {
    console.error('Error updating category selection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  sendMailOtp,
  emailVerify,
  showCategory,
  createCategory,
 selectDeselectCategory
};
