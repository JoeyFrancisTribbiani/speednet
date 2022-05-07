<template>
	<scroll-view style="padding: 15px;box-sizing: border-box;text-align: center;">
		<!-- {{ $t("index.text.prompt") }} -->
		<text style="color: #666; font-size: 15px;">新起点网游加速器管理后台</text>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</scroll-view>
</template>

<script>
	import {
		version
	} from '../../package.json'

	export default {
		data() {
			return {
				adminVersion: version,
			}
		},
		watch: {

		},
		onLoad() {},
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
</style>
