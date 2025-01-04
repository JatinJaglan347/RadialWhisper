import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      uniqueTag: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z0-9]+$/, // Capital letters and numbers only
      },
      profileImageURL: {
        type: String,
        default: function () {  
          const defaultSeed = `${Math.random()*100}`; // Fallback seed for default profile image
          return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${defaultSeed}`;
      },
      },
      bio: {
        type: [String], // Predefined options only, stored as an array
        default: [],
      },
      locationRadiusPreference: {
        type: Number,
        default: function () {
          return 100; // Default value; can be dynamically fetched from an admin-configurable source
        },
      },
      currentLocation: {
        latitude: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
      },
      previousLocation: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
      locationUpdatedAt: {
        type: Date,
        default: Date.now,
      },
      userRole: {
        type: String,
        enum: ['admin', 'moderator', 'normalUser'],
        default: 'normalUser',
      },
      friendList: [
        {
          friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User collection
          },
          since: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      friendRequests: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // User that has sent the request
            required: true,
          },
          status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
        immutable: true, // Prevents this field from being updated
      },
      updatedAt: {
        type: Date,
      },
      active: {
        type: Boolean,
        default: false, // Indicates if the user is currently active on the site
      },
      refreshToken: {
        type: String,
      },  
});



userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password , 10)
    next()
});

// Middleware to automatically update `updatedAt` only when specific fields change
userSchema.pre('save', function (next) {
  if (this.isModified('fullName') || this.isModified('gender') || this.isModified('bio')) {
    this.updatedAt = Date.now();
  }
  next();
});

userSchema.methods.updateLocation = function (latitude, longitude) {
  this.previousLocation = this.currentLocation;
  this.currentLocation = { latitude, longitude };
  this.locationUpdatedAt = Date.now();

  // Regenerate the profile picture based on the new location (random seed based on current location)
  const seed = `${latitude}-${longitude}+${Math.random()*100}`; // Combine latitude and longitude to create a unique seed
  this.profileImageURL = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

  // Save the updated user
  return this.save();
};

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccesToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName: this.fullName,
            uniqueTag:this.uniqueTag,
            gender:this.gender,
            profileImageURL:this.profileImageURL,
            bio:this.bio,
            currentLocation:this.currentLocation,
            firendList:this.friendList
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);