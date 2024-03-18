<template>
	<vite-pwa-manifest />
	<nuxt-layout name="main">
		<nuxt-page />
	</nuxt-layout>

	<nuxt-loading-indicator />
	<UNotifications :timeout="3000" />
</template>
