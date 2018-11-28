import rp from 'request-promise-native';
import { outputJSON } from 'fs-extra';
import { IssueOrPullRequest } from './types';
import { resolve } from 'path';

const ISSUES_PER_PAGE = 100;

export async function downloadIssues(repo: string): Promise<void> {
  let issues: IssueOrPullRequest[];
  let page = 1;

  do {
    console.log(`Getting page ${page}`);
    issues = await getIssues(repo, page);
    console.log(`Page ${page} had ${issues.length} issues. Saving...`);
    await saveIssues(issues).then(() => console.log(`Saved page ${page}`));
    page += 1;
  } while (issues.length >= ISSUES_PER_PAGE);
}

function getIssues(
  repo: string,
  page: number = 1
): Promise<IssueOrPullRequest[]> {
  const options = {
    uri: `https://api.github.com/repos/${repo}/issues`,
    qs: {
      state: 'all',
      per_page: ISSUES_PER_PAGE,
      page
      // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return rp(options) as any;
}

async function saveIssues(issues: IssueOrPullRequest[]): Promise<void> {
  const queue: Promise<void>[] = [];
  issues.forEach(issue => {
    const type = issue.pull_request ? 'pull-requests' : 'issues';
    queue.push(
      outputJSON(
        resolve(__dirname, `../data/${type}/${issue.number}.json`),
        issue,
        {
          spaces: 2
        }
      )
    );
  });

  return Promise.all(queue).then(() => void 0);
}
