import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, Button, Box, Checkbox, Alert } from '@mui/material';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';
// component
import { api } from '../../../constants/api';
import CustomerDropDown from '../../../components/customerDropdown';

// ----------------------------------------------------------------------

export default function AddTraining({ handleClose, refresh, edit, user }) {
  const navigate = useNavigate();

  const [selectedCustomer, setselectedCustomer] = useState('');
  const [activity, setactivity] = useState('');
  const [duration, setduration] = useState('');
  const [date, setdate] = useState('');
  const [apiDate, setapiDate] = useState('');

  const [loading, setloading] = useState(false);

  const [error, seterror] = useState(null);

  function AddTraining() {
    if (selectedCustomer === '' || activity === '' || duration === '' || date === '') {
      console.log(date);
      setalert({ visible: true, message: 'customer, activity, duration & date fields are required' });
    }
    if (selectedCustomer === '') {
      return seterror({ ...error, customer: true });
    }

    if (activity === '') {
      return seterror({ ...error, activity: true });
    }

    if (duration === '') {
      return seterror({ ...error, duration: true });
    }

    if (date === '') {
      return seterror({ ...error, date: true });
    }

    setloading(true);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        activity,
        duration,
        date: apiDate,
        customer: selectedCustomer,
      }),
      redirect: 'follow',
    };

    fetch(api.createTraining, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        refresh();
      })
      .catch((error) => console.log('error', error))
      .finally(() => {
        setloading(false);
      });
  }

  const [alert, setalert] = useState({ visible: false, message: '' });
  const inputRef = useRef();
  return (
    <Box p={2}>
      <Stack spacing={3}>
        <CustomerDropDown
          onSelect={(value) => {
            setselectedCustomer(value);
            seterror({ ...error, customer: false });
          }}
          error={error?.customer}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            error={error?.activity}
            fullWidth
            label="Activity"
            value={activity}
            onChange={(e) => {
              setactivity(e.target.value);
            }}
          />

          <TextField
            required
            fullWidth
            label="Duration"
            value={duration}
            type="number"
            //      label="Short stop treshold"
            InputProps={{
              inputProps: { min: 0 },
            }}
            error={error?.duration}
            onChange={(e) => {
              setduration(e.target.value);
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* <LocalizationProvider style={{ width: '100%' }} dateAdapter={AdapterDayjs}>
            <DemoContainer style={{ width: '100%' }} components={['DatePicker']}>
              <DatePicker
                style={{ width: '100%' }}
                format="dd.MM.YYYY hh:mm A"
                value={date}
                onChange={(newValue) => {
                  setdate(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider> */}
          <TextField
            required
            error={error?.date}
            id="date"
            type="datetime-local"
            color="secondary"
            value={date}
            fullWidth
            onChange={(e) => {
              setapiDate(moment(e.target.value).toISOString());
              setdate(e.target.value);
            }}
            inputProps={{
              min: new Date().toISOString().slice(0, 16),
              //   max: maxDateTime.toISOString().slice(0, 16),
            }}
            InputLabelProps={{ shrink: true }}
            inputRef={inputRef}
            onClick={() => {
              inputRef.current.showPicker();
            }}
          />
          {/* <TextField
            type="datetime-local"
            required
            fullWidth
            // label="Date"
            value={date}
            onChange={(e) => {
              console.log(e.target.value);
              setdate(e.target.value);
            }}
          /> */}
        </Stack>

        {alert.visible && (
          <>
            <Alert
              onClose={() => {
                setalert({ visible: false, message: '' });
              }}
              severity="error"
            >
              {alert.message}
            </Alert>
          </>
        )}
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <LoadingButton
            style={{ width: '49%' }}
            size="large"
            onClick={() => {
              AddTraining();
            }}
            variant="contained"
            loading={loading}
          >
            Save
          </LoadingButton>
          <Button
            sx={{
              width: '49%',
            }}
            onClick={handleClose}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
