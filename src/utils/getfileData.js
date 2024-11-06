import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readMarkdownFile = async (filename) => {
  const filePath = path.join(__dirname, '../../public', filename);
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
  }
};

export const getProductsData = async () => {
  return await parseMarkdownFile('products.md');
};

export const getPromotionsData = async () => {
  return await parseMarkdownFile('promotions.md');
};

const parseMarkdownFile = async (fileName) => {
  const fileContent = await readMarkdownFile(fileName);
  const lines = fileContent.split('\n').map((x) => x.trim());
  const category = lines.shift().split(',');

  lines.pop();
  return arrangeData(lines, category);
};

const arrangeData = (lines, category) => {
  return lines.map((text) => {
    const values = text.split(',');
    return createObjectFromHeaders(values, category);
  });
};

const createObjectFromHeaders = (values, category) => {
  const itemObject = {};
  for (let i = 0; i < category.length; i++) {
    itemObject[category[i]] = values[i];
  }
  return itemObject;
};
