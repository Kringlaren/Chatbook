import { defineStore } from 'pinia';
import { useAuthStore } from './';
import { formatNameForBackEnd } from '../services/format.js';
import api from '../services/api.js';

export const useUserStore = defineStore('user', {
    state: () => ({
      	profileUser: null, // Användarens vars användaresida man är på
      	userPreferences: null, // Allt från profilbild till färgval
      	followedUsers: [], // Användare den inloggade användaren följer
      	error: null,
      	loading: false
    }),

    actions: {
      	async fetchUserByUsername(username) {
      	    const res = await this.handleUserRequest("get", "get/" + username);

      	    if (!res.error) {
      	      	this.profileUser = res.data;
      	    }

      	    return res.data;
      	},

      	// Användarinställningar //
      	///////////////////////////

      	async fetchUserPreferences() {
      	  	const res = await this.handleUserRequest("get", "preferences");
      	  	if (res.error) return { error: "Kunde inte hämta preferenser" };

      	  	this.userPreferences = res.data.preferences;

      	  	return res.data;
      	},

      	async changeBanner(formData) {
      	  	const res = await this.handleUserRequest("post", "change-banner", formData);
      	  	if (res.error) return { error: "Kunde inte uppdatera banderollen" };

      	  	this.userPreferences.banner_img = res.data.banner_img;

      	  	return res.data;
      	},

      	async changeProfilePic(formData) {
      	  	const res = await this.handleUserRequest("post", "change-profile-pic", formData);
      	  	if (res.error) return { error: "Kunde inte uppdatera profilbilden" };

      	  	this.userPreferences.profile_pic = res.data.profile_pic;

      	  	return res.data;   
      	},

      	async changeBio(content) {
      	  	const res = await this.handleUserRequest("post", "change-bio", {content});
      	  	if (res.error) return { error: "Kunde inte uppdatera beskrivningen" };

      	  	return res.data;
      	},

      	async changeColors(colors) {
      	  	const res = await this.handleUserRequest("post", "change-color", { colors })
      	  	if (res.error) return { error: "Kunde inte uppdatera färger" };

      	  	colors.forEach(color => {
      	  	  	this.userPreferences[color.type] = color.color;
      	  	});

		  	return res.data;
      	},

      	// Följningar //
      	////////////////

      	async changeFollow(username) {
      	  	const res = await this.handleUserRequest("post", "follow", {username});
      	  	if (res.error) return { error: "Kunde inte ändra följarstatus" };

      	  	this.profileUser = res.data.user;

      	  	return res.data;
      	},

      	async fetchFollowedUsers(inputUsername = "") {
      	  	let username;
      	  	const authStore = useAuthStore();
      	  	if (inputUsername === "") {
      	  	  	username = formatNameForBackEnd(authStore.user?.username);
      	  	} else {
      	  	  	username = formatNameForBackEnd(inputUsername);
      	  	}

      	  	const res = await this.handleUserRequest("get", "followed-users/" + username);
      	  	if (res.error) return { error: "Kunde inte hämta följda konton" };

      	  	if (inputUsername === "") {
      	  	  	this.followedUsers = res.data.users;
      	  	}
		  
      	  	return res.data;
      	},

      	async handleUserRequest(method, url, data = null) {
      	  	this.loading = true;
      	  	try {
      	  	  	let res;
      	  	  	if (method === "post") {
      	  	  	  	res = await api.post("/api/user/" + url, data);
      	  	  	} else if (method === "get") {
      	  	  	  	res = await api.get("/api/user/" + url);
      	  	  	}
      	  	  	this.error = null;
      	  	  	return res;
      	  	} catch (error) {
      	  	  	this.error = error.response?.data?.message || 'Något gick fel';
      	  	  	return { error: this.error, status: error.response?.status };
      	  	} finally {
      	  	  	this.loading = false;
      	  	}
      	}
    },
});