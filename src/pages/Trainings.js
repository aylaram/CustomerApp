import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import moment from 'moment';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { api } from '../constants/api';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { AddTraining } from '../sections/@dashboard/trainings';

const TABLE_HEAD = [
  { id: 'activity', label: 'Activity', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'customer', label: 'Customer', alignRight: false },
  { id: '', label: 'Actions', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.activity.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Trainings() {
  const [TRAININGS, setTRAININGS] = useState([]);

  function getTrainings() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(api.trainings, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setTRAININGS(result);
      })
      .catch((error) => console.log('error', error));
  }

  useEffect(() => {
    getTrainings();
  }, []);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(TRAININGS, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  const [customerModal, setcustomerModal] = useState(false);

  const handleCustomerClose = () => {
    setedit(false);
    setcustomerModal(false);
  };
  const refreshAdmin = () => {
    setedit(false);
    setdeleteLink('');
    seteditUser(null);
    setcustomerModal(false);
    getTrainings();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const [deleteLoading, setdeleteLoading] = useState(false);

  function DeleteTraining(url) {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };
    setdeleteLoading(true);
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        handleClose();
        getTrainings();
      })
      .catch((error) => console.log('error', error))
      .finally(() => {
        setdeleteLoading(false);
      });
  }

  const [deleteLink, setdeleteLink] = useState('');
  const [deleteAlert, setdeleteAlert] = React.useState(false);

  const handleClose = () => {
    setdeleteAlert(false);
  };

  const [editUser, seteditUser] = useState(null);
  const [edit, setedit] = useState(false);

  return (
    <>
      <Helmet>
        <title> Trainings </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trainings
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setcustomerModal(true);
            }}
          >
            New Training
          </Button>
        </Stack>

        {/* CUSTOMER MODAL */}
        <Modal
          style={{
            overflow: 'scroll',
            height: '100%',
            display: 'block',
          }}
          open={customerModal}
          onClose={handleCustomerClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddTraining handleClose={handleCustomerClose} refresh={refreshAdmin} edit={edit} user={editUser} />
          </Box>
        </Modal>
        {/* CUSTOMER MODAL END

        {/* Delete Alert */}
        <Dialog
          open={deleteAlert}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Confirmation'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this training?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>

            <LoadingButton
              onClick={() => {
                DeleteTraining(deleteLink);
              }}
              variant="contained"
              color="error"
              loading={deleteLoading}
            >
              Yes
            </LoadingButton>
          </DialogActions>
        </Dialog>
        {/* Delete Alert End */}

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.map((row, index) => {
                    const { id, activity, date, duration, customer } = row;

                    return (
                      <TableRow hover key={index} padding="normal">
                        <TableCell scope="row" padding="normal">
                          <Typography variant="subtitle2" noWrap>
                            {activity || 'N/A'}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{date ? moment(date).format('dd.MM.yyyy HH:MM A') : 'N/A'}</TableCell>

                        <TableCell align="left">{duration}</TableCell>

                        <TableCell align="left">
                          {customer ? `${customer?.firstname} ${customer?.lastname}` : 'N/A'}
                        </TableCell>

                        <TableCell align="left">
                          <IconButton
                            size="large"
                            color="error"
                            onClick={() => {
                              setdeleteLink(`http://traineeapp.azurewebsites.net/api/trainings/${id}`);
                              setdeleteAlert(true);
                            }}
                          >
                            <Iconify icon={'eva:trash-2-outline'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
