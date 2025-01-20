import axios from "axios";
import conf from "../conf/conf";


const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}; path=/`;
  // Add secure flag (only for HTTPS connections)
  if (options?.secure) {
    cookieString += "; secure";
  }

  // Add SameSite attribute (Strict or Lax, default to Strict)
  cookieString += `; sameSite=${options.sameSite || 'Strict'}`;

  // Set max-age (time in seconds until the cookie expires)
  if (options?.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  // Set expiration date if provided
  if (options?.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  // Set the cookie
  document.cookie = cookieString;
};


// Helper to get cookies
const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

const loginUser = async (username, password, addUserData) => {
  try {
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    const response = await axios.post(`${conf.BACKEND_URL}/users/login`, {
      username,
      password,
    });

    const Data = response.data?.data;
    if (!Data?.user?.username) {
      throw new Error("Invalid login details.");
    }

    // Store token securely
    setCookie('accessToken',`${Data?.accessToken}`, {
      secure: true,
      sameSite: 'Strict',
      maxAge: 60*60*24,
    });

    addUserData(Data.user);
    return Data.user;
  } catch (error) {
    console.error("Error during login:", error);
    return null; 
  }
};

const logoutUser = async (removeUserData) => {
  try {
    const accessToken = getCookie("accessToken");
    if(!accessToken){
      console.log("No access token found by logout!");
      return null;
    }
    console.log("Access token sending by logout: " + accessToken)
    const Data=await axios.post(`${conf.BACKEND_URL}/users/logout`,{},{ 
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
     });
    document.cookie = "accessToken=; path=/; max-age=0; secure; sameSite=Strict"; // Clear cookie
    removeUserData();
    console.log("User logged out successfully",Data);
  } catch (error) {
    console.error("Error while logging out:", error);
  }
};

const getCurrentUser = async (addUserData) => {
  try {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      console.log("No access token found");
      return null;
    }

    console.log("Access Token sending by current-User is:", accessToken);

    const response = await axios.get(`${conf.BACKEND_URL}/users/current-user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
  });  

    const Data = response.data;
    if (!Data?.data?.username) {
      console.log("Error while fetching current user", Data);
      return null;
    }

    addUserData(Data?.data);
    return Data.data;
  } catch (error) {
    console.error("Error while fetching current user:", error);
    return null;
  }
};

const registerUser = async (fullName, username, password, email, avatar, coverImage="", addUserData) => {
    try {
      // Implementation here
        if(!username || !password || !email || !avatar){
          throw new Error("All data is required to register.");
          return null;
        }
        const form=new FormData();
        form.append("fullName",fullName);
        form.append("username",username);
        form.append("password",password);
        form.append("email",email);
        form.append("avatar",avatar);
        if(coverImage) {
          form.append("coverImage",coverImage);
        }
    
        const Data=await axios.post(`${conf.BACKEND_URL}/users/register`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res=> res.data);
    
        if(!Data){
          console.log("Error while registering user",Data);
          return null;
        }
    
        console.log('Details after signup: ',Data);
        const lg_data = await loginUser(username, password, addUserData);
        return lg_data;

    } catch (error) {
      console.log("Error while adding user",error);
      return null;
    }
};

export { 
  setCookie,
  getCookie,
  loginUser,
  logoutUser, 
  registerUser, 
  getCurrentUser };
