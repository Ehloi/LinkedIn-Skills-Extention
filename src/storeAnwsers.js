import axios from 'axios';
import { Octokit } from '@octokit/rest';
const octokit = new Octokit({ auth: `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` });
import fs from 'fs';

async function getDirContent(dirUrl) {
    let response;
    try {
        response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'Ebazhanov',
            repo: 'linkedin-skill-assessments-quizzes',
            path: dirUrl
        })
    } catch (e){
        console.log(e)
    }
    return response.data;
}

async function getFileContent(fileUrl) {
    let response;
    try {
        response = await axios.get(fileUrl);
    } catch (e){
        console.log(e)
    }
    return response.data;
}

export async function storeAnwsers() {
    fs.unlinkSync('src/answers.js');
    const githubData = await getRepoInfo();
    let dirs = githubData.filter((item) => item.type === 'dir');
    fs.writeFileSync('src/answers.js', 'export const Q_A_Array = [\n');
    // remove all dirs starting by .
    dirs = dirs.filter((item) => !item.name.startsWith('.'));

    // remove all git dirs
    dirs = dirs.filter((item) => !item.name.startsWith('git'));
    for (const dir of dirs) {
        const dirContent = await getDirContent(dir.path);
        const files = dirContent.filter((item) => item.type === 'file');
        for (const file of files) {
            // get only the markdown files
            if(!file.name.endsWith('.md'))
                continue;
            let fileContent = await getFileContent(file.download_url);
            
            // replace all the " by '
            fileContent = fileContent.replace(/"/g, "'");
            
            // get all lines which contains # or [x]
            const lines = fileContent.split('\n').filter((line) => line.includes('####') || line.includes('[x]'));
            
            // add " at the beginning and end of the line
            const linesWithQuotes = lines.map((line) => `    "${line}",`);
            fs.appendFileSync('src/answers.js', linesWithQuotes.join('\n') + '\n')
        }
    }
    fs.appendFileSync('src/answers.js', '];')
}


async function getRepoInfo() {
    let response;
    try {
        response = await octokit.request('GET /repos/{owner}/{repo}/contents/', {
            owner: 'Ebazhanov',
            repo: 'linkedin-skill-assessments-quizzes',
        })
    } catch (e){
        console.log(e)
    }
    return response.data;
}

