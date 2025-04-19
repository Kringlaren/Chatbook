<script setup>
const props = defineProps({
    comment: Object,
});

const urlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = props.comment.username.replace(/\s+/g, ".");
</script>

<template>
    <div class="comment">
        <div class="contentpadding">
            <div class="profile">
                <img :src="urlBase + comment.profile_pic" alt="Profilbild" class="profileimg">
                <h3><a :href="usernameNoSpace">{{ comment.username }}</a></h3>
                <p>-</p>
                <p>{{ comment.created_at }}</p>
            </div>
        
            <p>{{ comment.content }}</p>
            <img v-if="comment.image" :src="urlBase + comment.image" alt="Inläggsbild" class="commentimg">
        </div>

        
    </div>
</template>

<style scoped>
.comment {
  text-align: left;
  width: 100%;
  background-color: var(--primary-color);
  border-radius: calc(var(--default-border-radius)/2);
}

.profile {
    display: flex;
    gap: 1vw;
    align-items: center;
}

.profileimg {
    max-width: 3vw;
    max-height: 3vw;
    border-radius: 100%;
}

.commentimg {
    width: 10vw;
}

.contentpadding {
    padding: var(--default-padding) var(--default-padding) 0 var(--default-padding);
}
</style>