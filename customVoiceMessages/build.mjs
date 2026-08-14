import * as esbuild from "esbuild";

const externalPackages = {
    name: "external-vendetta",
    setup(build) {
        build.onResolve(
            { filter: /^@vendetta\// },
            args => ({
                path: args.path,
                external: true,
            })
        );
    },
};

await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "iife",
    platform: "neutral",
    target: "es2020",
    outfile: "index.js",
    sourcemap: false,
    minify: false,
    plugins: [externalPackages],
});

console.log("Custom Voice Messages+ built successfully.");
