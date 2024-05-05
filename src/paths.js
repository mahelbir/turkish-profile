import {fileURLToPath} from 'url';
import path from 'path';

const isESM = typeof __filename === 'undefined';

const getDirnameFilename = () => {
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    return {dirname, filename};
};

export default (isESM ? getDirnameFilename() : {dirname: __dirname, filename: __filename});