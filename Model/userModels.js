const prisma = require('../DB/db.config')
const bcrypt = require('bcrypt');
const {faker} = require('@faker-js/faker')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const createUser = async (name,email, password)=> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error creating user',error);
  }
}

const findUserByUsername = async(email)=> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    return false;
  
  }
}

const createmany = async()=>{
  try {
    // Generate 100 categories
    const categories = [];
    for (let i = 0; i < 100; i++) {
      categories.push({ name: faker.commerce.department() });
    }

    // Create multiple categories at once
    const createdCategories = await prisma.category.createMany({
      data: categories,
    });

    return createdCategories;

  } catch (error) {
    throw new Error('Error finding user');
  }
}

const findCategory = async (page) => {
  try {
    const data = await prisma.category.findMany({
      skip: (page - 1) * 6,
      take: 6,
    });
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


const otps = {}; // Temporary storage for OTPs and timestamps

// Generate an 8-digit random code
function generateVerificationCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}
// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'yash@gmail.com',
		pass: 'mewq qqnd mxtv jqew'
	}
});
// Generate and send OTP
async function sendOTP(email) {
  const otp = generateVerificationCode();
  const timestamp = Date.now();
  otps[email] = { code: otp, timestamp: timestamp };
  // Send OTP to the user's email
   // Configure email options
   const mailOptions = {
    from: 'yash@gmail.com',
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${otp}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

// Validate OTP
function validateOTP(email, enteredOTP) {
  if (otps[email]) {
    const { code, timestamp } = otps[email];
    const currentTimestamp = Date.now();
    if (currentTimestamp - timestamp <= 5 * 60 * 1000) { // 5 minutes in milliseconds
      if (code == enteredOTP) {
        return true; // OTP is valid
      }
    }
    // Remove the OTP from storage, whether it's expired or invalid
    delete otps[email];
  }
  return false; // OTP is invalid or expired
}


module.exports = {
  createUser,
  findUserByUsername,
  createmany,
  findCategory,
  sendOTP,
  validateOTP
};
