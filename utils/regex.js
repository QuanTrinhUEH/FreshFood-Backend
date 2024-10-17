export const convertTagsToHtml = (text, imageUrls) => {
    const imgRegex = /\[img=([0-9]+)]/g;

    return text.replace(imgRegex, (match, id) => {
        if (id >= 0 && id <= imageUrls.length) {
            return `[img=${imageUrls[id - 1]}]`;
        } else {
            return match;
        }
    });
}