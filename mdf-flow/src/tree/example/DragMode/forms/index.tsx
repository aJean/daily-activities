import React, { useEffect, ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';
import { IRefFormMethod } from '../../../src/FixedMode/types';

const ConfigForm: ForwardRefRenderFunction<IRefFormMethod, { defaultValue: any, globalVars: any }> = (props, ref) => {
  const { defaultValue, globalVars } = props;
  console.log('globalVarsInForm', globalVars)
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getFieldsValue: form.getFieldsValue,
    validateFields: form.validateFields,
  }));

  useEffect(() => {
    form.setFieldsValue(defaultValue);
  }, [defaultValue]);
  
  return (
    <Form form={form}>
      <Form.Item label="name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="dealType" name="dealType" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default forwardRef(ConfigForm);
