import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
            if(existingUser){
                return res.status(400).json({ error: "Username is already taken" })
            }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({ error: "email already exists" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email:newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
            })
        }else{
            res.status(400).json({ error: "Invalid user data"  });
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ error: "Invalid user data"  });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailer = await User.findOne({ email });

        // Check if user exists and the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, emailer?.password || "");
        if (!emailer || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" }); // Add return to prevent further execution
        }

      // Generate token and set cookie
      generateTokenAndSetCookie(emailer._id, res);

        res.status(200).json({
            _id: emailer._id,
            email: emailer.email,
            followers: emailer.followers,
            following: emailer.following,
            profileImg: emailer.profileImg,
        });
    } catch (error) {
      console.error("Error in login controller", error.message);
      return res.status(500).json({ error: "An error occurred during login" }); // Add return here as well
        
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1})
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error in login controller", error.message);
      res.status(500).json({message:"Internal server error"})
    }
}

export const getMe = async (req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user);
    } catch (error) {
      console.error("Error in getme controller", error.message);
      res.status(500).json({message:"Internal server error"})
    }
}