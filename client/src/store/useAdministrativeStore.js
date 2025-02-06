import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // axios instance for API calls
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';



export const useAdministrativeStore = create((set, get) => ({
  isKing: useAuthStore.getState().isKing,
  isAdmin: useAuthStore.getState().isAdmin,
  isModrater: useAuthStore.getState().isModrater,
  authUser: useAuthStore.getState().authUser,
  isGettingUserInfoRules : false,
  isUpdatingUserInfoRules:  false ,
  userInfoRulesData : null,

    
  getUserInfoRules: async (data) => {
    set({ isGettingUserInfoRules: true });
    try {
        console.log("userId", data);  // Check if data is being passed correctly
        const res = await axiosInstance.post('/api/v1/op/user-info-rules', data);
        console.log('Get UserInfo Rules API');
        set({ userInfoRulesData: res.data });
 
        console.log('userInfoRulesData:', res.data);  // Check what response you are receiving
    } catch (err) {
        console.error('Error in getUserInfoRules:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch user info rules';
        toast.error(errorMessage);
    } finally {
        set({ isGettingUserInfoRules: false });
    }
 },

 updateUserInfoRules : async (data) => {
    set({ isUpdatingUserInfoRules: true });
    try {
        console.log("userId", data);  // Check if data is being passed correctly
        const res = await axiosInstance.patch('/api/v1/op/update-user-info-rules', data);
        console.log('Update UserInfo Rules API');
        set({ userInfoRulesData: res.data });
 
        console.log('userInfoRulesData:', res.data);  // Check what response you are receiving
    } catch (err) {
        console.error('Error in getUserInfoRules:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch user info rules';
        toast.error(errorMessage);
    } finally {
        set({ isUpdatingUserInfoRules: false });
    }
 }

 
}))