import mongoose, { Schema } from "mongoose";

const userInfoRulesSchema = new Schema({
    
  fullName: {
    minLength: {
      type: Number,
      required: true,
      trim: true,
      default: 3,
    },
    maxLength: {
      type: Number,
      required: true,
      trim: true,
      default: 40,
    },
  },
  password: {
    minCharLength: {
      type: Number,
      required: true,
      default: 8, 
    },
    requireUpperCase: {
      type: Boolean,
      required: true,
      default: true, 
    },
    requireNumber: {
      type: Boolean,
      required: true,
      default: true,
    },
    requireSpecialChar: {
      type: Boolean,
      required: true,
      default: true, 
    },
  },
  genderList: {
    type: Array,
    required: true,
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
      required: true,
      default: 18,
    },
    maxAge: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  bio: {
    options:{
    type: Array,
    required: true,
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
      required: true,
      default: 6,
        }
  },
  locationRadiusPreference:{
        minLength: {
          type: Number,
          required: true,
          default: 50,
        },
        maxLength: {
          type: Number,
          required: true,
          default: 200,
        },
  },

});

// export default mongoose.model("UserInfoRules", userInfoRulesSchema);
export const UserInfoRules = mongoose.model("UserInfoRules", userInfoRulesSchema);
