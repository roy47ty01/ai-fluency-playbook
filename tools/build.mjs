/* Builds everything needed to publish the site into build/:
     build/worker.js       the bundled Worker (esbuild, single ESM file)
     build/public/         exactly the public assets
     build/manifest.json   the deployment manifest, paths relative to itself

   The folder must not start with a dot: the deployer refuses hidden paths.
   Run with: npm run build   (then deploy build/manifest.json) */
import { build } from "esbuild";
import { cp, mkdir, rm, writeFile, readdir } from "node:fs/promises";

const OUT = "build";

await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/public`, { recursive: true });

await build({
  entryPoints: ["src/worker.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  outfile: `${OUT}/worker.js`,
  logLevel: "warning"
});

await cp("public", `${OUT}/public`, { recursive: true });

const manifest = {
  entrypoint: "worker.js",
  compatibilityDate: "2026-11-01",
  modules: [{ name: "worker.js", type: "esm", path: "./worker.js" }],
  assetsDirectory: "./public"
};
await writeFile(`${OUT}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);

const assets = (await readdir(`${OUT}/public`)).sort();
console.log(`built ${OUT}/worker.js + ${assets.length} assets: ${assets.join(", ")}`);
