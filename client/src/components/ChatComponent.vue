<template>
	<div>
		<button @click="message()">message</button>
	</div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'ChatComponent',
	data: () => {
		return {};
	},
	computed: {
		// ...mapGetters(['isConnected']),
	},
	sockets: {
		connect: function () {
			console.log('socket connected');
		},
		disconnect() {},
	},
	mounted() {},
	methods: {
		// ...mapActions(['connectionStatus']),
		message() {
			this.$socket.emit('createMessage', {
				text: 'FROM CLIENT',
			});
		},
	},
};
</script>

<style scoped></style>
