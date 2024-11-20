import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"

export const signup = async (req, res) => {
  const { name, email, username, phone, password, confirmPassword} = req.body;

  console.log(name, email)
  
  if(password !== confirmPassword) {
    return res.status(400).json({message:"Passwords are not the same"}) 
  }

  //use mongoose unique messages instead 

  //checking signup data for duplicate existing already in db
  const existingEmailUser = await User.findOne({email});
  if(existingEmailUser?.email === email) return res.status(400).json({message: "An account with the email already exist"})

  const existingUsernameUser = await User.findOne({ username });
  if(existingUsernameUser?.username === username) return res.status(400).json({message: "Username already exist"})

  const existingPhoneUser = await User.findOne({ phone });
  if(existingPhoneUser?.phone === phone) return res.status(400).json({message: "An account with the phone no already exist"})


  try {
    //Password Hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        name, 
        email, 
        phone, 
        username, 
        password: hashedPassword
    });

    //Response
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  try {
    //Check if user exist
    const user = await User.findOne({ email }).select("+password");

    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    //Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }
    //Generate token and send
    const expiryTime = 1000 * 60 * 60 * 24 * (process.env.JWT_EXPIRY * 1);

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: expiryTime }
    );

    const { password: userPassword, ...userInfo } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: expiryTime, //one week expiry
        secure: process.env.NODE_ENV === "production" ? true : false, //for production on a https connection mode
      })
      .status(200)
      .json({ message: "Login successful", data: {...userInfo} });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login" });
  }
};


export const changePassword = async (req, res) => {
  const id = req.userId;
  
  const {currentPassword, password} = req.body;

  if(currentPassword === password) {
    return res.status(400).json({ message: "Passwords are the same!" });
  }
  
  try {
    // const confirmUser = await prisma.user.findUnique({ where: { id } });
    const confirmUser = await User.findById(id).select("+password");

    if (!confirmUser) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    //Check if password is correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      confirmUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    //Password Hashing
    const updatedPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(id, {password: updatedPassword});

    res.status(200).json({ message: "Password changed successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to change Password" });
  }
};


export const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout successful"})
};
