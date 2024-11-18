import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'https://graphql.anilist.co',
    documents: ['app/**/*.ts'],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './app/gql/': {
            preset: 'client'
        },
        './schema.graphql': {
            plugins: ['schema-ast'],
            config: {
                includeDirectives: true
            }
        }
    }
}

export default config