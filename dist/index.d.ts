import esbuild from 'esbuild';
export default class Builder {
    cssContext: esbuild.BuildContext;
    cssOptions: esbuild.BuildOptions;
    jsContext: esbuild.BuildContext;
    jsOptions: esbuild.BuildOptions;
    /**
     * @var string the directory name for vendor scripts, this directory will be excluded from purging on rebuild
     */
    jsVendorDir: string;
    watch: boolean;
    constructor(config?: Builder);
    configureCss(): void;
    configureJs(): void;
    build(): Promise<void>;
}
