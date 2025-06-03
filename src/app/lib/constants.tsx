// Repo Names
export const REPO_NAME_DARK_SOULS_CHAR_SHEET = "dark-souls-char-sheet";
export const REPO_NAME_SCOUNDREL = "scoundrel";
export const REPO_NAME_HALIGTREE = "haligtree";

// App Names
export const APP_NAME_DARK_SOULS_CHAR_SHEET =
    "Dark Souls TTRPG Character Sheet";
export const APP_NAME_SCOUNDREL = "Scoundrel";
export const APP_NAME_HALIGTREE = "Haligtree";

// Github Metadata API
export const GITHUB_METADATA_HOST = "https://api.github.com";
export const GITHUB_METADATA_REPOS_PATH = "/repos";
export const GITHUB_METADATA_LANGUAGES_PATH = "/languages";

// Github Data to Retrieve
export const GITHUB_USERNAME = "Camburgaler";
export const GITHUB_REPOS = [
    REPO_NAME_DARK_SOULS_CHAR_SHEET,
    REPO_NAME_SCOUNDREL,
    REPO_NAME_HALIGTREE,
];

// Maps
export const REPO_NAME_TO_APP_NAME: Map<string, string> = new Map([
    [REPO_NAME_DARK_SOULS_CHAR_SHEET, APP_NAME_DARK_SOULS_CHAR_SHEET],
    [REPO_NAME_SCOUNDREL, APP_NAME_SCOUNDREL],
    [REPO_NAME_HALIGTREE, APP_NAME_HALIGTREE],
]);
