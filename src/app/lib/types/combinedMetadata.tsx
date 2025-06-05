import { CustomMetadata } from "./customMetadata";
import { GithubMetadata } from "./githubMetadata";

export type CombinedMetadata = GithubMetadata & CustomMetadata;
