export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: 'open' | 'closed';
  locked: boolean;
  assignee: User;
  assignees: User[];
  milestone: null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  body: string;
  score: number;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: '';
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User';
  site_admin: false;
}

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: false;
}

export interface PullRequestInfo {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
}

export interface IssueOrPullRequest extends Issue {
  pull_request: PullRequestInfo;
  author_association?: 'CONTRIBUTOR';
}
