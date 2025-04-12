import mongoose, { Schema } from "mongoose";

const userInfoRulesSchema = new Schema({
    
  fullName: {
    minLength: {
      type: Number,
       
      trim: true,
      default: 3,
    },
    maxLength: {
      type: Number,
       
      trim: true,
      default: 40,
    },
  },
  password: {
    minCharLength: {
      type: Number,
       
      default: 8, 
    },
    requireUpperCase: {
      type: Boolean,
       
      default: true, 
    },
    requireNumber: {
      type: Boolean,
       
      default: true,
    },
    requireSpecialChar: {
      type: Boolean,
       
      default: true, 
    },
  },
  genderList: {
    type: Array,
     
    default: [
        "Male",
        "Female",
        "Non-binary",
        "Genderfluid",
        "Agender",
        "Transgender",
        "Intersex",
        "Attack Helicopter",
        "Cloud",
        "Pussy(cat)",
        "The Internet", 
        "Penguin in a Suit",
        "Cock(male chicken)",
        "Supercar",
        "Tank",
        "Pookie",
        "Mig-31",
        "usb cable 1m",
        "USB CABLE 1.5M",
    ],
  },
  dateOfBirth: {
    minAge: {
      type: Number,
       
      default: 18,
    },
    maxAge: {
      type: Number,
       
      default: 100,
    },
  },
  bio: {
    options:{
    type: Array,
     
    default: [
        "Adventurous",
        "Bookworm",
        "Foodie",
        "Fitness Enthusiast",
        "Tech Geek",
        "Music Lover",
        "Travel Junkie",
        "Nature Lover",
        "Pet Friendly",
        "Night Owl",
        "Early Bird",
        "Movie Buff",
        "Art Enthusiast",
        "Gamer",
        ],
    },
    selectionLimit: {
      type: Number,
       
      default: 6,
        }
  },
  locationRadiusPreference:{
        minLength: {
          type: Number,
           
          default: 50,
        },
        maxLength: {
          type: Number,
           
          default: 200,
        },
  },
  isSignupOtpRequired:{
    type: Boolean,
     
    default: true,
  },

});

// export default mongoose.model("UserInfoRules", userInfoRulesSchema);
export const UserInfoRules = mongoose.model("UserInfoRules", userInfoRulesSchema);
