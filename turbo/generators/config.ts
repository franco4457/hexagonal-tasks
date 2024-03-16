import { PlopTypes } from '@turbo/gen'

const generators = ['domain', 'application', 'infrastructure']

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  generators.forEach((gen) => {
    plop.setGenerator(gen, {
      description: `Generate a ${gen}`,
      prompts: [
        {
          type: 'input',
          name: `${gen}Name`,
          message: `Enter ${gen} name`,
          validate: (input: string) => {
            if (input.includes('.')) {
              return `${gen} name cannot include an extension`
            }
            if (input.includes(' ')) {
              return `${gen} name cannot include spaces`
            }
            if (!input) {
              return `${gen} name is required`
            }
            return true
          }
        },
        {
          type: 'input',
          name: 'description',
          message: `The description of this ${gen}:`
        }
      ],
      actions(answers) {
        const actions: PlopTypes.ActionType[] = []
        if (!answers) return actions

        const { description } = answers
        const generatorName = answers[`${gen}Name`] ?? ''

        const data = {
          [`${gen}Name`]: generatorName,
          description,
          outDir: gen
        }
        actions.push({
          type: 'addMany',
          destination: `{{ turbo.paths.root }}/packages/{{outDir}}/{{dashCase ${gen}Name}}`,
          templateFiles: `{{ turbo.paths.root }}/turbo/generators/templates/${gen}/**`,
          base: `{{ turbo.paths.root }}/turbo/generators/templates/${gen}`,
          data,
          abortOnFail: true,
          globOptions: { dot: true }
        })
        return actions
      }
    })
  })
}
