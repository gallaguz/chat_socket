<template>
	<div>
		<h1>Chat</h1>
		<ChatComponent />
	</div>
</template>

<script>
import ChatComponent from '../components/ChatComponent.vue';

export default {
	name: 'Chat',
	components: {
		ChatComponent,
	},
};
</script>

<style scoped></style>
