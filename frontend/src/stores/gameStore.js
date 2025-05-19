import { defineStore } from "pinia";
import api from "../services/api.js";

export const useGameStore = defineStore('game', {
    state: () => ({
        scoreboard: [], // Alla användare som spelat
        error: null,
        loading: false
    }),

    actions: {
        // Sparar poäng genom att lägga till om användaren inte finns eller byta ut om den finns, sorterar sedan 
        async saveScore(score) {
            const res = await this.handleGameRequest("post", "save-score", {score});
            if (res.error) return { error: "Kunde inte spara poängen" };

            if (this.scoreboard.length === 0) {
                this.scoreboard.push(res.data.score);
            } else {
                const index = this.scoreboard.findIndex(s => s.username === res.data.score.username);
                if (index !== -1) {
                    if (score > this.scoreboard[index].score) {
                        this.scoreboard[index] = res.data.score;
                    }
                } else {
                    this.scoreboard.push(res.data.score);
                }
            }
           
            this.scoreboard.sort((a, b) => b.score - a.score);

            return res.data
        },

        // Hämtar alla poäng
        async fetchScoreboard() {
            this.top = top;

            const res = await this.handleGameRequest("get", "scoreboard");
            if (res.error) return { error: "Kunde inte hämta poängdata" };

            this.scoreboard = res.data.scores;
            
            return res.data;
        },

        async fetchPb() {
            const res = await this.handleGameRequest("get", "pb");
            if (res.error) return { error: "Kunde inte hämta personbästa" };

            return res.data;
        },

        async handleGameRequest(method, url, data = null) {
            this.loading = true;
            try {
                let res;
                if (method === "post") {
                  res = await api.post("/api/game/" + url, data);
                } else if (method === "get") {
                  res = await api.get("/api/game/" + url);
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
    }
});