import React, { SetStateAction } from "react";
import { MeetingCategory } from "../../../types/types";

type FormSelectProps = {
  name: string;
  id: string;
  options: MeetingCategory[] | any;
  onChange: any;
  small?: boolean;
  additionalStyle?: string;
  label?: string;
};

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  id,
  options,
  onChange,
  small,
  additionalStyle,
  label,
}) => {
  {
    return (
      <div className={`${additionalStyle}`}>
        {label && (
          <label htmlFor={id} className={`ml-0.5`}>
            {label}
          </label>
        )}
        <select
          name={name}
          id={id}
          className={`bg-slate-50 border w-full pl-2 focus:outline-teal-600 ${
            small ? "text-sm rounded-sm" : "rounded-md"
          }  h-8  `}
          onChange={onChange}
        >
          {options!.map((option: MeetingCategory) => {
            return <option value={option.name}>{option.name}</option>;
          })}
        </select>
      </div>
    );
  }
};

export default FormSelect;