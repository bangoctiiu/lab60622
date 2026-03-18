const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let deadButtons = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const buttonRegex = /<(Button|button|a)\b[^>]*>/g;
    let match;

    while ((match = buttonRegex.exec(content)) !== null) {
        const fullTag = match[0];
        
        if (fullTag.includes('onClick=') || fullTag.includes('href=') || fullTag.includes('to=') || fullTag.includes('type="submit"') || fullTag.includes("htmlType=\"submit\"")) {
            continue;
        }
        
        const index = match.index;
        const lineNumber = content.substring(0, index).split('\n').length;
        
        deadButtons.push({ file: file.replace(__dirname, ''), line: lineNumber, tag: fullTag.replace(/\s+/g, ' ').substring(0, 100) });
    }
});

fs.writeFileSync(path.join(__dirname, 'dead_buttons.json'), JSON.stringify(deadButtons, null, 2));
console.log("Found " + deadButtons.length + " potential dead buttons.");
