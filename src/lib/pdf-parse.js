import pdf from 'pdf-parse';

export async function extractPDFText(fileBuffer) {
    try {
        // Ensure we're working with a Buffer
        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);

        // Add validation to ensure we have data
        if (!buffer || buffer.length === 0) {
            throw new Error('Empty file buffer provided');
        }

        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        return null;
    }
}