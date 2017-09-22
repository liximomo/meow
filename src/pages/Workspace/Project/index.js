import { Form, Input, Switch } from 'antd';

import style from './style.scss';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 16 },
  },
};

const mapValueToFields = value => {
  return Object.keys(value).reduce((fields, key) => {
    fields[key] = {
      value: value[key],
    };
    return fields;
  }, {});
};

const mapFieldsToValue = fields => {
  return Object.keys(fields).reduce((value, key) => {
    value[key] = fields[key].value;
    return value;
  }, {});
};

const ProjectForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return mapValueToFields(props.project);
  },
})(
  class extends React.Component {
    // constructor(props) {
    //   super(props);
    // }

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const deploy = getFieldValue('deploy');
      const pass = getFieldValue('remote_pass');
      const privateKeyPath = getFieldValue('remote_privateKeyPath');

      return (
        <Form>
          <div className={style.group}>
            <div className={style.groupLabel}>发布</div>
            <div className={style.groupBox}>
              <FormItem {...formItemLayout} label="发布路径">
                {getFieldDecorator('publicPath', {
                  rules: [{ required: true, message: '不能为空' }],
                })(<Input />)}
              </FormItem>
            </div>
          </div>
          <div className={style.group}>
            <div className={style.groupLabel}>
              <span className="u-marginRight10">部署</span>
              {getFieldDecorator('deploy', {
                valuePropName: 'checked',
                rules: [{ required: deploy, message: '不能为空' }],
              })(<Switch />)}
            </div>
            <div
              className={cn(style.groupBox, {
                'u-hide': !deploy,
              })}
            > 
              <FormItem {...formItemLayout} label="站点">
                {getFieldDecorator('remote_page', {
                  rules: [{ required: deploy, message: '不能为空' }],
                })(<Input.TextArea className={style.textarea} autosize={{ minRows: 1, maxRows: 6 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="主机">
                {getFieldDecorator('remote_host', {
                  rules: [{ required: deploy, message: '不能为空' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label=" 端口">
                {getFieldDecorator('remote_port', {
                  rules: [{ required: deploy, message: '不能为空' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('remote_user', {
                  rules: [{ required: deploy, message: '不能为空' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('remote_pass', {
                  rules: [{ required: !privateKeyPath, message: '密码和秘钥不能同时为空' }],
                })(<Input type="password" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="秘钥">
                {getFieldDecorator('remote_privateKeyPath', {
                  rules: [{ required: !pass, message: '密码和秘钥不能同时为空' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="根路径">
                {getFieldDecorator('remote_contentBase', {
                  rules: [{ required: deploy, message: '不能为空' }],
                })(<Input />)}
              </FormItem>
            </div>
          </div>
        </Form>
      );
    }
  }
);

class Project extends React.Component {
  handleFormChange = changedFields => {
    this.props.onChange(mapFieldsToValue(changedFields));
  };

  render() {
    return <ProjectForm project={this.props.data} onChange={this.handleFormChange} />;
  }
}

export default Project;
