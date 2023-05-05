import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Button, Box, Checkbox, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import { api } from '../../../constants/api';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function AddUserModal({ handleClose, refresh, edit, user }) {
  const navigate = useNavigate();

  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [streetaddress, setstreetaddress] = useState('');
  const [postcode, setpostcode] = useState('');
  const [city, setcity] = useState('');

  const [loading, setloading] = useState(false);

  const [error, seterror] = useState(null);

  function AddEditAdmin() {
    if (firstname === '' || lastname === '' || email === '') {
      setalert({ visible: true, message: 'Firstname, Lastname & Email fields are required' });
    }

    if (firstname === '') {
      return seterror({ ...error, firstname: true });
    }

    if (lastname === '') {
      return seterror({ ...error, lastname: true });
    }

    if (email === '') {
      return seterror({ ...error, email: true });
    }

    setloading(true);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: edit ? 'PUT' : 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        streetaddress,
        postcode,
        city,
      }),
      redirect: 'follow',
    };

    fetch(edit ? user?.links?.filter((item) => item?.rel === 'customer')[0].href : api.customers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        refresh();
      })
      .catch((error) => console.log('error', error))
      .finally(() => {
        setloading(false);
      });
  }

  useEffect(() => {
    if (edit) {
      setfirstname(user?.firstname);
      setlastname(user?.lastname);
      setemail(user?.email);
      setphone(user?.phone);
      setstreetaddress(user?.streetaddress);
      setpostcode(user?.postcode);
      setcity(user?.city);
    }
  }, []);

  const [alert, setalert] = useState({ visible: false, message: '' });
  return (
    <Box p={2}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            error={error?.firstname}
            fullWidth
            label="First name"
            value={firstname}
            onChange={(e) => {
              setfirstname(e.target.value);
            }}
          />

          <TextField
            required
            error={error?.lastname}
            fullWidth
            label="Last name"
            value={lastname}
            onChange={(e) => {
              setlastname(e.target.value);
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            error={error?.email}
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            value={phone}
            onChange={(e) => {
              setphone(e.target.value);
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Street Address"
            value={streetaddress}
            onChange={(e) => {
              setstreetaddress(e.target.value);
            }}
          />

          <TextField
            fullWidth
            label="Postcode"
            value={postcode}
            onChange={(e) => {
              setpostcode(e.target.value);
            }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="City"
            value={city}
            onChange={(e) => {
              setcity(e.target.value);
            }}
          />
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
              AddEditAdmin();
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
