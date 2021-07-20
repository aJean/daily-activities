import { IApi } from '@mdfjs/types';
import { resolve as resolvePath, join, basename, extname } from 'path';
import { globFind, chalkPrints, prettierFormat } from '@mdfjs/utils';
import { checkModel } from '../compiler/parse';

/**
 * @file 目前约定 model 只放在 src/models 里面，文件名作为 namespace
 */

export default function (api: IApi, modelsPath: string) {
  const { paths, Mustache } = api;
  const { isDev } = api.getConfig();
  const matches = globFind(`${modelsPath}/**/*.{ts,js,tsx,jsx}`);

  const models = matches
    .map((file: string) => {
      const error = checkModel(file, api);

      if (error) {
        const info = [['error: ', 'red'], ` ${error.msg}`];
        if (isDev) {
          api.addProcessDone(() => chalkPrints(info));
        } else {
          chalkPrints(info);
          process.exit(1);
        }
      }

      const modelName = basename(file, extname(file));
      const absFilePath = resolvePath(file);

      if (!modelName) {
        return chalkPrints([['error: ', 'red'], ` 解析${file}失败`]);
      }

      return {
        name: modelName,
        file,
        absFilePath,
        importPath: absFilePath.replace('.ts', ''),
      };
    })
    .filter(Boolean);

  // 约定文件名作为 model name
  const RegisterModels = models
    .map((model: any) => {
      const { absFilePath, name } = model;
      const modelTpl = `app.model({ ...require('${absFilePath}').default, name: '${name}' });`;
      return modelTpl.trim();
    })
    .join('\r\n');

  // 写入 app
  const tpl = api.getFile(join(__dirname, './app.tpl'));
  const content = Mustache.render(tpl, { RegisterModels });
  api.writeFile(`${paths.absTmpPath}/plugins-fundamental/app.ts`, prettierFormat(content));

  // 写入 typings
  const typesTpl = api.getFile(join(__dirname, './types.tpl'));
  const typesContent = Mustache.render(typesTpl, { models, loading: true });
  api.writeFile(`${paths.absTmpPath}/plugins-fundamental/type.d.ts`, prettierFormat(typesContent));
}
