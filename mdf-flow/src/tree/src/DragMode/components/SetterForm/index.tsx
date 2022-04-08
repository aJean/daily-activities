import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle } from 'react';
import { Setter, ISchemaForm, createFormActions } from '@byted-cg/builder-setters';
import { IRefFormMethod } from '../../types';

const setterActions = createFormActions();

interface IProps {
  setterConfig: ISchemaForm;
  defaultValue: any;
}

const SetterForm: ForwardRefRenderFunction<IRefFormMethod, IProps> = (props, ref) => {

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => setterActions.getFormState().values,
    validateFields: () => new Promise(async (resolve, reject) => {
      try {
        await setterActions.validate();
        resolve(setterActions.getFormState().values);
      } catch (error) {
        reject(error);
      }
    }),
  }));

  return (
    <Setter
      {...props.setterConfig}
      defaultValue={props.defaultValue}
      actions={setterActions}
    />
  )
};

export default forwardRef(SetterForm);
