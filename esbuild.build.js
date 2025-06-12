import esbuild from "esbuild"
import postCssPlugin from "esbuild-style-plugin"
import tailwindcss from "tailwindcss"

const main = async () => {
  // if no arguments are given, output help and exit
  if (process.argv.length < 3) {
    console.log("ERROR: you need to specify a command to execute")
    console.log("esbuild.js [--build|--watch]")
    console.log("  --build : builds static files for deployment")
    console.log("  --serve : starts the development server. listens on port 8000")
    return
  }
  const args = process.argv.slice(2)
  // should build app and exit?
  const build = args.includes("--build")
  // should serve development server?
  const serve = args.includes("--serve")

  const ctx = await esbuild
    .context({
      entryPoints: ["src/App.jsx", "src/styles/app.css"],
      outdir: "public/assets",
      bundle: true,
      minify: build,  // if building static files, minify them
      plugins: [
        postCssPlugin({
          postcss: {
            plugins: [tailwindcss]
          }
        })
      ],
      define: {
        "window.IS_PRODUCTION": build ? "true" : "false"
      },
      loader: {
        ".svg": "dataurl"
      }
    })
  if (serve) {
    await ctx.watch()
    const { host, port } = await ctx.serve({ servedir: "public" })
    console.log(`Running development server at ${host}:${port}`)
  } else {
    process.stdout.write("Building static files ... ")
    await ctx.rebuild()
    await ctx.dispose()
    console.log("done!")
  }
}
main()
