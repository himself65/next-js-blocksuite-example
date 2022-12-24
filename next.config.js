const path = require('node:path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const baseDir = process.env.LOCAL_BLOCK_SUITE ?? '/'
const withDebugLocal = require('next-debug-local')(
  {
    '@blocksuite/editor': path.resolve(baseDir, 'packages', 'editor'),
    '@blocksuite/blocks': path.resolve(baseDir, 'packages', 'blocks'),
    '@blocksuite/store': path.resolve(baseDir, 'packages', 'store'),
  },
  {
    enable: path.isAbsolute(process.env.LOCAL_BLOCK_SUITE ?? ''),
  }
)

module.exports = withDebugLocal(nextConfig)
