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
}
</script>

<template>
    <div class="backdrop" @click.self="close">
        <div class="panel">    
            <h2>{{ props.post.username }}s inlägg</h2>

            <div class="scrollable">
                <div class="content">
                    <div><Post :post="props.post" :modal="true"></Post></div> 
                    <p>Kommentarer</p>  
                    <div><MakeComment :post="props.post"></MakeComment></div> 
                    <div><Comments :post="props.post"></Comments></div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.panel {
    padding: 2vw;
    width: 50vw;
    height: 80vh;
    border-radius: var(--default-border-radius);
    background-color: var(--primary-color);
    display: flex;
    flex-direction: column;
    align-items: center;
} 

.content {
    width: 98%;
    display: flex;
    flex-direction: column;
    align-self: center;
    border: var(--default-border);
    border-radius: calc(var(--default-border-radius)/2);
}
</style>