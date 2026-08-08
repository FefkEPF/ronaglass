const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');

async function run() {
    const files = fs.readdirSync(imgDir);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const inputFile = path.join(imgDir, file);
            const tempFile = path.join(imgDir, 'opt_' + file);
            
            console.log(`Optimizing ${file}...`);
            try {
                let pipeline = sharp(inputFile);
                // Resize if very large (e.g. max width 1920)
                pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
                
                if (ext === '.png') {
                    pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
                } else {
                    pipeline = pipeline.jpeg({ quality: 80, progressive: true });
                }
                
                await pipeline.toFile(tempFile);
                
                // Replace original
                fs.renameSync(tempFile, inputFile);
                console.log(`Finished ${file}`);
            } catch (err) {
                console.error(`Error optimizing ${file}:`, err);
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            }
        }
    }
}

run().catch(console.error);
