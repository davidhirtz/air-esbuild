import * as esbuild from 'esbuild';
export default class Builder {
    watch: boolean;
    cssContext: esbuild.BuildContext;
    jsContext: esbuild.BuildContext;
    cssStartTime: number;
    jsStartTime: number;
    cssOptions: esbuild.BuildOptions;
    jsOptions: esbuild.BuildOptions;
    jsVendorDir: string;
    constructor(config?: Object);
    configure(): void;
    build(): Promise<void>;
    cssWatchPlugin: {
        name: string;
        setup(build: esbuild.PluginBuild): void;
    };
    jsWatchPlugin: {
        name: string;
        setup(build: esbuild.PluginBuild): void;
    };
}
