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
        type: {
          type: String,
          enum: ['Point'], // Must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number], // Array of numbers: [longitude, latitude]
          required: true,
          validate: {
            validator: function (value) {
              const [longitude, latitude] = value;
              return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
            },
            message: 'Coordinates must be valid [longitude, latitude].',
          },
        },
      },
      previousLocation: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          validate: {
            validator: function (value) {
              if (!value || value.length !== 2) return true;// Allow null or undefined
              const [longitude, latitude] = value;
              return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
            },
            message: 'Coordinates must be valid [longitude, latitude].',
          },
        },
      },
      locationUpdatedAt: {
        type: Date,
        default: Date.now,
      },
      userRole: {
        type: String,
        enum: ['admin', 'moderator', 'normalUser' , 'king'],
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
      onscreen: {
        current:{
          type: Boolean,
          default: false,
        },
        lastOnscreen: {
          type: Date,
        }
        
         // Indicates if the user is currently active on the site
      },
      banned: {
        current: {
          status: { type: Boolean, default: false },
          reason: { type: String, default: "" },
          actionBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
          date: { type: Date },
        },
        history: [
          {
            status: { type: Boolean },
            reason: { type: String },
            actionBy :{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            date: { type: Date },
          },
        ],
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
  if (this.isModified('fullName') || this.isModified('gender') || this.isModified('bio') || this.isModified('locationRadiusPreference') || this.isModified('dateOfBirth')) {
    this.updatedAt = Date.now();
  }
  next();
});

userSchema.pre('save', function (next) {
  // Check if the onscreen status is changing to false
  if (this.isModified('onscreen.current') && !this.onscreen.current) {
    // Update the lastOnscreen field with the current date and time
    this.onscreen.lastOnscreen = Date.now();
  }
  next();
});


userSchema.methods.updateLocation = async function (latitude, longitude) {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error('Invalid coordinates. Longitude must be between -180 and 180, and latitude must be between -90 and 90.');
  }

  // If the new location is the same as the current one, do nothing
  if (
    this.currentLocation &&
    this.currentLocation.coordinates &&
    this.currentLocation.coordinates[0] === longitude &&
    this.currentLocation.coordinates[1] === latitude
  ) {
    return this; // No need to update, return the current user document
  }

  // Only update `previousLocation` if `currentLocation` is different
  if (this.currentLocation && this.currentLocation.coordinates.length === 2) {
    this.previousLocation = {
      type: 'Point',
      coordinates: [...this.currentLocation.coordinates], // Store old location
    };
  }

  // Update `currentLocation`
  this.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  // Update timestamp
  this.locationUpdatedAt = Date.now();

  // Generate a new profile image seed based on location
  const seed = `${latitude}-${longitude}`;
  this.profileImageURL = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

  return await this.save();
};



userSchema.methods.bannedUser = function (status, reason) {
  const currentDate = new Date();

  // Update the current ban status
  this.banned.current = {
    status: status,
    reason: reason || (status ? "No reason provided" : "Unbanned"),
    date: currentDate,
  };

  // Add the action to the history
  this.banned.history.push({
    status: status,
    reason: reason || (status ? "No reason provided" : "Unbanned"),
    date: currentDate,
  });

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
            firendList:this.friendList,
            locationRadiusPreference:this.locationRadiusPreference,
            banned:this.banned.current.status,
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
userSchema.index({ currentLocation: "2dsphere" });


export const User = mongoose.model("User", userSchema);