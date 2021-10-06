import React, { useState, Fragment, useEffect, useRef } from "react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const WYSIWYGEditor = ({
  onChange,
  toolbarOptions,
  data,
  touched,
  error,
  onBlur,
  name,
  label,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const prevDataRef = useRef();
  useEffect(() => {
    prevDataRef.current = data;
  });
  const prevData = prevDataRef.current;

  useEffect(() => {
    let contentState;
    let editorState;
    if (data && isJson(data)) {
      contentState = convertFromRaw(JSON.parse(data || ""));
      editorState = EditorState.createWithContent(contentState);
      setEditorState(data ? editorState : EditorState.createEmpty());
    }
    setEditorState(EditorState.createEmpty());
  }, []);

  useEffect(() => {
    if (!prevData && data !== prevData && data && isJson(data)) {
      const contentState = convertFromRaw(JSON.parse(data || ""));
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [data]);

  const onEditorStateChange = (editState) => {
    const data = convertToRaw(editorState.getCurrentContent());
    setEditorState(editState);
    return onChange(JSON.stringify(data));
  };

  return (
    <Fragment>
      {label}
      <div className="editor">
        <Editor
          editorState={editorState}
          toolbarClassName="editor__toolbar"
          wrapperClassName="editor__wrapper"
          editorClassName="editor"
          toolbarOptions={toolbarOptions}
          onEditorStateChange={onEditorStateChange}
          // customStyleMap={}
        />
      </div>
      {error && touched && <span className="error-text">{error}</span>}
    </Fragment>
  );
};

export default WYSIWYGEditor;
