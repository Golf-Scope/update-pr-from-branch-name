const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const inputs = {
            token: core.getInput('repo-token'),
            issueTicketRegex: core.getInput('issue-ticket-regex'),
        }

        const baseBranchName = github.context.payload.pull_request.base.ref;
        core.info(`Base branch name: ${baseBranchName}`);

        const headBranchName = github.context.payload.pull_request.head.ref;
        core.info(`Head branch name: ${headBranchName}`);

        const issueTicket = headBranchName;

        core.info(`Issue ticket: ${issueTicket}`);

        const issueTicketRegex = new RegExp(inputs.issueTicketRegex);
        core.info(`Issue ticket regex: ${issueTicketRegex}`);

        const [_, issueTicketNumber] = issueTicket.split(issueTicketRegex);
        core.info(`Issue ticket number: ${issueTicketNumber}`);

        if(!issueTicketNumber) {
            core.info(`Issue ticket number is not found in branch name. Skipping Pull Request update...`);
            return 0;
        }

        let title = github.context.payload.pull_request.title || '';
        let body = github.context.payload.pull_request.body || '';

        title = `[${issueTicketNumber}] ` + title;
        body = body + `\n\nJira Ticket: [${issueTicketNumber}]`

        const request = {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.payload.pull_request.number,
            title,
            body
        }

        const octokit = github.getOctokit(inputs.token);
        const response = await octokit.rest.pulls.update(request);

        core.info(`Response: ${response.status}`);
        if (response.status !== 200) {
            core.error('Updating the pull request failed');
            return 1;
        }

        core.setOutput('issue-ticket-number', issueTicketNumber);
        core.setOutput('pull-request-title', request.title);
        core.setOutput('pull-request-body', request.body);
    } catch (error) {
        core.setFailed(error.message);
        return 1;
    }
}

void run();