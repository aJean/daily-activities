import {ExtractLoadingFromModels, ExtractModel} from '@medlinker/fundamental';
{{#models}}
import {{{ name }}}Model from '{{{ importPath }}}';
{{/models}}

/**
 * @file 此文件由 `fundamental/inject` 自动生成，请不要手动修改。
 */

{{#models}}
type {{{ name }}} = ExtractModel<typeof {{{ name }}}Model>
{{/models}}

declare module '@medlinker/fundamental' {
  interface Dispatch {
    {{#models}}
    {{{ name }}}: {{{ name }}}['actions'];
    {{/models}}
  }

  interface State {
    {{#models}}
      {{{ name }}}: {{{ name }}}['state'];
    {{/models}}
    
    {{#loading}}
    loading: ExtractLoadingFromModels<{
      {{#models}}
      {{{ name }}}
      {{/models}}
    }>;
    {{/loading}}
  }
}
