interface Options {
  errorColor?: string;
  errorEmoji?: string;
  prefix?: string;
  mainColor: string;
  token?: string;
  mongooseConnectionURI: string;
  successEmoji?: string;
  successEmbedColor?: string;
}
declare const config: Options;
export default config;
