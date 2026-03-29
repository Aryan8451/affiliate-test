declare namespace NodeJs {
    interface ProcessEnv {
        JWT_SECRET: string;
        DATABASE_URL: string;
        ZEPTO_MAIL_TOKEN: string;
        NEXT_PUBLIC_APP_URL: string;
    }
}

declare var process: {
    env: NodeJs.ProcessEnv;
};
