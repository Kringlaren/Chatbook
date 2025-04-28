import path from "path";
import fs from "fs/promises";

const __dirname = import.meta.dirname;

const deleteOldImage = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '..', fileName);
        await fs.unlink(filePath);
        return true;
    } catch {
        return false;
    }
}

export default { deleteOldImage };