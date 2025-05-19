<script setup>
import Post from './Post.vue';
import Comments from './Comments.vue';
import MakeComment from './MakeComment.vue';

const props = defineProps({
    post: Object
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
    <div class="back-drop" @click.self="close">
        <div class="panel">    
            <h2>{{ post.username }}s inlägg</h2>

            <div class="scrollable">
                <div class="content flex-column card">
                    <div><Post :post="post" :modal="true"></Post></div> 
                    <p>Kommentarer</p>  
                    <div><MakeComment :post="post"></MakeComment></div> 
                    <div><Comments :post="post"></Comments></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-drop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}
.panel {
    padding: var(--default-padding);
    width: 50vw;
    height: 80vh;
    border-radius: var(--default-border-radius);
    background-color: var(--primary-color);
    display: flex;
    flex-direction: column;
    align-items: center;
} 

.content {
    width: 45vw;
    align-self: center;
    border-radius: calc(var(--default-border-radius)/2);
}
@media only screen and (max-width: 1100px) {
    .panel {
        width: 70vw;
    }
    .content {
        width: 65vw;
    }
}
@media only screen and (max-width: 600px) {
    .panel {
        width: 80vw;
    }

    .content {
        width: 75vw;
    }
}
</style>