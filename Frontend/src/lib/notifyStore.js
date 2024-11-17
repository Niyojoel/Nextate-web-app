import {create} from 'zustand';
import apiRequest from './apiRequest';

export const notifyStore = create((set) => ({
  count: 0,
  fetch: async ()=> {
    const res = await apiRequest.get("/users/notification");
    console.log(res)
    set({count: res.data.data});
  },
  decrease: () => {
    set((prev) => ({count: prev.count - 1}));
  },
  reset: ()=> {
    set({count: 0});
  }
}))

export default notifyStore