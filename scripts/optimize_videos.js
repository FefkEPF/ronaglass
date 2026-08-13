const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const videoDir = path.join(__dirname, 'public', 'video');

function optimizeVideo(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        // -an: removes audio, -vcodec libx264 -crf 28: compress video.
        const command = `"${ffmpeg}" -y -i "${inputFile}" -vcodec libx264 -crf 28 -preset fast -an "${outputFile}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error optimizing ${inputFile}:`, error);
                return reject(error);
            }
            resolve();
        });
    });
}

async function run() {
    const files = fs.readdirSync(videoDir);
    for (const file of files) {
        if (file.endsWith('.mp4') && !file.includes('-optimized')) {
            const inputFile = path.join(videoDir, file);
            const outputFile = path.join(videoDir, file.replace('.mp4', '-optimized.mp4'));
            console.log(`Optimizing ${file}...`);
            await optimizeVideo(inputFile, outputFile);
            // Replace original
            fs.renameSync(outputFile, inputFile);
            console.log(`Finished ${file}`);
        }
    }
}

run().catch(console.error);
