// Plugins
import vue from "@vitejs/plugin-vue"
import { cloudflare } from "@cloudflare/vite-plugin"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// Builds src/worker.ts (wrangler.jsonc) next to the app and runs it in `pnpm dev` too.
		cloudflare(),
		vue({
			template: { transformAssetUrls },
		}),
		// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
		vuetify({
			autoImport: true,
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
	},
	optimizeDeps: {
		// vite-plugin-vuetify adds a vuetify/components/* import for each component a file uses, which Vite's dependency
		// scan cannot see. Pre-bundling Vuetify would then re-bundle the dependencies whenever a page first uses another
		// component, and the page that is loading gets "504 (Outdated Optimize Dep)". Vuetify ships ES modules, so it is
		// served as is (as the Vuetify docs recommend with auto-import).
		exclude: ["vuetify"],
	},
	server: {
		port: 3000,
	},
})
