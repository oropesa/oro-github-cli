export interface ApiGithubError {
  message: string;
  documentation_url: string;
  status: string;
}

export interface GithubUser {
  userid: string;
  username: string;
  name: string;
  email: string;
}

export interface GithubRepo {
  id: string;
  name: string;
  fullname: string;
  owner: string;
  webUrl: string;
  defaultBranch: string;
  branches: GithubRepoBranch[];
  labels: GithubRepoLabel[];
}

export interface GithubRepoBranch {
  name: string;
  protected: boolean;
}

export interface GithubRepoLabel {
  name: string;
  description: string;
  color: string;
}
