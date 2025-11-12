export const COMMAND_GET_GIT_REPO_NAME = `git config --local remote.origin.url | awk -F/ '{gsub(/.git$/, "", $NF); print $NF}'`;

export const COMMAND_GIT_FETCH_AND_CHECKOUT_BRANCH = `git fetch && git checkout {{branch}}`;
