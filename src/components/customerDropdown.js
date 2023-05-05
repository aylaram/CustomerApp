import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { api } from '../constants/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomerDropDown({ onSelect, error }) {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName(`${value.firstname} ${value.lastname}`);
    onSelect(value?.links?.filter((item) => item?.rel === 'customer')[0].href);
  };

  const [CUSTOMERLIST, setCUSTOMERLIST] = useState([]);

  function getCustomers() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(api.customers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCUSTOMERLIST(result.content);
      })
      .catch((error) => console.log('error', error));
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <>
      {CUSTOMERLIST.length > 0 && (
        <Select
          required
          error={error}
          value={personName}
          displayEmpty
          renderValue={(value) =>
            value?.length ? (Array.isArray(value) ? value.join(', ') : value) : 'Select Customer'
          }
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {CUSTOMERLIST.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item?.firstname} {item?.lastname}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
}
