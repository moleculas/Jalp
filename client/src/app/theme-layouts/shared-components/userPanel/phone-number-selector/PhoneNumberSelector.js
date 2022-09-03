import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { forwardRef } from 'react';
import clsx from 'clsx';
import PhoneNumberInput from './PhoneNumberInput';

const PhoneNumberSelector = forwardRef(({ value, onChange, className }, ref) => {
  return (
    <div className={clsx('w-full', className)} ref={ref}>
      {value.map((item, index) => (
        <PhoneNumberInput
          value={item}
          key={index}
          onChange={(val) => {
            onChange(value.map((_item, _index) => (index === _index ? val : _item)));
          }}
          onRemove={() => {
            onChange(value.filter((_item, _index) => index !== _index));
          }}
          hideRemove={value.length === 0}
        />
      ))}
      <Button
        className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
        onClick={() => onChange([...value, {telefono: "", etiqueta: ""}])}
      >
        <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
        <span className="ml-8 font-medium text-secondary group-hover:underline">
          Añade un número de teléfono
        </span>
      </Button>
    </div>
  );
});

export default PhoneNumberSelector;
