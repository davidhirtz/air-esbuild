import esbuild from 'esbuild';
export default class Builder {
    watch: boolean;
    cssContext: esbuild.BuildContext;
    jsContext: esbuild.BuildContext;
    cssOptions: esbuild.BuildOptions;
    jsOptions: esbuild.BuildOptions;
    jsVendorDir: string;
    constructor(config?: Object);
    configureCss(): void;
    configureJs(): void;
    build(): Promise<void>;
}
