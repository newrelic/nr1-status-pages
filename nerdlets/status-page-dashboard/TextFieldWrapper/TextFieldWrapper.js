import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import './TextFieldWrapper.scss';

const TextFieldWrapper = ({
  label,
  onChange,
  value,
  validationText,
  placeholder,
  disabled,
}) => {
  return (
    <div>
      <TextField
        className="text-field"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {validationText && (
        <span className="text-field__validation">{validationText}</span>
      )}
    </div>
  );
};

TextFieldWrapper.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  validationText: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default TextFieldWrapper;
