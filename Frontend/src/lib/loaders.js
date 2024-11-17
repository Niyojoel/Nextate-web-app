import { defer } from "react-router-dom";
import apiRequest from "./apiRequest"

export const singlePostLoader = async ({request,params}) =>{
    const res= await apiRequest("/posts/"+ params.id);
    return res.data;
}

export const listsPageLoader = async ({request}) =>{
    const query = request.url.split("?")[1];
    const postPromise = apiRequest("/posts?"+query);
    return defer({
        postResponse: postPromise,
    });
}

export const profilePageLoader = async ({request,params}) =>{
    const postPromise = apiRequest("/users/profile-posts");
    const chatPromise = apiRequest("/chats");
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise,
    });
}

export const agentsPageLoader = async ({request,params}) =>{
    const dataPromise = apiRequest("/users/agents");
    return defer({
        dataResponse: dataPromise,
    });
}
