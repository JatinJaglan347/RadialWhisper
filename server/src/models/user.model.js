import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Add schema debugging logs 
console.log("Initializing User schema with activeSessions support");

// Define activeSessions as a separate schema first for clarity
const sessionSchema = new Schema({
  refreshToken: { type: String, required: true },
  deviceInfo: { type: String, default: "Unknown device" },
  ip: { type: String, default: "Unknown IP" },
  lastActive: { type: Date, default: Date.now },
  issuedAt: { type: Date, default: Date.now }
});

// Log the created schema
console.log("Session Schema created:", sessionSchema ? "Success" : "Failed");

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
      customProfileImageURL: {
        type: String,
        default: null,
      },
      autoGenProfileImageURL: {
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
            ref: 'User',
          },
          since: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      // Incoming friend requests – requests that this user received
      friendRequests: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
      // Outgoing friend requests – requests that this user has sent
      friendRequestsSent: [
        {
          receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
      // onscreen: {
      //   current:{
      //     type: Boolean,
      //     default: false,
      //   },
      //   lastOnscreen: {
      //     type: Date,
      //   }
        
      // },


      activeStatus: {
        isActive: { type: Boolean, default: false },
        lastActive: { type: Date, default: Date.now }
      },
      otp: {
        code: { type: String, default: null },
        expiresAt: { type: Date, default: null },
        verified: { type: Boolean, default: false }
      },
      passwordReset: {
        otp: { type: String, default: null },
        expiresAt: { type: Date, default: null },
        verified: { type: Boolean, default: false }
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
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
      activeSessions: {
        type: [sessionSchema],
        default: function() {
          console.log("Creating default empty activeSessions array");
          return [];
        }
      },
      // Old refresh token field is kept for backward compatibility
      refreshToken: {
        type: String,
      },  
      
});

// Add tokenVersion field to the user schema - it will be incremented when forcing logout from other devices
userSchema.add({
  tokenVersion: {
    type: Number,
    default: 0
  }
});

// Add profileImageURL as a virtual property
userSchema.virtual('profileImageURL').get(function() {
  return this.customProfileImageURL || this.autoGenProfileImageURL;
});

// When setting profileImageURL directly (for backwards compatibility),
// update the appropriate underlying field
userSchema.virtual('profileImageURL').set(function(url) {
  // Check if the URL is from dicebear (auto-generated)
  if (url && url.includes('dicebear.com')) {
    this.autoGenProfileImageURL = url;
  } else {
    this.customProfileImageURL = url;
  }
});

// Ensure virtual fields are included in JSON and object conversions
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Migration helper for old documents that only have profileImageURL
userSchema.pre('save', function(next) {
  // If this is an existing document that has profileImageURL as a real field, migrate it
  if (this.isNew === false && this._doc.profileImageURL && 
      !this._doc.customProfileImageURL && !this._doc.autoGenProfileImageURL) {
    
    // Determine if the existing profileImageURL is auto-generated or custom
    const url = this._doc.profileImageURL;
    if (url && url.includes('dicebear.com')) {
      this.autoGenProfileImageURL = url;
    } else {
      this.customProfileImageURL = url;
    }
    
    // Remove the old field from the document
    delete this._doc.profileImageURL;
  }
  next();
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
  this.autoGenProfileImageURL = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

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
            tokenVersion: this.tokenVersion // Include token version in the payload
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
            tokenVersion: this.tokenVersion // Include token version in the payload
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.index({ currentLocation: "2dsphere" });


export const User = mongoose.model("User", userSchema);