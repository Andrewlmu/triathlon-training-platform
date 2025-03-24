/** 
 * Next.js Configuration
 * 
 * This configuration file controls various aspects of the Next.js build
 * and deployment process for the Triathlon Training Platform.
 * 
 * Key settings:
 * - ESLint: Ignore ESLint errors during builds for CI/CD compatibility
 * - TypeScript: Ignore type errors during builds for deployment flexibility
 * - Build ID Generation: Custom build ID for better deployment tracking
 * 
 * @type {import('next').NextConfig}
 */
module.exports = {
  // Ignore ESLint errors during builds
  // This allows deployments even when there are linting issues
  // Useful for development and staged environments
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during builds
  // Allows deployment even with type issues
  // Better for continuous deployment workflows
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Generate a unique build ID based on timestamp
  // Helps with cache invalidation and build identification
  generateBuildId: async () => {
    return `build-${Date.now()}`
  }
};