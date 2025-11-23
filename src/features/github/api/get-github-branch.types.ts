export interface ApiGithubBranch {
  ref: string;
  node_id: string;
  url: string;
  object: {
    type: 'commit';
    sha: string;
    url: string;
  };
}
