const fs = require('fs')
const path = require('path')

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

const ensureJsonFile = (filePath, defaultData) => {
  const dirPath = path.dirname(filePath)
  ensureDir(dirPath)

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8')
  }
}

const readJsonFile = (filePath, defaultData) => {
  try {
    ensureJsonFile(filePath, defaultData)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(defaultData)
      ? (Array.isArray(parsed) ? parsed : defaultData)
      : { ...defaultData, ...parsed }
  } catch {
    return Array.isArray(defaultData) ? [...defaultData] : { ...defaultData }
  }
}

const writeJsonFile = (filePath, data) => {
  const dirPath = path.dirname(filePath)
  ensureDir(dirPath)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

module.exports = {
  ensureJsonFile,
  readJsonFile,
  writeJsonFile,
}