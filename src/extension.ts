import * as vscode from 'vscode'
import mappingData from './mapping'

const selectors = [
    'typescript',
    'typescriptreact',
    'javascript',
    'javascriptreact',
]

function capitalize (word: string): string {
    if (typeof word !== 'string') return ''
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`
}

export function activate (context: vscode.ExtensionContext) {
    Object.values(mappingData).forEach(item => {
        const { cn: prefix, synonyms = [], en } = item
        const ens = synonyms.reduce((cur, next) => cur.concat(mappingData[next].en), en)
        const wordProvider = vscode.languages.registerCompletionItemProvider(selectors, {
            provideCompletionItems (document, position) {
                const choices = ens.join(',')
                const snippetCompletion = new vscode.CompletionItem(prefix)
                snippetCompletion.insertText = new vscode.SnippetString(`\${1|${choices}|}`)
                return [ snippetCompletion ]
            },
        })
        const wordsProvider = vscode.languages.registerCompletionItemProvider(selectors, {
            provideCompletionItems (document, position) {
                const choice = ens.map(capitalize).join(',')
                const linePrefix = document.lineAt(position).text.substr(0, position.character)
                const index = linePrefix.indexOf(prefix)
                const delimiterRegExp = /[.-]/
                const match = linePrefix.split('').reverse().join('').match(delimiterRegExp)
                const lastDelimiterIndex = match && match.index || linePrefix.length
                if (index <= 0 || index === lastDelimiterIndex) {
                    return undefined
                }
                const lastBlankIndex = Math.max(linePrefix.lastIndexOf(' ') + 1, 0)
                const snippetCompletion = new vscode.CompletionItem(linePrefix.slice(lastBlankIndex))
                const startIndex = Math.max(linePrefix.length - lastDelimiterIndex, lastBlankIndex)
                const snippetString = `${linePrefix.slice(startIndex, index)}${`\${1|${choice}|}`}`
                snippetCompletion.insertText = new vscode.SnippetString(snippetString)
                return [ snippetCompletion ]
            },
        })
        context.subscriptions.push(wordProvider, wordsProvider)
    })
}
