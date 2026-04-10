const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('assetion') || content.includes('Assetion') || content.includes('isAssetion')) {
        content = content.replace(/assetion/g, 'production');
        content = content.replace(/Assetion/g, 'Production');
        content = content.replace(/isAssetion/g, 'isProduction');
        fs.writeFileSync(file, content);
    }
});
