// @flow strict
import withPluginEntities from 'views/logic/withPluginEntities';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import type { AutoCompleter, Editor } from './ace-types';

import AceEditor from './queryinput/ace';
import type { Completer } from './SearchBarAutocompletions';
import SearchBarAutoCompletions from './SearchBarAutocompletions';

const _placeholderNode = (placeholder) => {
  const node = document.createElement('div');
  node.textContent = placeholder;
  node.className = 'ace_invisible ace_emptyMessage';
  node.style.padding = '0 9px';
  node.style.color = '#aaa';
  return node;
};

type Props = {
  value: string,
  completers: Array<Completer>,
  // eslint-disable-next-line no-undef
  completerClass?: Class<AutoCompleter>,
  onBlur?: (string) => void,
  onChange: (string) => Promise<string>,
  onExecute: (string) => void,
  placeholder: string,
};

type State = {
  value: string,
};

class QueryInput extends Component<Props, State> {
  static defaultProps = {
    onBlur: () => {},
    completerClass: SearchBarAutoCompletions,
    value: '',
    placeholder: '',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.editor = undefined;
    const CompleterClass = props.completerClass;
    const { completers = [] } = props;
    // $FlowFixMe: tailored for this specific one for now
    this.completer = new CompleterClass(completers);
  }

  componentDidMount() {
    const editor = this.editor && this.editor.editor;
    if (editor) {
      editor.commands.addCommand({
        name: 'Execute',
        bindKey: { win: 'Enter', mac: 'Enter' },
        exec: this._onExecute,
      });

      editor.setFontSize(16);

      editor.completers = [this.completer];

      const { value } = this.props;
      if (!value && !this._placeholderExists(editor)) {
        this._addPlaceholder(editor);
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value } = this.state;
    if (nextProps.value !== value) {
      this.setState({ value: nextProps.value });
    }
    if (this.editor) {
      const { editor } = this.editor;
      if (nextProps.value && this._placeholderExists(editor)) {
        this._removePlaceholder(this.editor.editor);
      }

      if (!nextProps.value && !this.isFocussed && !this._placeholderExists(editor)) {
        this._addPlaceholder(editor);
      }
    }
  }

  _addPlaceholder = (editor: Editor) => {
    if (!editor.renderer.emptyMessageNode) {
      const { placeholder } = this.props;
      const node = _placeholderNode(placeholder);
      // eslint-disable-next-line no-param-reassign
      editor.renderer.emptyMessageNode = node;
      editor.renderer.scroller.appendChild(node);
    }
  };

  _removePlaceholder = (editor: Editor) => {
    if (editor.renderer.emptyMessageNode) {
      editor.renderer.scroller.removeChild(editor.renderer.emptyMessageNode);
      // eslint-disable-next-line no-param-reassign
      editor.renderer.emptyMessageNode = null;
    }
  };

  _placeholderExists = (editor: Editor) => {
    const { emptyMessageNode } = editor.renderer;
    return emptyMessageNode !== undefined && emptyMessageNode !== null;
  };

  _onChange = (newValue: string) => {
    this.setState({ value: newValue });
  };

  _onBlur = () => {
    this.isFocussed = false;
    const editor = this.editor && this.editor.editor;
    if (editor) {
      const shouldShow = !editor.session.getValue().length;
      if (shouldShow && !this._placeholderExists(editor)) {
        this._addPlaceholder(editor);
      }
    }
    const { onBlur, onChange } = this.props;
    const { value } = this.state;
    onChange(value).then(onBlur);
  };

  _onFocus = () => {
    this.isFocussed = true;
    const editor = this.editor && this.editor.editor;
    if (editor && this._placeholderExists(editor)) {
      this._removePlaceholder(editor);
    }
  };

  _onExecute = (editor: Editor) => {
    const { onChange, onExecute } = this.props;
    if (editor.completer && editor.completer.popup) {
      editor.completer.popup.hide();
    }
    const { value } = this.state;
    onChange(value).then(onExecute);
  };

  _bindEditor(editor: { editor: Editor }) {
    if (editor) {
      this.editor = editor;
    }
  }

  completer: AutoCompleter;

  editor: {
    editor: Editor,
  } | typeof undefined;

  isFocussed: boolean;

  render() {
    const { onBlur, onChange, onExecute, placeholder, value: propsValue, ...rest } = this.props;
    const { value } = this.state;
    return (
      <div className="query" style={{ display: 'flex' }}>
        <AceEditor mode="lucene"
                   ref={editor => editor && this._bindEditor(editor)}
                   theme="ace-queryinput"
                   onBlur={this._onBlur}
                   onChange={this._onChange}
                   onFocus={this._onFocus}
                   value={value}
                   name="QueryEditor"
                   showGutter={false}
                   showPrintMargin={false}
                   highlightActiveLine={false}
                   minLines={1}
                   maxLines={1}
                   enableBasicAutocompletion
                   enableLiveAutocompletion
                   editorProps={{
                     $blockScrolling: Infinity,
                     selectionStyle: 'line',
                   }}
                   fontSize={13}
                   style={{
                     marginTop: '9px',
                     height: '34px',
                     width: '100%',
                   }}
                   {...rest} />
      </div>
    );
  }
}

QueryInput.propTypes = {
  completers: PropTypes.array.isRequired,
  completerClass: PropTypes.any,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onExecute: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default withPluginEntities(QueryInput, { completers: 'views.completers' });
