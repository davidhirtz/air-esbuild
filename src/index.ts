import esbuild from 'esbuild';
import autoprefixer from "autoprefixer";
import fs from "fs";
import mQPacker from '@hail2u/css-mqpacker';
import postcss from "postcss";
import {sassPlugin} from 'esbuild-sass-plugin'


export default class Builder {

    watch = process.argv.slice(2).includes('--watch');

    cssContext: esbuild.BuildContext;
    jsContext: esbuild.BuildContext;

    cssOptions: esbuild.BuildOptions = {
        entryPoints: ['./resources/scss/site.scss'],
        minify: true,
        outdir: './web/css/',
        plugins: [],
        sourcemap: true,
    }

    jsOptions: esbuild.BuildOptions = {
        bundle: true,
        entryPoints: ['./resources/js/site.ts'],
        external: ['./resources/js/vendor/*'],
        format: 'esm',
        minify: true,
        outdir: './web/js/',
        plugins: [],
        sourcemap: true,
        splitting: true,
    }

    jsVendorDir: string = 'vendor';

    constructor(config?: Object) {
        Object.assign(this, {...config});

        this.configureCss();
        this.configureJs();

        void this.build();
    }

    configureCss() {
        let cssStartTime: number;

        this.cssOptions.plugins.push({
            name: 'css-watch-plugin',
            setup(build: esbuild.PluginBuild) {
                build.onStart(() => {
                    cssStartTime = Date.now()
                });

                build.onEnd((result) => {
                    if (result.errors.length) {
                        console.log(result.errors);
                    }

                    console.log(`Compiled styles with esbuild (${esbuild.version}) in ${Date.now() - cssStartTime}ms`);
                });
            }
        });

    }
    configureJs() {
        const builder = this;
        let jsStartTime: number;

        this.cssOptions.plugins.push(sassPlugin({
            async transform(source) {
                const {css} = await postcss([
                    autoprefixer,
                    mQPacker({sort: true})
                ]).process(source, {from: undefined});

                return css;
            }
        }));

        this.jsOptions.plugins.push({
            name: 'js-watch-plugin',
            setup(build: esbuild.PluginBuild) {
                build.onStart(() => {
                    const dir = builder.jsOptions.outdir;

                    if (fs.existsSync(dir) || fs.mkdirSync(dir)) {
                        jsStartTime = Date.now();

                        fs.readdirSync(dir)
                            .filter((file) => file !== builder.jsVendorDir)
                            .map((file) => fs.unlinkSync(dir + file))
                    }
                });

                build.onEnd((result) => {
                    if (result.errors.length) {
                        console.log(result.errors);
                    }

                    console.log(`Bundled scripts with esbuild (${esbuild.version}) in ${Date.now() - jsStartTime}ms`);
                });
            }
        });
    }

    async build() {
        this.cssContext = await esbuild.context(this.cssOptions);
        this.jsContext = await esbuild.context(this.jsOptions);

        if (this.watch) {
            await this.cssContext.watch();
            await this.jsContext.watch();
        } else {
            await this.cssContext.rebuild();
            await this.jsContext.rebuild();

            await this.cssContext.dispose();
            await this.jsContext.dispose();
        }
    }}