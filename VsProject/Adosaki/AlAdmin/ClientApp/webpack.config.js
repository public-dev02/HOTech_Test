const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//�ҽ� ��ġ
const RootPath = path.resolve(__dirname);
const SrcPath = path.resolve(RootPath, "src");

//�������� ����ϴ� ���� �̸�
const WwwRoot = "build";
//�������� ����ϴ� ���� ��ġ
const WwwRootPath = path.resolve(__dirname, WwwRoot);

//���ø� ��ġ
const IndexHtmlPath = path.resolve(SrcPath, "index.html");
//const IndexHtmlPath = path.resolve(SrcPath, "test01.html");
//����� ��� ���� �̸�
let OutputFolder = "development";
//����� ��� ��ġ
let OutputPath = path.resolve(WwwRootPath, OutputFolder);
//����� ��� ��ġ - ��� �ּ�
let OutputPath_relative = path.resolve("/", OutputFolder);
/** ���� �ּ� - �׽�Ʈ�Ҷ��� ��Ʈ, �Ǽ��񽺶��� �ش� ��θ� ���´�. */
let OutputPath_PublicPath = "/";


module.exports = (env, argv) =>
{
    //������(���δ���)���� ����
    const EnvPrductionIs = argv.mode === "production";
    if (true === EnvPrductionIs)
    {
        //������ ��� ���� ����
        OutputFolder = "production";
        OutputPath = path.resolve(WwwRootPath, OutputFolder);
        OutputPath_relative = path.resolve("/", OutputFolder);
    }

    return {
        /** ���� ��� */
        mode: EnvPrductionIs ? "production" : "development",
        devtool: "inline-source-map",
        //devtool: "inline-source-map",
        resolve: {
            extensions: [".js", ".ts"],
            alias: {
                "@": SrcPath,
                "@bootstrap": path.resolve(RootPath, "node_modules/bootstrap"),
            }
        },
        output: {// ���������� ������� js
            /** ���� ��ġ */
            path: OutputPath,
            /** ���� ���� �� ���������� ������� ���� */
            filename: "app.js",
            publicPath: OutputPath_PublicPath,
        },
        module: {
            // ��� ��Ģ
            rules: [
                // TypeScript �δ� ����
                {
                    test: /\.ts?$/i,
                    exclude: /node_modules/,
                    use: ['ts-loader']
                },
                {
                    test: /\.(sa|sc|c)ss$/i,
                    exclude: /node_modules/,
                    use: [
                        EnvPrductionIs ? MiniCssExtractPlugin.loader : { loader: "style-loader" },
                        { loader: "css-loader" },
                        { loader: "sass-loader" },
                        { loader: "postcss-loader" },
                    ],
                },
                {
                    test: /simplebar\.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ],
                },
            ]
        },
        plugins: [
            //asp.net core�� �ߴ��� ������ ���� �÷�����
            new webpack.SourceMapDevToolPlugin({}),
            // ������ �����(��>��������)�� HTML�� �������ִ� �÷�����
            new HtmlWebpackPlugin({ template: IndexHtmlPath }),
            // ��������� ����ִ� �÷�����
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    '**/*',
                    "!robots.txt",
                    "!Upload"
                ]
            }),

            //�״�� ��������� ������ ���� ����
            new CopyPlugin({
                patterns: [
                    {
                        //��� html���� ����
                        from: "./src/**/*.html",
                        to({ context, absoluteFilename })
                        {
                            //'src/'�� ����
                            let sOutDir = path.relative(context, absoluteFilename).substring(4);
                            //index.html�� ����Ʈ�� �������ֹǷ� ���⼱ ��ŵ�Ѵ�.
                            if ("index.html" === sOutDir)
                            {
                                //sOutDir = "index_Temp.html";
                                sOutDir = "";
                            }
                            //console.log("sOutDir : " + sOutDir);
                            return `${sOutDir}`;
                        },
                    },
                ],
                options: {
                    concurrency: 100,
                },
            }),

            // CSS ���� �ϳ���
            new MiniCssExtractPlugin({
                filename: "app.css",
            }),
        ],

        devServer: {
            /** ���� ��Ʈ */
            port: "9500",
            https: true,
            proxy: {
                '/weatherforecast': 'https://localhost:7181'
            },
            /** ��������� ��ġ */
            static: [path.resolve("./", "build/development/")],
            /** ������ ���� ���� */
            open: false,
            /** �ָ��ε� ��뿩�� */
            hot: true,
            /** ���̺� ���ε� ��뿩�� */
            liveReload: true,
            historyApiFallback: true,
        },
    };
}